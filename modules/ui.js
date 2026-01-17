export class UI {
    constructor() {
        this.app = document.getElementById('app');
        this.screens = {
            setup: document.getElementById('setup-screen'),
            game: document.getElementById('game-screen'),
            score: document.getElementById('score-screen')
        };

        this.elements = {
            card: document.getElementById('flashcard'),
            cardFront: document.getElementById('card-front-content'),
            cardMainAnswer: document.getElementById('card-main-answer'),
            metaAtomic: document.getElementById('meta-atomic'),
            metaGroup: document.getElementById('meta-group'),
            metaEn: document.getElementById('meta-en'),
            metaLat: document.getElementById('meta-lat'),
            progressBar: document.getElementById('progress-bar'), // actually the container or bar itself?
            progressText: document.getElementById('progress-text'),
            answerControls: document.getElementById('answer-controls'),
            tapHint: document.getElementById('tap-hint'),
            themeToggle: document.getElementById('theme-toggle'),
            periodFilter: document.getElementById('period-filter'),
            groupFilter: document.getElementById('group-filter'),
            directionSelect: document.getElementById('direction-select'),
            batchButtons: document.querySelectorAll('.batch-btn')
        };
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(s => s.classList.add('hidden'));
        this.screens[screenName].classList.remove('hidden');
    }

    updateCard(item, direction) {
        // Reset card state
        this.elements.card.classList.remove('flipped');
        this.elements.answerControls.classList.add('hidden');
        this.elements.tapHint.classList.remove('hidden');

        // Determine simple "Front" content based on direction
        let frontText = '';
        let backMain = '';

        if (direction === 'symbol_to_name') {
            frontText = item.symbol;
            backMain = item.name_cz;
        } else if (direction === 'name_to_symbol') {
            frontText = item.name_cz;
            backMain = item.symbol;
        } else {
            // Mix: Randomly choose
            if (Math.random() > 0.5) {
                frontText = item.symbol;
                backMain = item.name_cz;
            } else {
                frontText = item.name_cz;
                backMain = item.symbol;
            }
        }

        this.elements.cardFront.textContent = frontText;
        this.elements.cardMainAnswer.textContent = backMain;

        // Fill metadata
        this.elements.metaAtomic.textContent = item.atomic_number;
        this.elements.metaGroup.textContent = item.group;
        this.elements.metaEn.textContent = item.name_en;
        this.elements.metaLat.textContent = item.name_lat;
    }

    flipCard() {
        this.elements.card.classList.toggle('flipped');

        if (this.elements.card.classList.contains('flipped')) {
            this.elements.answerControls.classList.remove('hidden');
            this.elements.tapHint.classList.add('hidden');
        } else {
            this.elements.answerControls.classList.add('hidden');
            this.elements.tapHint.classList.remove('hidden');
        }
    }

    updateProgress(current, total) {
        this.elements.progressText.textContent = `${current}/${total}`;
        // Update bar width CSS variable
        const percentage = total > 0 ? (current / total) * 100 : 0;
        this.elements.progressBar.style.setProperty('--progress', `${percentage}%`);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.elements.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌗';
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        return newTheme;
    }

    // Settings helpers
    getSettings() {
        // Find selected batch size
        let batchSize = 'all';
        this.elements.batchButtons.forEach(btn => {
            if (btn.classList.contains('selected')) {
                batchSize = btn.dataset.value;
            }
        });

        return {
            direction: this.elements.directionSelect.value,
            period: this.elements.periodFilter.value,
            group: this.elements.groupFilter.value,
            batchSize: batchSize
        };
    }

    setSettings(settings) {
        if (!settings) return;
        if (settings.direction) this.elements.directionSelect.value = settings.direction;

        if (settings.batchSize) {
            this.elements.batchButtons.forEach(btn => {
                if (btn.dataset.value == settings.batchSize) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
        }

        // Filters we don't strictly persist in UI if user wants fresh start, 
        // but can optionally set them if saved.
    }
}
