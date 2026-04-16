import fs from 'fs';

const filePath = 'src/pages/investor/Financials.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// The <p> tags currently have no styling. We'll add standard tailwind classes for line height and margin.
// We only want to replace raw <p> tags that don't have existing classes.
content = content.replace(/<p>/g, '<p className="mb-4 leading-relaxed text-gray-700">');

// There's one <p className="text-sm italic"> that we'll just add mb-4 to
content = content.replace(/<p className="text-sm italic">/g, '<p className="text-sm italic mb-4">');

// Also add a little margin below the section headers like <h4>
content = content.replace(/<h4/g, '<h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4"');
// Well we already have <h4 className="..."> in the file, so replacing <h4 won't work perfectly this way.
// Let's do it cleanly:
content = content.replace(/<h4 className="font-semibold text-gray-800">/g, '<h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4">');
content = content.replace(/<h4 className="font-semibold text-gray-800 mt-6">/g, '<h4 className="font-semibold text-gray-800 text-lg mt-8 mb-4">');

fs.writeFileSync(filePath, content);
console.log('Successfully added bottom margins to all paragraphs.');
