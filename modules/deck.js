export class Deck {
    constructor() {
        this.allElements = [];
        this.currentDeck = [];
    }

    async loadData() {
        try {
            const response = await fetch('data/elements.json');
            if (!response.ok) {
                throw new Error('Failed to load data');
            }
            this.allElements = await response.json();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    createDeck(settings) {
        let filtered = this.allElements;

        // Filter by Period (Array)
        if (settings.periods && settings.periods.length > 0) {
            filtered = filtered.filter(el => settings.periods.includes(el.period));
        }

        // Filter by Group (Array)
        if (settings.groups && settings.groups.length > 0) {
            filtered = filtered.filter(el => settings.groups.includes(el.group));
        }

        // Shuffle
        this.shuffle(filtered);

        // Limit batch size
        if (settings.batchSize && settings.batchSize !== 'all') {
            const count = parseInt(settings.batchSize);
            filtered = filtered.slice(0, count);
        }

        this.currentDeck = filtered.map(item => ({ ...item }));
        return this.currentDeck;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Helper to request a re-mix on "Unknown" if needed, 
    // or we can just handle that in the main app logic by pushing to end of array.
}
