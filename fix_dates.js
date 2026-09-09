const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'source', '_posts');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if date already exists in the frontmatter
    const parts = content.split('---');
    if (parts.length >= 3) {
        const frontmatter = parts[1];
        if (!/^date:/m.test(frontmatter)) {
            const year = Math.floor(Math.random() * (2026 - 2024 + 1)) + 2024;
            const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
            const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
            const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
            const min = String(Math.floor(Math.random() * 60)).padStart(2, '0');
            const sec = String(Math.floor(Math.random() * 60)).padStart(2, '0');
            
            const dateStr = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
            
            content = content.replace(/^---([\r\n]+)/, `---$1date: ${dateStr}$1`);
            fs.writeFileSync(filePath, content, 'utf8');
        }
    }
}
console.log('Dates fixed successfully.');
