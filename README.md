# 🖐️ AR Vision Quiz

An **offline-first, interactive Augmented Reality (AR) Quiz application** featuring **real-time hand gesture tracking**, **live skeletal AR overlays**, **1.5-second dwell auto-selection**, and a **lightweight JSON question engine**.

Designed to run smoothly on **standard laptop webcams** and display beautifully on **widescreen TVs, projectors, and classroom monitors (16:9 landscape)**.

---

## 📺 Application Layout

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                       AR QUIZ                                          │
├────────────────────────────────────────┬───────────────────────────────────────────────┤
│ 📷 LEFT: Camera & AR Skeleton Overlay  │ 📝 RIGHT: Question & Option Cards             │
│                                        │                                               │
│  QUESTION: 1/10          SCORE: 0      │  ┌──────────────────────────────────────────┐ │
│  ┌───────────────────────────────────┐ │  │ What tool is required to mine Diamond?  🔊│ │
│  │ [⏱ 1.5s Hold: Option C (65%)]    │ │  └──────────────────────────────────────────┘ │
│  │                                   │ │                                               │
│  │      (Glowing Cyan Skeleton)      │ │  [A]  Wooden Pickaxe                          │
│  │             \  |  /               │ │  [B]  Stone Pickaxe                           │
│  │              \ | /                │ │  [C]  Iron Pickaxe  ████████░░░ (Dwell Fill)  │
│  │             (✋ Hand)              │ │  [D]  Golden Pickaxe                          │
│  │                                   │ │                                               │
│  └───────────────────────────────────┘ │  🔀 [Random Question]  ⚙️ [Manage Questions]   │
└────────────────────────────────────────┴───────────────────────────────────────────────┘
```

---

## ✨ Key Features

- **📷 Real-Time AR Hand Skeleton ("Highlights What the Model Sees")**:
  - Live video feed layered with an HTML5 `<canvas>` (`transform: scaleX(-1)` mirrored).
  - Tracks and draws all **21 3D hand joints** in glowing neon cyan with bright connection lines and pulsating fingertip halos.
  - Floating in-camera status pill showing the currently recognized gesture and dwell countdown ring (matches the `⏱ 3s` badge in the reference UI).
- **⏱️ 1.5-Second Dwell Auto-Selection**:
  - Show **1, 2, 3, or 4 fingers** to pick options **A, B, C, or D**.
  - An animated blue progress bar fills across the highlighted option card over **1.5 seconds**.
  - Automatically locks the answer with a positive chime or buzzer sound, displays an instant explanation banner, and awards score without needing a mouse or keyboard!
- **💻 Laptop Webcam Anti-Jitter Engine**:
  - Engineered specifically for low-resolution 720p built-in laptop webcams.
  - **250ms Grace Period**: Tolerates momentary motion blur or dropped camera frames without resetting dwell progress.
  - **3D Vector Distance Heuristics**: Accurately recognizes hand gestures even when hands are tilted, angled, or at a distance.
- **📺 16:9 TV Landscape Kiosk Mode**:
  - Proportional widescreen layout: **zero vertical scrolling** on 1080p, 4K, or 720p screens.
  - Extra-large typography and high-contrast option cards readable from 3–5 meters across a living room or classroom.
  - One-click **`⛶ Fullscreen`** button (or press **`F`** on your keyboard).
- **🔀 Rapid Testing Mode**:
  - Tap **`🔀 Random Question`** (or press **`R`**) to instantly test any question from the active pack.
- **🔊 100% Offline Audio & Text-to-Speech**:
  - Synthesized Web Audio API sound effects (positive chime / negative buzzer).
  - Browser-native offline `window.speechSynthesis` reads questions out loud when tapping the speaker icon.
- **🔒 100% Local & Air-Gapped (Zero Cloud Requests)**:
  - Local MediaPipe WebAssembly engine pre-bundled in `public/wasm/`.
  - Local float16 `hand_landmarker.task` model (~7.8 MB) pre-bundled in `public/models/`.
  - Works completely offline without Wi-Fi or internet connection.

---

## 🚀 How to Run

### Step 1: Clone the Repository
```bash
git clone https://github.com/zyione/ar_quiz.git
cd ar_quiz
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start the Local Development Server
```bash
npm run dev
```

### Step 4: Open in Your Browser
Visit the local URL in Google Chrome, Microsoft Edge, Brave, or Safari:
```
http://localhost:5173/
```
*When prompted, allow camera permissions so the app can track hand gestures locally.*

---

## 📺 How to Display on a TV / Projector

1. Connect your laptop to your TV or projector using an **HDMI cable** or wireless screen mirroring (AirPlay, Miracast, or Chromecast).
2. Open `http://localhost:5173/` in your browser.
3. Click the **`⛶ Fullscreen`** button in the top HUD (or press **`F`** on your keyboard).
4. The application will fit the 16:9 landscape TV screen with crisp, oversized fonts and high-contrast buttons designed for 10-foot viewing.

---

## 🎮 Hand Gestures & Hotkeys Cheat Sheet

| Option | Hand Shape | Recommended Gesture | Keyboard Shortcut |
| :---: | :---: | :--- | :---: |
| **A** | ☝️ | 1 Finger (Index pointed up) | `1` or `A` |
| **B** | ✌️ | 2 Fingers (Peace / Victory sign) | `2` or `B` |
| **C** | 🤟 | 3 Fingers (Index + Middle + Ring) | `3` or `C` |
| **D** | 🖐️ | 4 Fingers (or Open Palm) | `4` or `D` |
| **Confirm** | ⏱️ | Hold gesture for 1.5 seconds | `Enter` |
| **Next Question**| ➜ | Auto-advances or press button | `Space` or `Enter` |
| **Random Question**| 🔀 | Jump to random question | `R` |
| **TV Fullscreen** | ⛶ | Toggle Fullscreen | `F` |

