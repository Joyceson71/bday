const fs = require('fs');

const college = fs.readdirSync('assets/photos/college').map(f => 'assets/photos/college/' + f);
const marriage = fs.readdirSync('assets/photos/marriage').map(f => 'assets/photos/marriage/' + f);
const current = fs.readdirSync('assets/photos/current').map(f => 'assets/photos/current/' + f);
const appa = fs.readdirSync('assets/photos/appa').map(f => 'assets/photos/appa/' + f);

const haul = [];
let id = 1;

// Appa
appa.forEach((f, idx) => {
  haul.push({
    id: id++,
    src: f,
    category: 'appa',
    categoryLabel: 'With Appa 💙',
    caption: idx === 0 ? "Appa's proud, gentle smile holding his beloved little princess." : "The safest place in the world — walking hand in hand by Appa's side."
  });
});

// College
college.forEach((f, idx) => {
  haul.push({
    id: id++,
    src: f,
    category: 'college',
    categoryLabel: 'College Days 🎓',
    caption: idx === 0 ? "College elegance — quiet confidence and radiant intelligence." : idx === 1 ? "Campus memories, notebooks, and laughter shared with dear friends." : "Young Glory standing on the brink of a bright, beautiful future."
  });
});

// Marriage
marriage.forEach((f, idx) => {
  haul.push({
    id: id++,
    src: f,
    category: 'marriage',
    categoryLabel: 'Sacred Marriage 💍',
    caption: idx === 0 ? "The blessed wedding day — bride adorned in silk, gold, and grace." : idx === 1 ? "Two souls, one sacred journey. The beginning of our home." : idx === 2 ? "A smile reflecting hope, love, and lifelong companionship." : idx === 3 ? "Holding hands through sunshine and rain — true partnership." : "Sacred vows and timeless blessings that built our family."
  });
});

// Current
const currentCaptions = [
  "Queen Glory Gnana Selvi — radiant in royal elegance 👑",
  "The face of warmth, comfort, and unconditional love 💜",
  "A mother's smile that lights up the whole house brighter than sunrise ✨",
  "Dignity, grace, and timeless beauty personified 🌸",
  "Celebrating the woman who makes every day a festival 🎉",
  "Surrounded by love, wearing the sweetest smile 💖",
  "Our pillar of strength, prayer, and endless kindness 🌷",
  "Joyful moments, treasured laughter with family 🧸",
  "The sweetest Amma in the universe, looking splendid 🌺",
  "Graceful in traditional silk — a true Queen 👗",
  "Eyes sparkling with affection and blessings for everyone 🕊️",
  "Forever young at heart, spreading cheer everywhere 🌟",
  "A heartwarming portrait of our beloved Amma ❤️",
  "Peaceful, serene, and blessed with God's grace 🪔",
  "Amma enjoying her day of celebration and royalty 👑",
  "Every shade of purple and gold looks made just for her ✨",
  "Our family's greatest treasure and brightest blessing 💜",
  "Laughter that heals every heartache in seconds 🎶",
  "A radiant smile capturing decades of love and devotion 🥹",
  "Queen of our home, ruling with tenderness and wisdom 👑",
  "Loving moments captured forever in time 📸",
  "Always giving, always smiling, always loving 🌸",
  "A stunning portrait of Glory Gnana Selvi 💖",
  "The gentlest mother God ever created on earth 🕊️",
  "Amma in full festive cheer and warmth 🎊",
  "Every photo of yours is a poem of love, Amma 🌹",
  "Cherished memories that grow sweeter every year ✨",
  "Forever our pride, our heart, and our home 🏠",
  "Thank you for being born, dearest Amma! 💜"
];

current.forEach((f, idx) => {
  haul.push({
    id: id++,
    src: f,
    category: 'current',
    categoryLabel: 'Queen Glory Today 👑',
    caption: currentCaptions[idx % currentCaptions.length]
  });
});

fs.writeFileSync('assets/photos_manifest.json', JSON.stringify(haul, null, 2));
console.log('Manifest written with', haul.length, 'photos.');
