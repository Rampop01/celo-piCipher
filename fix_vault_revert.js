const fs = require('fs');
const path = require('path');

const VAULT_FILE = path.join(__dirname, 'frontend/src/data/vault.js');
let content = fs.readFileSync(VAULT_FILE, 'utf8');

// Replace loremflickr back to pollinations
content = content.replace(/https:\/\/loremflickr\.com\/400\/300\/([A-Za-z]+)\?lock=(\d+)/g, "https://image.pollinations.ai/prompt/$1%20photography?width=400&height=300&nologo=true&seed=$2");

// Replace local pollinations back to pollinations
content = content.replace(/\/images\/vault\/pollination_([a-zA-Z]+)_(\d+)\.jpg/g, (match, p1, p2) => {
  return `https://image.pollinations.ai/prompt/${p1}%20photography?width=400&height=300&nologo=true&seed=${p2}`;
});

// Capitalize the first letter of the word in the pollinations URL so it matches the original format
content = content.replace(/prompt\/([a-z])([a-zA-Z]*)%20photography/g, (match, p1, p2) => {
  return `prompt/${p1.toUpperCase()}${p2}%20photography`;
});

fs.writeFileSync(VAULT_FILE, content);
console.log("Reverted vault.js to use pollinations.ai URLs");
