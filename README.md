# 💜 Happy Birthday, Amma! — Glory Gnana Selvi
### A Multi-Page Interactive Birthday Website, Made Only For Her

A deeply personal, interactive multi-page birthday website built with plain HTML, CSS and vanilla JavaScript. No frameworks, no build step — just double-click `index.html` in any browser or deploy on any static host.

---

## 🗂️ Project Structure (14 Dedicated Rooms)

```
bday/
├── index.html          ← 🎪 Room 1: The Party Gate (Opening Tamil blessing + golden key door game)
├── lobby.html          ← 🎈 Room 2: Welcome Lobby (Amma's feast menu + 10-balloon pop game)
├── memories.html       ← 📸 Room 3: Memory Lane (4 life phases, flip photo cards + memory match game)
├── questions.html      ← 💬 Room 4: Questions Just For Amma (5 chapters, voice dictation, Excel/Sheet sync)
├── videos.html         ← 🎥 Room 5: Wishes From The Family (single centerpiece family video + "AMMA LOVE" word game)
├── cake.html           ← 🎂 Room 6: The Cake Moment (5 candles, mic/tap blow-out, cake slice, gift catch)
├── photo-haul.html     ← 📸 Room 7: Photo Haul & Memories Showcase (all 37 photos, category tabs, lightbox, auto showcase)
├── party-corner.html   ← 🪔 Room 8: Party Corner (gift boxes, wish jar, vinyl jukebox, "Light the Lamps")
├── dares.html          ← 🎯 Room 9: Birthday Dares (golden spin-the-wheel for 5 loving dares)
├── kids-challenge.html ← 🧸 Room 10: The Kids' Love Challenge (tender hugs & kisses checklist)
├── appa.html           ← 💙 Room 11: A Room For Appa (reverent 4-stage room, memories, sacred Q5, wish video)
├── letter.html         ← 💌 Room 12: The Final Letter & Keepsake (wax seal envelope, typewriter letter)
├── hug.html            ← 🤗 Room 13: A Virtual Hug (glowing heartbeat hug, handwritten love card)
├── answers.html        ← 📊 Admin/Archive: View all Amma's answers & export to Excel (.csv)
│
├── css/
│   ├── theme.css       ← Royal Purple & Gold design system, Google Fonts, Noto Sans Tamil, Music panel
│   └── animations.css  ← Keyframes for float, shimmer, sparkle, cake knife slice, heartbeat, etc.
│
├── js/
│   ├── config.js       ← ⭐ Centralized personalization file (photos, questions, dares, letter, hug, songs)
│   └── main.js         ← Shared engine (continuous music, gold hearts progress, ambient FX, guard)
│
└── assets/
    ├── photos_manifest.json ← Catalog of all 39 memories with IDs, categories, and captions
    ├── photos/
    │   ├── current/    ← 29 real Queen Glory photos (WhatsApp memories)
    │   ├── marriage/   ← 5 real sacred wedding photos
    │   ├── college/    ← 3 real college days photos
    │   ├── appa/       ← Appa photos (photo1.jpeg, photo2.jpeg)
    │   └── school/     ← School memories placeholders
    ├── videos/         ← video-1.mp4 (Kavin's wish & Appa room wish)
    ├── audio/
    │   ├── background/ ← Page background music tracks (.wav / .mp3)
    │   ├── effects/    ← Sound effects (pop, chime, bell, heartbeat, success)
    │   └── jukebox/    ← Amma's favourite Tamil songs (.wav / .mp3)
    └── stickers/       ← Royal celebratory sticker icons
```

---

## 🌸 Core Design & Rules

1. **Made Only for Amma**: Everything is addressed directly to her ("Amma, this room is for you"). There are no other guest names or guest books.
2. **Naming**: Addressed as **"Amma"** throughout. Formal name **"Glory Gnana Selvi"** appears only on the invitation card (`index.html`) and the final letter (`letter.html`). Her son is **"Gunda"** (Kavin), her father is **"Appa"**, and her partner is called **"her husband"**.
3. **No Age Mention**: Her age is never displayed or referenced anywhere.
4. **Opening Message**: Starts with the golden script blessing:
   > **பிறந்ததற்கு நன்றி, அம்மா 💜**  
   > *Porandhadhuku nandri, Amma.*  
   > *Thank you for being born.*
