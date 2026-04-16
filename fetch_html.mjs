import https from 'https';

https.get('https://investor.sdaletech.com/news.html/id/2328046', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        // Output the relevant section
        const match = data.match(/<div class="news_container">([\s\S]*?)<\/div>\s*<div class="clearfix">/);
        if (match) {
            console.log("Found container:", match[1].substring(0, 1500));
        } else {
            // Let's just look for tables
            const tableMatch = data.match(/<table[\s\S]*?<\/table>/);
            if (tableMatch) {
                 console.log("Found table:", tableMatch[0]);
            } else {
                 console.log("No table found. Dumping first 1000 chars of body:");
                 const bodyMatch = data.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/);
                 if (bodyMatch) console.log(bodyMatch[1].substring(0, 1000));
            }
        }
    });
});
