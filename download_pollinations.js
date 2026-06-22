const fs = require('fs');
const path = require('path');
const https = require('https');

const VAULT_FILE = path.join(__dirname, 'frontend/src/data/vault.js');
const IMAGES_DIR = path.join(__dirname, 'frontend/public/images/vault');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function downloadImage(urlStr, filename) {
  return new Promise((resolve, reject) => {
    https.get(urlStr, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(filename);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(filename); });
    }).on('error', reject).setTimeout(15000, function() {
      this.abort(); reject(new Error('Timeout'));
    });
  });
}

const delay = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  let content = fs.readFileSync(VAULT_FILE, 'utf8');
  const regex = /https:\/\/loremflickr\.com\/400\/300\/([a-zA-Z]+)\?lock=(\d+)/g;
  let match;
  const tasks = [];
  
  while ((match = regex.exec(content)) !== null) {
    tasks.push({
      original: match[0],
      word: match[1],
      seed: match[2]
    });
  }
  
  console.log(`Found ${tasks.length} images to download`);
  
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const url = `https://image.pollinations.ai/prompt/${task.word}%20photography?width=400&height=300&nologo=true&seed=${task.seed}`;
    const filename = `pollination_${task.word.toLowerCase()}_${task.seed}.jpg`;
    const filepath = path.join(IMAGES_DIR, filename);
    const localUrl = `/images/vault/${filename}`;
    
    console.log(`[${i+1}/${tasks.length}] Downloading ${task.word} seed ${task.seed}...`);
    
    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await downloadImage(url, filepath);
        success = true;
        break;
      } catch (err) {
        console.error(`  Attempt ${attempt} failed: ${err.message}`);
        await delay(2000);
      }
    }
    
    if (success) {
      content = content.replace(task.original, localUrl);
    } else {
      console.log(`  Falling back to a solid color placeholder for ${task.word}`);
      // Fallback: create a dummy image or use a base64 string
      content = content.replace(task.original, `https://placehold.co/400x300/000000/35D07F/png?text=${task.word}`);
    }
    
    // update vault.js continuously in case we crash
    fs.writeFileSync(VAULT_FILE, content);
  }
  
  console.log("Done.");
}

main().catch(console.error);
