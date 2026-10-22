const fs = require('fs');
const path = require('path');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');

const rooms = [
  'index.html',
  'lobby.html',
  'memories.html',
  'questions.html',
  'videos.html',
  'cake.html',
  'photo-haul.html',
  'party-corner.html',
  'dares.html',
  'kids-challenge.html',
  'appa.html',
  'letter.html',
  'hug.html',
  'photobooth.html', // legacy redirect
  'answers.html'     // answers archive & Excel export
];

console.log('=== 1. Verifying HTML Files ===');
let missingFiles = 0;
rooms.forEach(file => {
  const fullPath = path.join(rootDir, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] Missing file: ${file}`);
    missingFiles++;
  } else {
    const stat = fs.statSync(fullPath);
    console.log(`[OK] ${file} (${stat.size} bytes)`);
  }
});

console.log('\n=== 2. Verifying Config & Photo Haul Assets ===');
const configPath = path.join(rootDir, 'js', 'config.js');
const configContent = fs.readFileSync(configPath, 'utf8');

// Read manifest
const manifestPath = path.join(rootDir, 'assets', 'photos_manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
console.log(`Loaded ${manifest.length} items from photos_manifest.json`);

let missingPhotos = 0;
manifest.forEach(item => {
  const p = path.join(rootDir, item.src);
  if (!fs.existsSync(p)) {
    console.error(`[FAIL] Photo missing: ${item.src}`);
    missingPhotos++;
  }
});
if (missingPhotos === 0) {
  console.log(`[OK] All ${manifest.length} photo haul assets exist on disk.`);
}

console.log('\n=== 3. Testing HTTP Server Status (port 8080) ===');
function testHttp(urlPath) {
  return new Promise((resolve) => {
    http.get(`http://localhost:8080/${urlPath}`, (res) => {
      resolve({ path: urlPath, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ path: urlPath, status: 'ERROR', error: err.message });
    });
  });
}

async function runHttpTests() {
  const testUrls = [
    ...rooms,
    'js/config.js',
    'js/main.js',
    'css/theme.css',
    'css/animations.css',
    'assets/photos_manifest.json',
    'assets/videos/video-1.mp4',
    'assets/photos/appa/photo1.jpeg',
    'assets/photos/appa/photo2.jpeg'
  ];

  for (const u of testUrls) {
    const res = await testHttp(u);
    if (res.status === 200 || res.status === 304) {
      console.log(`[HTTP ${res.status}] /${u}`);
    } else {
      console.error(`[HTTP ${res.status}] /${u}`);
    }
  }

  console.log('\n=== 4. Checking Tone & Prohibited Words ===');
  let toneIssues = 0;
  rooms.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    // Check for " Mom" or "Mom's" or "Mom "
    const momMatch = content.match(/\bMom('s)?\b/i);
    if (momMatch) {
      // Allow comment or ignore if not present
      console.warn(`[WARN] File ${file} might contain 'Mom': match found`);
      toneIssues++;
    }
  });

  if (toneIssues === 0) {
    console.log('[OK] All pages adhere to the "Amma" tone guideline! No "Mom" found.');
  }

  console.log('\n=== Verification Summary ===');
  console.log(`Missing HTML files: ${missingFiles}`);
  console.log(`Missing Photos: ${missingPhotos}`);
  console.log('Done!');
}

runHttpTests();
