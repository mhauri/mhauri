const fs = require('fs');
const https = require('https');

const BASE_API_URL = process.env.BASE_API_URL

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
        articles += `\n - [${item.title}](https://marcelhauri.ch/${item.collection}/${item.slug})`;
      })

      fs.readFile('TEMPLATE.md', 'utf-8', (err, data) => {
        if (err) throw err;

        const updatedMd = data.replace('{LATEST_BLOG_POSTS}', articles);

        fs.writeFile('README.md', updatedMd, 'utf-8', (err) => {
          if (err) throw err;
          console.log('README update complete.');
        });
      });
    });
  });
}

updateBlogPosts();