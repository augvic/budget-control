const path = require('path');
const fs = require('fs');

const distFolder = path.resolve(__dirname, './dist');
const winUnpackedFolder = path.resolve(__dirname, './dist/win-unpacked');
const filesToDelete = [
    'builder-debug.yml',
    'builder-effective-config.yaml',
    '.icon-ico'
];

filesToDelete.forEach(file => {
    const filePath = path.join(distFolder, file);
    fs.rmSync(filePath, { recursive: true, force: true });
});
const winUnpackedFiles = fs.readdirSync(winUnpackedFolder);
winUnpackedFiles.forEach(file => {
    const oldFilePath = path.join(winUnpackedFolder, file);
    const newFilePath = path.join(distFolder, file);
    fs.renameSync(oldFilePath, newFilePath);
});
fs.rmdirSync(winUnpackedFolder);