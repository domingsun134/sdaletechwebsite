import fs from 'fs';

const filePath = 'src/data/newsArticles.js';
let content = fs.readFileSync(filePath, 'utf8');

// We are looking for the Event Dates row specifically in 2328798
// It currently looks like:
// <tr>
//   <th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">Event Dates</th>
//   <td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words"></td>
// </tr>

const searchRegex = /<tr>\s*<th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1\/3 md:w-1\/4 align-top break-words">Event Dates<\/th>\s*<td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words"><\/td>\s*<\/tr>/g;

const replacement = `<tr class="bg-gray-800 text-white">
            <th colspan="2" class="border border-gray-300 px-4 py-3 font-semibold text-left">Event Dates</th>
          </tr>`;

if (searchRegex.test(content)) {
    content = content.replace(searchRegex, replacement);
    fs.writeFileSync(filePath, content);
    console.log('Successfully formatted the Event Dates row.');
} else {
    // If exact regex fails due to spacing, lets try a more flexible one
    const flexRegex = /<tr>[\s\S]*?>Event Dates<\/th>[\s\S]*?<\/td>[\s\S]*?<\/tr>/;
    const match = content.match(flexRegex);
    
    if (match) {
        content = content.replace(match[0], replacement);
        fs.writeFileSync(filePath, content);
        console.log('Successfully formatted the Event Dates row via fallback regex.');
    } else {
        console.log('Could not find the Event Dates row.');
    }
}
