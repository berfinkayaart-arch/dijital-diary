/**
 * Storage Manager for Goodnotes-Style Digital Planner & Voxel Garden
 * Version 2: Clean 100% Blank Canvas Initializer
 */

const STORAGE_PREFIX = 'cozy_journal_v4_';

export class StorageManager {
    constructor() {
        this.currentDate = this.getTodayFormatted();
        this.undoStack = [];
        this.redoStack = [];
    }

    getTodayFormatted() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getKey(dateStr) {
        return `${STORAGE_PREFIX}${dateStr || this.currentDate}`;
    }

    getDataForDate(dateStr) {
        const targetDate = dateStr || this.currentDate;
        const key = this.getKey(targetDate);
        const raw = localStorage.getItem(key);

        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (!parsed.elements) parsed.elements = [];
                if (!parsed.paperTemplate) parsed.paperTemplate = 'dotted';
                return parsed;
            } catch (e) {
                console.error("Failed to parse storage for date", targetDate, e);
            }
        }

        // Default initial digital planner state: 100% BLANK CANVAS
        const defaultData = {
            date: targetDate,
            mood: 'calm',
            paperTemplate: 'dotted',
            elements: []
        };

        this.saveDataForDate(targetDate, defaultData);
        return defaultData;
    }

    saveDataForDate(dateStr, data) {
        const targetDate = dateStr || this.currentDate;
        const key = this.getKey(targetDate);
        data.date = targetDate;
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error("Storage save failed", e);
        }
    }

    setCurrentDate(dateStr) {
        this.currentDate = dateStr;
    }

    getCurrentDate() {
        return this.currentDate;
    }

    getTasksForGarden(dateStr) {
        const data = this.getDataForDate(dateStr);
        return (data.elements || [])
            .filter(el => el.type === 'task')
            .map(el => ({
                id: el.taskId || el.id,
                elementId: el.id,
                title: el.title,
                category: el.category,
                completed: el.completed,
                slotIndex: el.slotIndex !== undefined ? el.slotIndex : 0
            }));
    }

    getPhotosCount(dateStr) {
        const data = this.getDataForDate(dateStr);
        return (data.elements || []).filter(el => el.type === 'photo').length;
    }
}

export const storage = new StorageManager();
