const fs = require('fs');
const https = require('https');

const BASE_API_URL = process.env.BASE_API_URL
const BASE_SITE_URL = process.env.BASE_SITE_URL

function updateFile(source, target, placeholder, content) {
  fs.readFile(source, 'utf-8', (err, data) => {
    if (err) throw err;

    const updatedMd = data.replace(placeholder, content);

    fs.writeFile(target, updatedMd, 'utf-8', (err) => {
      if (err) throw err;
    });
  });
}

function updateBlogPosts() {
  let url = BASE_API_URL + '/posts?collection=blog&per_page=3';
  https.get(url, (res) => {
    res.setEncoding('utf8');
    let body = '';
    res.on('data', (data) => body += data);
    res.on('end', () => {
      body = JSON.parse(body);
      let articles = '';
      body.forEach(function (item) {
        articles += `\n - [${item.title}](${BASE_SITE_URL}/${item.collection}/${item.slug})`;
      })
      updateFile('README.md', 'README.md', '{LATEST_BLOG_POSTS}', articles);
    });
  });
}

function updateTimestamp() {
  updateFile('TEMPLATE.md', 'README.md', '{TIMESTAMP}', new Date().toUTCString());
}

updateTimestamp();
updateBlogPosts();
