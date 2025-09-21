const path = require('path');
const fs = require('fs');

const distPath = path.resolve(__dirname, './dist');

if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
}