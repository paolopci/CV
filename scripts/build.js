const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const staticEntries = [
    'courses.json',
    'favicon.ico',
    'Paolo Paci.pdf',
    'code-demo.js',
    'robots.txt',
    'sitemap.xml',
    'sitemap.txt',
    '404.html',
    'llms.txt',
    'google4c78e69bd5788aea.html'
];

const staticImageEntries = [
    'Paolo Paci Img.jpg',
    'infoCV-1200.webp',
    'infoCV-dark-1200.webp',
    'infoCV-light-1200.png',
    'infoCV-dark-1200.png',
    'infoskills-1200.webp',
    'infoskills-dark-1200.webp',
    'infoskills-light-1200.png',
    'infoskills-dark-1200.png',
    'infoPercorsoProf-1200.webp',
    'infoPercorsoProf-dark-1200.webp',
    'infoPercorsoProf-light-1200.png',
    'infoPercorsoProf-dark-1200.png'
];

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function removeDir(dir) {
    fs.rmSync(dir, { recursive: true, force: true });
}

function copyRecursive(source, destination) {
    const stat = fs.statSync(source);
    if (stat.isDirectory()) {
        ensureDir(destination);
        fs.readdirSync(source).forEach((entry) => {
            copyRecursive(path.join(source, entry), path.join(destination, entry));
        });
        return;
    }

    ensureDir(path.dirname(destination));
    fs.copyFileSync(source, destination);
}

function shortHash(filePath) {
    const contents = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(contents).digest('hex').slice(0, 10);
}

function rewriteHtml() {
    const sourceHtmlPath = path.join(rootDir, 'index.html');
    const cssPath = path.join(distDir, 'css', 'index.min.css');
    const jsPath = path.join(distDir, 'js', 'app.min.js');

    if (!fs.existsSync(cssPath) || !fs.existsSync(jsPath)) {
        throw new Error('Run build:css and build:js before build:static.');
    }

    const cssVersion = shortHash(cssPath);
    const jsVersion = shortHash(jsPath);
    let html = fs.readFileSync(sourceHtmlPath, 'utf8');

    html = html.replace(
        /<link rel="stylesheet" href="css\/index\.css[^\"]*" \/>/,
        `<link rel="stylesheet" href="css/index.min.css?v=${cssVersion}" />`
    );

    html = html.replace(/\n\s*<script src="js\/main\.js[^\"]*" defer><\/script>/, '');
    html = html.replace(/\n\s*<!-- Code background injector -->\n\s*<script src="js\/hero-code-bg\.js[^\"]*" defer><\/script>/, '');
    html = html.replace(
        /(<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/prismjs@1\/plugins\/autoloader\/prism-autoloader\.min\.js"><\/script>)/,
        `$1\n    <script src="js/app.min.js?v=${jsVersion}" defer></script>`
    );

    fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');
}

function copyStaticImages() {
    const imagesSourceDir = path.join(rootDir, 'images');
    const imagesDistDir = path.join(distDir, 'images');
    ensureDir(imagesDistDir);

    staticImageEntries.forEach((entry) => {
        const source = path.join(imagesSourceDir, entry);
        if (!fs.existsSync(source)) {
            throw new Error(`Static image not found: ${entry}`);
        }
        copyRecursive(source, path.join(imagesDistDir, entry));
    });
}

function copyStatic() {
    ensureDir(distDir);
    staticEntries.forEach((entry) => {
        const source = path.join(rootDir, entry);
        if (!fs.existsSync(source)) {
            throw new Error(`Static entry not found: ${entry}`);
        }
        copyRecursive(source, path.join(distDir, entry));
    });
    copyStaticImages();
    rewriteHtml();
}

const command = process.argv[2];

if (command === 'clean') {
    removeDir(distDir);
} else if (command === 'static') {
    copyStatic();
} else {
    console.error('Usage: node scripts/build.js <clean|static>');
    process.exit(1);
}
