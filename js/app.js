/**
 * Cozy Botanical Journal & Garden - Complete Cozy Upgrade Bundle
 * Includes 3D Accordion Notebook, Washi Tape & Clips, Vintage Date Stamp,
 * Torn Paper edges, ASMR Sound Synthesizers, Ambient Nature Audio, 
 * Monthly Index Tabs, and PNG Memory Card Exporter.
 */

// --- GLOBAL FALLBACK HANDLERS ---
window.openJournal = function() {
    try {
        if (window.cozyApp && window.cozyApp.journal) {
            window.cozyApp.journal.openModal();
            return;
        }
    } catch (e) {}
    const modal = document.getElementById('journalModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        modal.classList.add('active');
        modal.classList.add('is-open');
    }
};

window.openBookCover = function() {
    try {
        if (window.cozyApp && window.cozyApp.journal) {
            window.cozyApp.journal.goToCover();
            return;
        }
    } catch (e) {}
    window.openJournal();
};

window.openBookPages = function() {
    try {
        sound.playPageFlip();
    } catch (e) {}
    const coverView = document.getElementById('bookCoverView');
    const pagesView = document.getElementById('bookPagesView');
    if (coverView) coverView.style.display = 'none';
    if (pagesView) pagesView.style.display = 'flex';
    if (window.cozyApp && window.cozyApp.journal) {
        window.cozyApp.journal.isCoverMode = false;
        window.cozyApp.journal.renderCurrentDay();
    }
};

window.closeToCover = function() {
    try {
        sound.playPageFlip();
    } catch (e) {}
    const coverView = document.getElementById('bookCoverView');
    const pagesView = document.getElementById('bookPagesView');
    if (pagesView) pagesView.style.display = 'none';
    if (coverView) coverView.style.display = 'flex';
    if (window.cozyApp && window.cozyApp.journal) {
        window.cozyApp.journal.isCoverMode = true;
        window.cozyApp.journal.renderCover();
    }
};

window.closeJournal = function() {
    try {
        if (window.cozyApp && window.cozyApp.journal) {
            window.cozyApp.journal.close();
            return;
        }
    } catch (e) {}
    const modal = document.getElementById('journalModal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        modal.classList.remove('active');
        modal.classList.remove('is-open');
    }
};

