import fs from 'fs';

const filePath = 'src/data/newsArticles.js';
let content = fs.readFileSync(filePath, 'utf8');

// The regex matches the opening <tr> right before "Narrative Type"
const regex = /<tr>\s*<th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1\/3 md:w-1\/4 align-top break-words">Narrative Type<\/th>/;

const replacement = `</tbody>
      </table>
      
      <table class="w-full text-left border-collapse mb-6 my-4 text-sm md:text-base border border-gray-300">
        <tbody>
          <tr>
            <th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">Narrative Type</th>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content);
    console.log('Successfully split the table.');
} else {
    // try fallback regex just in case
    const flexRegex = /<tr>[\s]*<th[^>]*>Narrative Type<\/th>/;
    if (flexRegex.test(content)) {
        content = content.replace(flexRegex, replacement);
        fs.writeFileSync(filePath, content);
        console.log('Successfully split the table using flexible regex.');
    } else {
        console.log('Could not find Narrative Type row.');
    }
}
