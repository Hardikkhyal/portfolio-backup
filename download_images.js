const fs = require('fs');
const path = require('path');
const https = require('https');

const baseDir = path.join(__dirname, 'public', 'project-images');

const imagesToDownload = {
  'artwork': [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783928591-724f16b7b786?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&auto=format&fit=crop&q=80'
  ],
  'logo': [
    'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80'
  ],
  'graphic-designer': [
    'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1561070791-26c113006238?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572044160444-ad609029b908?w=800&auto=format&fit=crop&q=80'
  ],
  'webproject': [
    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80'
  ]
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const [folder, urls] of Object.entries(imagesToDownload)) {
    const dir = path.join(baseDir, folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    for (let i = 0; i < urls.length; i++) {
      const dest = path.join(dir, `${i + 1}.jpg`);
      console.log(`Downloading ${folder}/${i + 1}.jpg...`);
      await download(urls[i], dest);
    }
  }
  console.log('All downloads completed successfully!');
}

run().catch(console.error);
