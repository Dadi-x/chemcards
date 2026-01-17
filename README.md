# ChemFlash ⚗️

ChemFlash is a modern, responsive web application designed to help students learn the Periodic Table of Elements through interactive flashcards. It is built as a lightweight Single Page Application (SPA) using pure Vanilla JavaScript, HTML5, and CSS3, requiring no build tools or complex dependencies.

## ✨ Features

*   **Interactive Flashcards**: Test your knowledge of chemical elements (Symbols, Names, Atomic Numbers).
*   **Customizable Study Sessions**:
    *   **Direction**: Symbol -> Name, Name -> Symbol, or Mixed.
    *   **Batch Size**: Study in chunks of 12, 24, 48, or the whole table.
    *   **Filters**: Focus on specific Groups or Periods.
*   **Spaced Repetition Logic**: "Unknown" cards are recycled within the session until mastered.
*   **Dark/Light Mode**: Fully themeable UI with automatic preference detection.
*   **Mobile-First Design**: Optimized for touch interaction on phones and tablets.
*   **Offline Capable**: Static architecture makes it easy to cache and run locally.

## 🚀 How to Run

Since ChemFlash uses native ES6 modules, it needs to be served via a local web server (opening `index.html` directly will likely cause CORS errors).

### Using Python
If you have Python installed:

```bash
# Python 3
python3 -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Using VS Code Live Server
1.  Install the **Live Server** extension.
2.  Right-click `index.html`.
3.  Select **Open with Live Server**.

### Using Node.js (http-server)
```bash
npx http-server .
```

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3 (Variables, Flexbox/Grid), JavaScript (ES6 Modules).
*   **Data**: JSON (`data/elements.json`).
*   **Styling**: Custom CSS with extensive use of CSS Custom Properties for theming; no frameworks like Bootstrap or Tailwind.
*   **Build System**: None needed! ⚡

## 📂 Project Structure

```text
/
├── index.html          # Main entry point
├── style.css           # Global styles and themes
├── app.js              # Main application controller
├── modules/            # JS Logic Modules
│   ├── deck.js         # Deck loading, shuffling, filtering
│   ├── ui.js           # DOM manipulation & View management
│   └── storage.js      # LocalStorage wrapper for settings
└── data/
    └── elements.json   # Periodic table data
```

## 🔮 Future Plans

*   Adding detailed info for elements (Electronic Configuration, Mass).
*   Expanded datasets (Molecules, Ions).
*   Progress history and statistics charts.

---
*Created for the ChemCards Project.*