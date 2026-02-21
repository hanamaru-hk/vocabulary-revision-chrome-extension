const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const publishDir = path.join(rootDir, 'publish');
const zipPath = path.join(publishDir, 'word-notebook.zip');

if (!fs.existsSync(distDir)) {
    console.error('dist/ not found. Run build first.');
    process.exit(1);
}

fs.mkdirSync(publishDir, { recursive: true });

console.log('Zipping dist to publish/word-notebook.zip...');
execSync(`cd "${distDir}" && zip -r "${zipPath}" .`, {
    stdio: 'inherit',
    cwd: rootDir,
});

console.log('Done. Output: publish/word-notebook.zip');
