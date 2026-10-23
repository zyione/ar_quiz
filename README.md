# 🖐️ AR Vision Quiz

An **offline-first, interactive AR Quiz application** featuring **real-time hand gesture tracking**, **live skeletal AR overlays**, **dwell auto-selection**, and a **lightweight JSON question engine**.

Designed specifically for **laptops and widescreen TV / classroom displays (16:9 landscape)**.

---

## ✨ Features

- **📷 Real-Time AR Hand Skeleton**:
  - Live webcam feed with an HTML5 Canvas overlay.
  - Highlights 21 3D hand joints with glowing neon cyan/blue bones and pulsating fingertip halos.
  - Floating top-left HUD pill showing live gesture recognition and dwell countdown.
- **⏱️ 1.5-Second Dwell Auto-Selection**:
  - Hold up **1, 2, 3, or 4 fingers** to select options **A, B, C, or D**.
  - Animated blue progress bar fills across the option card over 1.5 seconds.
  - Automatically locks the answer with synthesized sound chimes and confetti without touching the keyboard or mouse!
- **💻 Laptop Webcam Optimized**:
  - Built-in **250ms anti-jitter grace period** to tolerate low frame rates or motion blur on budget laptop webcams.
  - 3D vector-based distance calculations handle hand tilts, angles, and distances seamlessly.
- **📺 Widescreen TV Landscape Mode**:
  - Designed for 16:9 displays (1080p / 4K / 720p) with **zero vertical scrolling**.
  - Large, high-contrast typography readable from 3–5 meters away.
  - One-click **⛶ Fullscreen** kiosk toggle (Hotkey: **`F`**).
- **🔀 Rapid Testing Mode**:
  - Tap **`🔀 Random Question`** (Hotkey: **`R`**) to instantly jump to a random question from the active pack.
- **🔊 Offline Audio & Text-to-Speech**:
  - Synthesized Web Audio API sound effects (positive chime / negative buzzer).
  - Browser-native offline `window.speechSynthesis` reads questions out loud when tapping the speaker icon.
- **🔒 100% Fully Local & Offline**:
  - Bundled WebAssembly binaries in `public/wasm/`.
  - Local float16 `hand_landmarker.task` (~7.8 MB) in `public/models/`.
  - **Zero cloud API calls or internet connection required.**

---

## 🚀 How to Run

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- A laptop webcam or USB webcam

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/zyione/ar_quiz.git
cd ar_quiz
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/
```

### 4. Build for Production
To generate an optimized production bundle:
```bash
npm run build
npm run preview
```

---

## 📝 How to Add or Edit Questions

You can manage questions in two easy ways:

### Method 1: Using the In-App Question Manager (No Coding Required)
1. Open the app and click the **`⚙️ Questions`** button in the top HUD or Welcome Screen.
2. **Visual Editor Tab**:
   - Click **`+ Add`** to create a new question.
   - Enter your question text (use `___________` for fill-in-the-blank).
   - Enter options for **A**, **B**, **C**, and **D**.
   - Select the radio button for the correct answer.
   - Add an explanation shown after answering.
   - Click **`💾 Save Changes`**.
3. **Import / Export**:
   - Click **`📥 Export JSON`** to save your questions as a `.json` file to your computer.
   - Click **`📤 Import JSON`** to upload any question pack JSON.
4. **Pack Switcher**:
   - Use the dropdown to toggle between **📚 English Grammar** and **🤖 AI Literacy Challenge**.

---

### Method 2: Editing `public/questions.json` Directly
Open `public/questions.json` in any text editor. It uses a lightweight array of question objects:

```json
[
  {
    "id": 1,
    "category": "English Grammar",
    "difficulty": "Beginner",
    "question": "You should ___________ some vitamins and get some rest.",
    "options": {
      "A": "has",
      "B": "having",
      "C": "take",
      "D": "took"
    },
    "correctAnswer": "C",
    "explanation": "After modal verbs like 'should', we use the base form of the verb ('take')."
  },
  {
    "id": 2,
    "category": "Science",
    "difficulty": "Beginner",
    "question": "What gas do plants absorb during photosynthesis?",
    "options": {
      "A": "Oxygen",
      "B": "Carbon Dioxide",
      "C": "Nitrogen",
      "D": "Hydrogen"
    },
    "correctAnswer": "B",
    "explanation": "Plants take in carbon dioxide and water to produce glucose and oxygen."
  }
]
```

### Question Schema Fields:
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `number` | Unique numeric identifier |
| `category` | `string` | Subject or topic tag (e.g., "English Grammar", "Math", "History") |
| `difficulty` | `string` | "Beginner", "Intermediate", or "Advanced" |
| `question` | `string` | The prompt (use `___________` for blanks) |
| `options` | `object` | Dictionary containing options for `"A"`, `"B"`, `"C"`, `"D"` |
| `correctAnswer` | `string` | Must be `"A"`, `"B"`, `"C"`, or `"D"` |
| `explanation` | `string` | Short explanation revealed after answering |

---

## 🎮 Controls & Hotkeys

| Action | Hand Gesture | Keyboard Shortcut |
| :--- | :--- | :--- |
| **Select Option A** | ☝️ 1 Finger (Index) | `1` or `A` |
| **Select Option B** | ✌️ 2 Fingers (Peace Sign) | `2` or `B` |
| **Select Option C** | 🤟 3 Fingers (Index+Middle+Ring) | `3` or `C` |
| **Select Option D** | 🖐️ 4 Fingers (or Open Palm) | `4` or `D` |
| **Lock / Confirm** | Hold gesture for 1.5 seconds | `Enter` |
| **Next Question** | - | `Enter` or `Space` |
| **Random Question** | - | `R` |
| **TV Fullscreen Mode**| - | `F` |

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 8](https://vitejs.dev/)
- **Computer Vision**: [@mediapipe/tasks-vision](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) (Local WebAssembly + WebGL GPU delegate)
- **Audio & SFX**: Native Web Audio API (synthesized tones) + Web Speech API (offline TTS)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling**: Vanilla CSS (Tailored dark mode, neon glow shaders, responsive TV viewport)

---

## 📄 License

MIT
