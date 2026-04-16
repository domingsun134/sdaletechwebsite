import fs from 'fs';

// 1. Header.jsx
let headerContent = fs.readFileSync('src/components/Header.jsx', 'utf8');
headerContent = headerContent.replace(
    "{ name: 'Latest News', path: '/investor-relations/newsroom' },",
    "...(import.meta.env.DEV ? [{ name: 'Latest News', path: '/investor-relations/newsroom' }] : []),"
);
fs.writeFileSync('src/components/Header.jsx', headerContent);

// 2. InvestorLayout.jsx
let layoutContent = fs.readFileSync('src/components/investor/InvestorLayout.jsx', 'utf8');
layoutContent = layoutContent.replace(
    "{ path: '/investor-relations/newsroom', label: 'Latest News' },",
    "...(import.meta.env.DEV ? [{ path: '/investor-relations/newsroom', label: 'Latest News' }] : []),"
);
fs.writeFileSync('src/components/investor/InvestorLayout.jsx', layoutContent);

// 3. InvestorHome.jsx
let homeContent = fs.readFileSync('src/pages/investor/InvestorHome.jsx', 'utf8');
const searchLink = `<Link
            to="/investor-relations/newsroom"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            See all news
          </Link>`;
// use string replace, handles multiline since it's exact character match
if (homeContent.includes(searchLink)) {
    homeContent = homeContent.replace(
        searchLink,
        "{import.meta.env.DEV && (\n          <Link\n            to=\"/investor-relations/newsroom\"\n            className=\"text-red-600 hover:text-red-700 font-medium\"\n          >\n            See all news\n          </Link>\n        )}"
    );
} else {
    // try fallback regex just in case
    homeContent = homeContent.replace(/<Link\s+to="\/investor-relations\/newsroom"[\s\S]*?See all news\s*<\/Link>/, match => `{import.meta.env.DEV && (\n          ${match}\n        )}`);
}
fs.writeFileSync('src/pages/investor/InvestorHome.jsx', homeContent);

// 4. InvestorRelations.jsx
let relationsContent = fs.readFileSync('src/pages/InvestorRelations.jsx', 'utf8');
const relLink = `<a href="https://investor.sdaletech.com/newsroom.html" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">See all news</a>`;
if (relationsContent.includes(relLink)) {
    relationsContent = relationsContent.replace(
        relLink,
        `{import.meta.env.DEV && <a href="https://investor.sdaletech.com/newsroom.html" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">See all news</a>}`
    );
}
fs.writeFileSync('src/pages/InvestorRelations.jsx', relationsContent);

console.log('Successfully updated visibility to dev mode only.');
