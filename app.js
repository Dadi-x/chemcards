import { Deck } from './modules/deck.js';
import { UI } from './modules/ui.js';
import { Storage } from './modules/storage.js';

class App {
    constructor() {
        this.deck = new Deck();
        this.ui = new UI();
        this.storage = new Storage();

        this.currentCards = [];
        this.currentIndex = 0;
        this.currentSettings = {};

        // Statistics tracking
        this.stats = {
            totalCards: 0,
            correctFirstTry: 0,
            wrongAttempts: 0,
            startTime: null
        };

        this.init();
    }

    async init() {
        // Load Data
        await this.deck.loadData();

        // Load Stored Theme
        const savedTheme = this.storage.getTheme();
        this.ui.setTheme(savedTheme);

        // Load Stored Settings
        const savedSettings = this.storage.loadSettings();
        if (savedSettings) {
            this.ui.setSettings(savedSettings);
        }

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Theme Toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const newTheme = this.ui.toggleTheme();
            this.storage.saveTheme(newTheme);
        });

        // Batch Size Buttons
        document.querySelectorAll('.batch-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.batch-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });

        // Start Game
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        // Card Flip (Click on card or Spacebar)
        document.getElementById('flashcard').addEventListener('click', () => {
            this.ui.flipCard();
        });

        document.addEventListener('keydown', (e) => {
            if (document.getElementById('game-screen').classList.contains('hidden')) return;

            if (e.code === 'Space') {
                e.preventDefault(); // Prevent scrolling
                this.ui.flipCard();
            } else if (e.code === 'ArrowRight' || e.code === 'KeyV') {
                // Vím
                if (document.getElementById('flashcard').classList.contains('flipped')) {
                    this.handleKnowledge(true);
                }
            } else if (e.code === 'ArrowLeft' || e.code === 'KeyX') {
                // Nevím
                if (document.getElementById('flashcard').classList.contains('flipped')) {
                    this.handleKnowledge(false);
                }
            }
        });

        // Knowledge Buttons
        document.getElementById('btn-known').addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid flipping
            this.handleKnowledge(true);
        });

        document.getElementById('btn-unknown').addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid flipping
            this.handleKnowledge(false);
        });

        // Exit Button
        document.getElementById('exit-btn').addEventListener('click', () => {
            this.handleExit();
        });

        // Score Screen Buttons
        document.getElementById('restart-same-btn').addEventListener('click', () => {
            this.startGame(true); // Restart with same deck
        });

        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.ui.showScreen('setup');
        });
    }

    startGame(replaySameDeck = false) {
        if (!replaySameDeck) {
            this.currentSettings = this.ui.getSettings();
            this.storage.saveSettings(this.currentSettings);
            this.currentCards = this.deck.createDeck(this.currentSettings);
        } else {
            // Just reshuffle if checking again
            this.deck.shuffle(this.currentCards);
        }

        if (this.currentCards.length === 0) {
            alert('Žádné karty neodpovídají výběru. Zkuste změnit filtr.');
            return;
        }

        this.currentIndex = 0;
        this.ui.showScreen('game');
        this.loadNextCard();
    }

    loadNextCard() {
        if (this.currentIndex >= this.currentCards.length) {
            this.finishGame();
            return;
        }

        const card = this.currentCards[this.currentIndex];
        this.ui.updateCard(card, this.currentSettings.direction);
        this.ui.updateProgress(this.currentIndex, this.currentCards.length);
    }

    handleKnowledge(known) {
        const card = this.currentCards[this.currentIndex];

        if (known) {
            // Move to next
            this.currentIndex++;
        } else {
            // Push to end or N cards later?
            // MVP Simple: Push to end of current session queue to repeat
            this.currentCards.push(card);
            this.currentCards.splice(this.currentIndex, 1); // Remove from current spot
            // Don't increment index because we removed the current one, so next one slides in
            // BUT, if we want to simulate "moving forward" visually, it's tricky.
            // Let's simpler approach: Just push to end, but keep current index unless we want "spaced repetition".
            // Actually, simply pushing to end means the array length grows? No, we just move it.
            // Let's do:
            // Remove current card
            // Add to end
            // Index stays same?? No.

            // Simpler Logic akin to physical deck:
            // Take card from top.
            // If unknown, put at bottom.
            // If known, discard.

            // Re-implementation of flow:
            // We use currentIndex to track "completed" count effectively if we just iterate?
            // No, the deck is dynamic.

            // Let's change strategy:
            // We display card at `currentCards[0]` always.
            // Known -> Shift (remove first).
            // Unknown -> Push (move first to last).

            // However, we want a progress bar.
            // Progress is "Number of Known cards" vs "Total Initial Cards".

            // Let's stick to simple array manipulation.
            if (!this.initialCount) this.initialCount = this.currentCards.length; // Wait, this changes on restart.

            // Let's just do:
            // currentCards is the queue.
            // We shift() the first card.
            // If known, it's gone.
            // If unknown, we push() it back.
        }

        // Wait... above logic for Known means we remove it.
        // But for Unknown we recycle it.

        // Let's refine `startGame`:
        // We need `this.todoCards`
        // We need `this.completedCount`

        // Refactoring shortly below...
    }
}

