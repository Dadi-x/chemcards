export class Storage {
    constructor() {
        this.STORAGE_KEY = 'chemflash_settings';
    }

    saveSettings(settings) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    }

    loadSettings() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    }

    getTheme() {
        return localStorage.getItem('chemflash_theme') || 'dark';
    }

    saveTheme(theme) {
        localStorage.setItem('chemflash_theme', theme);
    }
}