5. **Aesthetics**: Deep royal purple (`#2E0854`), metallic & bright gold (`#D4AF37`, `#FFD700`), champagne, lavender, and soft rose.
6. **Continuous Music System**:
   - Soft, slow, mellow instrumentals (piano, light strings, acoustic guitar, flute, veena) kept at mild volume (20% to 30%).
   - Seamlessly plays across page transitions without restarting, retaining playback position in `localStorage`.
   - Floating music controls panel with Mute/Unmute, Volume Slider, Next Song button, and Sound Effects toggle.
   - Music automatically drops / pauses whenever a family video or Appa's video is played, and when a Jukebox song is selected.

---

## 🎵 Music System & How to Replace Audio Files

All audio files are organized in `/assets/audio/`:

### 1. Page Background Music (`assets/audio/background/`)
- `gate-lobby.wav` — Light, happy, soft instrumental (Gate & Lobby)
- `memories-piano.wav` — Nostalgic, slow piano (Memory Lane)
- `questions-acoustic.wav` — Calm, cozy acoustic (Questions Just For Amma)
- `cake-festive.wav` — Festive, warm celebratory tune (The Cake Moment)
- `playful-corner.wav` — Soft playful chimes & melody (Booth, Party Corner, Dares)
- `lullaby-kids.wav` — Soothing, tender lullaby (Kids' Love Challenge)
- `appa-reverence.wav` — Slowest, quietest music of the site (A Room For Appa)
- `letter-hug.wav` — Soft emotional piano (Final Letter & Virtual Hug)

To replace any track, simply drop your own `.mp3` or `.wav` file into `assets/audio/background/` and update `CONFIG.music.pages` in [`js/config.js`](js/config.js).

### 2. Jukebox Playlist (`assets/audio/jukebox/`)
- `amma-endru.wav` — Amma Endru Azhaikadha (K.J. Yesudas)
- `kannana-kanne.wav` — Kannana Kanne (Sid Sriram)
- `en-thaaye.wav` — En Thaaye En Thaaye (Vandana)
- `roja-instrumental.wav` — Roja Jaaneman Instrumental (A.R. Rahman)

To add more songs for Amma:
1. Place audio files in `assets/audio/jukebox/`.
2. Open [`js/config.js`](js/config.js) and add entries to `CONFIG.jukebox`:
   ```javascript
   {
     title: "Song Name",
     artist: "Artist Name",
     file: "assets/audio/jukebox/song.mp3",
     dedication: "Dedication note for Amma 💜",
     youtubeId: "optional_youtube_id"
   }
   ```

### 3. Sound Effects (`assets/audio/effects/`)
- `pop.wav` — Balloon pop
- `chime.wav` — Star drop / jar fill
- `bell.wav` — Room entrance bell
- `heartbeat.wav` — Rhythmic heartbeat for Virtual Hug
- `success.wav` — Game celebration chime

---

## ✏️ How to Personalise Everything in `js/config.js`

All configuration lives in **[`js/config.js`](js/config.js)**:

### 1. Basic Details
```js
name:     "Amma",               // Always called Amma
fullName: "Glory Gnana Selvi",  // Used on invitation and letter
sonName:  "Kavin",              // Her Gunda
```

### 2. Adding Photos
Drop your photos into:
- `assets/photos/school/photo1.jpg` … `photo4.jpg`
- `assets/photos/college/photo1.jpg` … `photo4.jpg`
- `assets/photos/marriage/photo1.jpg` … `photo4.jpg`
- `assets/photos/current/photo1.jpg` … `photo4.jpg`
- `assets/photos/appa/portrait.jpg` (Appa's portrait) and `photo1.jpg` … `photo4.jpg`

Update the captions in `config.js` under `photos` and `appa.photos`.

### 3. Google Sheets & Excel Export for Amma's Answers
- **Real-Time Google Sheets Webhook**:
  1. Open a new Google Sheet at [sheets.new](https://sheets.new).
  2. In the top menu, go to **Extensions > Apps Script**.
  3. Paste the contents of `scripts/google_apps_script.js` and click **Save**.
  4. Click **Deploy > New deployment > Web app** (set *Who has access* to **Anyone**).
  5. Copy the Web App URL and paste it into `js/config.js` under `sheetsWebhookUrl`.
  Every answer Amma types or dictates is now automatically posted as a new row in your Google Sheet in real-time!
- **Instant Excel (.csv) Export**:
  - Click the **"📊 Export All Answers to Excel (.csv)"** button in the Keepsake section of `questions.html`.
  - Or visit `answers.html` anytime to see a live table of all answers and download the `.csv` spreadsheet.
  - Or press **`Shift + E`** on any page to immediately download all answers as an Excel file!

### 4. Family Video (Single Video for The Family)
- Single centerpiece video for the entire family (`assets/videos/video-1.mp4`). No separation into individual relations—addressed from the whole family to Amma.
- Appa's Birthday Wish Video: placed at `assets/videos/appa-birthday-wish.mp4` or configured in `config.js`.

### 5. Customizing Questions, Dares, Hug & The Final Letter
- Questions for Amma (5 Chapters): in `config.js` under `questionsChapters`.
- Appa's Room Questions: in `config.js` under `appa.questions`.
- Birthday Dares: in `config.js` under `dares`.
- The Kids' Challenge: in `config.js` under `kidsChallenge`.
- Final Letter Text: in `config.js` under `letter.paragraphs`.
- Virtual Hug Message & Tamil line: in `config.js` under `hug`.

---

## 🎮 Page-by-Page Game & Flow Guide (13 Rooms)

| Room | Page | Game / Interaction | How to Unlock Next Room |
|------|------|--------------------|-------------------------|
| 1 | `index.html` | Drag Golden Key | Drag the golden key to the doors or tap "Tap to Open, Amma!" |
| 2 | `lobby.html` | Pop 10 Balloons | Gently pop all 10 balloons (zero time pressure; reveals blessings) |
| 3 | `memories.html` | Photo Memory Match | Match 3 pairs of Amma's photos (6 cards) |
| 4 | `questions.html` | Questions for Amma | Journey through 5 life chapters; fill the Star Jar with 5 stars |
| 5 | `videos.html` | Family Video & "AMMA LOVE" | Watch the single Family video or unscramble **A M M A &nbsp; L O V E** |
| 6 | `cake.html` | Candles & Gift Catch | Blow out the 5 candles (mic or tap), slice cake, catch 10 falling gifts |
| 7 | `photo-haul.html` | Photo Haul Showcase | Explore or love at least 5 cherished memories |
| 8 | `party-corner.html`| Light the 5 Lamps | Tap each glowing diya/lantern to illuminate the room |
| 9 | `dares.html` | Spin the Golden Wheel | Spin and complete the 5 gentle birthday dares |
| 10 | `kids-challenge.html` | Kids' Love Checklist | Check off hugs, kisses, and love for her children |
| 11 | `appa.html` | A Room For Appa | Reverent 4-stage experience: Door → Memories → 5 Questions (with sacred diya pause & Question 5) → Appa's Wish Video |
| 12 | `letter.html` | The Final Letter | Tap wax seal to unfold letter, view Amma's Keepsake Book, tap "A hug from me, Amma 🤗" |
| 13 | `hug.html` | A Virtual Hug | Tap/hold the glowing heart to receive a beating hug pulse, floating hearts, and handwritten card |
| 14 | `jd.html` | A Wish From JD | Typewriter message from JD with optional photo/video/voice note, then view Amma's Answer Keepsake |

---

## 🔑 Secret Testing & Admin Shortcuts

- **`Shift + S`**: Instantly unlocks the next room.
- **`Shift + E`**: Instantly exports all of Amma's recorded answers to an Excel (.csv) file.
- **`Shift + R`**: Resets all room progress and starts over from the Gate.
- **`answers.html`**: Direct page to view and export all answers.

---

## 🚀 How to Deploy for Free

### Option 1 — Netlify (Recommended)
1. Go to [netlify.com](https://netlify.com) and log in for free.
2. Drag and drop the `bday` folder onto the dashboard.
3. You will receive an instant HTTPS live link to share with Amma.

### Option 2 — GitHub Pages
1. Push this folder to a GitHub repository.
2. Under **Settings → Pages**, set Branch to `main` and folder to `/ (root)`.
3. Save and open the generated link.

### Option 3 — Vercel
1. Run `npx -y vercel` or upload the repository via [vercel.com](https://vercel.com).
