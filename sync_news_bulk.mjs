import fs from 'fs';
import https from 'https';
import path from 'path';

const mappings = [
    { localId: '2327272', liveId: '824239' },
    { localId: '2325956', liveId: '822792' },
    { localId: '2325784', liveId: '822427' },
    { localId: '2325762', liveId: '822387' },
    { localId: '2325442', liveId: '821954' },
    { localId: '2325410', liveId: '821838' },
    { localId: '2325260', liveId: '821128' },
    { localId: '2325127', liveId: '820558' }
];

const filePath = 'src/data/newsArticles.js';
let content = fs.readFileSync(filePath, 'utf8');

const targetDir = 'public/investor-relations/newsroom';
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const fetchHtml = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
};

const downloadPdf = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                return downloadPdf(response.headers.location, dest).then(resolve).catch(reject);
            }
            response.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

async function processMappings() {
    for (const item of mappings) {
        const url = `https://investor.sdaletech.com/news.html/id/${item.liveId}`;
        console.log(`Fetching ${url}`);
        
        try {
            const html = await fetchHtml(url);
            
            let tableContent = '';
            const tableMatch = html.match(/<table[\s\S]*?<\/table>/);
            if (tableMatch) {
                tableContent = tableMatch[0];
            } else {
                console.log(`Warning: No table found for ${item.localId}`);
                const bodyMatch = html.match(/<div class="news_container">([\s\S]*?)<\/div>\s*<div class="clearfix">/);
                if (bodyMatch) {
                    tableContent = bodyMatch[1].replace(/<a href="\/newsroom\.html".*?Back<\/a>/i, '').trim();
                }
            }

            let attachmentHtml = '';
            const attachmentMatch = html.match(/Attachments[\s\S]*?<a href="(.*?.pdf)"[^>]*>(.*?)<\/a>\s*\(Size:\s*(.*?)\)/i);
            
            if (attachmentMatch) {
                let [_, pdfUrl, attachName, attachSize] = attachmentMatch;
                if (!pdfUrl.startsWith('http')) {
                    pdfUrl = 'https://investor.sdaletech.com' + pdfUrl;
                }
                const fileName = pdfUrl.split('/').pop().split('?')[0];
                const localPath = path.join(targetDir, fileName);
                
                console.log(`Downloading ${fileName}...`);
                await downloadPdf(pdfUrl, localPath);
                
                attachmentHtml = `
      <p>Attachments</p>
      <ul style="list-style-type: none; padding-left: 0;">
        <li>
          &bull; <a href="/investor-relations/newsroom/${fileName}" target="_blank" rel="noopener noreferrer">${attachName}</a> (Size: ${attachSize})
        </li>
      </ul>`;
            }

            if (tableContent.includes('<table')) {
                tableContent = tableContent.replace(/<table[^>]*>/, '<table class="w-full text-left border-collapse mb-6 my-4 text-sm md:text-base border border-gray-300">');
                tableContent = tableContent.replace(/<tr[^>]*>/g, '<tr>');
                tableContent = tableContent.replace(/<td[^>]*>/g, '<td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words">');
                
                let formattedTable = '';
                const rows = tableContent.split(/<tr>/);
                for (let i = 0; i < rows.length; i++) {
                    if (i === 0) { formattedTable += rows[i]; continue; }
                    let rowHtml = rows[i];
                    
                    if (rowHtml.includes('Event Dates')) {
                        rowHtml = '<tr class="bg-gray-800 text-white"><th colspan="2" class="border border-gray-300 px-4 py-3 font-semibold text-left">Event Dates</th></tr>' + rowHtml.split(/<\/tr>/)[1];
                    } else if (rowHtml.trim() !== '') {
                         rowHtml = '<tr>' + rowHtml.replace(/<td class="([^"]*)">([\s\S]*?)<\/td>/i, '<th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">$2</th>');
                    }
                    formattedTable += rowHtml;
                }
                tableContent = formattedTable;
                
                const narrativeRegex = /<tr><th[^>]*>Narrative Type<\/th>/i;
                if (narrativeRegex.test(tableContent)) {
                    tableContent = tableContent.replace(narrativeRegex, `</tbody></table><table class="w-full text-left border-collapse mb-6 my-4 text-sm md:text-base border border-gray-300"><tbody><tr><th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">Narrative Type</th>`);
                }
            }

            const combinedNewContent = `\n      ${tableContent}\n      ${attachmentHtml}\n`;

            const regex = new RegExp(`id:\\s*'${item.localId}',[\\s\\S]*?content:\\s*\`([\\s\\S]*?)\`\\s*},`, 'g');
            
            if (regex.test(content)) {
                content = content.replace(regex, (match, p1) => {
                    return match.replace(p1, combinedNewContent);
                });
                console.log(`Successfully updated ${item.localId}`);
            } else {
                console.log(`Warning: ${item.localId} not found in newsArticles.js. Adding it to the top...`);
                
                const titleMatchFull = html.match(/<h2[^>]*>(.*?)<\/h2>/i);
                let titleStr = titleMatchFull ? titleMatchFull[1].trim() : 'Announcement ' + item.localId;
                
                let dateStr = 'Unknown Date';
                const dateMatch = tableContent.match(/Date &amp; Time of Broadcast<\/th>\s*<td[^>]*>(.*?)<\/td>/i);
                if (dateMatch) {
                    const parts = dateMatch[1].trim().split(' ');
                    if (parts.length >= 3) {
                       dateStr = parts[0] + ' ' + parts[1] + ' ' + parts[2];
                    }
                }

                const newEntry = `  {
    id: '${item.localId}',
    date: '${dateStr}',
    title: '${titleStr.replace(/'/g, "\\'")}',
    category: 'Corporate Action',
    content: \`${combinedNewContent}\`
  },
`;
                content = content.replace('export const newsArticles = [\n', 'export const newsArticles = [\n' + newEntry);
            }

        } catch (e) {
            console.error(`Failed to process ${item.localId}: `, e);
        }
    }

    fs.writeFileSync(filePath, content);
    console.log('Finished bulk synchronization.');
}

processMappings();