// Re-write of App class methods for better logic
App.prototype.startGame = function (replaySameDeck = false) {
    if (!replaySameDeck) {
        this.currentSettings = this.ui.getSettings();
        this.storage.saveSettings(this.currentSettings);
        this.todoCards = this.deck.createDeck(this.currentSettings); // This returns a copy
        this.totalCardsInitially = this.todoCards.length;
    } else {
        this.deck.shuffle(this.todoCards); // Reshuffle remaining? Or restart all?
        // "Znovu stejné" usually means restart the whole batch.
        // So we need a reference to the original deck?
        // Let's assume "Znovu stejné" means "Restart with same cards"
        // But we modified the array.
        // We should regenerate or keep a copy.
        // Simplification: Regenerate using same settings for MVP if "New Game"
        // For "Restart Same Batch", we might need to store the IDs.

        // MVP: Just regenerate using settings. User context "Restart same selection" -> same filters.
        if (replaySameDeck) {
            // If we finished, todoCards is empty.
            // We need to re-generate using saved settings.
            this.todoCards = this.deck.createDeck(this.currentSettings);
            this.totalCardsInitially = this.todoCards.length;
        }
    }

    if (this.todoCards.length === 0) {
        alert('Žádné karty neodpovídají výběru. Zkuste změnit filtr.');
        return;
    }

    this.completedCount = 0;

    // Initialize stats
    this.stats = {
        totalCards: this.totalCardsInitially,
        correctFirstTry: 0,
        wrongAttempts: 0,
        startTime: Date.now()
    };
    this.seenCards = new Set(); // Track which cards we've seen

    this.ui.showScreen('game');
    this.loadNextCard();
};

App.prototype.loadNextCard = function () {
    if (this.todoCards.length === 0) {
        this.finishGame();
        return;
    }

    const card = this.todoCards[0]; // Always take top
    this.ui.updateCard(card, this.currentSettings.direction);
    // Update progress: Completed / Total Initial
    this.ui.updateProgress(this.completedCount, this.totalCardsInitially);
};

App.prototype.handleKnowledge = function (known) {
    const card = this.todoCards.shift(); // Remove from top

    // Track stats
    if (!this.seenCards.has(card.id)) {
        this.seenCards.add(card.id);
        if (known) {
            this.stats.correctFirstTry++;
        } else {
            this.stats.wrongAttempts++;
        }
    } else {
        // Card was recycled, count as wrong attempt
        if (!known) {
            this.stats.wrongAttempts++;
        }
    }

    if (known) {
        this.completedCount++;
    } else {
        // Recycle: put back at end
        this.todoCards.push(card);
    }

    this.loadNextCard();
};

App.prototype.finishGame = function () {
    // Calculate stats
    const timeElapsed = Date.now() - this.stats.startTime;
    const minutes = Math.floor(timeElapsed / 60000);
    const seconds = Math.floor((timeElapsed % 60000) / 1000);
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const totalAttempts = this.stats.correctFirstTry + this.stats.wrongAttempts;
    const accuracy = totalAttempts > 0
        ? Math.round((this.stats.correctFirstTry / totalAttempts) * 100)
        : 100;

    // Update UI
    document.getElementById('stat-total').textContent = this.stats.totalCards;
    document.getElementById('stat-correct').textContent = this.stats.correctFirstTry;
    document.getElementById('stat-accuracy').textContent = `${accuracy}%`;
    document.getElementById('stat-time').textContent = timeString;

    this.ui.showScreen('score');
};

App.prototype.handleExit = function () {
    const confirmed = confirm('Opravdu chceš ukončit lekci?\n\nTvůj postup nebude uložen.');
    if (confirmed) {
        this.ui.showScreen('setup');
    }
};

new App();
