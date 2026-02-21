
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const backgroundDistDir = path.join(rootDir, 'apps/background/dist');
const popupDistDir = path.join(rootDir, 'apps/popup/dist');
const manifestDir = path.join(rootDir, 'apps/manifest');

// Clean dist directory
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

console.log('Building workspaces (no test)...');
execSync('turbo run build', { stdio: 'inherit', cwd: rootDir });

console.log('Copying background scripts...');
if (fs.existsSync(backgroundDistDir)) {
    fs.cpSync(backgroundDistDir, distDir, { recursive: true });
} else {
    console.error('Background build not found!');
    process.exit(1);
}

console.log('Copying popup...');
if (fs.existsSync(popupDistDir)) {
    fs.cpSync(popupDistDir, distDir, { recursive: true });
} else {
    console.error('Popup build not found!');
    process.exit(1);
}

console.log('Copying manifest and icons...');
if (fs.existsSync(manifestDir)) {
    fs.cpSync(manifestDir, distDir, { recursive: true });
    // Remove README.md from manifest if it was copied
    const readmePath = path.join(distDir, 'README.md');
    if (fs.existsSync(readmePath)) {
        fs.unlinkSync(readmePath);
    }
} else {
    console.error('Manifest files not found!');
    process.exit(1);
}

console.log('Extension built successfully in /dist');
