const fs = require('fs');
const path = require('path');

const VAULT_FILE = path.join(__dirname, 'frontend/src/data/vault.js');
let content = fs.readFileSync(VAULT_FILE, 'utf8');

// Replace pollinations.ai with loremflickr
// "https://image.pollinations.ai/prompt/Insect%20photography?width=400&height=300&nologo=true&seed=1"
// becomes "https://loremflickr.com/400/300/Insect?lock=1"
content = content.replace(/https:\/\/image\.pollinations\.ai\/prompt\/([A-Za-z]+)(?:%20photography)?\?[^"]*seed=(\d+)[^"]*/g, "https://loremflickr.com/400/300/$1?lock=$2");

fs.writeFileSync(VAULT_FILE, content);
console.log("Updated vault.js with LoremFlickr URLs");
