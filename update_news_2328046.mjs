import fs from 'fs';

const filePath = 'src/data/newsArticles.js';
let content = fs.readFileSync(filePath, 'utf8');

const newContent = `
      <table class="w-full text-left border-collapse mb-6 my-4 text-sm md:text-base border border-gray-300">
        <tbody>
          <tr>
            <th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">Announcement Title</th>
            <td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words">General Announcement</td>
          </tr>
          <tr>
            <th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">Date &amp; Time of Broadcast</th>
            <td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words">Apr 8, 2021 17:38</td>
          </tr>
          <tr>
            <th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">Status</th>
            <td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words">New</td>
          </tr>
          <tr>
            <th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">Announcement Sub Title</th>
            <td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words">EFFECTIVE DATE OF THE SCHEME</td>
          </tr>
          <tr>
            <th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">Announcement Reference</th>
            <td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words">SG210408OTHRYK5F</td>
          </tr>
          <tr>
            <th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">Submitted By (Co./ Ind. Name)</th>
            <td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words">Benny Lum</td>
          </tr>
          <tr>
            <th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">Designation</th>
            <td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words">Company Secretary</td>
          </tr>
          <tr>
            <th class="border border-gray-300 px-4 py-3 text-gray-600 font-normal w-1/3 md:w-1/4 align-top break-words">Description (Please provide a detailed description of the event in the box below)</th>
            <td class="border border-gray-300 px-4 py-3 text-gray-800 align-top break-words">Please refer to the attachment.</td>
          </tr>
        </tbody>
      </table>
      <p>Attachments</p>
      <ul style="list-style-type: none; padding-left: 0;">
        <li>
          &bull; <a href="https://investor.sdaletech.com/newsroom/20210408_173857_BHQ_RAE6P2LOZ759URXZ.1.pdf" target="_blank" rel="noopener noreferrer">Attachment 1</a> (Size: 36,881 bytes)
        </li>
      </ul>
`;

// we need to replace the content of 2328046.
// Because the content spans multiple lines, we'll use a strong regex.
const regex = /id:\s*'2328046',[\s\S]*?content:\s*`([\s\S]*?)`\s*},/g;

content = content.replace(regex, (match, p1) => {
    return match.replace(p1, newContent);
});

fs.writeFileSync(filePath, content);
console.log('Successfully updated the news article 2328046.');
