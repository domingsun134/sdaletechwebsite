import fs from 'fs';

const filePath = 'src/pages/investor/Newsroom.jsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/const \[selectedYear, setSelectedYear\] = useState\('.*?'\);\n?/, '');

const newFilterBlock = `  const filteredNews = newsArticles
    .filter(article => {
      return searchTerm.length < 4 || article.title.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));`;

content = content.replace(/const filteredNews = newsArticles\.filter\([\s\S]*?\}\);/, newFilterBlock);

// Replace the filter block specifically
content = content.replace(/<div className="w-full md:w-48">[\s\S]*?<label className="block text-sm font-medium text-gray-700 mb-2">\s*Filter by Year\s*<\/label>[\s\S]*?<\/select>\s*<\/div>/, '');

fs.writeFileSync(filePath, content);
console.log('Successfully updated Newsroom.jsx.');