---

## 📝 How to Add or Edit Questions

The quiz includes built-in question packs and supports custom JSON files:
- ⛏️ **Minecraft Trivia** (Default pack)
- 📚 **English Grammar** (From the reference classroom screenshot)
- 🤖 **AI Literacy Challenge** (40 professional questions)

You can add and customize questions using either method below:

### Method 1: Using the In-App Question Manager (Easiest)
1. In the app, click **`⚙️ Questions`** in the top HUD or Welcome Screen.
2. **Visual Editor Tab**:
   - Click **`+ Add`** to create a new question.
   - Enter your question prompt (use `___________` for fill-in-the-blank).
   - Enter options for **A**, **B**, **C**, and **D**.
   - Select the radio button next to the correct answer.
   - Enter an explanation displayed after the answer is locked.
   - Click **`💾 Save Changes`**.
3. **Import / Export**:
   - Click **`📥 Export JSON`** to download your questions as a `.json` file.
   - Click **`📤 Import JSON`** to upload any question pack from your computer.
4. **Preset Pack Switcher**:
   - Use the **Active Pack** dropdown to switch between *Minecraft Trivia*, *English Grammar*, and *AI Literacy*.

---

### Method 2: Editing `public/questions.json` Directly
Open `public/questions.json` in any text editor. It uses a lightweight array of question objects:

```json
[
  {
    "id": 1,
    "category": "Minecraft Trivia",
    "difficulty": "Beginner",
    "question": "What tool is required to mine Diamond Ore and collect diamonds?",
    "options": {
      "A": "Wooden Pickaxe",
      "B": "Stone Pickaxe",
      "C": "Iron Pickaxe",
      "D": "Golden Pickaxe"
    },
    "correctAnswer": "C",
    "explanation": "You need an Iron Pickaxe (or Diamond/Netherite) to mine Diamond Ore. Stone or Wood will destroy the block!"
  },
  {
    "id": 2,
    "category": "Minecraft Trivia",
    "difficulty": "Beginner",
    "question": "Which hostile mob hisses and explodes when it gets near you?",
    "options": {
      "A": "Zombie",
      "B": "Skeleton",
      "C": "Creeper",
      "D": "Enderman"
    },
    "correctAnswer": "C",
    "explanation": "Creepers silently approach players and hiss for about 1.5 seconds before exploding."
  }
]
```

### JSON Schema Breakdown:
| Field | Type | Required | Description |
| :--- | :---: | :---: | :--- |
| `id` | `number` | Yes | Unique ID number |
| `category` | `string` | Optional | Topic tag (e.g., "Minecraft Trivia", "Science", "Math") |
| `difficulty` | `string` | Optional | "Beginner", "Intermediate", or "Advanced" |
| `question` | `string` | Yes | The question prompt text (use `___________` for blanks) |
| `options` | `object` | Yes | Dictionary containing keys `"A"`, `"B"`, `"C"`, `"D"` |
| `correctAnswer` | `string` | Yes | The correct choice: `"A"`, `"B"`, `"C"`, or `"D"` |
| `explanation` | `string` | Yes | Educational explanation shown after answering |

---

## 💡 Webcam & Tracking Tips for Best Accuracy

- **Lighting**: Face a soft light source (window or room lamp). Avoid having strong backlights directly behind you.
- **Camera Angle**: Position your laptop webcam so your hand is clearly visible in the frame at chest/shoulder height.
- **Distance**: Sit or stand roughly 0.5 to 2 meters (2 to 6 feet) from the camera.
- **Finger Separation**: Hold your fingers clearly apart so the 21-point tracking mesh can clearly distinguish each finger tip.

---

## 🛠️ Project Structure

```
ar_quiz/
├── public/
│   ├── models/
│   │   └── hand_landmarker.task   # Local float16 hand landmark vision model (~7.8 MB)
│   ├── wasm/                      # Local MediaPipe Tasks Vision WebAssembly binaries
│   │   ├── vision_wasm_internal.wasm
│   │   └── vision_wasm_internal.js
│   └── questions.json             # Default lightweight JSON quiz questions
├── src/
│   ├── components/
│   │   ├── CameraPanel.tsx        # Camera view with AR Skeleton canvas overlay & dwell timer
│   │   ├── QuestionCard.tsx       # Stacked option cards with animated dwell fill bar & TTS
│   │   └── QuestionEditorModal.tsx# In-app question manager modal (Visual + Raw JSON)
│   ├── context/
│   │   └── QuizContext.tsx        # Global quiz state, pack management, and score tracking
│   ├── lib/
│   │   ├── arDrawing.ts           # Canvas renderer for 21 glowing joints and skeletal bones
│   │   ├── handGesture.ts         # Local MediaPipe landmarker and 3D vector finger heuristics
│   │   ├── questionStore.ts       # Preset pack definitions, local storage, and JSON import/export
│   │   └── effects.ts             # Web Audio API sound synthesis and confetti effects
│   ├── screens/
│   │   ├── QuizScreen.tsx         # Main split-view TV landscape quiz screen
│   │   ├── WelcomeScreen.tsx      # Welcome hero screen with pack picker
│   │   ├── CameraSetupScreen.tsx  # Camera setup and gesture test screen
│   │   └── ResultsScreen.tsx      # Performance summary screen
│   └── index.css                  # Tailored dark-mode aesthetics, neon shaders, and TV viewport rules
├── README.md                      # Complete project documentation and guide
└── package.json
```

---

## 📦 Production Build

To test or deploy the production bundle:
```bash
npm run build
npm run preview
```
The compiled assets will be output to the `dist/` folder.

---

## 📄 License

MIT
