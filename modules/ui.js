export class UI {
    constructor() {
        this.app = document.getElementById('app');
        this.screens = {
            landing: document.getElementById('landing-screen'),
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
            periodFilters: document.getElementById('period-filters'),
            groupFilters: document.getElementById('group-filters'),
            directionButtons: document.querySelectorAll('#direction-group .batch-btn'),
            batchButtons: document.querySelectorAll('#batch-size-group .batch-btn')
        };

        this.initFilters();
    }

    initFilters() {
        this.createFilterButtons(this.elements.periodFilters, 7);
        this.createFilterButtons(this.elements.groupFilters, 18);
    }

    createFilterButtons(container, count) {
        // All button
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn selected';
        allBtn.textContent = 'Vše';
        allBtn.dataset.value = 'all';
        container.appendChild(allBtn);

        for (let i = 1; i <= count; i++) {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = i;
            btn.dataset.value = i;
            container.appendChild(btn);
        }

        // Event delegation
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleFilterClick(e.target, container);
            }
        });
    }

    handleFilterClick(clickedBtn, container) {
        const isAll = clickedBtn.dataset.value === 'all';
        const allBtn = container.querySelector('[data-value="all"]');
        const otherBtns = container.querySelectorAll('.filter-btn:not([data-value="all"])');

        if (isAll) {
            // Select All, deselect others
            allBtn.classList.add('selected');
            otherBtns.forEach(btn => btn.classList.remove('selected'));
        } else {
            // Toggle specific
            clickedBtn.classList.toggle('selected');

            // Check state
            const anySelected = Array.from(otherBtns).some(b => b.classList.contains('selected'));

            if (anySelected) {
                allBtn.classList.remove('selected');
            } else {
                // If nothing selected, revert to All
                allBtn.classList.add('selected');
            }
        }
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(s => s.classList.add('hidden'));
        this.screens[screenName].classList.remove('hidden');
    }

    updateCard(item, direction) {
        // Reset card state instantly without animation to avoid flashing back side
        this.elements.card.classList.add('no-transition');
        this.elements.card.classList.remove('flipped');

        // Force reflow
        this.elements.card.offsetHeight;

        this.elements.card.classList.remove('no-transition');

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

        // Find selected direction
        let direction = 'symbol_to_name';
        this.elements.directionButtons.forEach(btn => {
            if (btn.classList.contains('selected')) {
                direction = btn.dataset.value;
            }
        });

        return {
            direction: direction,
            periods: this.getSelectedFilters(this.elements.periodFilters),
            groups: this.getSelectedFilters(this.elements.groupFilters),
            batchSize: batchSize
        };
    }

    getSelectedFilters(container) {
        const allBtn = container.querySelector('[data-value="all"]');
        if (allBtn.classList.contains('selected')) return []; // Empty array triggers "select all" in logic

        return Array.from(container.querySelectorAll('.filter-btn.selected'))
            .filter(btn => btn.dataset.value !== 'all')
            .map(btn => parseInt(btn.dataset.value));
    }

    setSettings(settings) {
        if (!settings) return;

        if (settings.direction) {
            this.elements.directionButtons.forEach(btn => {
                if (btn.dataset.value === settings.direction) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
        }

        if (settings.batchSize) {
            this.elements.batchButtons.forEach(btn => {
                if (btn.dataset.value == settings.batchSize) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
        }

        if (settings.periods) this.restoreFilters(this.elements.periodFilters, settings.periods);
        if (settings.groups) this.restoreFilters(this.elements.groupFilters, settings.groups);
    }

    restoreFilters(container, selectedValues) {
        const allBtn = container.querySelector('[data-value="all"]');
        const otherBtns = container.querySelectorAll('.filter-btn:not([data-value="all"])');

        if (!selectedValues || selectedValues.length === 0) {
            allBtn.classList.add('selected');
            otherBtns.forEach(btn => btn.classList.remove('selected'));
        } else {
            allBtn.classList.remove('selected');
            otherBtns.forEach(btn => {
                if (selectedValues.includes(parseInt(btn.dataset.value))) {
                    btn.classList.add('selected');
                } else {
                    btn.classList.remove('selected');
                }
            });
        }
    }

    updateModal(item) {
        document.getElementById('modal-symbol').textContent = item.symbol;
        document.getElementById('modal-main-answer').textContent = item.name_cz;
        document.getElementById('modal-atomic').textContent = item.atomic_number;
        document.getElementById('modal-group').textContent = item.group;
        document.getElementById('modal-en').textContent = item.name_en;
        document.getElementById('modal-lat').textContent = item.name_lat;
    }

    toggleModal(show) {
        const modal = document.getElementById('card-modal');
        if (show) {
            modal.classList.remove('hidden');
        } else {
            modal.classList.add('hidden');
        }
    }
}
