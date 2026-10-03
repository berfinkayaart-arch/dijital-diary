/**
 * 2D Voxel Garden Manager
 * Cleanly renders PNG flower images anchored directly over the dark soil plots of the farm backdrop.
 * - Bloomed flowers scaled to 36px (.flower-img)
 * - Seeds scaled down to 16px (.seed-img)
 * - Sprouts scaled to 24px (.sprout-img)
 * Zero bird rendering or artificial glow effects.
 */

export class GardenManager {
    constructor(containerEl, onSelectTaskForJournal) {
        this.container = containerEl;
        this.onSelectTaskForJournal = onSelectTaskForJournal;
        this.slots = this.generateSlotCoordinates();
        this.activeTooltip = null;
    }

    // 36 isometric slot positions aligned to the base of the 6 fenced soil beds
    generateSlotCoordinates() {
        const beds = [
            // Bed 1: Top-Left bed
            { minX: 32, maxX: 43, minY: 44, maxY: 52 },
            // Bed 2: Top-Right bed
            { minX: 57, maxX: 67, minY: 49, maxY: 57 },
            // Bed 3: Middle-Left bed
            { minX: 41, maxX: 52, minY: 57, maxY: 65 },
            // Bed 4: Middle-Right bed
            { minX: 70, maxX: 80, minY: 62, maxY: 71 },
            // Bed 5: Bottom-Left bed
            { minX: 51, maxX: 61, minY: 73, maxY: 82 },
            // Bed 6: Bottom-Right bed
            { minX: 78, maxX: 88, minY: 77, maxY: 86 }
        ];

        const slots = [];
        let slotId = 0;

        beds.forEach((bed) => {
            const rows = 2;
            const cols = 3;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const fracX = (c + 0.5) / cols;
                    const fracY = (r + 0.5) / rows;
                    const x = bed.minX + fracX * (bed.maxX - bed.minX);
                    const y = bed.minY + fracY * (bed.maxY - bed.minY);
                    slots.push({
                        id: slotId++,
                        xPercent: x,
                        yPercent: y
                    });
                }
            }
        });

        return slots;
    }

    getFlowerSprite(category) {
        switch ((category || '').toLowerCase()) {
            case 'work':
                return 'assets/cicekler/2.png'; // Ayçiçeği
            case 'deep-focus':
            case 'deep focus':
                return 'assets/cicekler/3.png'; // Gelincik
            case 'routine':
                return 'assets/cicekler/4.png'; // Papatya
            case 'self-care':
            case 'self care':
                return 'assets/cicekler/5.png'; // Lavanta
            case 'creative':
                return 'assets/cicekler/6.png'; // Pembe Çiçek
            default:
                return 'assets/cicekler/4.png';
        }
    }

    getFlowerName(category) {
        switch ((category || '').toLowerCase()) {
            case 'work': return 'Ayçiçeği';
            case 'deep-focus':
            case 'deep focus': return 'Gelincik';
            case 'routine': return 'Papatya';
            case 'self-care':
            case 'self care': return 'Lavanta';
            case 'creative': return 'Pembe Çiçek';
            default: return 'Papatya';
        }
    }

    renderGarden(tasks) {
        this.clearGarden();

        if (!tasks || tasks.length === 0) return;

        tasks.forEach((task, idx) => {
            const slotIndex = task.slotIndex !== undefined ? task.slotIndex : (idx % this.slots.length);
            const slot = this.slots[slotIndex] || this.slots[idx % this.slots.length];

            const plantNode = document.createElement('div');
            plantNode.className = `garden-plant-slot ${task.completed ? 'is-bloomed' : 'is-seed'}`;
            plantNode.style.left = `${slot.xPercent}%`;
            plantNode.style.top = `${slot.yPercent}%`;
            plantNode.style.zIndex = Math.floor(slot.yPercent * 10);

            const img = document.createElement('img');
            if (task.completed) {
                img.src = this.getFlowerSprite(task.category);
                img.className = 'plant-img flower-img voxel-popup-anim';
                img.alt = task.title;
            } else {
                img.src = idx % 2 === 0 ? 'assets/cicekler/7.png' : 'assets/cicekler/8.png';
                img.className = idx % 2 === 0 ? 'plant-img sprout-img' : 'plant-img seed-img';
                img.alt = 'Filiz/Tohum';
            }

            plantNode.appendChild(img);

            // Soil base shadow
            const shadow = document.createElement('div');
            shadow.className = 'plant-shadow';
            plantNode.appendChild(shadow);

            plantNode.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showTooltip(plantNode, task);
            });

            this.container.appendChild(plantNode);
        });
    }

    showTooltip(plantNode, task) {
        this.closeTooltip();

        const tooltip = document.createElement('div');
        tooltip.className = 'flower-speech-bubble';
        const flowerName = this.getFlowerName(task.category);
        const statusText = task.completed ? 'Çiçek Açtı! ✨' : 'Toprakta Büyüyor 🌿';

        tooltip.innerHTML = `
            <div class="bubble-header">
                <span class="bubble-flower-tag">${flowerName}</span>
                <span class="bubble-status">${statusText}</span>
            </div>
            <div class="bubble-title">"${task.title}"</div>
            <button class="bubble-btn" id="viewInJournalBtn">
                📖 Defterde Göster
            </button>
            <div class="bubble-arrow"></div>
        `;

        plantNode.appendChild(tooltip);
        this.activeTooltip = tooltip;

        const btn = tooltip.querySelector('#viewInJournalBtn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTooltip();
            if (this.onSelectTaskForJournal) {
                this.onSelectTaskForJournal(task);
            }
        });

        const closeHandler = (e) => {
            if (!tooltip.contains(e.target)) {
                this.closeTooltip();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 10);
    }

    closeTooltip() {
        if (this.activeTooltip) {
            this.activeTooltip.remove();
            this.activeTooltip = null;
        }
    }

    animatePopAndSparkle(slotIndex) {
        const slot = this.slots[slotIndex];
        if (!slot) return;

        const sparkleEl = document.createElement('div');
        sparkleEl.className = 'bloom-sparkle-burst';
        sparkleEl.style.left = `${slot.xPercent}%`;
        sparkleEl.style.top = `${slot.yPercent}%`;

        sparkleEl.innerHTML = `
            <div class="sparkle-particle p1">✨</div>
            <div class="sparkle-particle p2">🌸</div>
            <div class="sparkle-particle p3">✨</div>
            <div class="sparkle-particle p4">⭐</div>
        `;

        this.container.appendChild(sparkleEl);
        setTimeout(() => sparkleEl.remove(), 1200);
    }

    clearGarden() {
        this.container.innerHTML = '';
        this.activeTooltip = null;
    }
}
