import fs from 'fs';

const filePath = 'src/data/newsArticles.js';
let content = fs.readFileSync(filePath, 'utf8');

function toTitleCase(str) {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

const regex = /{\s*id:\s*'(.*?)',\s*date:\s*'(.*?)',\s*title:\s*'(.*?)',\s*category:\s*'(.*?)',\s*content:\s*`([\s\S]*?)`\s*}/g;

content = content.replace(regex, (fullMatch, id, date, title, category, tableHtml) => {
    let newTitle = title;
    
    if (title === 'News' || title.startsWith('Announcement ')) {
        let subTitleMatch = tableHtml.match(/Announcement Sub Title<\/th>\s*<td.*?>(.*?)<\/td>/i);
        if (subTitleMatch && subTitleMatch[1].trim() !== '') {
            newTitle = subTitleMatch[1].replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();
            if (newTitle === newTitle.toUpperCase()) {
                newTitle = toTitleCase(newTitle);
            }
        } else {
            let annTitleMatch = tableHtml.match(/Announcement Title<\/th>\s*<td.*?>(.*?)<\/td>/i);
            if (annTitleMatch && annTitleMatch[1].trim() !== '') {
                newTitle = annTitleMatch[1].replace(/&amp;/g, '&').replace(/<[^>]+>/g, '').trim();
            }
        }
    }
    
    return `{
    id: '${id}',
    date: '${date}',
    title: '${newTitle.replace(/'/g, "\\'")}',
    category: '${category}',
    content: \`${tableHtml}\`
  }`;
});

fs.writeFileSync(filePath, content);
console.log('Successfully fixed announcement titles.');
