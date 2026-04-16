import fs from 'fs';

const filePath = 'src/data/newsArticles.js';
let content = fs.readFileSync(filePath, 'utf8');

// Replace standard HTML table tags with tailwind-styled ones using 'class=' since it's going into innerHTML
content = content.replace(/<table>/g, '<table class="w-full text-left border-collapse mb-6 my-4 text-sm md:text-base border border-gray-300">');
content = content.replace(/<th>/g, '<th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">');
content = content.replace(/<td>/g, '<td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words">');

fs.writeFileSync(filePath, content);
console.log('Successfully styled all tables in newsArticle.js.');
