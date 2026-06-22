const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const VAULT_FILE = path.join(__dirname, '../src/data/vault.js');
const IMAGES_DIR = path.join(__dirname, '../public/images/vault');

// Create images directory if it doesn't exist
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function downloadImage(urlStr, filename) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(urlStr);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      const req = protocol.get(urlStr, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
        }
        
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download ${urlStr}: ${res.statusCode}`));
          return;
        }

        const file = fs.createWriteStream(filename);
        res.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve(filename);
        });
      });

      req.on('error', (err) => {
        reject(err);
      });
      
      // Timeout
      req.setTimeout(10000, () => {
        req.abort();
        reject(new Error(`Timeout downloading ${urlStr}`));
      });
    } catch (e) {
      reject(e);
    }
  });
}

async function main() {
  let content = fs.readFileSync(VAULT_FILE, 'utf8');
  
  // Extract all URLs
  const urlRegex = /"https?:\/\/[^"]+"/g;
  const urls = content.match(urlRegex) || [];
  
  console.log(`Found ${urls.length} URLs to process.`);
  
  let i = 0;
  for (const urlMatch of urls) {
    const url = urlMatch.slice(1, -1); // Remove quotes
    const ext = path.extname(new URL(url).pathname) || '.jpg';
    const localFilename = `img_${i}${ext}`;
    const localPath = path.join(IMAGES_DIR, localFilename);
    const publicPath = `/images/vault/${localFilename}`;
    
    console.log(`Downloading ${url} -> ${localPath}`);
    try {
      await downloadImage(url, localPath);
      // Replace in content
      content = content.replace(urlMatch, `"${publicPath}"`);
    } catch (e) {
      console.error(`Error downloading ${url}:`, e.message);
    }
    i++;
  }
  
  fs.writeFileSync(VAULT_FILE, content, 'utf8');
  console.log('Done downloading images and updating vault.js');
}

main().catch(console.error);
