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

        // Filter by Period
        if (settings.period) {
            filtered = filtered.filter(el => el.period === parseInt(settings.period));
        }

        // Filter by Group
        if (settings.group) {
            filtered = filtered.filter(el => el.group === parseInt(settings.group));
        }

        // Shuffle
        this.shuffle(filtered);

        // Limit batch size
        if (settings.batchSize && settings.batchSize !== 'all') {
            const count = parseInt(settings.batchSize);
            filtered = filtered.slice(0, count);
        }

        this.currentDeck = filtered.map(item => ({ ...item })); // Deep copy needed? Shallow is probably fine for read-only
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