window.showCozyToast = function(message) {
    let toast = document.getElementById('cozyToastNotification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cozyToastNotification';
        toast.className = 'cozy-toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
};

window.openPlantModal = function() {
    try {
        if (window.cozyApp) {
            window.cozyApp.openPlantModal();
            return;
        }
    } catch (e) {}
    const modal = document.getElementById('plantModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        modal.classList.add('is-open');
    }
};

window.closePlantModal = function() {
    try {
        if (window.cozyApp) {
            window.cozyApp.closePlantModal();
            return;
        }
    } catch (e) {}
    const modal = document.getElementById('plantModal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        modal.classList.remove('is-open');
    }
};

window.openPomodoroModal = function() {
    try {
        if (window.cozyApp && window.cozyApp.pomodoro) {
            window.cozyApp.pomodoro.open();
            return;
        }
    } catch (e) {}
    const modal = document.getElementById('pomodoroModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
        modal.classList.add('is-open');
    }
};

window.closePomodoroModal = function() {
    try {
        if (window.cozyApp && window.cozyApp.pomodoro) {
            window.cozyApp.pomodoro.close();
            return;
        }
    } catch (e) {}
    const modal = document.getElementById('pomodoroModal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
        modal.classList.remove('is-open');
    }
};

(function() {
    // --- 1. ASMR & COZY SOUND FX (Web Audio API) ---
    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.ambientActive = false;
            this.ambientTimer = null;
        }

        init() {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }
        }

        playPageFlip() {
            try {
                this.init();
                if (!this.ctx) return;

                const bufferSize = this.ctx.sampleRate * 0.25;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const output = buffer.getChannelData(0);

                for (let i = 0; i < bufferSize; i++) {
                    output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
                }

                const whiteNoise = this.ctx.createBufferSource();
                whiteNoise.buffer = buffer;

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(800, this.ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.25);
                filter.Q.value = 1.5;

                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

                whiteNoise.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                whiteNoise.start();
            } catch (e) {}
        }

        playTapeSlap() {
            try {
                this.init();
                if (!this.ctx) return;

                const bufferSize = this.ctx.sampleRate * 0.04;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const output = buffer.getChannelData(0);

                for (let i = 0; i < bufferSize; i++) {
                    output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
                }

                const source = this.ctx.createBufferSource();
                source.buffer = buffer;

                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

                source.connect(gain);
                gain.connect(this.ctx.destination);
                source.start();
            } catch (e) {}
        }

        playPlantSeed() {
            try {
                this.init();
                if (!this.ctx) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(140, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(360, this.ctx.currentTime + 0.08);

                gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.1);
            } catch (e) {}
        }

        playBloomSparkle() {
            try {
                this.init();
                if (!this.ctx) return;

                const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
                notes.forEach((freq, idx) => {
                    const startTime = this.ctx.currentTime + (idx * 0.06);
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();

                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, startTime);

                    gain.gain.setValueAtTime(0.001, startTime);
                    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(startTime);
                    osc.stop(startTime + 0.45);
                });
            } catch (e) {}
        }

        playStamp() {
            try {
                this.init();
                if (!this.ctx) return;

                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(120, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);

                gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + 0.12);
            } catch (e) {}
        }

        playPencilCheck() {
            try {
                this.init();
                if (!this.ctx) return;

                const bufferSize = this.ctx.sampleRate * 0.06;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const output = buffer.getChannelData(0);

                for (let i = 0; i < bufferSize; i++) {
                    output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
                }

                const source = this.ctx.createBufferSource();
                source.buffer = buffer;

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.value = 1200;

                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

                source.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                source.start();
            } catch (e) {}
        }

        toggleAmbientNature() {
            this.init();
            this.ambientActive = !this.ambientActive;

            const iconEl = document.getElementById('audioIcon');
            if (iconEl) {
                iconEl.innerText = this.ambientActive ? '🔊' : '🔇';
            }

            if (this.ambientActive) {
                this.startAmbientLoop();
            } else {
                this.stopAmbientLoop();
            }
            return this.ambientActive;
        }

        startAmbientLoop() {
            if (this.ambientTimer) clearInterval(this.ambientTimer);

            const playSoftChirp = () => {
                if (!this.ambientActive || !this.ctx) return;
                try {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();

                    osc.type = 'sine';
                    const startFreq = 2200 + Math.random() * 800;
                    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(startFreq + 300, this.ctx.currentTime + 0.06);

                    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start();
                    osc.stop(this.ctx.currentTime + 0.08);
                } catch (e) {}
            };

            this.ambientTimer = setInterval(() => {
                if (Math.random() > 0.4) {
                    playSoftChirp();
                }
            }, 3500);
        }

        stopAmbientLoop() {
            if (this.ambientTimer) {
                clearInterval(this.ambientTimer);
                this.ambientTimer = null;
            }
        }
    }

    const sound = new SoundEngine();

    // --- 2. STORAGE MANAGER ---
    const STORAGE_PREFIX = 'journal_data_';

    class StorageManager {
        constructor() {
            this.currentDate = this.getTodayFormatted();
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
            let raw = null;
            try {
                raw = localStorage.getItem(key);
                if (!raw) {
                    raw = localStorage.getItem(`cozy_journal_v4_${targetDate}`);
                }
            } catch (e) {}

            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed === 'object') {
                        if (!Array.isArray(parsed.elements)) parsed.elements = [];
                        if (!parsed.paperTemplate) parsed.paperTemplate = 'dotted';
                        return parsed;
                    }
                } catch (e) {}
            }

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
            } catch (e) {}
        }

        getCoverData() {
            const key = `${STORAGE_PREFIX}cover_data`;
            let raw = null;
            try {
                raw = localStorage.getItem(key);
            } catch (e) {}

            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed === 'object') {
                        if (!Array.isArray(parsed.elements)) parsed.elements = [];
                        // Filter out any sticky or task notes mistakenly saved on cover
                        parsed.elements = parsed.elements.filter(el => el.type !== 'task' && el.type !== 'sticky');
                        return parsed;
                    }
                } catch (e) {}
            }

            const defaultCover = {
                paperTemplate: 'leather',
                elements: []
            };
            this.saveCoverData(defaultCover);
            return defaultCover;
        }

        saveCoverData(data) {
            const key = `${STORAGE_PREFIX}cover_data`;
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {}
        }

        setCurrentDate(dateStr) {
            this.currentDate = dateStr;
        }

        getCurrentDate() {
            return this.currentDate;
        }

        getTasksForGarden(dateStr) {
            const data = this.getDataForDate(dateStr);
            const taskElements = (data.elements || [])
                .filter(el => el.type === 'task')
                .map(el => ({
                    id: el.taskId || el.id,
                    elementId: el.id,
                    title: el.title,
                    category: el.category,
                    completed: el.completed,
                    slotIndex: el.slotIndex !== undefined ? el.slotIndex : 0
                }));

            const routineTasks = (data.catRoutines || [])
                .map((r, idx) => ({
                    id: r.id,
                    elementId: r.id,
                    title: r.title + (r.note ? ` (${r.note})` : ''),
                    category: r.category || 'routine',
                    completed: r.completed,
                    slotIndex: (idx + 1) * 3
                }));

            const customFlowers = (data.customFlowers || [])
                .map((f, idx) => ({
                    id: f.id,
                    elementId: f.id,
                    title: f.title + (f.completedTime ? ` (${f.completedTime})` : ''),
                    category: 'creative',
                    completed: true,
                    customImageSrc: f.customImageSrc,
                    slotIndex: f.slotIndex !== undefined ? f.slotIndex : (idx * 2 + 1)
                }));

            return [...taskElements, ...routineTasks, ...customFlowers];
        }
    }

    const storage = new StorageManager();

    // --- 3. GARDEN MANAGER ---
    class GardenManager {
        constructor(containerEl, onSelectTaskForJournal) {
            this.container = containerEl;
            this.onSelectTaskForJournal = onSelectTaskForJournal;
            this.slots = this.generateSlotCoordinates();
            this.activeTooltip = null;
        }

        generateSlotCoordinates() {
            const beds = [
                { minX: 32, maxX: 43, minY: 44, maxY: 52 },
                { minX: 57, maxX: 67, minY: 49, maxY: 57 },
                { minX: 41, maxX: 52, minY: 57, maxY: 65 },
                { minX: 70, maxX: 80, minY: 62, maxY: 71 },
                { minX: 51, maxX: 61, minY: 73, maxY: 82 },
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
                case 'work': return 'assets/cicekler/2.png';
                case 'deep-focus':
                case 'deep focus': return 'assets/cicekler/3.png';
                case 'routine': return 'assets/cicekler/4.png';
                case 'self-care':
                case 'self care': return 'assets/cicekler/5.png';
                case 'creative': return 'assets/cicekler/6.png';
                default: return 'assets/cicekler/4.png';
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
            if (!this.container) return;
            if (!tasks || tasks.length === 0) return;

            const currentDateStr = storage.getCurrentDate();

            tasks.forEach((task, idx) => {
                const slotIndex = task.slotIndex !== undefined ? task.slotIndex : (idx % this.slots.length);
                const slot = this.slots[slotIndex] || this.slots[idx % this.slots.length];

                const plantNode = document.createElement('div');
                plantNode.className = `garden-plant-slot ${task.completed ? 'is-bloomed' : 'is-seed'} ${task.customImageSrc ? 'custom-drawn-flower' : ''}`;
                plantNode.style.left = `${slot.xPercent}%`;
                plantNode.style.top = `${slot.yPercent}%`;
                plantNode.style.zIndex = Math.floor(slot.yPercent * 10);

                const img = document.createElement('img');
                if (task.completed) {
                    img.src = task.customImageSrc || this.getFlowerSprite(task.category);
                    img.className = 'plant-img flower-img voxel-popup-anim';
                    img.alt = task.title;
                } else {
                    img.src = idx % 2 === 0 ? 'assets/cicekler/7.png' : 'assets/cicekler/8.png';
                    img.className = idx % 2 === 0 ? 'plant-img sprout-img' : 'plant-img seed-img';
                    img.alt = 'Filiz/Tohum';
                }

                plantNode.appendChild(img);

                const shadow = document.createElement('div');
                shadow.className = 'plant-shadow';
                plantNode.appendChild(shadow);

                plantNode.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showTooltip(plantNode, task, currentDateStr);
                });

                this.container.appendChild(plantNode);
            });
        }

        showTooltip(plantNode, task, dateStr) {
            this.closeTooltip();

            const tooltip = document.createElement('div');
            tooltip.className = 'flower-speech-bubble';
            const flowerName = this.getFlowerName(task.category);
            const statusText = task.completed ? `Çiçek Açtı! (${dateStr}) ✨` : `Toprakta Büyüyor (${dateStr}) 🌿`;

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
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.closeTooltip();
                    if (this.onSelectTaskForJournal) {
                        this.onSelectTaskForJournal(task);
                    }
                });
            }

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

        clearGarden() {
            if (this.container) {
                this.container.innerHTML = '';
            }
            this.activeTooltip = null;
        }
    }

    // --- 3.9 ADVANCED PEN & DRAWING CANVAS MANAGER ---
    class DrawingCanvasManager {
        constructor({ storage, sound }) {
            this.storage = storage;
            this.sound = sound;

            this.penType = 'fountain'; // 'fountain', 'felt', 'highlighter', 'eraser'
            this.penColor = '#2b1d14';
            this.penSize = 4;
            this.penOpacity = 1.0;
            this.isPenActive = false;

            this.leftCanvas = null;
            this.rightCanvas = null;
            this.leftCtx = null;
            this.rightCtx = null;

            this.isDrawing = false;
            this.activePage = null; // 'left' or 'right'
            this.lastPoint = null;
            this.lastTime = 0;

            this.undoStackLeft = [];
            this.redoStackLeft = [];
            this.undoStackRight = [];
            this.redoStackRight = [];

            this.initUI();
            this.initKeyShortcuts();
            window.addEventListener('resize', () => this.resizeCanvases());
        }

        initUI() {
            const btnPen = document.getElementById('btnPen');
            const penMenu = document.getElementById('penMenu');

            if (btnPen && penMenu) {
                btnPen.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.dropdown-popover').forEach(p => {
                        if (p !== penMenu) p.classList.add('hidden');
                    });
                    penMenu.classList.toggle('hidden');
                    this.togglePenActive(!this.isPenActive);
                });
            }

            const sizeSlider = document.getElementById('penSizeSlider');
            const sizeVal = document.getElementById('penSizeVal');
            if (sizeSlider) {
                sizeSlider.addEventListener('input', (e) => {
                    this.penSize = parseFloat(e.target.value) || 4;
                    if (sizeVal) sizeVal.innerText = `${this.penSize}px`;
                });
            }

            const opacitySlider = document.getElementById('penOpacitySlider');
            const opacityVal = document.getElementById('penOpacityVal');
            if (opacitySlider) {
                opacitySlider.addEventListener('input', (e) => {
                    this.penOpacity = parseFloat(e.target.value) || 1.0;
                    if (opacityVal) opacityVal.innerText = `%${Math.round(this.penOpacity * 100)}`;
                });
            }

            document.querySelectorAll('.pen-type-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.pen-type-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.penType = btn.dataset.type || 'fountain';
                    this.togglePenActive(true);
                });
            });

            document.querySelectorAll('.pen-color-dot').forEach(dot => {
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.pen-color-dot').forEach(d => d.classList.remove('active'));
                    dot.classList.add('active');
                    this.penColor = dot.dataset.color || '#2b1d14';
                    if (this.penType === 'eraser') {
                        this.penType = 'fountain';
                        const fBtn = document.querySelector('.pen-type-btn[data-type="fountain"]');
                        document.querySelectorAll('.pen-type-btn').forEach(b => b.classList.remove('active'));
                        if (fBtn) fBtn.classList.add('active');
                    }
                    this.togglePenActive(true);
                });
            });

            const customPicker = document.getElementById('penCustomColorPicker');
            if (customPicker) {
                customPicker.addEventListener('input', (e) => {
                    this.penColor = e.target.value;
                    document.querySelectorAll('.pen-color-dot').forEach(d => d.classList.remove('active'));
                    if (this.penType === 'eraser') {
                        this.penType = 'fountain';
                        const fBtn = document.querySelector('.pen-type-btn[data-type="fountain"]');
                        document.querySelectorAll('.pen-type-btn').forEach(b => b.classList.remove('active'));
                        if (fBtn) fBtn.classList.add('active');
                    }
                    this.togglePenActive(true);
                });
            }

            const btnUndo = document.getElementById('btnUndoDraw');
            const btnRedo = document.getElementById('btnRedoDraw');
            const btnClear = document.getElementById('btnClearDraw');

            if (btnUndo) btnUndo.addEventListener('click', (e) => { e.stopPropagation(); this.undo(); });
            if (btnRedo) btnRedo.addEventListener('click', (e) => { e.stopPropagation(); this.redo(); });
            if (btnClear) btnClear.addEventListener('click', (e) => { e.stopPropagation(); this.clearAll(); });
        }

        initKeyShortcuts() {
            window.addEventListener('keydown', (e) => {
                const active = document.activeElement;
                if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
                    return;
                }
                const modal = document.getElementById('journalModal');
                if (!modal || modal.style.display === 'none') return;

                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    this.undo();
                } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
                    e.preventDefault();
                    this.redo();
                }
            });
        }

        togglePenActive(forceState) {
            this.isPenActive = forceState !== undefined ? forceState : !this.isPenActive;
            const btnPen = document.getElementById('btnPen');
            if (btnPen) {
                if (this.isPenActive) btnPen.classList.add('active');
                else btnPen.classList.remove('active');
            }

            [this.leftCanvas, this.rightCanvas].forEach(c => {
                if (c) {
                    if (this.isPenActive) c.classList.add('pen-active');
                    else c.classList.remove('pen-active');
                }
            });
        }

        attachCanvases() {
            const pageLeft = document.getElementById('pageLeft');
            const pageRight = document.getElementById('pageRight');

            if (pageLeft) {
                let cLeft = document.getElementById('drawCanvasLeft');
                if (!cLeft) {
                    cLeft = document.createElement('canvas');
                    cLeft.id = 'drawCanvasLeft';
                    cLeft.className = 'page-drawing-canvas';
                    pageLeft.appendChild(cLeft);
                }
                this.leftCanvas = cLeft;
                this.leftCtx = cLeft.getContext('2d');
                this.setupCanvasEvents(cLeft, 'left');
            }

            if (pageRight) {
                let cRight = document.getElementById('drawCanvasRight');
                if (!cRight) {
                    cRight = document.createElement('canvas');
                    cRight.id = 'drawCanvasRight';
                    cRight.className = 'page-drawing-canvas';
                    pageRight.appendChild(cRight);
                }
                this.rightCanvas = cRight;
                this.rightCtx = cRight.getContext('2d');
                this.setupCanvasEvents(cRight, 'right');
            }

            this.resizeCanvases();
            this.loadDrawingsForCurrentDate();
        }

        resizeCanvases() {
            [
                { canvas: this.leftCanvas, ctx: this.leftCtx, container: document.getElementById('pageLeft') },
                { canvas: this.rightCanvas, ctx: this.rightCtx, container: document.getElementById('pageRight') }
            ].forEach(({ canvas, ctx, container }) => {
                if (!canvas || !container) return;
                const rect = container.getBoundingClientRect();
                const w = Math.round(rect.width) || 380;
                const h = Math.round(rect.height) || 520;

                if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
                    const temp = document.createElement('canvas');
                    temp.width = canvas.width;
                    temp.height = canvas.height;
                    if (temp.width > 0 && temp.height > 0) {
                        temp.getContext('2d').drawImage(canvas, 0, 0);
                    }

                    canvas.width = w;
                    canvas.height = h;

                    if (temp.width > 0 && temp.height > 0) {
                        ctx.drawImage(temp, 0, 0, temp.width, temp.height, 0, 0, w, h);
                    }
                }
            });
        }

        setupCanvasEvents(canvas, page) {
            const getPos = (e) => {
                const rect = canvas.getBoundingClientRect();
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            };

            const startDrawing = (pos) => {
                if (!this.isPenActive) return;
                this.isDrawing = true;
                this.activePage = page;
                this.lastPoint = pos;
                this.lastTime = Date.now();

                this.saveUndoState(page);

                const ctx = page === 'left' ? this.leftCtx : this.rightCtx;
                this.applyPenStyle(ctx);

                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(pos.x + 0.1, pos.y + 0.1);
                ctx.stroke();
            };

            const moveDrawing = (pos) => {
                if (!this.isDrawing || this.activePage !== page) return;
                const ctx = page === 'left' ? this.leftCtx : this.rightCtx;
                const now = Date.now();
                const dt = Math.max(1, now - this.lastTime);
                const dist = Math.hypot(pos.x - this.lastPoint.x, pos.y - this.lastPoint.y);
                const speed = dist / dt;

                this.applyPenStyle(ctx, speed);

                ctx.beginPath();
                ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();

                this.lastPoint = pos;
                this.lastTime = now;
            };

            const stopDrawing = () => {
                if (!this.isDrawing || this.activePage !== page) return;
                this.isDrawing = false;
                this.saveDrawingToStorage(page);
            };

            canvas.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                startDrawing(getPos(e));
            });

            canvas.addEventListener('mousemove', (e) => {
                moveDrawing(getPos(e));
            });

            window.addEventListener('mouseup', () => stopDrawing());

            canvas.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    const t = e.touches[0];
                    startDrawing(getPos(t));
                }
            }, { passive: true });

            canvas.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1) {
                    const t = e.touches[0];
                    moveDrawing(getPos(t));
                }
            }, { passive: true });

            canvas.addEventListener('touchend', () => stopDrawing());
        }

        applyPenStyle(ctx, speed = 0) {
            const opacity = this.penOpacity !== undefined ? this.penOpacity : 1.0;
            const size = this.penSize !== undefined ? this.penSize : 4;

            if (this.penType === 'fountain') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = this.penColor;
                ctx.globalAlpha = opacity;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                const dynamicW = Math.max(1, Math.min(size * 2, size + (2.5 - speed * 1.2)));
                ctx.lineWidth = dynamicW;
            } else if (this.penType === 'felt') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = this.penColor;
                ctx.globalAlpha = opacity;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = Math.max(2, size * 1.5);
            } else if (this.penType === 'highlighter') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = this.penColor;
                ctx.globalAlpha = Math.min(0.45, opacity * 0.35);
                ctx.lineCap = 'square';
                ctx.lineJoin = 'bevel';
                ctx.lineWidth = Math.max(12, size * 3);
            } else if (this.penType === 'eraser') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.strokeStyle = 'rgba(0,0,0,1)';
                ctx.globalAlpha = 1.0;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.lineWidth = Math.max(16, size * 3.5);
            }
        }

        saveUndoState(page) {
            const canvas = page === 'left' ? this.leftCanvas : this.rightCanvas;
            const stack = page === 'left' ? this.undoStackLeft : this.undoStackRight;
            const redoStack = page === 'left' ? this.redoStackLeft : this.redoStackRight;

            if (canvas && canvas.width > 0) {
                stack.push(canvas.toDataURL());
                if (stack.length > 25) stack.shift();
                redoStack.length = 0;
            }
        }

        undo() {
            ['left', 'right'].forEach(page => {
                const canvas = page === 'left' ? this.leftCanvas : this.rightCanvas;
                const ctx = page === 'left' ? this.leftCtx : this.rightCtx;
                const undoStack = page === 'left' ? this.undoStackLeft : this.undoStackRight;
                const redoStack = page === 'left' ? this.redoStackLeft : this.redoStackRight;

                if (undoStack.length > 0) {
                    redoStack.push(canvas.toDataURL());
                    const prevDataUrl = undoStack.pop();
                    this.restoreCanvasDataUrl(canvas, ctx, prevDataUrl, () => {
                        this.saveDrawingToStorage(page);
                    });
                }
            });
        }

        redo() {
            ['left', 'right'].forEach(page => {
                const canvas = page === 'left' ? this.leftCanvas : this.rightCanvas;
                const ctx = page === 'left' ? this.leftCtx : this.rightCtx;
                const undoStack = page === 'left' ? this.undoStackLeft : this.undoStackRight;
                const redoStack = page === 'left' ? this.redoStackLeft : this.redoStackRight;

                if (redoStack.length > 0) {
                    undoStack.push(canvas.toDataURL());
                    const nextDataUrl = redoStack.pop();
                    this.restoreCanvasDataUrl(canvas, ctx, nextDataUrl, () => {
                        this.saveDrawingToStorage(page);
                    });
                }
            });
        }

        clearAll() {
            ['left', 'right'].forEach(page => {
                this.saveUndoState(page);
                const canvas = page === 'left' ? this.leftCanvas : this.rightCanvas;
                const ctx = page === 'left' ? this.leftCtx : this.rightCtx;
                if (canvas && ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    this.saveDrawingToStorage(page);
                }
            });
            if (window.showCozyToast) {
                window.showCozyToast("Sayfadaki çizimler temizlendi! 🧹");
            }
        }

        restoreCanvasDataUrl(canvas, ctx, dataUrl, onDone) {
            if (!canvas || !ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (!dataUrl) {
                if (onDone) onDone();
                return;
            }

            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                if (onDone) onDone();
            };
            img.src = dataUrl;
        }

        saveDrawingToStorage(page) {
            const canvas = page === 'left' ? this.leftCanvas : this.rightCanvas;
            if (!canvas) return;

            const curDate = this.storage.getCurrentDate();
            const data = this.storage.getDataForDate(curDate);

            const dataUrl = canvas.toDataURL();
            if (page === 'left') data.drawingLeft = dataUrl;
            else data.drawingRight = dataUrl;

            this.storage.saveDataForDate(curDate, data);
        }

        loadDrawingsForCurrentDate() {
            const curDate = this.storage.getCurrentDate();
            const data = this.storage.getDataForDate(curDate);

            if (this.leftCanvas && this.leftCtx) {
                this.restoreCanvasDataUrl(this.leftCanvas, this.leftCtx, data.drawingLeft);
            }
            if (this.rightCanvas && this.rightCtx) {
                this.restoreCanvasDataUrl(this.rightCanvas, this.rightCtx, data.drawingRight);
            }
        }
    }

    // --- 4. JOURNAL MANAGER (3D ACCORDION & CANVAS ENGINE) ---
    class JournalManager {
        constructor({ storage, onMoodChange, onTaskToggle, onTaskAdd, onDateChange }) {
            this.storage = storage;
            this.onMoodChange = onMoodChange;
            this.onTaskToggle = onTaskToggle;
            this.onTaskAdd = onTaskAdd;
            this.onDateChange = onDateChange;

            this.modalEl = document.getElementById('journalModal');
            this.bookSceneEl = document.getElementById('bookScene');
            this.leftCanvasEl = document.getElementById('pageLeft');
            this.rightCanvasEl = document.getElementById('pageRight');
            this.dateTitleEl = document.getElementById('currentDateDisplay');
            this.spineShadowEl = document.getElementById('spineShadow');

            this.drawingManager = new DrawingCanvasManager({ storage: this.storage });

            this.selectedElementId = null;
            this.activeTransform = null;
            this.isFlipping = false;
            this.isCoverMode = true; // Opens directly on Cover page spread by default

            // Crop State
            this.activeCropElement = null;
            this.cropImg = null;
            this.cropMode = 'lasso';
            this.cropRect = { x: 0, y: 0, w: 0, h: 0 };
            this.lassoPoints = [];
            this.isDrawingLasso = false;
            this.activeRectHandle = null;

            this.initEventListeners();
            this.initCropModalListeners();
        }

        initEventListeners() {
            const closeBtn = document.getElementById('btnCloseJournal');
            if (closeBtn) closeBtn.addEventListener('click', () => this.close());

            const btnCover = document.getElementById('btnCover');
            if (btnCover) btnCover.addEventListener('click', () => this.goToCover());

            if (this.modalEl) {
                this.modalEl.addEventListener('click', (e) => {
                    if (e.target === this.modalEl) this.close();
                });
            }

            // Comprehensive Clipboard Paste (Cmd+V / Ctrl+V) Sticker Handler
            window.addEventListener('paste', async (e) => {
                if (!this.modalEl || (this.modalEl.style.display === 'none' || this.modalEl.style.opacity === '0')) return;

                const activeEl = document.activeElement;
                const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);

                const clipboardData = e.clipboardData || window.clipboardData || e.originalEvent?.clipboardData;
                if (!clipboardData) return;

                let imageHandled = false;

                // 1. Image Blobs in items
                const items = clipboardData.items || [];
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.type && item.type.indexOf('image') === 0) {
                        e.preventDefault();
                        imageHandled = true;
                        const blob = item.getAsFile();
                        if (blob) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                                this.addPastedSticker(evt.target.result, 'left');
                            };
                            reader.readAsDataURL(blob);
                        }
                        break;
                    }
                }

                if (imageHandled) return;

                // 2. Image Files array (e.g. Mac Finder paste)
                const files = clipboardData.files || [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.type && file.type.indexOf('image') === 0) {
                        e.preventDefault();
                        imageHandled = true;
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                            this.addPastedSticker(evt.target.result, 'left');
                        };
                        reader.readAsDataURL(file);
                        break;
                    }
                }

                if (imageHandled) return;

                // 3. HTML image tags (e.g. copied image from Pinterest/Web)
                const htmlText = clipboardData.getData('text/html');
                if (htmlText) {
                    const match = htmlText.match(/<img[^>]+src=["']([^"']+)["']/i);
                    if (match && match[1]) {
                        if (!isTyping) e.preventDefault();
                        this.addPastedSticker(match[1], 'left');
                        return;
                    }
                }

                // 4. Plain text Data URL or Image URL
                const plainText = clipboardData.getData('text/plain');
                if (plainText && (plainText.startsWith('data:image/') || plainText.match(/^https?:\/\/.*\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i))) {
                    if (!isTyping) e.preventDefault();
                    this.addPastedSticker(plainText.trim(), 'left');
                    return;
                }
            });

            // Drag & Drop Image files directly onto notebook pages
            [this.leftCanvasEl, this.rightCanvasEl].forEach((pageEl, idx) => {
                if (!pageEl) return;
                const pageName = idx === 0 ? 'left' : 'right';

                pageEl.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                });

                                pageEl.addEventListener('drop', (e) => {
                    const files = e.dataTransfer && e.dataTransfer.files;
                    if (files && files.length > 0) {
                        for (let file of files) {
                            if (file.type && file.type.indexOf('image') === 0) {
                                e.preventDefault();
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                    this.addPastedSticker(evt.target.result, pageName);
                                };
                                reader.readAsDataURL(file);
                                break;
                            }
                        }
                        return;
                    }

                    // Handle dragged routine cards dropped on canvas
                    let rawData = e.dataTransfer.getData('application/json');
                    if (rawData) {
                        e.preventDefault();
                        try {
                            const cardData = JSON.parse(rawData);
                            if (cardData && cardData.title) {
                                const rect = pageEl.getBoundingClientRect();
                                const clickX = Math.max(10, Math.round(e.clientX - rect.left));
                                const clickY = Math.max(10, Math.round(e.clientY - rect.top));
                                
                                const ctx = this.getTargetContext(pageName);
                                const newEl = {
                                    id: 'el_task_' + Date.now(),
                                    type: 'task',
                                    taskId: 't_' + Date.now(),
                                    title: cardData.note ? (cardData.title + ': ' + cardData.note) : cardData.title,
                                    category: cardData.category || 'routine',
                                    completed: false,
                                    x: clickX,
                                    y: clickY,
                                    width: 220,
                                    height: 130,
                                    rotation: 0,
                                    zIndex: 10 + (ctx.data.elements || []).length,
                                    page: ctx.page
                                };
                                if (!ctx.data.elements) ctx.data.elements = [];
                                ctx.data.elements.push(newEl);
                                this.saveTargetContext(ctx);
                                this.renderElementToCanvas(newEl, ctx.data);
                                this.selectElement(newEl.id);
                                if (this.onTaskAdd && !ctx.isCover) {
                                    this.onTaskAdd('Yeni Görev', newEl.category);
                                }
                            }
                        } catch(err) {}
                    }
                });

                // Direct page double-click or text tool click to insert handwriting text right at clicked coordinates
                pageEl.addEventListener('dblclick', (e) => {
                    if (this.drawingManager && this.drawingManager.isPenActive) return;
                    if (e.target.closest('.scrapbook-canvas-item') || e.target.closest('.goodnotes-toolbar')) return;
                    const rect = pageEl.getBoundingClientRect();
                    const clickX = Math.max(10, Math.round(e.clientX - rect.left));
                    const clickY = Math.max(10, Math.round(e.clientY - rect.top));
                    this.addFreeformText(pageName, null, clickX, clickY);
                });
            });



            // Monthly Index Tabs (Jan - Dec)
            document.querySelectorAll('.bookmark-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const monthIdx = parseInt(tab.dataset.month, 10);
                    const now = new Date();
                    const year = now.getFullYear();
                    const monthStr = String(monthIdx + 1).padStart(2, '0');
                    const targetDateStr = `${year}-${monthStr}-01`;
                    this.storage.setCurrentDate(targetDateStr);
                    this.isCoverMode = false;
                    sound.playPageFlip();
                    if (this.onDateChange) {
                        this.onDateChange(targetDateStr);
                    }
                });
            });

            // Keyboard Delete & Backspace shortcut for selected element
            window.addEventListener('keydown', (e) => {
                if ((e.key === 'Delete' || e.key === 'Backspace') && this.selectedElementId) {
                    const active = document.activeElement;
                    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
                        if (e.key === 'Delete' || (active.tagName === 'TEXTAREA' && active.value.trim() === '')) {
                            e.preventDefault();
                            this.deleteElement(this.selectedElementId);
                            return;
                        }
                        return;
                    }
                    e.preventDefault();
                    this.deleteElement(this.selectedElementId);
                }
            });

            const toolTextBtn = document.getElementById('btnText');
            const toolPhotoBtn = document.getElementById('btnPhoto');
            const toolTaskBtn = document.getElementById('btnTask');
            const toolWashiBtn = document.getElementById('btnWashi');
            const toolDateStampBtn = document.getElementById('btnDateStamp');
            const toolStickerBtn = document.getElementById('btnSticker');
            const toolPaperBtn = document.getElementById('btnPaper');
            const toolExportBtn = document.getElementById('btnExport');
            const toolDeleteBtn = document.getElementById('btnDelete');

            const photoInput = document.getElementById('photoInput');
            const textColorMenu = document.getElementById('textColorMenu');
            const washiMenu = document.getElementById('washiMenu');
            const stickerMenu = document.getElementById('stickerMenu');
            const paperMenu = document.getElementById('paperMenu');

            if (toolTextBtn && textColorMenu) {
                toolTextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (washiMenu) washiMenu.classList.add('hidden');
                    if (stickerMenu) stickerMenu.classList.add('hidden');
                    if (paperMenu) paperMenu.classList.add('hidden');
                    textColorMenu.classList.toggle('hidden');
                });
            }

            document.querySelectorAll('.tb-color-opt').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const color = btn.dataset.color;
                    this.activeTextColor = color;
                    if (textColorMenu) textColorMenu.classList.add('hidden');

                    if (this.selectedElementId) {
                        const ctx = this.getTargetContext();
                        const targetEl = (ctx.data.elements || []).find(el => el.id === this.selectedElementId);
                        if (targetEl && targetEl.type === 'text') {
                            targetEl.color = color;
                            this.saveTargetContext(ctx);
                            const node = document.querySelector(`[data-id="${targetEl.id}"] textarea`);
                            if (node) node.style.color = color;
                            return;
                        }
                    }

                    this.addFreeformText('right', color);
                });
            });

            document.querySelectorAll('.tb-font-opt').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.tb-font-opt').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const font = btn.dataset.font || "'Caveat', cursive";
                    this.activeTextFont = font;
                    if (textColorMenu) textColorMenu.classList.add('hidden');

                    if (this.selectedElementId) {
                        const ctx = this.getTargetContext();
                        const targetEl = (ctx.data.elements || []).find(el => el.id === this.selectedElementId);
                        if (targetEl && targetEl.type === 'text') {
                            targetEl.fontFamily = font;
                            this.saveTargetContext(ctx);
                            const node = document.querySelector(`[data-id="${targetEl.id}"] textarea`);
                            if (node) node.style.fontFamily = font;
                        }
                    }
                });
            });

            if (toolPhotoBtn && photoInput) toolPhotoBtn.addEventListener('click', () => photoInput.click());

            if (photoInput) {
                photoInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                            sound.playTapeSlap();
                            this.addPhoto(evt.target.result, 'right');
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            if (toolTaskBtn) toolTaskBtn.addEventListener('click', () => this.addStickyTaskNote('right'));
            if (toolDateStampBtn) toolDateStampBtn.addEventListener('click', () => this.addVintageDateStamp('right'));
            if (toolExportBtn) toolExportBtn.addEventListener('click', () => this.exportMemoryCard());

            // Washi Dropdown Toggle
            if (toolWashiBtn && washiMenu) {
                toolWashiBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (stickerMenu) stickerMenu.classList.add('hidden');
                    if (paperMenu) paperMenu.classList.add('hidden');
                    washiMenu.classList.toggle('hidden');
                });
            }

            // Washi Pattern Selection
            document.querySelectorAll('.washi-opt-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sound.playTapeSlap();
                    this.addWashiTape(btn.dataset.pattern, 'right');
                    if (washiMenu) washiMenu.classList.add('hidden');
                });
            });

            // Paperclip Badge Toggle
            const addPaperclipBtn = document.getElementById('addPaperclipBtn');
            if (addPaperclipBtn) {
                addPaperclipBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sound.playTapeSlap();
                    this.togglePaperclipOnSelected();
                    if (washiMenu) washiMenu.classList.add('hidden');
                });
            }

            // Torn Paper Edge Toggle
            const toggleTornBtn = document.getElementById('toggleTornBtn');
            if (toggleTornBtn) {
                toggleTornBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sound.playTapeSlap();
                    this.toggleTornEdgeOnSelected();
                    if (washiMenu) washiMenu.classList.add('hidden');
                });
            }

            if (toolStickerBtn && stickerMenu) {
                toolStickerBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (washiMenu) washiMenu.classList.add('hidden');
                    if (paperMenu) paperMenu.classList.add('hidden');
                    stickerMenu.classList.toggle('hidden');
                });
            }

            if (toolPaperBtn && paperMenu) {
                toolPaperBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (washiMenu) washiMenu.classList.add('hidden');
                    if (stickerMenu) stickerMenu.classList.add('hidden');
                    paperMenu.classList.toggle('hidden');
                });
            }

            if (toolDeleteBtn) {
                toolDeleteBtn.addEventListener('click', () => {
                    if (this.selectedElementId) {
                        this.deleteElement(this.selectedElementId);
                    }
                });
            }

            document.querySelectorAll('.sticker-opt').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sound.playTapeSlap();
                    const emoji = item.dataset.emoji || item.innerText;
                    this.addSticker(emoji, 'right');
                    if (stickerMenu) stickerMenu.classList.add('hidden');
                });
            });

            document.querySelectorAll('.stamp-opt').forEach(item => {
                if (item.id === 'addPaperclipBtn' || item.id === 'toggleTornBtn') return;
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sound.playStamp();
                    this.addMoodStamp(item.dataset.mood, item.dataset.emoji, item.dataset.label, 'left');
                    if (stickerMenu) stickerMenu.classList.add('hidden');
                });
            });

            document.querySelectorAll('.paper-opt').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.setPaperTemplate(btn.dataset.type);
                    if (paperMenu) paperMenu.classList.add('hidden');
                });
            });

            window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            window.addEventListener('mouseup', () => this.handleMouseUp());

            document.addEventListener('click', (e) => {
                if (!e.target.closest('#washiMenu') && !e.target.closest('#btnWashi')) {
                    if (washiMenu) washiMenu.classList.add('hidden');
                }
                if (!e.target.closest('#stickerMenu') && !e.target.closest('#btnSticker')) {
                    if (stickerMenu) stickerMenu.classList.add('hidden');
                }
                if (!e.target.closest('#paperMenu') && !e.target.closest('#btnPaper')) {
                    if (paperMenu) paperMenu.classList.add('hidden');
                }
                if (!e.target.closest('.scrapbook-canvas-item') && !e.target.closest('.goodnotes-toolbar')) {
                    this.deselectAll();
                }
            });
        }

        openModal() {
            if (this.modalEl) {
                this.modalEl.classList.add('active');
                this.modalEl.classList.add('is-open');
                this.modalEl.style.display = 'flex';
                this.modalEl.style.opacity = '1';
                this.modalEl.style.pointerEvents = 'auto';
            }

            const coverView = document.getElementById('bookCoverView');
            const pagesView = document.getElementById('bookPagesView');

            if (this.isCoverMode) {
                if (coverView) coverView.style.display = 'flex';
                if (pagesView) pagesView.style.display = 'none';
                this.renderCover();
            } else {
                if (coverView) coverView.style.display = 'none';
                if (pagesView) pagesView.style.display = 'flex';
                this.renderCurrentDay();
            }

            if (window.showCozyToast) {
                setTimeout(() => {
                    window.showCozyToast("💡 İpucu: Kopyaladığınız görselleri (Ctrl+V) doğrudan sayfaya yapıştırabilirsiniz!");
                }, 400);
            }
        }

        goToCover() {
            if (this.isFlipping) return;
            sound.playPageFlip();
            this.isCoverMode = true;
            const coverView = document.getElementById('bookCoverView');
            const pagesView = document.getElementById('bookPagesView');
            if (pagesView) pagesView.style.display = 'none';
            if (coverView) coverView.style.display = 'flex';
            this.renderCover();
        }

        goToCurrentDay() {
            if (this.isFlipping) return;
            sound.playPageFlip();
            this.isCoverMode = false;
            const coverView = document.getElementById('bookCoverView');
            const pagesView = document.getElementById('bookPagesView');
            if (coverView) coverView.style.display = 'none';
            if (pagesView) pagesView.style.display = 'flex';
            this.renderCurrentDay();
        }

        openSpread() {
            this.openModal();
        }

        open() {
            this.openModal();
        }

        close() {
            sound.playPageFlip();
            if (this.modalEl) {
                this.modalEl.classList.remove('active');
                this.modalEl.classList.remove('is-open');
                this.modalEl.style.display = 'none';
                this.modalEl.style.opacity = '0';
                this.modalEl.style.pointerEvents = 'none';
            }
        }

        navigateDay(offsetDays) {
            if (this.isFlipping) return;
            this.isFlipping = true;
            sound.playPageFlip();

            // If currently on Cover page
            if (this.isCoverMode) {
                if (offsetDays > 0) {
                    // Navigate forward from Cover to Current Day
                    this.animatePageFlip(true, () => {
                        window.openBookPages();
                        this.isFlipping = false;
                    });
                } else {
                    this.isFlipping = false;
                }
                return;
            }

            const curDateStr = this.storage.getCurrentDate();
            let year, month, day;

            if (curDateStr && curDateStr.includes('-')) {
                const parts = curDateStr.split('-');
                year = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10) - 1;
                day = parseInt(parts[2], 10);
            } else {
                const now = new Date();
                year = now.getFullYear();
                month = now.getMonth();
                day = now.getDate();
            }

            const d = new Date(year, month, day);
            d.setDate(d.getDate() + offsetDays);

            const newYear = d.getFullYear();
            const newMonth = String(d.getMonth() + 1).padStart(2, '0');
            const newDay = String(d.getDate()).padStart(2, '0');
            const newDateStr = `${newYear}-${newMonth}-${newDay}`;

            // If navigating backwards past the first day (e.g. 2026-09-01), return to cover
            if (offsetDays < 0 && newDateStr < '2026-09-01') {
                this.animatePageFlip(false, () => {
                    window.closeToCover();
                    this.isFlipping = false;
                });
                return;
            }

            this.animatePageFlip(offsetDays > 0, () => {
                this.storage.setCurrentDate(newDateStr);
                if (this.onDateChange) {
                    this.onDateChange(newDateStr);
                } else {
                    this.renderCurrentDay();
                }
                this.isFlipping = false;
            });
        }

        animatePageFlip(isNext, onComplete) {
            if (this.bookSceneEl) {
                const flipper = document.createElement('div');
                flipper.className = `turning-page-flipper ${isNext ? 'flipper-right-to-left' : 'flipper-left-to-right'}`;

                const sourcePage = isNext ? this.rightCanvasEl : this.leftCanvasEl;
                const frontContent = sourcePage ? sourcePage.innerHTML : '';

                flipper.innerHTML = `
                    <div class="flipper-face flipper-front paper-dotted">${frontContent}</div>
                    <div class="flipper-face flipper-back paper-dotted"></div>
                `;

                this.bookSceneEl.appendChild(flipper);

                if (this.spineShadowEl) {
                    this.spineShadowEl.style.opacity = '0.7';
                }

                flipper.getBoundingClientRect();
                flipper.style.transform = isNext ? 'rotateY(-180deg)' : 'rotateY(180deg)';

                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 260);

                setTimeout(() => {
                    flipper.remove();
                    if (this.spineShadowEl) {
                        this.spineShadowEl.style.opacity = '0';
                    }
                }, 550);
            } else {
                if (onComplete) onComplete();
            }
        }

        renderCover() {
            this.isCoverMode = true;
            const coverCanvas = document.getElementById('coverCanvas');
            if (!coverCanvas) return;

            coverCanvas.querySelectorAll('.scrapbook-canvas-item').forEach(el => el.remove());

            const coverData = this.storage.getCoverData();
            (coverData.elements || []).forEach(el => {
                el.page = 'cover';
                this.renderElementToCanvas(el, coverData);
            });
        }

        renderCurrentDay() {
            this.isCoverMode = false;
            const currentDateStr = this.storage.getCurrentDate();
            const data = this.storage.getDataForDate(currentDateStr);

            if (this.dateTitleEl && currentDateStr) {
                try {
                    const parts = currentDateStr.split('-');
                    if (parts.length === 3) {
                        const dayNum = String(parts[2]).padStart(2, '0');
                        const monthNum = String(parts[1]).padStart(2, '0');
                        const yearNum = parts[0];
                        this.dateTitleEl.innerText = "";
                    } else {
                        this.dateTitleEl.innerText = "";
                    }
                } catch (e) {
                    this.dateTitleEl.innerText = "";
                }
            }

            this.applyPaperTemplate(data.paperTemplate || 'dotted');

            if (this.leftCanvasEl) this.leftCanvasEl.innerHTML = '';
            if (this.rightCanvasEl) this.rightCanvasEl.innerHTML = '';

            // Clean up any legacy yellow task notes from date elements array
            if (Array.isArray(data.elements)) {
                data.elements = data.elements.filter(el => el.type !== 'task');
                this.storage.saveDataForDate(currentDateStr, data);
            }

            (data.elements || []).forEach(el => {
                this.renderElementToCanvas(el, data);
            });

            if (this.rightCanvasEl) {
                const existingMinimalDate = this.rightCanvasEl.querySelector('.minimal-page-date');
                if (existingMinimalDate) existingMinimalDate.remove();
            }

            if (this.drawingManager) {
                this.drawingManager.attachCanvases();
                this.drawingManager.loadDrawingsForCurrentDate();
            }
        }

        applyPaperTemplate(templateName) {
            const pages = [this.leftCanvasEl, this.rightCanvasEl];
            pages.forEach(p => {
                if (p) {
                    p.className = `notebook-page paper-${templateName}`;
                }
            });
        }

        setPaperTemplate(templateName) {
            if (this.isCoverMode) {
                const coverData = this.storage.getCoverData();
                coverData.paperTemplate = templateName;
                this.storage.saveCoverData(coverData);
            } else {
                const curDate = this.storage.getCurrentDate();
                const data = this.storage.getDataForDate(curDate);
                data.paperTemplate = templateName;
                this.storage.saveDataForDate(curDate, data);
            }
            this.applyPaperTemplate(templateName);
        }

        renderElementToCanvas(el, data) {
            if (el.type === 'task') return;
            let targetPageEl;
            if (el.page === 'cover') {
                targetPageEl = document.getElementById('coverCanvas');
            } else if (el.page === 'left') {
                targetPageEl = this.leftCanvasEl;
            } else {
                targetPageEl = this.rightCanvasEl;
            }
            if (!targetPageEl) return;

            const node = document.createElement('div');
            node.className = `scrapbook-canvas-item journal-text-item item-type-${el.type} ${this.selectedElementId === el.id ? 'is-selected selected' : ''} ${el.torn ? 'torn-paper' : ''}`;
            node.dataset.id = el.id;
            node.style.left = `${el.x}px`;
            node.style.top = `${el.y}px`;
            node.style.width = `${el.width || 180}px`;
            node.style.height = `${el.height || 'auto'}px`;
            node.style.transform = `rotate(${el.rotation || 0}deg) scale(${el.flipX ? -1 : 1}, ${el.flipY ? -1 : 1})`;
            node.style.zIndex = el.zIndex || 10;

            if (el.hasPaperclip) {
                const clip = document.createElement('div');
                clip.className = 'paperclip-badge';
                node.appendChild(clip);
            }

            node.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.selectElement(el.id);

                if (e.target.classList.contains('resize-handle') || 
                    e.target.classList.contains('rot-handle') || 
                    e.target.classList.contains('delete-handle') || 
                    e.target.classList.contains('crop-handle') || 
                    e.target.classList.contains('flipx-handle') || 
                    e.target.classList.contains('flipy-handle') || 
                    e.target.tagName === 'INPUT' || 
                    e.target.tagName === 'TEXTAREA' || 
                    e.target.tagName === 'SELECT') {
                    return;
                }
                this.startTransform('move', e, el, node);
            });

            const handlesContainer = document.createElement('div');
            handlesContainer.className = 'transform-handles-container';

            ['nw', 'ne', 'sw', 'se'].forEach(pos => {
                const h = document.createElement('div');
                h.className = `resize-handle handle-${pos}`;
                h.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                    this.startTransform(`resize-${pos}`, e, el, node);
                });
                handlesContainer.appendChild(h);
            });

            const rotStem = document.createElement('div');
            rotStem.className = 'rot-handle-stem';
            handlesContainer.appendChild(rotStem);

            const rotTooltip = document.createElement('div');
            rotTooltip.className = 'rot-degree-tooltip';
            rotTooltip.innerText = `${el.rotation || 0}°`;
            handlesContainer.appendChild(rotTooltip);

            const rotH = document.createElement('div');
            rotH.className = 'rot-handle';
            rotH.innerHTML = '🔄';
            rotH.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.startTransform('rotate', e, el, node, rotTooltip);
            });
            handlesContainer.appendChild(rotH);

            if (el.type === 'photo' || el.type === 'sticker') {
                const cropH = document.createElement('div');
                cropH.className = 'crop-handle';
                cropH.innerHTML = '✂️';
                cropH.title = 'Görseli Kırp (Dikdörtgen / Kement)';
                cropH.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                });
                cropH.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openCropModal(el);
                });
                handlesContainer.appendChild(cropH);

                const flipXH = document.createElement('div');
                flipXH.className = 'flipx-handle';
                flipXH.innerHTML = '↔️';
                flipXH.title = 'Yatay Çevir (Flip X)';
                flipXH.addEventListener('click', (e) => {
                    e.stopPropagation();
                    el.flipX = !el.flipX;
                    node.style.transform = `rotate(${el.rotation || 0}deg) scale(${el.flipX ? -1 : 1}, ${el.flipY ? -1 : 1})`;
                    this.saveTargetContext(this.getTargetContext());
                });
                handlesContainer.appendChild(flipXH);

                const flipYH = document.createElement('div');
                flipYH.className = 'flipy-handle';
                flipYH.innerHTML = '↕️';
                flipYH.title = 'Dikey Çevir (Flip Y)';
                flipYH.addEventListener('click', (e) => {
                    e.stopPropagation();
                    el.flipY = !el.flipY;
                    node.style.transform = `rotate(${el.rotation || 0}deg) scale(${el.flipX ? -1 : 1}, ${el.flipY ? -1 : 1})`;
                    this.saveTargetContext(this.getTargetContext());
                });
                handlesContainer.appendChild(flipYH);
            }

            const delH = document.createElement('div');
            delH.className = 'delete-handle';
            delH.innerHTML = '✕';
            delH.title = 'Sil';
            delH.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteElement(el.id);
            });
            handlesContainer.appendChild(delH);

            node.appendChild(handlesContainer);

            const contentBox = document.createElement('div');
            contentBox.className = 'item-content-box';

            if (el.type === 'text') {
                const color = el.color || '#3b2518';
                const font = el.fontFamily || this.activeTextFont || "'Caveat', cursive";
                contentBox.innerHTML = `
                    <textarea class="canvas-handwriting-text" style="color: ${color} !important; font-family: ${font};" placeholder="Yazmaya başlayın...">${el.content || ''}</textarea>
                `;

                const ta = contentBox.querySelector('textarea');
                if (ta) {
                    ta.addEventListener('focus', () => this.selectElement(el.id));
                    ta.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.selectElement(el.id);
                    });
                    ta.addEventListener('input', () => {
                        el.content = ta.value;
                        if (el.page === 'cover') this.storage.saveCoverData(data);
                        else this.storage.saveDataForDate(data.date, data);
                    });
                }
            } else if (el.type === 'photo') {
                const imgSrc = el.src || 'assets/flower_pink_blossom.png';
                contentBox.innerHTML = `
                    <div class="raw-photo-card">
                        <img src="${imgSrc}" alt="Anı Fotoğrafı" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='assets/flower_pink_blossom.png';" />
                    </div>
                `;
            } else if (el.type === 'task') {
                const cat = el.category || 'routine';
                const catClass = `cat-${cat}`;
                contentBox.innerHTML = `
                    <div class="task-chip-card ${catClass} ${el.completed ? 'is-completed' : ''}">
                        <input type="checkbox" class="task-chip-cb" ${el.completed ? 'checked' : ''} />
                        <span class="task-chip-title">${el.title || 'Yeni Görev'}</span>
                    </div>
                `;

                const cb = contentBox.querySelector('.task-chip-cb');
                const titleSpan = contentBox.querySelector('.task-chip-title');
                const card = contentBox.querySelector('.task-chip-card');
                
                if (card) {
                    card.addEventListener('click', (e) => {
                        if (e.target === cb) return; // checkbox click should not open drawer
                        e.stopPropagation();
                        // Open the left drawer (Rutin kısmı)
                        if (window.cozyApp && window.cozyApp.drawerManager) {
                            window.cozyApp.drawerManager.open();
                            const tabs = document.querySelectorAll('.drawer-tab-btn');
                            tabs.forEach(t => t.classList.remove('active'));
                            const pns = document.querySelectorAll('.drawer-tab-pane');
                            pns.forEach(p => p.classList.remove('active'));
                            document.querySelector('[data-tab="routines"]')?.classList.add('active');
                            document.getElementById('routinesTabPane')?.classList.add('active');
                        }
                        
                        // Show prompt to read/edit the text
                        const newTitle = prompt('Görev Detayı:', el.title || '');
                        if (newTitle !== null) {
                            el.title = newTitle.trim();
                            if(titleSpan) titleSpan.innerText = el.title;
                            if (el.page === 'cover') this.storage.saveCoverData(data);
                            else this.storage.saveDataForDate(data.date, data);
                        }
                    });

                }
                if (cb) {
                    cb.addEventListener('change', (e) => {
                        e.stopPropagation();
                        el.completed = cb.checked;
                        const card = contentBox.querySelector('.task-chip-card');
                        if (el.completed) {
                            card.classList.add('is-completed');
                            if (this.onTaskToggle) this.onTaskToggle(el.id, el.category);
                        } else {
                            card.classList.remove('is-completed');
                            try { sound.playPencilCheck(); } catch (err) {}
                        }
                        if (el.page === 'cover') this.storage.saveCoverData(data);
                        else this.storage.saveDataForDate(data.date, data);
                    });
                }
            } else if (el.type === 'sticker') {
                contentBox.innerHTML = `
                    <div class="canvas-sticker-display">${el.emoji || '🌸'}</div>
                `;
            } else if (el.type === 'stamp') {
                contentBox.innerHTML = `
                    <div class="canvas-stamp-display" title="${el.label}">
                        <div class="stamp-outer-circle">
                            <span class="stamp-emoji">${el.emoji}</span>
                            <span class="stamp-label-text">${el.label}</span>
                        </div>
                        <div class="ink-stamp-word">STAMPED</div>
                    </div>
                `;
            } else if (el.type === 'washi') {
                contentBox.innerHTML = `
                    <div class="washi-tape-strip pattern-${el.pattern || 'polka'}"></div>
                `;
            } else if (el.type === 'dateStamp') {
                contentBox.innerHTML = `
                    <div class="vintage-date-stamp">
                        <span class="stamp-date-text">${el.dateStr || '13 EYL 2026'}</span>
                        <span class="stamp-star-sub">★ COZY JOURNAL ★</span>
                    </div>
                `;
            } else if (el.type === 'sticky') {
                const style = el.style || 'yellow';
                contentBox.innerHTML = `
                    <div class="sticky-note-card style-${style}">
                        ${style === 'washi' ? '<div class="tpl-washi-tape"></div>' : (style === 'kraft' ? '' : '<div class="sticky-pin">📍</div>')}
                        <textarea class="canvas-handwriting-text" placeholder="Notunuzu yazın...">${el.content || ''}</textarea>
                    </div>
                `;
                const ta = contentBox.querySelector('textarea');
                if (ta) {
                    ta.addEventListener('focus', () => this.selectElement(el.id));
                    ta.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.selectElement(el.id);
                    });
                    ta.addEventListener('input', () => {
                        el.content = ta.value;
                        if (el.page === 'cover') this.storage.saveCoverData(data);
                        else this.storage.saveDataForDate(data.date, data);
                    });
                }
            } else if (el.type === 'pngSticky') {
                contentBox.innerHTML = `
                    <div class="png-sticky-card-wrap">
                        <img src="${el.src}" alt="Not Kağıdı" class="png-sticky-bg-img" />
                        <textarea class="png-sticky-textarea" placeholder="Notunuzu yazın...">${el.content || ''}</textarea>
                    </div>
                `;
                const ta = contentBox.querySelector('textarea');
                if (ta) {
                    ta.addEventListener('focus', () => this.selectElement(el.id));
                    ta.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.selectElement(el.id);
                    });
                    ta.addEventListener('input', () => {
                        el.content = ta.value;
                        if (el.page === 'cover') this.storage.saveCoverData(data);
                        else this.storage.saveDataForDate(data.date, data);
                    });
                }
            }

            node.appendChild(contentBox);
            targetPageEl.appendChild(node);
        }

        selectElement(id) {
            this.selectedElementId = id;
            document.querySelectorAll('.scrapbook-canvas-item, .journal-text-item').forEach(n => {
                if (n.dataset.id === id) {
                    n.classList.add('is-selected');
                    n.classList.add('selected');
                } else {
                    n.classList.remove('is-selected');
                    n.classList.remove('selected');
                }
            });
        }

        deselectAll() {
            this.selectedElementId = null;
            document.querySelectorAll('.scrapbook-canvas-item, .journal-text-item').forEach(n => {
                n.classList.remove('is-selected');
                n.classList.remove('selected');
            });
        }

        startTransform(type, e, elementData, domNode, tooltipEl = null) {
            this.activeTransform = {
                type: type,
                element: elementData,
                node: domNode,
                startX: e.clientX,
                startY: e.clientY,
                initialX: elementData.x,
                initialY: elementData.y,
                initialW: domNode.offsetWidth,
                initialH: domNode.offsetHeight,
                initialRot: elementData.rotation || 0,
                tooltip: tooltipEl
            };
        }

        handleMouseMove(e) {
            if (!this.activeTransform) return;

            const { type, element, node, startX, startY, initialX, initialY, initialW, initialH, tooltip } = this.activeTransform;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (type === 'move') {
                let newX = initialX + dx;
                let newY = initialY + dy;

                // Seamless crossover between left and right pages
                if (element.page === 'left' || element.page === 'right') {
                    const pageWidth = this.leftCanvasEl ? (this.leftCanvasEl.offsetWidth || 440) : 440;
                    if (element.page === 'left' && newX > pageWidth - 20) {
                        element.page = 'right';
                        element.x = newX - pageWidth - 20;
                        if (this.rightCanvasEl && node.parentElement !== this.rightCanvasEl) {
                            this.rightCanvasEl.appendChild(node);
                        }
                        this.activeTransform.initialX = element.x - dx;
                        newX = element.x;
                    } else if (element.page === 'right' && newX < -20) {
                        element.page = 'left';
                        element.x = newX + pageWidth + 20;
                        if (this.leftCanvasEl && node.parentElement !== this.leftCanvasEl) {
                            this.leftCanvasEl.appendChild(node);
                        }
                        this.activeTransform.initialX = element.x - dx;
                        newX = element.x;
                    }
                }

                element.x = newX;
                element.y = newY;
                node.style.left = `${newX}px`;
                node.style.top = `${newY}px`;
            } else if (type.startsWith('resize-')) {
                let newW = initialW;
                let newH = initialH;

                if (type.includes('se') || type.includes('ne')) newW = Math.max(60, initialW + dx);
                if (type.includes('sw') || type.includes('nw')) newW = Math.max(60, initialW - dx);
                if (type.includes('se') || type.includes('sw')) newH = Math.max(40, initialH + dy);
                if (type.includes('ne') || type.includes('nw')) newH = Math.max(40, initialH - dy);

                element.width = newW;
                element.height = newH;
                node.style.width = `${newW}px`;
                node.style.height = `${newH}px`;
            } else if (type === 'rotate') {
                const rect = node.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                let deg = Math.round(rad * (180 / Math.PI)) + 90;

                element.rotation = deg;
                node.style.transform = `rotate(${deg}deg)`;

                if (tooltip) {
                    tooltip.innerText = `${deg}°`;
                    tooltip.classList.add('visible');
                }
            }
        }

        handleMouseUp() {
            if (this.activeTransform) {
                const { element, tooltip } = this.activeTransform;
                if (tooltip) {
                    tooltip.classList.remove('visible');
                }
                if (element) {
                    if (element.page === 'cover') {
                        const coverData = this.storage.getCoverData();
                        const idx = coverData.elements.findIndex(e => e.id === element.id);
                        if (idx !== -1) coverData.elements[idx] = element;
                        else coverData.elements.push(element);
                        this.storage.saveCoverData(coverData);
                    } else {
                        const curDate = this.storage.getCurrentDate();
                        const data = this.storage.getDataForDate(curDate);
                        const idx = data.elements.findIndex(e => e.id === element.id);
                        if (idx !== -1) data.elements[idx] = element;
                        else data.elements.push(element);
                        this.storage.saveDataForDate(curDate, data);
                    }
                }
                this.activeTransform = null;
            }
        }

        getTargetContext(defaultPage = 'right') {
            const isCover = this.isCoverMode;
            const page = isCover ? 'cover' : defaultPage;
            const curDate = this.storage.getCurrentDate();
            const data = isCover ? this.storage.getCoverData() : this.storage.getDataForDate(curDate);
            return { isCover, page, curDate, data };
        }

        saveTargetContext(ctx) {
            if (ctx.isCover) {
                this.storage.saveCoverData(ctx.data);
            } else {
                this.storage.saveDataForDate(ctx.curDate, ctx.data);
            }
        }

        getCalculatedCoordinates(ctx) {
            const elements = ctx.data.elements || [];
            const count = elements.length;
            const cols = 2;
            const colWidth = 175;
            const rowHeight = 160;

            const col = count % cols;
            const row = Math.floor(count / cols) % 3;

            let posX = 30 + col * colWidth + Math.floor(Math.random() * 20);
            let posY = 40 + row * rowHeight + Math.floor(Math.random() * 20);

            let overlaps = true;
            let attempts = 0;
            while (overlaps && attempts < 12) {
                overlaps = elements.some(el => Math.abs(el.x - posX) < 35 && Math.abs(el.y - posY) < 35);
                if (overlaps) {
                    posX += 30;
                    posY += 30;
                    if (posX > 250) posX = 30;
                    if (posY > 380) posY = 40;
                }
                attempts++;
            }

            return { x: posX, y: posY };
        }

        addFreeformText(defaultPage = 'right', color = null, clickX = null, clickY = null) {
            const ctx = this.getTargetContext(defaultPage);
            let coords;
            if (clickX !== null && clickY !== null) {
                coords = { x: clickX, y: clickY };
            } else {
                coords = this.getCalculatedCoordinates(ctx);
            }
            const chosenColor = color || this.activeTextColor || '#3b2518';
            const newEl = {
                id: 'el_text_' + Date.now(),
                type: 'text',
                content: '',
                color: chosenColor,
                x: coords.x,
                y: coords.y,
                width: 220,
                height: 80,
                rotation: 0,
                zIndex: 10 + (ctx.data.elements || []).length,
                page: ctx.page
            };

            if (!ctx.data.elements) ctx.data.elements = [];
            ctx.data.elements.push(newEl);
            this.saveTargetContext(ctx);
            this.renderElementToCanvas(newEl, ctx.data);
            this.selectElement(newEl.id);

            setTimeout(() => {
                const ta = document.querySelector(`[data-id="${newEl.id}"] textarea`);
                if (ta) ta.focus();
            }, 50);
        }

        addStyledStickyNote(style = 'yellow', defaultPage = 'right') {
            const ctx = this.getTargetContext(defaultPage);
            const coords = this.getCalculatedCoordinates(ctx);
            const newEl = {
                id: 'el_sticky_' + Date.now(),
                type: 'sticky',
                style: style,
                content: '',
                x: coords.x,
                y: coords.y,
                width: 210,
                height: 140,
                rotation: 0,
                zIndex: 12 + (ctx.data.elements || []).length,
                page: ctx.page,
                torn: style === 'kraft'
            };

            if (!ctx.data.elements) ctx.data.elements = [];
            ctx.data.elements.push(newEl);
            this.saveTargetContext(ctx);
            sound.playTapeSlap();
            this.renderElementToCanvas(newEl, ctx.data);
            this.selectElement(newEl.id);

            setTimeout(() => {
                const ta = document.querySelector(`[data-id="${newEl.id}"] textarea`);
                if (ta) ta.focus();
            }, 50);
        }

        addPngStickyNote(imgSrc, defaultPage = 'right') {
            const ctx = this.getTargetContext(defaultPage);
            const coords = this.getCalculatedCoordinates(ctx);
            const newEl = {
                id: 'el_png_sticky_' + Date.now(),
                type: 'pngSticky',
                src: imgSrc,
                content: '',
                x: coords.x,
                y: coords.y,
                width: 220,
                height: 190,
                rotation: 0,
                zIndex: 12 + (ctx.data.elements || []).length,
                page: ctx.page
            };

            if (!ctx.data.elements) ctx.data.elements = [];
            ctx.data.elements.push(newEl);
            this.saveTargetContext(ctx);
            sound.playTapeSlap();
            this.renderElementToCanvas(newEl, ctx.data);
            this.selectElement(newEl.id);

            setTimeout(() => {
                const ta = document.querySelector(`[data-id="${newEl.id}"] textarea`);
                if (ta) ta.focus();
            }, 50);
        }

        addPhoto(base64Src, defaultPage = 'left') {
            const ctx = this.getTargetContext(defaultPage);
            const coords = this.getCalculatedCoordinates(ctx);
            const newEl = {
                id: 'el_photo_' + Date.now(),
                type: 'photo',
                src: base64Src,
                x: coords.x,
                y: coords.y,
                width: 180,
                height: 190,
                rotation: 0,
                zIndex: 10 + (ctx.data.elements || []).length,
                page: ctx.page
            };

            if (!ctx.data.elements) ctx.data.elements = [];
            ctx.data.elements.push(newEl);
            this.saveTargetContext(ctx);
            this.renderElementToCanvas(newEl, ctx.data);
            this.selectElement(newEl.id);
        }

        addPastedSticker(base64Src, defaultPage = 'right') {
            const ctx = this.getTargetContext(defaultPage);
            const coords = this.getCalculatedCoordinates(ctx);

            const img = new Image();
            img.onload = () => {
                let w = 210;
                let h = Math.round((img.height / img.width) * 210) || 200;
                if (h > 330) {
                    h = 330;
                    w = Math.round((img.width / img.height) * 330);
                }

                const newEl = {
                    id: 'el_photo_' + Date.now(),
                    type: 'photo',
                    src: base64Src,
                    x: coords.x,
                    y: coords.y,
                    width: w,
                    height: h,
                    rotation: 0,
                    zIndex: 15 + (ctx.data.elements || []).length,
                    page: ctx.page
                };

                if (!ctx.data.elements) ctx.data.elements = [];
                ctx.data.elements.push(newEl);
                this.saveTargetContext(ctx);

                try {
                    if (sound && sound.playTapeSlap) sound.playTapeSlap();
                } catch (err) {}

                this.renderElementToCanvas(newEl, ctx.data);
                this.selectElement(newEl.id);

                if (window.showCozyToast) {
                    window.showCozyToast("Görsel sayfaya yapıştırıldı! 🖼️");
                }
            };
            img.src = base64Src;
        }

        addStickyTaskNote(defaultPage = 'right') {
            const ctx = this.getTargetContext(defaultPage);
            const existingTasks = (ctx.data.elements || []).filter(el => el.type === 'task');
            const usedSlots = new Set(existingTasks.map(t => t.slotIndex));
            let nextSlot = 0;
            while (usedSlots.has(nextSlot) && nextSlot < 36) {
                nextSlot++;
            }

            const taskId = 't_' + Date.now();
            const newEl = {
                id: 'el_task_' + Date.now(),
                type: 'task',
                taskId: taskId,
                title: 'Yeni Görev',
                category: 'routine',
                completed: false,
                slotIndex: nextSlot % 36,
                x: 40 + Math.random() * 30,
                y: 60 + Math.random() * 30,
                width: 220,
                height: 130,
                rotation: 0,
                zIndex: 10 + (ctx.data.elements || []).length,
                page: ctx.page
            };

            if (!ctx.data.elements) ctx.data.elements = [];
            ctx.data.elements.push(newEl);
            this.saveTargetContext(ctx);
            this.renderElementToCanvas(newEl, ctx.data);
            this.selectElement(newEl.id);

            if (this.onTaskAdd && !ctx.isCover) {
                this.onTaskAdd('Yeni Görev', 'routine');
            }
        }

        addWashiTape(pattern = 'polka', defaultPage = 'right') {
            const ctx = this.getTargetContext(defaultPage);
            const newEl = {
                id: 'el_washi_' + Date.now(),
                type: 'washi',
                pattern: pattern,
                x: 60 + Math.random() * 40,
                y: 70 + Math.random() * 40,
                width: 160,
                height: 32,
                rotation: 0,
                zIndex: 15 + (ctx.data.elements || []).length,
                page: ctx.page
            };

            if (!ctx.data.elements) ctx.data.elements = [];
            ctx.data.elements.push(newEl);
            this.saveTargetContext(ctx);
            this.renderElementToCanvas(newEl, ctx.data);
            this.selectElement(newEl.id);
        }

        togglePaperclipOnSelected() {
            if (!this.selectedElementId) return;
            const ctx = this.getTargetContext();
            const targetEl = (ctx.data.elements || []).find(el => el.id === this.selectedElementId);
            if (targetEl) {
                targetEl.hasPaperclip = !targetEl.hasPaperclip;
                this.saveTargetContext(ctx);
                
                const node = document.querySelector(`[data-id="${targetEl.id}"]`);
                if (node) {
                    let clip = node.querySelector('.paperclip-badge');
                    if (targetEl.hasPaperclip && !clip) {
                        clip = document.createElement('div');
                        clip.className = 'paperclip-badge';
                        node.appendChild(clip);
                    } else if (!targetEl.hasPaperclip && clip) {
                        clip.remove();
                    }
                }
            }
        }

        toggleTornEdgeOnSelected() {
            if (!this.selectedElementId) return;
            const ctx = this.getTargetContext();
            const targetEl = (ctx.data.elements || []).find(el => el.id === this.selectedElementId);
            if (targetEl) {
                targetEl.torn = !targetEl.torn;
                this.saveTargetContext(ctx);

                const node = document.querySelector(`[data-id="${targetEl.id}"]`);
                if (node) {
                    if (targetEl.torn) node.classList.add('torn-paper');
                    else node.classList.remove('torn-paper');
                }
            }
        }

        addVintageDateStamp(defaultPage = 'right') {
            const ctx = this.getTargetContext(defaultPage);
            const d = new Date(ctx.curDate + 'T00:00:00');
            const dateStr = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });

            const newEl = {
                id: 'el_datestamp_' + Date.now(),
                type: 'dateStamp',
                dateStr: dateStr,
                x: 40 + Math.random() * 40,
                y: 40 + Math.random() * 40,
                width: 150,
                height: 60,
                rotation: 0,
                zIndex: 12 + (ctx.data.elements || []).length,
                page: ctx.page
            };

            if (!ctx.data.elements) ctx.data.elements = [];
            ctx.data.elements.push(newEl);
            this.saveTargetContext(ctx);
            sound.playStamp();
            this.renderElementToCanvas(newEl, ctx.data);
            this.selectElement(newEl.id);
        }

        addSticker(emoji, defaultPage = 'right') {
            const ctx = this.getTargetContext(defaultPage);
            const newEl = {
                id: 'el_stk_' + Date.now(),
                type: 'sticker',
                emoji: emoji,
                x: 80 + Math.random() * 50,
                y: 100 + Math.random() * 50,
                width: 65,
                height: 65,
                rotation: 0,
                zIndex: 20 + (ctx.data.elements || []).length,
                page: ctx.page
            };

            if (!ctx.data.elements) ctx.data.elements = [];
            ctx.data.elements.push(newEl);
            this.saveTargetContext(ctx);
            this.renderElementToCanvas(newEl, ctx.data);
            this.selectElement(newEl.id);
        }

        addMoodStamp(moodKey, emoji, label, defaultPage = 'left') {
            const ctx = this.getTargetContext(defaultPage);
            ctx.data.mood = moodKey;

            const newEl = {
                id: 'el_stamp_' + Date.now(),
                type: 'stamp',
                moodKey: moodKey,
                emoji: emoji,
                label: label,
                x: 30 + Math.random() * 30,
                y: 30 + Math.random() * 30,
                width: 80,
                height: 80,
                rotation: 0,
                zIndex: 5,
                page: ctx.page
            };

            if (!ctx.data.elements) ctx.data.elements = [];
            ctx.data.elements.push(newEl);
            this.saveTargetContext(ctx);
            this.renderElementToCanvas(newEl, ctx.data);
            this.selectElement(newEl.id);

            if (this.onMoodChange && !ctx.isCover) {
                this.onMoodChange(moodKey);
            }
        }

        deleteElement(elementId) {
            if (!elementId) return;

            // Check cover elements
            const coverData = this.storage.getCoverData();
            if (coverData.elements && coverData.elements.some(el => el.id === elementId)) {
                coverData.elements = coverData.elements.filter(el => el.id !== elementId);
                this.storage.saveCoverData(coverData);
                const node = document.querySelector(`[data-id="${elementId}"]`);
                if (node) node.remove();
                this.selectedElementId = null;
                sound.playTapeSlap();
                return;
            }

            // Check date page elements
            const curDate = this.storage.getCurrentDate();
            const data = this.storage.getDataForDate(curDate);
            if (data.elements) {
                data.elements = data.elements.filter(el => el.id !== elementId);
                this.storage.saveDataForDate(curDate, data);
                const node = document.querySelector(`[data-id="${elementId}"]`);
                if (node) node.remove();
                this.selectedElementId = null;
                sound.playTapeSlap();
                if (this.onDateChange) {
                    this.onDateChange(curDate);
                }
            }
        }

        exportMemoryCard() {
            sound.playPageFlip();
            const bookContainer = document.getElementById('bookContainer');
            if (!bookContainer) return;

            // Generate crisp SVG Image Blob export
            try {
                const htmlStr = `<div xmlns="http://www.w3.org/1999/xhtml" style="width:920px;height:570px;background:#8b5a2b;padding:10px;border-radius:14px;box-sizing:border-box;">${bookContainer.innerHTML}</div>`;
                const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="920" height="570"><foreignObject width="100%" height="100%">${htmlStr}</foreignObject></svg>`;
                const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.download = `cozy_journal_${this.storage.getCurrentDate()}.svg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (e) {
                console.error("Export memory card failed", e);
            }
        }

        initCropModalListeners() {
            const closeBtn = document.getElementById('closeCropModalBtn');
            const rectBtn = document.getElementById('cropModeRectBtn');
            const lassoBtn = document.getElementById('cropModeLassoBtn');
            const resetBtn = document.getElementById('btnResetCrop');
            const applyBtn = document.getElementById('btnApplyCrop');

            if (closeBtn) closeBtn.addEventListener('click', () => this.closeCropModal());

            if (rectBtn) {
                rectBtn.addEventListener('click', () => {
                    this.cropMode = 'rect';
                    rectBtn.classList.add('active');
                    if (lassoBtn) lassoBtn.classList.remove('active');
                    this.renderCropCanvas();
                });
            }

            if (lassoBtn) {
                lassoBtn.addEventListener('click', () => {
                    this.cropMode = 'lasso';
                    lassoBtn.classList.add('active');
                    if (rectBtn) rectBtn.classList.remove('active');
                    this.renderCropCanvas();
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    const canvas = document.getElementById('cropCanvas');
                    if (canvas && this.cropImg) {
                        this.cropRect = {
                            x: Math.round(canvas.width * 0.1),
                            y: Math.round(canvas.height * 0.1),
                            w: Math.round(canvas.width * 0.8),
                            h: Math.round(canvas.height * 0.8)
                        };
                        this.lassoPoints = [];
                        this.renderCropCanvas();
                    }
                });
            }

            if (applyBtn) {
                applyBtn.addEventListener('click', () => this.applyCrop());
            }

            this.initCropCanvasEvents();
        }

        openCropModal(photoEl) {
            this.activeCropElement = photoEl;
            const cropModal = document.getElementById('cropModal');
            const canvas = document.getElementById('cropCanvas');
            if (!cropModal || !canvas) return;

            const setupCropCanvas = () => {
                const imgW = this.cropImg.naturalWidth || 600;
                const imgH = this.cropImg.naturalHeight || 400;
                canvas.width = imgW;
                canvas.height = imgH;

                this.cropMode = 'lasso';
                const lassoBtn = document.getElementById('cropModeLassoBtn');
                const rectBtn = document.getElementById('cropModeRectBtn');
                if (rectBtn) rectBtn.classList.remove('active');
                if (lassoBtn) lassoBtn.classList.add('active');

                this.cropRect = {
                    x: Math.round(imgW * 0.05),
                    y: Math.round(imgH * 0.05),
                    w: Math.round(imgW * 0.9),
                    h: Math.round(imgH * 0.9)
                };
                this.lassoPoints = [];

                cropModal.classList.add('is-open');
                cropModal.style.display = 'flex';
                cropModal.style.opacity = '1';
                cropModal.style.pointerEvents = 'auto';
                cropModal.style.zIndex = '3500';

                this.renderCropCanvas();
            };

            this.cropImg = new Image();
            this.cropImg.crossOrigin = 'Anonymous';
            this.cropImg.onload = setupCropCanvas;
            this.cropImg.src = photoEl.src;
            if (this.cropImg.complete && this.cropImg.naturalWidth > 0) {
                setupCropCanvas();
            }
        }

        closeCropModal() {
            const cropModal = document.getElementById('cropModal');
            if (cropModal) {
                cropModal.classList.remove('is-open');
                cropModal.style.display = 'none';
                cropModal.style.opacity = '0';
                cropModal.style.pointerEvents = 'none';
            }
            this.activeCropElement = null;
            this.cropImg = null;
        }

        renderCropCanvas() {
            const canvas = document.getElementById('cropCanvas');
            if (!canvas || !this.cropImg) return;
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(this.cropImg, 0, 0, w, h);

            if (this.cropMode === 'rect') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
                ctx.fillRect(0, 0, w, h);

                const { x, y, w: rw, h: rh } = this.cropRect;
                if (rw > 0 && rh > 0) {
                    ctx.clearRect(x, y, rw, rh);
                    ctx.drawImage(this.cropImg, x, y, rw, rh, x, y, rw, rh);

                    ctx.strokeStyle = '#d4af37';
                    ctx.lineWidth = Math.max(2, Math.round(w / 200));
                    ctx.setLineDash([8, 8]);
                    ctx.strokeRect(x, y, rw, rh);
                    ctx.setLineDash([]);

                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#3b2518';
                    ctx.lineWidth = 2;
                    const r = Math.max(6, Math.round(w / 80));
                    const corners = [
                        { x: x, y: y },
                        { x: x + rw, y: y },
                        { x: x, y: y + rh },
                        { x: x + rw, y: y + rh }
                    ];
                    corners.forEach(c => {
                        ctx.beginPath();
                        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                    });
                }
            } else if (this.cropMode === 'lasso') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
                ctx.fillRect(0, 0, w, h);

                if (this.lassoPoints.length > 1) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(this.lassoPoints[0].x, this.lassoPoints[0].y);
                    for (let i = 1; i < this.lassoPoints.length; i++) {
                        ctx.lineTo(this.lassoPoints[i].x, this.lassoPoints[i].y);
                    }
                    if (!this.isDrawingLasso) {
                        ctx.closePath();
                    }
                    ctx.clip();
                    ctx.drawImage(this.cropImg, 0, 0, w, h);
                    ctx.restore();

                    ctx.beginPath();
                    ctx.moveTo(this.lassoPoints[0].x, this.lassoPoints[0].y);
                    for (let i = 1; i < this.lassoPoints.length; i++) {
                        ctx.lineTo(this.lassoPoints[i].x, this.lassoPoints[i].y);
                    }
                    if (!this.isDrawingLasso) {
                        ctx.closePath();
                    }
                    ctx.strokeStyle = '#e67e22';
                    ctx.lineWidth = Math.max(3, Math.round(w / 150));
                    ctx.setLineDash([6, 6]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            }
        }

        initCropCanvasEvents() {
            const canvas = document.getElementById('cropCanvas');
            if (!canvas) return;

            const getPos = (e) => {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                return {
                    x: (e.clientX - rect.left) * scaleX,
                    y: (e.clientY - rect.top) * scaleY
                };
            };

            canvas.addEventListener('mousedown', (e) => {
                const pos = getPos(e);
                if (this.cropMode === 'rect') {
                    const { x, y, w, h } = this.cropRect;
                    const threshold = Math.max(30, Math.round(canvas.width / 20));
                    if (Math.hypot(pos.x - x, pos.y - y) < threshold) this.activeRectHandle = 'nw';
                    else if (Math.hypot(pos.x - (x + w), pos.y - y) < threshold) this.activeRectHandle = 'ne';
                    else if (Math.hypot(pos.x - x, pos.y - (y + h)) < threshold) this.activeRectHandle = 'sw';
                    else if (Math.hypot(pos.x - (x + w), pos.y - (y + h)) < threshold) this.activeRectHandle = 'se';
                    else if (pos.x >= x && pos.x <= x + w && pos.y >= y && pos.y <= y + h) {
                        this.activeRectHandle = 'move';
                        this.dragStartPos = pos;
                        this.initialCropRect = { ...this.cropRect };
                    }
                } else if (this.cropMode === 'lasso') {
                    this.isDrawingLasso = true;
                    this.lassoPoints = [pos];
                    this.renderCropCanvas();
                }
            });

            canvas.addEventListener('mousemove', (e) => {
                const pos = getPos(e);
                if (this.cropMode === 'rect' && this.activeRectHandle) {
                    const { x, y, w, h } = this.cropRect;
                    if (this.activeRectHandle === 'se') {
                        this.cropRect.w = Math.max(20, pos.x - x);
                        this.cropRect.h = Math.max(20, pos.y - y);
                    } else if (this.activeRectHandle === 'nw') {
                        const newX = Math.min(x + w - 20, pos.x);
                        const newY = Math.min(y + h - 20, pos.y);
                        this.cropRect.w = (x + w) - newX;
                        this.cropRect.h = (y + h) - newY;
                        this.cropRect.x = newX;
                        this.cropRect.y = newY;
                    } else if (this.activeRectHandle === 'ne') {
                        const newY = Math.min(y + h - 20, pos.y);
                        this.cropRect.w = Math.max(20, pos.x - x);
                        this.cropRect.h = (y + h) - newY;
                        this.cropRect.y = newY;
                    } else if (this.activeRectHandle === 'sw') {
                        const newX = Math.min(x + w - 20, pos.x);
                        this.cropRect.w = (x + w) - newX;
                        this.cropRect.h = Math.max(20, pos.y - y);
                        this.cropRect.x = newX;
                    } else if (this.activeRectHandle === 'move' && this.dragStartPos) {
                        const dx = pos.x - this.dragStartPos.x;
                        const dy = pos.y - this.dragStartPos.y;
                        this.cropRect.x = Math.max(0, Math.min(canvas.width - w, this.initialCropRect.x + dx));
                        this.cropRect.y = Math.max(0, Math.min(canvas.height - h, this.initialCropRect.y + dy));
                    }
                    this.renderCropCanvas();
                } else if (this.cropMode === 'lasso' && this.isDrawingLasso) {
                    this.lassoPoints.push(pos);
                    this.renderCropCanvas();
                }
            });

            window.addEventListener('mouseup', () => {
                if (this.activeRectHandle) {
                    this.activeRectHandle = null;
                }
                if (this.isDrawingLasso) {
                    this.isDrawingLasso = false;
                    this.renderCropCanvas();
                }
            });
        }

        applyCrop() {
            if (!this.activeCropElement || !this.cropImg) return;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (this.cropMode === 'rect') {
                const { x, y, w, h } = this.cropRect;
                const cropW = Math.max(10, Math.round(w));
                const cropH = Math.max(10, Math.round(h));
                canvas.width = cropW;
                canvas.height = cropH;

                ctx.clearRect(0, 0, cropW, cropH);
                ctx.drawImage(this.cropImg, Math.round(x), Math.round(y), cropW, cropH, 0, 0, cropW, cropH);
            } else if (this.cropMode === 'lasso') {
                if (this.lassoPoints.length < 3) {
                    this.closeCropModal();
                    return;
                }

                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                this.lassoPoints.forEach(p => {
                    if (p.x < minX) minX = p.x;
                    if (p.y < minY) minY = p.y;
                    if (p.x > maxX) maxX = p.x;
                    if (p.y > maxY) maxY = p.y;
                });

                const cropW = Math.max(10, Math.round(maxX - minX));
                const cropH = Math.max(10, Math.round(maxY - minY));
                canvas.width = cropW;
                canvas.height = cropH;

                ctx.clearRect(0, 0, cropW, cropH);

                ctx.beginPath();
                ctx.moveTo(this.lassoPoints[0].x - minX, this.lassoPoints[0].y - minY);
                for (let i = 1; i < this.lassoPoints.length; i++) {
                    ctx.lineTo(this.lassoPoints[i].x - minX, this.lassoPoints[i].y - minY);
                }
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(this.cropImg, -minX, -minY);
            }

            let croppedDataUrl;
            try {
                croppedDataUrl = canvas.toDataURL('image/png');
            } catch (err) {
                console.warn("Canvas crop error:", err);
                if (window.showCozyToast) {
                    window.showCozyToast("Görsel korumalı olduğu için kırpılamadı, orijinal hali korundu. 🌸");
                }
                this.closeCropModal();
                return;
            }

            if (!croppedDataUrl || croppedDataUrl === 'data:,' || croppedDataUrl.length < 50) {
                this.closeCropModal();
                return;
            }

            this.activeCropElement.src = croppedDataUrl;

            if (canvas.width > 0 && canvas.height > 0) {
                const curW = this.activeCropElement.width || 180;
                const calcH = Math.round(curW * (canvas.height / canvas.width));
                this.activeCropElement.height = calcH;
            }

            if (this.activeCropElement.page === 'cover') {
                const coverData = this.storage.getCoverData();
                const target = (coverData.elements || []).find(el => el.id === this.activeCropElement.id);
                if (target) {
                    target.src = croppedDataUrl;
                    target.height = this.activeCropElement.height;
                }
                this.storage.saveCoverData(coverData);
                try { sound.playTapeSlap(); } catch(e){}
                this.closeCropModal();
                this.renderCover();
            } else {
                const curDate = this.storage.getCurrentDate();
                const data = this.storage.getDataForDate(curDate);
                const target = (data.elements || []).find(el => el.id === this.activeCropElement.id);
                if (target) {
                    target.src = croppedDataUrl;
                    target.height = this.activeCropElement.height;
                }
                this.storage.saveDataForDate(curDate, data);
                try { sound.playTapeSlap(); } catch(e){}
                this.closeCropModal();
                this.renderCurrentDay();
            }
        }
    }

    // --- 5. DRAWER MANAGER (SIDEBAR CAT ROUTINES & STICKY PALETTE) ---
    class DrawerManager {
        constructor({ storage, journal, sound, timePicker, flowerDrawManager, onTaskToggle }) {
            this.storage = storage;
            this.journal = journal;
            this.sound = sound;
            this.timePicker = timePicker;
            this.flowerDrawManager = flowerDrawManager;
            this.onTaskToggle = onTaskToggle;

            this.drawerEl = document.getElementById('taskDrawer');
            this.floatingTabBtn = document.getElementById('floatingDrawerTab');
            this.toolbarTaskBtn = document.getElementById('btnTask');
            this.closeBtn = document.getElementById('closeDrawerBtn');

            this.routinesPane = document.getElementById('routinesTabPane');
            this.stickiesPane = document.getElementById('stickiesTabPane');
            this.routinesListEl = document.getElementById('catRoutinesList');

            this.activeTab = 'routines';
            this.isOpen = false;

            this.initEventListeners();
        }

        initEventListeners() {
            if (this.floatingTabBtn) {
                this.floatingTabBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggle();
                });
            }
            if (this.toolbarTaskBtn) {
                this.toolbarTaskBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggle();
                });
            }
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.close();
                });
            }

            // Drawer Tab switching
            document.querySelectorAll('.drawer-tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const tabKey = btn.dataset.tab;
                    this.switchTab(tabKey);
                });
            });

            // Sticky note template item clicks
            document.querySelectorAll('.sticky-tpl-item').forEach(tpl => {
                tpl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const style = tpl.dataset.style || 'yellow';
                    if (this.journal) {
                        this.journal.addStyledStickyNote(style);
                    }
                });
            });
        }

        toggle() {
            if (this.isOpen) this.close();
            else this.open();
        }

        open() {
            this.isOpen = true;
            if (this.drawerEl) this.drawerEl.classList.add('is-open');
            const toolbar = document.querySelector('.goodnotes-toolbar');
            if (toolbar) toolbar.classList.add('drawer-open');
            this.renderRoutines();
        }

        close() {
            this.isOpen = false;
            if (this.drawerEl) this.drawerEl.classList.remove('is-open');
            const toolbar = document.querySelector('.goodnotes-toolbar');
            if (toolbar) toolbar.classList.remove('drawer-open');
        }

        switchTab(tabKey) {
            this.activeTab = tabKey;
            document.querySelectorAll('.drawer-tab-btn').forEach(btn => {
                if (btn.dataset.tab === tabKey) btn.classList.add('active');
                else btn.classList.remove('active');
            });

            if (tabKey === 'routines') {
                if (this.routinesPane) this.routinesPane.classList.add('active');
                if (this.stickiesPane) this.stickiesPane.classList.remove('active');
                this.renderRoutines();
            } else {
                if (this.routinesPane) this.routinesPane.classList.remove('active');
                if (this.stickiesPane) this.stickiesPane.classList.add('active');
                this.renderStickyTemplates();
            }
        }

        renderStickyTemplates() {
            const grid = document.getElementById('stickyTemplatesGrid');
            if (!grid) return;
            grid.innerHTML = '';

            const notes = [
                { id: 'note_1', name: 'Vintage Krem', src: 'not kağıtları/1.png' },
                { id: 'note_2', name: 'Mavi Klipsli', src: 'not kağıtları/2.png' },
                { id: 'note_3', name: 'Kırmızı Kurdeleli', src: 'not kağıtları/3.png' },
                { id: 'note_4', name: 'Kırmızı Çerçeveli', src: 'not kağıtları/4.png' },
                { id: 'note_5', name: 'Kahverengi Ayılı', src: 'not kağıtları/5.png' },
                { id: 'note_6', name: 'Kurdeleli Pembe', src: 'not kağıtları/6.png' },
                { id: 'note_7', name: 'Yeşil Desenli', src: 'not kağıtları/7.png' },
                { id: 'note_8', name: 'Sarı Klipsli', src: 'not kağıtları/8.png' },
                { id: 'note_9', name: 'Kırmızı Klipsli', src: 'not kağıtları/9.png' },
                { id: 'note_10', name: 'Pembe Kalpli', src: 'not kağıtları/10.png' }
            ];

            notes.forEach(note => {
                const item = document.createElement('div');
                item.className = 'png-note-tpl-item';
                item.dataset.src = note.src;
                item.innerHTML = `
                    <div class="png-note-preview-wrap">
                        <img src="${note.src}" alt="${note.name}" class="png-note-preview-img" />
                    </div>
                    <div class="png-note-tpl-name">${note.name}</div>
                `;

                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.sound.playTapeSlap();
                    if (this.journal) {
                        this.journal.addPngStickyNote(note.src);
                    }
                });

                grid.appendChild(item);
            });
        }

        getDefaultRoutines() {
            return [
                { id: 'cat_shop', title: 'Alışveriş Kartı', category: 'shopping', completed: false, note: '', imgSrc: 'görev listesi/alışveriş.png' },
                { id: 'cat_cook', title: 'Yemek Kartı', category: 'food', completed: false, note: '', imgSrc: 'görev listesi/yemek.png' },
                { id: 'cat_water', title: 'Su Kartı', category: 'self-care', completed: false, note: '', imgSrc: 'görev listesi/su.png' },
                { id: 'cat_sport', title: 'Spor Kartı', category: 'deep-focus', completed: false, note: '', imgSrc: 'görev listesi/spor.png' },
                { id: 'cat_read', title: 'Kitap Okuma Kartı', category: 'creative', completed: false, note: '', imgSrc: 'görev listesi/kitap.png' },
                { id: 'cat_coffee', title: 'Kahve Molası Kartı', category: 'self-care', completed: false, note: '', imgSrc: 'görev listesi/kahve.png' },
                { id: 'cat_plant', title: 'Bitkileri Sulama Kartı', category: 'work', completed: false, note: '', imgSrc: 'görev listesi/sulama.png' }
            ];
        }

        renderRoutines() {
            if (!this.routinesListEl) return;
            const curDate = this.storage.getCurrentDate();
            const dateData = this.storage.getDataForDate(curDate);

            const defaults = this.getDefaultRoutines();
            if (!Array.isArray(dateData.catRoutines) || dateData.catRoutines.length === 0) {
                dateData.catRoutines = defaults;
                this.storage.saveDataForDate(curDate, dateData);
            } else {
                dateData.catRoutines.forEach(r => {
                    const def = defaults.find(d => d.id === r.id);
                    if (def) {
                        if (!r.imgSrc) r.imgSrc = def.imgSrc;
                        r.category = def.category; // force sync category
                    }
                });
                this.storage.saveDataForDate(curDate, dateData);
            }

            this.routinesListEl.innerHTML = '';

            dateData.catRoutines.forEach(r => {
                const cardNode = document.createElement('div');
                cardNode.className = `routine-card ${r.completed ? 'is-completed' : ''}`;
                cardNode.setAttribute('draggable', 'true');
                cardNode.setAttribute('data-routine-id', r.id);

                cardNode.innerHTML = `
                    <div class="routine-card-canvas-wrap">
                        <button class="routine-card-time-btn" title="Saat Seç" draggable="false">⏰</button>
                        <img src="${r.imgSrc}" alt="${r.title}" class="routine-card-img" draggable="false" />
                        <textarea class="routine-card-note-overlay" placeholder="Notunuzu yazın..." draggable="false">${r.note || ''}</textarea>
                        <button class="routine-check-btn ${r.completed ? 'is-completed' : ''}" title="Tamamla" draggable="false">${r.completed ? '✓' : ''}</button>
                    </div>
                `;

                cardNode.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({
                        id: r.id,
                        title: r.title,
                        imgSrc: r.imgSrc,
                        note: r.note || '', category: r.category || 'routine'
                    }));
                    e.dataTransfer.effectAllowed = 'copyMove';
                    cardNode.classList.add('is-dragging');
                });

                cardNode.addEventListener('dragend', () => {
                    cardNode.classList.remove('is-dragging');
                    document.querySelectorAll('.timeline-slot-row').forEach(row => row.classList.remove('snap-hover'));
                });

                const timeBtn = cardNode.querySelector('.routine-card-time-btn');
                if (timeBtn) {
                    timeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (this.timePicker) this.timePicker.showForCard(r, timeBtn);
                    });
                }

                const checkBtn = cardNode.querySelector('.routine-check-btn');
                checkBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    r.completed = !r.completed;
                    this.storage.saveDataForDate(curDate, dateData);

                    if (r.completed) {
                        this.sound.playBloomSparkle();
                    this.growFlowerOnIsland(category);
                        if (this.flowerDrawManager) {
                            this.flowerDrawManager.openForTask(r);
                        }
                    } else {
                        this.sound.playPencilCheck();
                    }
                    if (this.onTaskToggle) this.onTaskToggle(r.id);
                    this.renderRoutines();
                });

                const noteOverlay = cardNode.querySelector('.routine-card-note-overlay');
                noteOverlay.addEventListener('input', () => {
                    r.note = noteOverlay.value;
                    this.storage.saveDataForDate(curDate, dateData);
                });

                this.routinesListEl.appendChild(cardNode);
            });
        }
    }

    // --- 5.6 ENERGY PROFILE MANAGER (RABBIT ONBOARDING SLIDER - 7 STEPS) ---
    class EnergyProfileManager {
        constructor({ storage, onProfileSaved }) {
            this.storage = storage;
            this.onProfileSaved = onProfileSaved;

            this.modalEl = document.getElementById('energySetupModal');
            this.trackEl = document.getElementById('energySliderTrack');
            this.startBtn = document.getElementById('startCarrotBtn') || document.getElementById('startRabbitBtn');
            this.prevBtn = document.getElementById('epPrevBtn');
            this.nextBtn = document.getElementById('epNextBtn');
            this.finishBtn = document.getElementById('epFinishBtn');
            this.applyBtn = document.getElementById('applyEnergyToScheduleBtn');
            this.dots = document.querySelectorAll('.energy-dot');

            this.currentStep = 0;
            this.totalSteps = 7;

            this.initEvents();
        }

        initEvents() {
            const slide0 = document.querySelector('.energy-slide-step.slide-0');
            if (slide0) {
                slide0.addEventListener('click', () => this.goToStep(1));
            }
            if (this.startBtn) {
                this.startBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.goToStep(1);
                });
            }
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.goToStep(this.currentStep - 1));
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.goToStep(this.currentStep + 1));
            }
            if (this.finishBtn) {
                this.finishBtn.addEventListener('click', () => this.goToStep(6));
            }
            if (this.applyBtn) {
                this.applyBtn.addEventListener('click', () => this.saveProfile());
            }

            this.dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const step = parseInt(dot.getAttribute('data-step'), 10);
                    if (!isNaN(step)) this.goToStep(step);
                });
            });

            // Pill option selection logic
            document.querySelectorAll('.energy-option-group').forEach(group => {
                const buttons = group.querySelectorAll('.energy-pill-btn');
                buttons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        buttons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                    });
                });
            });

            window.openEnergyModal = () => this.open();
            window.closeEnergyModal = () => this.close();
        }

        resetSelections() {
            document.querySelectorAll('#energySliderTrack .energy-pill-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        }

        open() {
            if (this.modalEl) {
                this.modalEl.classList.add('is-open');
                this.resetSelections();
                this.goToStep(0);
            }
        }

        close() {
            if (this.modalEl) {
                this.modalEl.classList.remove('is-open');
                this.goToStep(0);
            }
        }

        areAllQuestionsAnswered() {
            const groups = document.querySelectorAll('#energySliderTrack .energy-option-group');
            for (let g of groups) {
                if (!g.querySelector('.energy-pill-btn.active')) {
                    return false;
                }
            }
            return true;
        }

        getFirstUnansweredStep() {
            const steps = document.querySelectorAll('.energy-slide-step');
            for (let s of steps) {
                const stepNum = parseInt(s.getAttribute('data-step'), 10);
                if (stepNum >= 1 && stepNum <= 5) {
                    const groups = s.querySelectorAll('.energy-option-group');
                    for (let g of groups) {
                        if (!g.querySelector('.energy-pill-btn.active')) {
                            return { step: stepNum, group: g };
                        }
                    }
                }
            }
            return null;
        }

        goToStep(step) {
            // Lock results screen until all questions are answered
            if (step === 6) {
                const unanswered = this.getFirstUnansweredStep();
                if (unanswered) {
                    this.goToStep(unanswered.step);
                    unanswered.group.style.animation = 'none';
                    unanswered.group.offsetHeight;
                    unanswered.group.style.animation = 'pulseError 0.8s ease';
                    alert('Lütfen sonuçları görmeden önce tüm soruları yanıtlayın! ✨');
                    return;
                }
            }

            this.currentStep = Math.max(0, Math.min(6, step));

            if (this.trackEl) {
                const percent = this.currentStep * (100 / 7);
                this.trackEl.style.transform = `translateX(-${percent}%)`;
            }

            const footerEl = this.modalEl?.querySelector('.energy-modal-footer');
            if (footerEl) {
                if (this.currentStep === 0 || this.currentStep === 6) {
                    footerEl.style.display = 'none';
                } else {
                    footerEl.style.display = 'flex';
                }
            }

            this.dots.forEach(dot => {
                const dStep = parseInt(dot.getAttribute('data-step'), 10);
                if (dStep === this.currentStep) dot.classList.add('active');
                else dot.classList.remove('active');
            });

            if (this.prevBtn) {
                this.prevBtn.style.visibility = this.currentStep <= 1 ? 'hidden' : 'visible';
            }

            if (this.nextBtn && this.finishBtn) {
                if (this.currentStep === 5) {
                    this.nextBtn.style.display = 'none';
                    this.finishBtn.style.display = 'inline-block';
                } else if (this.currentStep === 6) {
                    this.nextBtn.style.display = 'none';
                    this.finishBtn.style.display = 'none';
                    this.renderResults();
                } else {
                    this.nextBtn.style.display = 'inline-block';
                    this.finishBtn.style.display = 'none';
                }
            }
        }

        computeProfile() {
            const getVal = (param) => {
                const group = document.querySelector(`.energy-option-group[data-param="${param}"]`);
                const active = group?.querySelector('.energy-pill-btn.active');
                return active?.getAttribute('data-val') || '';
            };

            const weekendDiff = getVal('weekendDiff');
            const brainWake = getVal('brainWake');
            const wakeFeel = getVal('wakeFeel');
            const workTempo = getVal('workTempo');
            const workStyle = getVal('workStyle');
            const distractTime = getVal('distractTime');
            const firstCoffee = getVal('firstCoffee');
            const lunchType = getVal('lunchType');
            const lastCaffeine = getVal('lastCaffeine');
            const dipRange = getVal('dipRange');
            const energyDrain = getVal('energyDrain');
            const secondWind = getVal('secondWind');
            const breakStyle = getVal('breakStyle');
            const burnoutAction = getVal('burnoutAction');

            // 1. ZİRVE ODAK SAATİ (Peak Focus)
            let peakText = "09:30 - 12:30";
            let peakStart = 9.5, peakEnd = 12.5;

            if (brainWake === '15_dk' && wakeFeel === 'fresh') {
                peakText = "08:30 - 11:30";
                peakStart = 8.5; peakEnd = 11.5;
            } else if (brainWake === '1_saat' || weekendDiff === '3_saat') {
                peakText = "11:00 - 14:00";
                peakStart = 11; peakEnd = 14;
            }

            // 2. ÇÖKÜŞ SAATİ (The Dip)
            let dipText = "15:30 - 17:00";
            let dipS = 15.5, dipE = 17;

            if (dipRange === '13:30-15:00') {
                dipText = "13:30 - 15:00";
                dipS = 13.5; dipE = 15;
            } else if (dipRange === '15:00-16:30') {
                dipText = "15:30 - 17:00";
                dipS = 15.5; dipE = 17;
            } else if (dipRange === 'olmaz') {
                dipText = "14:30 - 15:30 (Hafif Rölanti)";
                dipS = 14.5; dipE = 15.5;
            }

            if (lunchType === 'agir') {
                dipText += " ⚠️ Rehavet";
            }

            // 3. İKİNCİ RÜZGAR (Second Wind)
            let windText = "19:00 - 21:00 (Hobi Vakti)";
            let windS = 19, windE = 21;

            if (secondWind === '19:00_canlanirim') {
                windText = "20:30 - 23:00";
                windS = 20.5; windE = 23;
            } else if (secondWind === 'hobi') {
                windText = "19:00 - 21:00 (Hobi Vakti)";
                windS = 19; windE = 21;
            } else if (secondWind === 'pilim_biter') {
                windText = "Dinlenme & Uyku Modu";
                windS = 0; windE = 0;
            }

            // 4. KİŞİSEL TAVSİYE METNİ
            let adviceText = "Günün yüksek temposunda kendine nazik bir mola aralığı ayır, zihnini dinlendir.";

            if (burnoutAction === 'durdur') {
                adviceText = "Çöküş saatinde bildirimleri kapa, 10 dk sessizlikle şarj ol. Ajandan seni nazikçe durduracak.";
            } else if (burnoutAction === '5_dk_adim') {
                adviceText = "Çöküş saatlerinde kendini zorlama, sadece 5 dakikalık minik rutinlerle odağını tazele.";
            } else if (burnoutAction === 'hatirlat') {
                adviceText = "Günün yüksek temposunda kendine nazik bir mola aralığı ayır, zihnini dinlendir.";
            }

            return {
                weekendDiff,
                brainWake,
                wakeFeel,
                workTempo,
                workStyle,
                distractTime,
                firstCoffee,
                lunchType,
                lastCaffeine,
                dipRange,
                energyDrain,
                secondWind,
                breakStyle,
                burnoutAction,
                peakText,
                dipText,
                windText,
                adviceText,
                peakWindow: { start: peakStart, end: peakEnd },
                dipWindow: { start: dipS, end: dipE },
                secondWindWindow: { start: windS, end: windE }
            };
        }

        renderResults() {
            const profile = this.computeProfile();
            const resPeakRange = document.getElementById('resPeakRange');
            const resDipRange = document.getElementById('resDipRange');
            const resWindRange = document.getElementById('resWindRange');
            const resAdviceText = document.getElementById('resAdviceText');

            if (resPeakRange) resPeakRange.textContent = profile.peakText;
            if (resDipRange) resDipRange.textContent = profile.dipText;
            if (resWindRange) resWindRange.textContent = profile.windText;
            if (resAdviceText) resAdviceText.textContent = profile.adviceText;
        }

        saveProfile() {
            const profile = this.computeProfile();
            localStorage.setItem('userEnergyProfile', JSON.stringify(profile));
            this.close();
            if (window.openJournal) window.openJournal();
            if (window.openBookPages) window.openBookPages();

            if (window.cozyApp && window.cozyApp.scheduleManager) {
                window.cozyApp.scheduleManager.applyProfileBands(profile);
            } else if (this.onProfileSaved) {
                this.onProfileSaved(profile);
            }
        }

        getProfile() {
            try {
                const raw = localStorage.getItem('userEnergyProfile');
                if (raw) return JSON.parse(raw);
            } catch (e) {}
            return {
                peakWindow: { start: 9.5, end: 12.5 },
                dipWindow: { start: 15.5, end: 17 },
                secondWindWindow: { start: 19, end: 21 }
            };
        }
    }


    // --- 5.7 SCHEDULE TIMELINE MANAGER (DAILY ENERGY & PLAN CHART) ---
    class ScheduleTimelineManager {
        constructor({ storage, energyProfileManager, flowerDrawManager, sound }) {
            this.storage = storage;
            this.energyProfileManager = energyProfileManager;
            this.flowerDrawManager = flowerDrawManager;
            this.sound = sound;

            this.layerEl = document.getElementById('dailyScheduleLayer');
            this.toggleBtn = document.getElementById('btnToggleSchedule');
            this.contentEl = document.getElementById('scheduleContent');
            this.slotsEl = document.getElementById('scheduleTimelineSlots');
            this.pathEl = document.getElementById('energyCurvePath');

            this.initEvents();
            this.initDropZone();
        }

        initEvents() {
            if (this.toggleBtn && this.contentEl) {
                this.toggleBtn.addEventListener('click', () => {
                    this.contentEl.classList.toggle('collapsed');
                    this.toggleBtn.innerText = this.contentEl.classList.contains('collapsed') ? '▲' : '▼';
                });
            }
        }

        initDropZone() {
            if (!this.contentEl) return;

            this.contentEl.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';

                const slotRows = this.slotsEl ? Array.from(this.slotsEl.querySelectorAll('.timeline-slot-row')) : [];
                let nearestRow = null;
                let minDistance = Infinity;

                slotRows.forEach(row => {
                    const rect = row.getBoundingClientRect();
                    let dist = 0;
                    if (e.clientY < rect.top) dist = rect.top - e.clientY;
                    else if (e.clientY > rect.bottom) dist = e.clientY - rect.bottom;
                    else dist = 0;

                    if (dist < minDistance) {
                        minDistance = dist;
                        nearestRow = row;
                    }
                });

                slotRows.forEach(row => row.classList.remove('snap-hover'));

                if (nearestRow && minDistance <= 30) {
                    if (nearestRow.classList.contains('slot-row-peak')) {
                        this.slotsEl.querySelectorAll('.slot-row-peak').forEach(r => r.classList.add('snap-hover'));
                    } else if (nearestRow.classList.contains('slot-row-dip')) {
                        this.slotsEl.querySelectorAll('.slot-row-dip').forEach(r => r.classList.add('snap-hover'));
                    } else if (nearestRow.classList.contains('slot-row-wind')) {
                        this.slotsEl.querySelectorAll('.slot-row-wind').forEach(r => r.classList.add('snap-hover'));
                    } else {
                        nearestRow.classList.add('snap-hover');
                    }
                }
            });

            this.contentEl.addEventListener('dragleave', (e) => {
                if (!this.contentEl.contains(e.relatedTarget)) {
                    document.querySelectorAll('.timeline-slot-row').forEach(r => r.classList.remove('snap-hover'));
                }
            });

            this.contentEl.addEventListener('drop', (e) => {
                e.preventDefault();
                document.querySelectorAll('.timeline-slot-row').forEach(r => r.classList.remove('snap-hover'));

                let rawData = e.dataTransfer.getData('application/json');
                if (!rawData) rawData = e.dataTransfer.getData('text/plain');
                if (!rawData) return;

                let cardData = null;
                try {
                    cardData = JSON.parse(rawData);
                } catch (err) {
                    return;
                }

                if (!cardData || !cardData.id) return;

                const slotRows = this.slotsEl ? Array.from(this.slotsEl.querySelectorAll('.timeline-slot-row')) : [];
                let targetRow = null;
                let minDistance = Infinity;

                slotRows.forEach(row => {
                    const rect = row.getBoundingClientRect();
                    let dist = 0;
                    if (e.clientY < rect.top) dist = rect.top - e.clientY;
                    else if (e.clientY > rect.bottom) dist = e.clientY - rect.bottom;
                    else dist = 0;

                    if (dist < minDistance) {
                        minDistance = dist;
                        targetRow = row;
                    }
                });

                if (!targetRow || minDistance > 45) return;

                let bandStartRow = targetRow;
                const profile = this.energyProfileManager.getProfile();
                let timeTag = '';

                if (targetRow.classList.contains('slot-row-peak')) {
                    const peakRows = this.slotsEl.querySelectorAll('.slot-row-peak');
                    if (peakRows.length > 0) bandStartRow = peakRows[0];
                    const s = profile.peakWindow.start;
                    const sh = Math.floor(s);
                    const sm = (s % 1 !== 0) ? '30' : '00';
                    timeTag = `${String(sh).padStart(2, '0')}:${sm}`;
                } else if (targetRow.classList.contains('slot-row-dip')) {
                    const dipRows = this.slotsEl.querySelectorAll('.slot-row-dip');
                    if (dipRows.length > 0) bandStartRow = dipRows[0];
                    const s = profile.dipWindow.start;
                    const sh = Math.floor(s);
                    const sm = (s % 1 !== 0) ? '30' : '00';
                    timeTag = `${String(sh).padStart(2, '0')}:${sm}`;
                } else if (targetRow.classList.contains('slot-row-wind')) {
                    const windRows = this.slotsEl.querySelectorAll('.slot-row-wind');
                    if (windRows.length > 0) bandStartRow = windRows[0];
                    const s = profile.secondWindWindow.start;
                    const sh = Math.floor(s);
                    const sm = (s % 1 !== 0) ? '30' : '00';
                    timeTag = `${String(sh).padStart(2, '0')}:${sm}`;
                } else {
                    const h = targetRow.getAttribute('data-hour') || '09';
                    timeTag = `${String(h).padStart(2, '0')}:00`;
                }

                const targetHour = bandStartRow.getAttribute('data-hour');
                const timeKey = `${String(targetHour).padStart(2, '0')}:00`;

                const curDate = this.storage.getCurrentDate();
                const dateData = this.storage.getDataForDate(curDate);
                if (!dateData.scheduledCatRoutines) dateData.scheduledCatRoutines = {};
                if (!dateData.scheduledCatRoutines[timeKey]) dateData.scheduledCatRoutines[timeKey] = [];

                if (!dateData.scheduledCatRoutines[timeKey].some(b => b.id === cardData.id)) {
                    dateData.scheduledCatRoutines[timeKey].push({
                        id: cardData.id,
                        title: cardData.title,
                        imgSrc: cardData.imgSrc, category: cardData.category,
                        timeTag: timeTag,
                        completed: false
                    });
                    this.storage.saveDataForDate(curDate, dateData);
                    try { sound.playTapeSlap(); } catch (err) {}
                    this.renderSchedule();
                }
            });
        }

        applyProfileBands(computedResult) {
            const profile = computedResult || this.energyProfileManager.getProfile();
            this.renderSchedule(profile);

            if (window.showCozyToast) {
                window.showCozyToast("Ajandanız güncellendi! 🌸");
            }
        }

        renderSchedule(overrideProfile) {
            if (!this.slotsEl) return;
            this.slotsEl.innerHTML = '';

            const profile = overrideProfile || this.energyProfileManager.getProfile();
            const curDate = this.storage.getCurrentDate();
            const dateData = this.storage.getDataForDate(curDate);
            const scheduledCatRoutines = dateData.scheduledCatRoutines || {};

            const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            const curvePoints = [];

            hours.forEach((h, idx) => {
                const slotRow = document.createElement('div');
                slotRow.className = 'timeline-slot-row';
                slotRow.setAttribute('data-hour', h);

                const timeStr = `${String(h).padStart(2, '0')}:00`;
                let tagHtml = '';
                let energyVal = 50;

                const inPeak = (h >= Math.floor(profile.peakWindow.start) && h <= Math.floor(profile.peakWindow.end));
                const inDip = (h >= Math.floor(profile.dipWindow.start) && h <= Math.floor(profile.dipWindow.end));
                const inWind = (profile.secondWindWindow.start > 0 && h >= Math.floor(profile.secondWindWindow.start) && h <= Math.floor(profile.secondWindWindow.end));

                if (inPeak) {
                    tagHtml = '<span class="slot-energy-tag tag-peak">⚡ Zirve</span>';
                    slotRow.classList.add('slot-row-peak');
                    energyVal = 88;
                } else if (inDip) {
                    tagHtml = '<span class="slot-energy-tag tag-dip">☕ Mola</span>';
                    slotRow.classList.add('slot-row-dip');
                    energyVal = 22;
                } else if (inWind) {
                    tagHtml = '<span class="slot-energy-tag tag-wind">🌿 2. Rüzgar</span>';
                    slotRow.classList.add('slot-row-wind');
                    energyVal = 72;
                }

                curvePoints.push({ x: idx, y: energyVal });

                const hourKey = `${String(h).padStart(2, '0')}:00`;
                const assignedBadges = scheduledCatRoutines[hourKey] || [];
                let badgesHtml = '';

                assignedBadges.forEach(b => {
                    badgesHtml += `
                        <div class="scheduled-cat-badge ${b.completed ? 'is-completed' : ''} cat-${b.category || 'routine'}" data-id="${b.id}" data-hour-key="${hourKey}" title="${b.title} (Tamamlamak için çift tıkla)">
                            <span class="badge-corner-time">${b.timeTag || hourKey}</span>
                            <img src="${b.imgSrc}" alt="${b.title}" class="cat-ico" />
                            <span class="badge-title-text">${b.title}</span>
                            ${b.completed ? '<span class="badge-check-ico">✓</span>' : ''}
                        </div>
                    `;
                });

                slotRow.innerHTML = `
                    <span class="slot-time-label">${timeStr}</span>
                    ${tagHtml}
                    <div class="slot-task-dropzone">${badgesHtml}</div>
                `;

                this.slotsEl.appendChild(slotRow);
            });

            // Double-click listener on scheduled routine badges
            const badges = this.slotsEl.querySelectorAll('.scheduled-cat-badge');
            badges.forEach(badge => {
                badge.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const currentTitle = badge.querySelector('.badge-title-text')?.textContent || '';
                    const newTitle = prompt('Görevi düzenle:', currentTitle);
                    if (newTitle !== null) {
                        const cardId = badge.getAttribute('data-id');
                        const hourKey = badge.getAttribute('data-hour-key');
                        const curDate = this.storage.getCurrentDate();
                        const dateData = this.storage.getDataForDate(curDate);
                        if (dateData.scheduledCatRoutines && dateData.scheduledCatRoutines[hourKey]) {
                            const item = dateData.scheduledCatRoutines[hourKey].find(b => b.id === cardId);
                            if (item) {
                                item.title = newTitle.trim();
                                this.storage.saveDataForDate(curDate, dateData);
                                this.renderSchedule();
                            }
                        }
                    }
                });
                
                badge.addEventListener('dblclick', (e) => {
                    e.stopPropagation();
                    const cardId = badge.getAttribute('data-id');
                    const hourKey = badge.getAttribute('data-hour-key');
                    const curDate = this.storage.getCurrentDate();
                    const dateData = this.storage.getDataForDate(curDate);

                    let taskObj = null;
                    if (dateData.catRoutines) {
                        taskObj = dateData.catRoutines.find(r => r.id === cardId);
                    }
                    if (!taskObj) {
                        taskObj = { id: cardId, title: badge.querySelector('.badge-title-text')?.textContent || 'Rutin Kartı', completed: false };
                    }

                    taskObj.completed = true;

                                        if (dateData.scheduledCatRoutines && dateData.scheduledCatRoutines[hourKey]) {
                        const item = dateData.scheduledCatRoutines[hourKey].find(b => b.id === cardId);
                        if (item) {
                            item.completed = true;
                            if (window.cozyApp && window.cozyApp.growFlowerOnIsland) {
                                window.cozyApp.growFlowerOnIsland(item.category || 'routine');
                            }
                        }
                    }

                    this.storage.saveDataForDate(curDate, dateData);
                    try { sound.playBloomSparkle(); } catch (err) {}

                    const fdm = (window.cozyApp && window.cozyApp.flowerDrawManager) ? window.cozyApp.flowerDrawManager : this.flowerDrawManager;
                    if (fdm) {
                        fdm.openForTask(taskObj);
                    }

                    this.renderSchedule();
                    if (window.cozyApp && window.cozyApp.routinesDrawer) {
                        window.cozyApp.routinesDrawer.renderRoutines();
                    }
                });
            });

            // Allow DOM layout pass then draw energy curve
            requestAnimationFrame(() => {
                this.drawEnergyCurve(curvePoints);
            });
        }

        drawEnergyCurve(points) {
            const pathEl = document.getElementById('energyCurvePath');
            const dashedPathEl = document.getElementById('energyWaveDashedPath');
            if (!pathEl && !dashedPathEl) return;

            const total = points.length;
            if (total < 2) return;

            const slotRows = this.slotsEl ? this.slotsEl.querySelectorAll('.timeline-slot-row') : [];
            const containerHeight = this.slotsEl ? this.slotsEl.offsetHeight || 500 : 500;

            const coords = points.map((p, i) => {
                let y = (i + 0.5) * (containerHeight / total);
                if (slotRows[i]) {
                    y = slotRows[i].offsetTop + slotRows[i].offsetHeight / 2;
                }
                const x = 14 + ((p.y - 20) / 70) * 28;
                return { x, y };
            });

            let dCurve = `M ${coords[0].x} ${coords[0].y}`;
            for (let i = 0; i < coords.length - 1; i++) {
                const p0 = coords[i];
                const p1 = coords[i + 1];
                const dy = p1.y - p0.y;
                const cp1x = p0.x;
                const cp1y = p0.y + dy * 0.5;
                const cp2x = p1.x;
                const cp2y = p1.y - dy * 0.5;
                dCurve += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
            }

            if (dashedPathEl) {
                dashedPathEl.setAttribute('d', dCurve);
            }

            if (pathEl) {
                const lastY = coords[coords.length - 1].y;
                const firstY = coords[0].y;
                let dFill = dCurve + ` L 0 ${lastY} L 0 ${firstY} Z`;
                pathEl.setAttribute('d', dFill);
            }
        }
    }


    // --- 5.8 CAT ROUTINES TIME PICKER POPOVER ---
    class CatRoutinesTimePicker {
        constructor({ storage, energyProfileManager, scheduleManager }) {
            this.storage = storage;
            this.energyProfileManager = energyProfileManager;
            this.scheduleManager = scheduleManager;

            this.popoverEl = document.getElementById('timePickerPopover');
            this.hourInput = document.getElementById('timePopHour');
            this.minInput = document.getElementById('timePopMin');
            this.assignBtn = document.getElementById('btnAssignCardTime');
            this.closeBtn = document.getElementById('closeTimePopBtn');

            this.activeCardData = null;

            this.initEvents();
        }

        initEvents() {
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.hide());
            }

            document.querySelectorAll('.pop-shortcut-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const preset = btn.getAttribute('data-preset');
                    const profile = this.energyProfileManager.getProfile();
                    if (preset === 'peak') {
                        if (this.hourInput) this.hourInput.value = profile.peakWindow.start;
                    } else if (preset === 'dip') {
                        if (this.hourInput) this.hourInput.value = profile.dipWindow.start;
                    } else if (preset === 'evening') {
                        if (this.hourInput) this.hourInput.value = profile.secondWindWindow.start;
                    }
                });
            });

            if (this.assignBtn) {
                this.assignBtn.addEventListener('click', () => this.assignTimeToCard());
            }
        }

        showForCard(cardData, anchorEl) {
            this.activeCardData = cardData;
            if (!this.popoverEl) return;

            const rect = anchorEl.getBoundingClientRect();
            this.popoverEl.style.top = `${Math.max(10, rect.top - 10)}px`;
            this.popoverEl.style.left = `${Math.max(10, rect.left - 230)}px`;
            this.popoverEl.classList.remove('hidden');
        }

        hide() {
            if (this.popoverEl) this.popoverEl.classList.add('hidden');
            this.activeCardData = null;
        }

        assignTimeToCard() {
            if (!this.activeCardData) return;
            const h = parseInt(this.hourInput?.value || '14', 10);
            const timeKey = `${String(h).padStart(2, '0')}:00`;

            const curDate = this.storage.getCurrentDate();
            const dateData = this.storage.getDataForDate(curDate);
            if (!dateData.scheduledCatRoutines) dateData.scheduledCatRoutines = {};
            if (!dateData.scheduledCatRoutines[timeKey]) dateData.scheduledCatRoutines[timeKey] = [];

            if (!dateData.scheduledCatRoutines[timeKey].some(b => b.id === this.activeCardData.id)) {
                dateData.scheduledCatRoutines[timeKey].push({
                    id: this.activeCardData.id,
                    title: this.activeCardData.title,
                    imgSrc: this.activeCardData.imgSrc, category: this.activeCardData.category
                });
            }

            this.storage.saveDataForDate(curDate, dateData);
            this.hide();
            if (this.scheduleManager) this.scheduleManager.renderSchedule();
        }
    }


    // --- 5.9 FLOWER DRAWING CANVAS REWARD MANAGER ---
    class FlowerDrawManager {
        constructor({ sound, onPlantDrawnFlower }) {
            this.sound = sound;
            this.onPlantDrawnFlower = onPlantDrawnFlower;

            this.modalEl = document.getElementById('flowerDrawModal');
            this.canvasEl = document.getElementById('flowerCanvas');
            this.ctx = this.canvasEl ? this.canvasEl.getContext('2d') : null;

            this.currentColor = '#ff758f';
            this.isDrawing = false;
            this.history = [];
            this.activeTask = null;

            this.initEvents();
        }

        initEvents() {
            window.closeFlowerDrawModal = () => this.close();

            if (!this.canvasEl || !this.ctx) return;

            document.querySelectorAll('.palette-swatch').forEach(swatch => {
                swatch.addEventListener('click', () => {
                    document.querySelectorAll('.palette-swatch').forEach(s => s.classList.remove('active'));
                    swatch.classList.add('active');
                    this.currentColor = swatch.getAttribute('data-color');
                });
            });

            const startDraw = (e) => {
                this.isDrawing = true;
                this.saveHistory();
                const pos = this.getPos(e);
                this.ctx.beginPath();
                this.ctx.moveTo(pos.x, pos.y);
            };

            const draw = (e) => {
                if (!this.isDrawing) return;
                const pos = this.getPos(e);
                this.ctx.strokeStyle = this.currentColor;
                this.ctx.lineWidth = 4;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                this.ctx.lineTo(pos.x, pos.y);
                this.ctx.stroke();
            };

            const stopDraw = () => {
                this.isDrawing = false;
            };

            this.canvasEl.addEventListener('mousedown', startDraw);
            this.canvasEl.addEventListener('mousemove', draw);
            this.canvasEl.addEventListener('mouseup', stopDraw);
            this.canvasEl.addEventListener('mouseleave', stopDraw);

            this.canvasEl.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e.touches[0]); });
            this.canvasEl.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e.touches[0]); });
            this.canvasEl.addEventListener('touchend', stopDraw);

            document.getElementById('btnUndoFlower')?.addEventListener('click', () => this.undo());
            document.getElementById('btnClearFlower')?.addEventListener('click', () => this.clear());
            document.getElementById('btnSkipFlowerDraw')?.addEventListener('click', () => {
                this.close();
                if (this.onPlantDrawnFlower) this.onPlantDrawnFlower(null, this.activeTask);
            });
            document.getElementById('btnPlantDrawnFlower')?.addEventListener('click', () => {
                const dataUrl = this.canvasEl.toDataURL('image/png');
                this.close();
                if (this.onPlantDrawnFlower) this.onPlantDrawnFlower(dataUrl, this.activeTask);
            });
        }

        getPos(e) {
            const rect = this.canvasEl.getBoundingClientRect();
            return {
                x: (e.clientX - rect.left) * (this.canvasEl.width / rect.width),
                y: (e.clientY - rect.top) * (this.canvasEl.height / rect.height)
            };
        }

        saveHistory() {
            if (this.ctx && this.canvasEl) {
                this.history.push(this.ctx.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height));
                if (this.history.length > 20) this.history.shift();
            }
        }

        undo() {
            if (this.history.length > 0 && this.ctx) {
                const last = this.history.pop();
                this.ctx.putImageData(last, 0, 0);
            }
        }

        clear() {
            if (this.ctx && this.canvasEl) {
                this.saveHistory();
                this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
            }
        }

        openForTask(task) {
            this.activeTask = task;
            if (this.modalEl) {
                this.clear();
                this.history = [];
                this.modalEl.classList.add('is-open');
            }
        }

        close() {
            if (this.modalEl) {
                this.modalEl.classList.remove('is-open');
            }
        }
    }

    // --- 5.5 PANDA POMODORO MANAGER ---
    class PandaPomodoroManager {
        constructor({ sound, onCompleteSession }) {
            this.sound = sound;
            this.onCompleteSession = onCompleteSession;

            this.modalEl = document.getElementById('pomodoroModal');
            this.frameImgEl = document.getElementById('pomodoroFrameImg');

            // Overlays & Hotspots
            this.coverHotspotEl = document.getElementById('pomoCoverHotspot');
            this.startTomatoHotspotEl = document.getElementById('pomoStartTomatoHotspot');
            this.tomatoDigitalDisplayEl = document.getElementById('tomatoDigitalDisplay');
            this.tomatoDigitsEl = document.getElementById('tomatoDigits');
            this.setupOverlayEl = document.getElementById('pomoSetupOverlay');
            this.alarmOverlayEl = document.getElementById('pomoAlarmOverlay');
            this.celebrationOverlayEl = document.getElementById('pomoCelebrationOverlay');
            this.finishDayOverlayEl = document.getElementById('pomoFinishDayOverlay');
            this.earlyBreakBtn = document.getElementById('btnEarlyBreak');
            this.startBreakBtn = document.getElementById('btnStartBreak');

            // Inputs
            this.workHoursInput = document.getElementById('pomoWorkHours');
            this.workMinsInput = document.getElementById('pomoWorkMins');
            this.breakMinsInput = document.getElementById('pomoBreakMins');
            this.totalSessionsInput = document.getElementById('pomoTotalSessions');

            // State variables
            this.state = 'cover'; // cover | setup | start | work | break_alarm | break | completed | finish_day
            this.timer = null;
            this.isPaused = false;

            this.workDurationSeconds = 25 * 60;
            this.breakDurationSeconds = 5 * 60;
            this.totalSessions = 4;
            this.currentSession = 1;
            this.remainingSeconds = 0;
            this.currentMode = 'work'; // 'work' | 'break'

            this.initEventListeners();
        }

        initEventListeners() {
            // Step 1: Click Cover (2.png) -> Setup (sari.png)
            if (this.coverHotspotEl) {
                this.coverHotspotEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.goToSetupState();
                });
            }

            // Step 2: Save Setup -> Go to START screen (3.png)
            const btnSaveSetup = document.getElementById('btnSavePomoSetup');
            if (btnSaveSetup) {
                btnSaveSetup.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.saveSetupAndGoToStart();
                });
            }

            // Step 3: Click START Tomato (3.png) -> Start Work Timer (4.png)
            if (this.startTomatoHotspotEl) {
                this.startTomatoHotspotEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.startWorkTimer();
                });
            }

            // Early Break button during work timer (4.png)
            if (this.earlyBreakBtn) {
                this.earlyBreakBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.onWorkTimeFinished();
                });
            }

            // Step 5: Alarm (5.png) -> Start Break Timer (7.png)
            if (this.startBreakBtn) {
                this.startBreakBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.startBreakTimer();
                });
            } else if (this.alarmOverlayEl) {
                this.alarmOverlayEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.startBreakTimer();
                });
            }

            // Step 7: Celebration (8.png) -> Finish Day Screen (9.png)
            if (this.celebrationOverlayEl) {
                this.celebrationOverlayEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.goToFinishDayState();
                });
            }

            // Step 8: Finish Day (9.png) -> Close Modal
            if (this.finishDayOverlayEl) {
                this.finishDayOverlayEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.close();
                    this.goToCoverState();
                });
            }

            // Frame Image click fallback for seamless flow
            if (this.frameImgEl) {
                this.frameImgEl.addEventListener('click', () => {
                    if (this.state === 'cover') {
                        this.goToSetupState();
                    } else if (this.state === 'start') {
                        this.startWorkTimer();
                    } else if (this.state === 'break_alarm') {
                        this.startBreakTimer();
                    } else if (this.state === 'completed') {
                        this.goToFinishDayState();
                    } else if (this.state === 'finish_day') {
                        this.close();
                        this.goToCoverState();
                    }
                });
            }
        }

        open() {
            if (this.modalEl) {
                this.modalEl.classList.add('is-open');
                this.modalEl.style.display = 'flex';
            }
            this.goToCoverState();
        }

        close() {
            this.stopTimer();
            if (this.modalEl) {
                this.modalEl.classList.remove('is-open');
                this.modalEl.style.display = 'none';
            }
        }

        hideAllOverlays() {
            if (this.coverHotspotEl) this.coverHotspotEl.classList.add('hidden');
            if (this.startTomatoHotspotEl) this.startTomatoHotspotEl.classList.add('hidden');
            if (this.tomatoDigitalDisplayEl) this.tomatoDigitalDisplayEl.classList.add('hidden');
            if (this.setupOverlayEl) this.setupOverlayEl.classList.add('hidden');
            if (this.alarmOverlayEl) this.alarmOverlayEl.classList.add('hidden');
            if (this.celebrationOverlayEl) this.celebrationOverlayEl.classList.add('hidden');
            if (this.finishDayOverlayEl) this.finishDayOverlayEl.classList.add('hidden');
            if (this.earlyBreakBtn) this.earlyBreakBtn.classList.add('hidden');
            if (this.startBreakBtn) this.startBreakBtn.classList.add('hidden');
        }

        goToCoverState() {
            this.stopTimer();
            this.state = 'cover';
            this.hideAllOverlays();
            if (this.frameImgEl) this.frameImgEl.src = 'panda pomodoro/2.png';
            if (this.coverHotspotEl) this.coverHotspotEl.classList.remove('hidden');
        }

        goToSetupState() {
            this.state = 'setup';
            this.hideAllOverlays();
            if (this.frameImgEl) this.frameImgEl.src = 'panda pomodoro/sari.png';
            if (this.setupOverlayEl) this.setupOverlayEl.classList.remove('hidden');
        }

        saveSetupAndGoToStart() {
            const hrs = parseInt(this.workHoursInput ? this.workHoursInput.value : 0, 10) || 0;
            const mins = parseInt(this.workMinsInput ? this.workMinsInput.value : 25, 10) || 25;
            const breakMins = parseInt(this.breakMinsInput ? this.breakMinsInput.value : 5, 10) || 5;

            this.workDurationSeconds = Math.max(10, (hrs * 3600) + (mins * 60));
            this.breakDurationSeconds = Math.max(5, breakMins * 60);

            if (this.sound && this.sound.playPageFlip) this.sound.playPageFlip();

            this.goToStartState();
        }

        goToStartState() {
            this.stopTimer();
            this.state = 'start';
            this.hideAllOverlays();
            if (this.frameImgEl) this.frameImgEl.src = 'panda pomodoro/3.png';
            if (this.startTomatoHotspotEl) this.startTomatoHotspotEl.classList.remove('hidden');
        }

        startWorkTimer() {
            this.state = 'alarm_intro';
            this.currentMode = 'work';
            this.remainingSeconds = this.workDurationSeconds;
            this.isPaused = false;
            this.hideAllOverlays();

            // 1. Step: 3.png'deki START'a basılınca 4.png açılır (alarm domatesi görseli)
            if (this.frameImgEl) this.frameImgEl.src = 'panda pomodoro/4.png';
            if (this.tomatoDigitalDisplayEl) {
                this.tomatoDigitalDisplayEl.className = 'pomo-minimal-digits-display';
                this.tomatoDigitalDisplayEl.classList.remove('hidden');
            }
            if (this.startBreakBtn) this.startBreakBtn.classList.remove('hidden');

            if (this.sound && this.sound.playBloomSparkle) this.sound.playBloomSparkle();
                    this.growFlowerOnIsland(category);

            this.runTimer();

            // 2. Step: Basıldıktan 6 saniye sonra OTOMATİK 5.png'ye (çalışan panda) geçer
            if (this.introTimeout) clearTimeout(this.introTimeout);
            this.introTimeout = setTimeout(() => {
                if (this.state === 'alarm_intro') {
                    this.state = 'work';
                    if (this.frameImgEl) this.frameImgEl.src = 'panda pomodoro/5.png';
                    if (this.tomatoDigitalDisplayEl) {
                        this.tomatoDigitalDisplayEl.className = 'pomo-minimal-digits-display floating-bottom';
                    }
                    if (this.startBreakBtn) this.startBreakBtn.classList.remove('hidden');
                }
            }, 6000);
        }

        runTimer() {
            this.stopTimer();
            this.updateDigits();

            this.timer = setInterval(() => {
                if (this.isPaused) return;

                this.remainingSeconds--;
                this.updateDigits();

                if (this.remainingSeconds <= 0) {
                    this.stopTimer();
                    if (this.currentMode === 'work') {
                        this.onWorkTimeFinished();
                    } else {
                        this.onBreakTimeFinished();
                    }
                }
            }, 1000);
        }

        onWorkTimeFinished() {
            this.stopTimer();
            // Çalışma süresi bittiğinde doğrudan 8.png (kutlama) görseline geçer
            this.goToCompletedState();
        }

        startBreakTimer() {
            this.state = 'break';
            this.currentMode = 'break';
            this.remainingSeconds = this.breakDurationSeconds;
            this.isPaused = false;
            this.hideAllOverlays();

            // Mola butonuna basılınca 7.png (mola pandası) açılır
            if (this.frameImgEl) this.frameImgEl.src = 'panda pomodoro/7.png';
            if (this.tomatoDigitalDisplayEl) {
                this.tomatoDigitalDisplayEl.className = 'pomo-minimal-digits-display floating-bottom';
                this.tomatoDigitalDisplayEl.classList.remove('hidden');
            }

            if (this.sound && this.sound.playPageFlip) this.sound.playPageFlip();

            this.runTimer();
        }

        onBreakTimeFinished() {
            this.goToCompletedState();
        }

        goToCompletedState() {
            this.state = 'completed';
            this.hideAllOverlays();

            // Mola bitince 8.png (good job) açılır
            if (this.frameImgEl) this.frameImgEl.src = 'panda pomodoro/8.png';
            if (this.celebrationOverlayEl) this.celebrationOverlayEl.classList.remove('hidden');

            if (this.sound && this.sound.playBloomSparkle) this.sound.playBloomSparkle();
                    this.growFlowerOnIsland(category);

            if (this.onCompleteSession) {
                this.onCompleteSession(this.totalSessions);
            }

            // 5 saniye sonra OTOMATİK 9.png'ye geçer
            if (this.completedTimeout) clearTimeout(this.completedTimeout);
            this.completedTimeout = setTimeout(() => {
                if (this.state === 'completed') {
                    this.goToFinishDayState();
                }
            }, 5000);
        }

        goToFinishDayState() {
            this.state = 'finish_day';
            this.hideAllOverlays();

            // 9.png (today I did my best) açılır
            if (this.frameImgEl) this.frameImgEl.src = 'panda pomodoro/9.png';
            if (this.finishDayOverlayEl) this.finishDayOverlayEl.classList.remove('hidden');

            if (this.sound && this.sound.playPageFlip) this.sound.playPageFlip();

            // 5 saniye sonra OTOMATİK başa döner ve modal kapanır
            if (this.finishDayTimeout) clearTimeout(this.finishDayTimeout);
            this.finishDayTimeout = setTimeout(() => {
                if (this.state === 'finish_day') {
                    this.close();
                    this.goToCoverState();
                }
            }, 5000);
        }

        stopTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            if (this.introTimeout) {
                clearTimeout(this.introTimeout);
                this.introTimeout = null;
            }
            if (this.completedTimeout) {
                clearTimeout(this.completedTimeout);
                this.completedTimeout = null;
            }
            if (this.finishDayTimeout) {
                clearTimeout(this.finishDayTimeout);
                this.finishDayTimeout = null;
            }
        }

        updateDigits() {
            const secs = Math.max(0, this.remainingSeconds);
            const minsNum = Math.floor(secs / 60);
            const secsNum = secs % 60;
            const formatted = `${String(minsNum).padStart(2, '0')}:${String(secsNum).padStart(2, '0')}`;

            if (this.tomatoDigitsEl) this.tomatoDigitsEl.innerText = formatted;
        }
    }

    // --- 5.9 FLOATING ISLAND & FLOWER PLANTING MANAGER ---
    class IslandManager {
        constructor({ storage }) {
            this.storage = storage;
            this.islandEl = document.getElementById('floatingIsland');
            this.flowersContainer = document.getElementById('islandFlowersContainer');

            this.init();
        }

        init() {
            this.renderPlantedFlowers();
        }

        updateIslandState() {
            // Single organic island always unlocked
            this.renderPlantedFlowers();
        }

        plantFlower(customDataUrl, task) {
            const curDate = this.storage.getCurrentDate();
            const dateData = this.storage.getDataForDate(curDate);
            if (!dateData.plantedIslandFlowers) dateData.plantedIslandFlowers = [];

            const coords = this.getRandomCoordForIsland();

            const newFlower = {
                id: 'fl_' + Date.now(),
                imageSrc: customDataUrl || 'assets/flower_pink_blossom.png',
                x: coords.x,
                y: coords.y,
                title: task ? (task.title || 'Görev Çiçeği') : 'Anna Secret Garden Çiçeği',
                createdAt: new Date().toISOString()
            };

            dateData.plantedIslandFlowers.push(newFlower);
            this.storage.saveDataForDate(curDate, dateData);

            this.renderPlantedFlowers();
        }

        getRandomCoordForIsland() {
            // Grass surface on single organic ada.png
            const x = 35 + Math.random() * 30; // 35% to 65%
            const y = 32 + Math.random() * 26; // 32% to 58%

            return { x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) };
        }

        renderPlantedFlowers() {
            if (!this.flowersContainer) return;
            this.flowersContainer.innerHTML = '';

            const curDate = this.storage.getCurrentDate();
            const dateData = this.storage.getDataForDate(curDate);
            const flowers = dateData.plantedIslandFlowers || [];

            flowers.forEach(fl => {
                const img = document.createElement('img');
                img.src = fl.imageSrc;
                img.alt = fl.title;
                img.className = 'planted-island-flower';
                img.style.left = `${fl.x}%`;
                img.style.top = `${fl.y}%`;
                img.title = `${fl.title}`;

                this.flowersContainer.appendChild(img);
            });
        }
    }

    // --- 6. MAIN APP BOOTSTRAPPER ---
    class App {
        constructor() {
            this.storage = storage;
            this.sound = sound;

            this.hudDateText = document.getElementById('hudDateText');
            this.hudWeatherIcon = document.getElementById('hudWeatherIcon');
            this.unreadBadge = document.getElementById('unreadJournalBadge');
            this.weatherOverlay = document.getElementById('weatherOverlay');
            this.plantModal = document.getElementById('plantModal');
            this.ambientAudioBtn = document.getElementById('ambientAudioBtn');

            this.initEnergyProfile();
            this.initSchedule();
            this.initFlowerDraw();
            this.initIsland();
            this.initGarden();
            this.initJournal();
            this.initDrawer();
            this.initPomodoro();
            this.initEventListeners();

            this.renderAll();
        }

        initIsland() {
            this.islandManager = new IslandManager({ storage: this.storage });
        }

        growFlowerOnIsland(category = 'routine') {
            const flowerImages = {
                routine: 'assets/flower_pink_blossom.png',
                work: 'assets/flower_pink_blossom.png',
                'self-care': 'assets/flower_pink_blossom.png',
                'deep-focus': 'assets/flower_pink_blossom.png',
                creative: 'assets/flower_pink_blossom.png',
                shopping: 'assets/flower_pink_blossom.png',
                food: 'assets/flower_pink_blossom.png'
            };
            const imgSrc = flowerImages[category] || 'assets/flower_pink_blossom.png';
            if (this.islandManager) {
                this.islandManager.plantFlower(imgSrc, { title: 'Açan Görev Çiçeği' });
            }
            if (this.sound && this.sound.playBloomSparkle) {
                this.sound.playBloomSparkle();
                    this.growFlowerOnIsland(category);
            }
        }

        initEnergyProfile() {
            this.energyProfileManager = new EnergyProfileManager({
                storage: this.storage,
                onProfileSaved: () => {
                    if (this.scheduleManager) this.scheduleManager.renderSchedule();
                }
            });
        }

        initSchedule() {
            this.scheduleManager = new ScheduleTimelineManager({
                storage: this.storage,
                energyProfileManager: this.energyProfileManager
            });
            this.timePicker = new CatRoutinesTimePicker({
                storage: this.storage,
                energyProfileManager: this.energyProfileManager,
                scheduleManager: this.scheduleManager
            });
        }

        initFlowerDraw() {
            this.flowerDrawManager = new FlowerDrawManager({
                sound: this.sound,
                onPlantDrawnFlower: (dataUrl, task) => {
                    this.handleCustomFlowerPlanted(dataUrl, task);
                }
            });
        }

        handleCustomFlowerPlanted(dataUrl, task) {
            if (this.islandManager) {
                this.islandManager.plantFlower(dataUrl, task);
            }

            const curDate = this.storage.getCurrentDate();
            const dateData = this.storage.getDataForDate(curDate);
            if (!dateData.customFlowers) dateData.customFlowers = [];

            dateData.customFlowers.push({
                id: 'fl_' + Date.now(),
                title: task ? (task.title || 'Görev Çiçeği') : 'El Çizimi Çiçek',
                customImageSrc: dataUrl || 'assets/flower_pink_blossom.png',
                completed: true,
                completedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                slotIndex: Math.floor(Math.random() * 18)
            });

            this.storage.saveDataForDate(curDate, dateData);
            this.renderAll();
        }

        initPomodoro() {
            this.pomodoro = new PandaPomodoroManager({
                sound: this.sound,
                onCompleteSession: (count) => {
                    if (this.sound) this.sound.playBloomSparkle();
                    this.growFlowerOnIsland(category);
                    const curDate = this.storage.getCurrentDate();
                    const data = this.storage.getDataForDate(curDate);
                    const taskId = 'pomo_task_' + Date.now();
                    if (!data.elements) data.elements = [];
                    data.elements.push({
                        id: 'el_pomo_' + Date.now(),
                        type: 'task',
                        taskId: taskId,
                        title: `🍅 Pomodoro Seansı (${count} Seans Tamamlandı)`,
                        category: 'routine',
                        completed: true,
                        slotIndex: Math.floor(Math.random() * 18),
                        x: 50,
                        y: 50,
                        width: 220,
                        height: 130,
                        rotation: 0,
                        zIndex: 10,
                        page: 'right'
                    });
                    this.storage.saveDataForDate(curDate, data);
                    this.renderAll();
                }
            });
        }

        initDrawer() {
            this.drawer = new DrawerManager({
                storage: this.storage,
                journal: this.journal,
                sound: this.sound,
                timePicker: this.timePicker,
                flowerDrawManager: this.flowerDrawManager,
                onTaskToggle: (taskId, category) => {
                    this.renderAll();
                }
            });
        }

        initGarden() {
            const container = document.getElementById('gardenPlotContainer');
            this.garden = new GardenManager(container, () => {
                this.journal.openSpread();
            });
        }

        initJournal() {
            this.journal = new JournalManager({
                storage: this.storage,
                onMoodChange: (newMood) => {
                    this.updateWeatherEffect(newMood);
                    this.renderHUD();
                },
                onTaskToggle: (taskId, category) => {
                    this.sound.playBloomSparkle();
                    this.growFlowerOnIsland(category);
                    this.renderAll();
                },
                onTaskAdd: () => {
                    this.sound.playPlantSeed();
                    this.renderAll();
                },
                onDateChange: (dateStr) => {
                    this.storage.setCurrentDate(dateStr);
                    this.renderAll();
                    if (this.journal.modalEl && (this.journal.modalEl.classList.contains('active') || this.journal.modalEl.classList.contains('is-open'))) {
                        this.journal.renderCurrentDay();
                    }
                }
            });
        }

        initEventListeners() {
            if (this.ambientAudioBtn) {
                this.ambientAudioBtn.addEventListener('click', () => {
                    this.sound.toggleAmbientNature();
                });
            }

            const floatingBtn = document.getElementById('floatingJournalBtn');
            if (floatingBtn) {
                floatingBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.journal.open();
                });
            }

            const plantSeedBtn = document.getElementById('plantSeedBtn');
            if (plantSeedBtn) {
                plantSeedBtn.addEventListener('click', () => {
                    this.openPlantModal();
                });
            }

            const pomodoroHudBtn = document.getElementById('pomodoroHudBtn');
            if (pomodoroHudBtn) {
                pomodoroHudBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openPomodoroModal();
                });
            }

            const closePlantBtn = document.getElementById('closePlantModalBtn');
            if (closePlantBtn) {
                closePlantBtn.addEventListener('click', () => {
                    this.closePlantModal();
                });
            }

            if (this.plantModal) {
                this.plantModal.addEventListener('click', (e) => {
                    if (e.target === this.plantModal) {
                        this.closePlantModal();
                    }
                });
            }

            const plantForm = document.getElementById('plantSeedForm');
            if (plantForm) {
                plantForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const titleInput = document.getElementById('quickTaskTitle');
                    const catInput = document.getElementById('quickTaskCategory');
                    if (titleInput && titleInput.value.trim()) {
                        this.journal.addStickyTaskNote('right');
                        const curDate = this.storage.getCurrentDate();
                        const data = this.storage.getDataForDate(curDate);
                        const lastTask = (data.elements || []).filter(el => el.type === 'task').pop();
                        if (lastTask) {
                            lastTask.title = titleInput.value.trim();
                            lastTask.category = catInput ? catInput.value : 'routine';
                            this.storage.saveDataForDate(curDate, data);
                        }
                        titleInput.value = '';
                        this.closePlantModal();
                        this.renderAll();
                    }
                });
            }
        }

        openPlantModal() {
            this.sound.playPlantSeed();
            if (this.plantModal) {
                this.plantModal.classList.add('is-open');
                this.plantModal.style.display = 'flex';
                this.plantModal.style.opacity = '1';
                this.plantModal.style.pointerEvents = 'auto';
            }
        }

        closePlantModal() {
            if (this.plantModal) {
                this.plantModal.classList.remove('is-open');
                this.plantModal.style.display = 'none';
                this.plantModal.style.opacity = '0';
                this.plantModal.style.pointerEvents = 'none';
            }
        }

        openPomodoroModal() {
            if (this.sound) this.sound.playTapeSlap();
            if (this.pomodoro) {
                this.pomodoro.open();
            } else {
                const modal = document.getElementById('pomodoroModal');
                if (modal) {
                    modal.style.display = 'flex';
                    modal.style.opacity = '1';
                    modal.style.pointerEvents = 'auto';
                    modal.classList.add('is-open');
                }
            }
        }

        closePomodoroModal() {
            if (this.pomodoro) {
                this.pomodoro.close();
            } else {
                const modal = document.getElementById('pomodoroModal');
                if (modal) {
                    modal.style.display = 'none';
                    modal.style.opacity = '0';
                    modal.style.pointerEvents = 'none';
                    modal.classList.remove('is-open');
                }
            }
        }

        renderAll() {
            const curDate = this.storage.getCurrentDate();
            const data = this.storage.getDataForDate(curDate);
            const tasks = this.storage.getTasksForGarden(curDate);

            this.renderHUD();
            this.updateWeatherEffect(data.mood);
            this.garden.renderGarden(tasks);
            if (this.scheduleManager) this.scheduleManager.renderSchedule();
            this.updateUnreadBadge(data);
        }

        renderHUD() {
            const curDate = this.storage.getCurrentDate();
            const data = this.storage.getDataForDate(curDate);

            if (this.hudDateText && curDate) {
                try {
                    const parts = curDate.split('-');
                    if (parts.length === 3) {
                        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                        this.hudDateText.innerText = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
                    } else {
                        this.hudDateText.innerText = curDate;
                    }
                } catch (e) {
                    this.hudDateText.innerText = curDate;
                }
            }

            if (this.hudWeatherIcon) {
                this.hudWeatherIcon.innerText = this.getMoodWeatherEmoji(data.mood);
            }
        }

        updateUnreadBadge(data) {
            if (!this.unreadBadge) return;
            const elementsCount = (data.elements || []).length;
            if (elementsCount === 0) {
                this.unreadBadge.style.display = 'flex';
            } else {
                this.unreadBadge.style.display = 'none';
            }
        }

        getMoodWeatherEmoji(mood) {
            switch (mood) {
                case 'energetic': return '☀️';
                case 'calm': return '🫖';
                case 'focused': return '🌱';
                case 'melancholy': return '🌧️';
                case 'creative': return '🌸';
                default: return '☀️';
            }
        }

        updateWeatherEffect(mood) {
            if (!this.weatherOverlay) return;

            this.weatherOverlay.className = 'weather-overlay';
            this.weatherOverlay.innerHTML = '';

            if (mood === 'melancholy') {
                this.weatherOverlay.classList.add('weather-rain');
                for (let i = 0; i < 45; i++) {
                    const drop = document.createElement('div');
                    drop.className = 'rain-drop';
                    drop.style.left = `${Math.random() * 100}%`;
                    drop.style.animationDuration = `${0.6 + Math.random() * 0.5}s`;
                    drop.style.animationDelay = `${Math.random() * 2}s`;
                    this.weatherOverlay.appendChild(drop);
                }
            } else if (mood === 'energetic') {
                this.weatherOverlay.classList.add('weather-sunbeams');
                for (let i = 0; i < 5; i++) {
                    const beam = document.createElement('div');
                    beam.className = 'sunbeam-ray';
                    beam.style.left = `${10 + i * 20}%`;
                    this.weatherOverlay.appendChild(beam);
                }
            } else if (mood === 'focused') {
                this.weatherOverlay.classList.add('weather-fireflies');
                for (let i = 0; i < 20; i++) {
                    const firefly = document.createElement('div');
                    firefly.className = 'firefly-dot';
                    firefly.style.left = `${Math.random() * 100}%`;
                    firefly.style.top = `${Math.random() * 100}%`;
                    firefly.style.animationDuration = `${2 + Math.random() * 3}s`;
                    firefly.style.animationDelay = `${Math.random() * 2}s`;
                    this.weatherOverlay.appendChild(firefly);
                }
            } else if (mood === 'creative') {
                this.weatherOverlay.classList.add('weather-sunset-glow');
            } else {
                this.weatherOverlay.classList.add('weather-calm-haze');
            }
        }
    }

    function initCoverTitle() {
        const titleInput = document.getElementById('coverTitleInput');
        if (!titleInput) return;
        const savedTitle = localStorage.getItem('cozy_journal_cover_title');
        if (savedTitle !== null) {
            titleInput.value = savedTitle;
        }
        titleInput.addEventListener('input', () => {
            localStorage.setItem('cozy_journal_cover_title', titleInput.value);
        });
        titleInput.addEventListener('click', (e) => e.stopPropagation());
        titleInput.addEventListener('focus', (e) => e.stopPropagation());
    }

    function initApp() {
        if (!window.cozyApp) {
            window.cozyApp = new App();
        }
        initCoverTitle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
