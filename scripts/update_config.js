const fs = require('fs');
let cfg = fs.readFileSync('js/config.js', 'utf8');

// 1. Update schedule Room 7
cfg = cfg.replace(
  '{ time: "Room 7",  event: "Photo Booth — Queen Glory posing in royal style 🤳" },',
  '{ time: "Room 7",  event: "Photo Haul — Grand showcase of all our memories 📸" },'
);

// 2. Update photos.college
cfg = cfg.replace(
  /college:\s*\[[\s\S]*?\](?=,\s*marriage:)/,
  `college: [
      { src: "assets/photos/college/WhatsApp Image 2026-10-22 at 4.40.36 PM.jpeg", caption: "College elegance — quiet confidence and radiant intelligence." },
      { src: "assets/photos/college/WhatsApp Image 2026-10-22 at 4.40.37 PM (1).jpeg", caption: "Campus memories, notebooks, and laughter shared with dear friends." },
      { src: "assets/photos/college/WhatsApp Image 2026-10-22 at 4.40.37 PM.jpeg", caption: "Young Glory standing on the brink of a beautiful future." }
    ]`
);

// 3. Update photos.marriage
cfg = cfg.replace(
  /marriage:\s*\[[\s\S]*?\](?=,\s*current:)/,
  `marriage: [
      { src: "assets/photos/marriage/WhatsApp Image 2026-10-22 at 4.41.18 PM (1).jpeg", caption: "The blessed wedding day — bride adorned in silk, gold, and grace." },
      { src: "assets/photos/marriage/WhatsApp Image 2026-10-22 at 4.41.18 PM (2).jpeg", caption: "Two souls, one sacred journey. The beginning of our family." },
      { src: "assets/photos/marriage/WhatsApp Image 2026-10-22 at 4.41.18 PM.jpeg", caption: "A smile reflecting hope, love, and lifelong devotion." },
      { src: "assets/photos/marriage/WhatsApp Image 2026-10-22 at 4.41.19 PM (1).jpeg", caption: "Together through sunshine and rain — true companionship." },
      { src: "assets/photos/marriage/WhatsApp Image 2026-10-22 at 4.41.19 PM.jpeg", caption: "Sacred vows and timeless blessings that built our family." }
    ]`
);

// 4. Update photos.current
cfg = cfg.replace(
  /current:\s*\[[\s\S]*?\](?=,\s*\},)/,
  `current: [
      { src: "assets/photos/current/WhatsApp Image 2026-10-22 at 4.42.07 PM.jpeg", caption: "Our dearest Amma today — gorgeous, graceful, and our whole world." },
      { src: "assets/photos/current/WhatsApp Image 2026-10-22 at 4.42.08 PM.jpeg", caption: "The face of comfort. One hug from Amma cures everything." },
      { src: "assets/photos/current/WhatsApp Image 2026-10-22 at 4.42.09 PM.jpeg", caption: "Queen Glory Gnana Selvi — celebrating you today and every day!" },
      { src: "assets/photos/current/WhatsApp Image 2026-10-22 at 4.42.11 PM.jpeg", caption: "Thank you for being born, Amma. We love you beyond all measure." }
    ]`
);

// 5. Update photos.school
cfg = cfg.replace(
  /school:\s*\[[\s\S]*?\](?=,\s*college:)/,
  `school: [
      { src: "assets/photos/college/WhatsApp Image 2026-10-22 at 4.40.36 PM.jpeg", caption: "Youthful Glory with the sweetest smile and bright curiosity." },
      { src: "assets/photos/college/WhatsApp Image 2026-10-22 at 4.40.37 PM (1).jpeg", caption: "Endearing innocence, warmth, and dreams destined to bloom." },
      { src: "assets/photos/college/WhatsApp Image 2026-10-22 at 4.40.37 PM.jpeg", caption: "A heart full of wonder, destined to become the greatest mother." }
    ]`
);

// 6. Update videos[0].src to assets/videos/video-1.mp4
cfg = cfg.replace(
  `name:      "Kavin (Your Gunda)",\n      relation:  "Your Loving Son",\n      src:       null,`,
  `name:      "Kavin (Your Gunda)",\n      relation:  "Your Loving Son",\n      src:       "assets/videos/video-1.mp4",`
);

// 7. Update appa photos & portrait
cfg = cfg.replace(
  'portrait: "assets/photos/appa/portrait.jpg",',
  'portrait: "assets/photos/appa/photo1.jpeg",'
);

cfg = cfg.replace(
  /photos:\s*\[[\s\S]*?photo4\.jpg\"[\s\S]*?\}\s*\],/,
  `photos: [
      { src: "assets/photos/appa/photo1.jpeg", caption: "Appa's proud, gentle smile holding his beloved little princess." },
      { src: "assets/photos/appa/photo2.jpeg", caption: "The safest place in the world — walking hand in hand by Appa's side." }
    ],`
);

cfg = cfg.replace(
  'poster: "assets/photos/appa/portrait.jpg",',
  'poster: "assets/photos/appa/photo1.jpeg",'
);

cfg = cfg.replace(
  'src: "assets/videos/appa-birthday-wish.mp4",',
  'src: "assets/videos/video-1.mp4",'
);

// 8. Add photoHaul manifest array
const manifest = fs.readFileSync('assets/photos_manifest.json', 'utf8');
if (!cfg.includes('photoHaul:')) {
  cfg = cfg.replace(
    '// ─── TAMIL JUKEBOX',
    '// ─── PHOTO HAUL (SHOWCASE OF ALL 39 MEMORIES) ──────────\n  photoHaul: ' + manifest + ',\n\n  // ─── TAMIL JUKEBOX'
  );
}

// 9. Update music pages mapping for photo-haul.html
cfg = cfg.replace(
  '"photobooth.html":     { src: "assets/audio/background/playful-corner.wav", volume: 0.24, label: "Playful Melody" },',
  '"photo-haul.html":      { src: "assets/audio/background/playful-corner.wav", volume: 0.24, label: "Memory Haul" },\n      "photobooth.html":     { src: "assets/audio/background/playful-corner.wav", volume: 0.24, label: "Memory Haul" },'
);

fs.writeFileSync('js/config.js', cfg, 'utf8');
console.log('config.js successfully updated with all real assets!');
