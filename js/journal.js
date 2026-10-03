/**
 * Free-Form Goodnotes Digital Planner Engine
 * Handles free drag & drop, corner scale (.resize-handle), rotation (.rot-handle),
 * popover drawer toggles, and renders elements on #pageLeft and #pageRight blank canvases.
 */

import { sound } from './audio.js';

export class JournalManager {
    constructor({ storage, onMoodChange, onTaskToggle, onTaskAdd, onDateChange }) {
        this.storage = storage;
        this.onMoodChange = onMoodChange;
        this.onTaskToggle = onTaskToggle;
        this.onTaskAdd = onTaskAdd;
        this.onDateChange = onDateChange;

        this.modalEl = document.getElementById('journalModal');
        this.leftCanvasEl = document.getElementById('pageLeft');
        this.rightCanvasEl = document.getElementById('pageRight');
        this.dateTitleEl = document.getElementById('currentDateDisplay');

        this.selectedElementId = null;
        this.activeTransform = null;

        this.initEventListeners();
    }

    initEventListeners() {
        const closeBtn = document.getElementById('btnCloseJournal');
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());

        if (this.modalEl) {
            this.modalEl.addEventListener('click', (e) => {
                if (e.target === this.modalEl) this.close();
            });
        }



        // Floating Toolbar Buttons
        const toolTextBtn = document.getElementById('btnText');
        const toolPhotoBtn = document.getElementById('btnPhoto');
        const toolTaskBtn = document.getElementById('btnTask');
        const toolStickerBtn = document.getElementById('btnSticker');
        const toolPaperBtn = document.getElementById('btnPaper');
        const toolDeleteBtn = document.getElementById('btnDelete');

        const photoInput = document.getElementById('photoInput');
        const stickerMenu = document.getElementById('stickerMenu');
        const paperMenu = document.getElementById('paperMenu');

        if (toolTextBtn) toolTextBtn.addEventListener('click', () => this.addFreeformText('right'));
        if (toolPhotoBtn && photoInput) toolPhotoBtn.addEventListener('click', () => photoInput.click());

        if (photoInput) {
            photoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        this.addPhoto(evt.target.result, 'left');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (toolTaskBtn) toolTaskBtn.addEventListener('click', () => this.addStickyTaskNote('right'));

        // Popover Drawer Toggles
        if (toolStickerBtn && stickerMenu) {
            toolStickerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (paperMenu) paperMenu.classList.add('hidden');
                stickerMenu.classList.toggle('hidden');
            });
        }

        if (toolPaperBtn && paperMenu) {
            toolPaperBtn.addEventListener('click', (e) => {
                e.stopPropagation();
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

        // Drawer Selections (Stickers)
        document.querySelectorAll('.sticker-opt').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const emoji = item.dataset.emoji || item.innerText;
                this.addSticker(emoji, 'right');
                if (stickerMenu) stickerMenu.classList.add('hidden');
            });
        });

        // Drawer Selections (Mood Stamps)
        document.querySelectorAll('.stamp-opt').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                sound.playStamp();
                this.addMoodStamp(item.dataset.mood, item.dataset.emoji, item.dataset.label, 'left');
                if (stickerMenu) stickerMenu.classList.add('hidden');
            });
        });

        // Paper Template Selection
        document.querySelectorAll('.paper-opt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setPaperTemplate(btn.dataset.type);
                if (paperMenu) paperMenu.classList.add('hidden');
            });
        });

        // Mouse Drag / Pointer Handlers
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', () => this.handleMouseUp());

        // Close drawers & deselect elements on outside click
        document.addEventListener('click', (e) => {
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

    open() {
        try {
            sound.playPageFlip();
        } catch (e) {
            console.warn("Sound play failed", e);
        }

        if (this.modalEl) {
            this.modalEl.classList.add('active');
            this.modalEl.classList.add('is-open');
            this.modalEl.style.display = 'flex';
            this.modalEl.style.opacity = '1';
            this.modalEl.style.pointerEvents = 'auto';
        }

        try {
            this.renderCurrentDay();
        } catch (e) {
            console.error("Error rendering journal day:", e);
        }
    }

    close() {
        if (this.modalEl) {
            this.modalEl.classList.remove('active');
            this.modalEl.classList.remove('is-open');
            this.modalEl.style.display = 'none';
            this.modalEl.style.opacity = '0';
            this.modalEl.style.pointerEvents = 'none';
        }
    }

    navigateDay(offsetDays) {
        try {
            sound.playPageFlip();
        } catch (e) {}

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

        this.onDateChange(newDateStr);
    }

    renderCurrentDay() {
        const currentDateStr = this.storage.getCurrentDate();
        const data = this.storage.getDataForDate(currentDateStr);

        if (this.dateTitleEl && currentDateStr) {
            try {
                const parts = currentDateStr.split('-');
                if (parts.length === 3) {
                    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    this.dateTitleEl.innerText = d.toLocaleDateString('tr-TR', options);
                } else {
                    this.dateTitleEl.innerText = currentDateStr;
                }
            } catch (e) {
                this.dateTitleEl.innerText = currentDateStr;
            }
        }

        this.applyPaperTemplate(data.paperTemplate || 'dotted');

        if (this.leftCanvasEl) this.leftCanvasEl.innerHTML = '';
        if (this.rightCanvasEl) this.rightCanvasEl.innerHTML = '';

        (data.elements || []).forEach(el => {
            this.renderElementToCanvas(el, data);
        });
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
        const curDate = this.storage.getCurrentDate();
        const data = this.storage.getDataForDate(curDate);
        data.paperTemplate = templateName;
        this.storage.saveDataForDate(curDate, data);
        this.applyPaperTemplate(templateName);
    }

    renderElementToCanvas(el, data) {
        const targetPageEl = el.page === 'left' ? this.leftCanvasEl : this.rightCanvasEl;
        if (!targetPageEl) return;

        const node = document.createElement('div');
        node.className = `scrapbook-canvas-item item-type-${el.type} ${this.selectedElementId === el.id ? 'is-selected' : ''}`;
        node.dataset.id = el.id;
        node.style.left = `${el.x}px`;
        node.style.top = `${el.y}px`;
        node.style.width = `${el.width || 180}px`;
        node.style.height = `${el.height || 'auto'}px`;
        node.style.transform = `rotate(${el.rotation || 0}deg)`;
        node.style.zIndex = el.zIndex || 10;

        node.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle') || 
                e.target.classList.contains('rot-handle') || 
                e.target.classList.contains('delete-handle') || 
                e.target.tagName === 'INPUT' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.tagName === 'SELECT') {
                return;
            }
            e.stopPropagation();
            this.selectElement(el.id);
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

        const rotH = document.createElement('div');
        rotH.className = 'rot-handle';
        rotH.innerHTML = '🔄';
        rotH.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.startTransform('rotate', e, el, node);
        });
        handlesContainer.appendChild(rotH);

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
            contentBox.innerHTML = `
                <textarea class="canvas-handwriting-text" placeholder="Yazmaya başlayın...">${el.content || ''}</textarea>
            `;
            const ta = contentBox.querySelector('textarea');
            ta.addEventListener('input', () => {
                el.content = ta.value;
                this.storage.saveDataForDate(data.date, data);
            });
        } else if (el.type === 'photo') {
            contentBox.innerHTML = `
                <div class="raw-photo-card">
                    <img src="${el.src}" alt="Anı Fotoğrafı" />
                </div>
            `;
        } else if (el.type === 'task') {
            contentBox.innerHTML = `
                <div class="sticky-note-card ${el.completed ? 'is-completed' : ''}">
                    <div class="sticky-pin">📍</div>
                    <label class="sticky-checkbox-label">
                        <input type="checkbox" class="sticky-task-cb" ${el.completed ? 'checked' : ''} />
                        <span class="sticky-custom-cb"></span>
                    </label>
                    <input type="text" class="sticky-title-input" value="${el.title || ''}" placeholder="Görev başlığı..." />
                    <select class="sticky-category-select">
                        <option value="routine" ${el.category === 'routine' ? 'selected' : ''}>🌼 Rutin (Papatya)</option>
                        <option value="work" ${el.category === 'work' ? 'selected' : ''}>🌻 İş/Ders (Ayçiçeği)</option>
                        <option value="self-care" ${el.category === 'self-care' ? 'selected' : ''}>🪻 Kişisel Bakım (Lavanta)</option>
                        <option value="deep-focus" ${el.category === 'deep-focus' ? 'selected' : ''}>🌺 Odak (Gelincik)</option>
                        <option value="creative" ${el.category === 'creative' ? 'selected' : ''}>🌸 Yaratıcı (Pembe Çiçek)</option>
                    </select>
                </div>
            `;

            const cb = contentBox.querySelector('.sticky-task-cb');
            cb.addEventListener('change', () => {
                sound.playPencilCheck();
                el.completed = cb.checked;
                this.storage.saveDataForDate(data.date, data);
                if (this.onTaskToggle) {
                    this.onTaskToggle(el.taskId || el.id);
                }
            });

            const titleInput = contentBox.querySelector('.sticky-title-input');
            titleInput.addEventListener('input', () => {
                el.title = titleInput.value;
                this.storage.saveDataForDate(data.date, data);
            });

            const catSelect = contentBox.querySelector('.sticky-category-select');
            catSelect.addEventListener('change', () => {
                el.category = catSelect.value;
                this.storage.saveDataForDate(data.date, data);
                if (this.onTaskAdd) {
                    this.onDateChange(data.date);
                }
            });
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
        }

        node.appendChild(contentBox);
        targetPageEl.appendChild(node);
    }

    selectElement(id) {
        this.selectedElementId = id;
        document.querySelectorAll('.scrapbook-canvas-item').forEach(n => {
            if (n.dataset.id === id) {
                n.classList.add('is-selected');
            } else {
                n.classList.remove('is-selected');
            }
        });
    }

    deselectAll() {
        this.selectedElementId = null;
        document.querySelectorAll('.scrapbook-canvas-item').forEach(n => n.classList.remove('is-selected'));
    }

    startTransform(type, e, elementData, domNode) {
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
            initialRot: elementData.rotation || 0
        };
    }

    handleMouseMove(e) {
        if (!this.activeTransform) return;

        const { type, element, node, startX, startY, initialX, initialY, initialW, initialH } = this.activeTransform;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (type === 'move') {
            const pageEl = node.parentElement;
            const pageRect = pageEl.getBoundingClientRect();

            let newX = initialX + dx;
            let newY = initialY + dy;

            newX = Math.max(0, Math.min(newX, pageRect.width - 40));
            newY = Math.max(0, Math.min(newY, pageRect.height - 40));

            element.x = newX;
            element.y = newY;
            node.style.left = `${newX}px`;
            node.style.top = `${newY}px`;
        } else if (type.startsWith('resize-')) {
            let newW = initialW;
            let newH = initialH;

            if (type.includes('se') || type.includes('ne')) newW = Math.max(80, initialW + dx);
            if (type.includes('sw') || type.includes('nw')) newW = Math.max(80, initialW - dx);
            if (type.includes('se') || type.includes('sw')) newH = Math.max(50, initialH + dy);
            if (type.includes('ne') || type.includes('nw')) newH = Math.max(50, initialH - dy);

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
        }
    }

    handleMouseUp() {
        if (this.activeTransform) {
            const curDate = this.storage.getCurrentDate();
            const data = this.storage.getDataForDate(curDate);
            this.storage.saveDataForDate(curDate, data);
            this.activeTransform = null;
        }
    }

    addFreeformText(page = 'right') {
        const curDate = this.storage.getCurrentDate();
        const data = this.storage.getDataForDate(curDate);

        const newEl = {
            id: 'el_text_' + Date.now(),
            type: 'text',
            content: '',
            x: 50 + Math.random() * 30,
            y: 60 + Math.random() * 30,
            width: 220,
            height: 90,
            rotation: Math.round(Math.random() * 6 - 3),
            zIndex: 10 + (data.elements || []).length,
            page: page
        };

        if (!data.elements) data.elements = [];
        data.elements.push(newEl);
        this.storage.saveDataForDate(curDate, data);
        this.selectElement(newEl.id);
        this.renderCurrentDay();
    }

    addPhoto(base64Src, page = 'left') {
        const curDate = this.storage.getCurrentDate();
        const data = this.storage.getDataForDate(curDate);

        const newEl = {
            id: 'el_photo_' + Date.now(),
            type: 'photo',
            src: base64Src,
            x: 40 + Math.random() * 30,
            y: 50 + Math.random() * 30,
            width: 170,
            height: 180,
            rotation: Math.round(Math.random() * 10 - 5),
            zIndex: 10 + (data.elements || []).length,
            page: page
        };

        if (!data.elements) data.elements = [];
        data.elements.push(newEl);
        this.storage.saveDataForDate(curDate, data);
        this.selectElement(newEl.id);
        this.renderCurrentDay();
    }

    addPastedSticker(base64Src, page = 'left') {
        const curDate = this.storage.getCurrentDate();
        const data = this.storage.getDataForDate(curDate);

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
                x: 40 + Math.random() * 30,
                y: 50 + Math.random() * 30,
                width: w,
                height: h,
                rotation: Math.round(Math.random() * 8 - 4),
                zIndex: 15 + (data.elements || []).length,
                page: page
            };

            if (!data.elements) data.elements = [];
            data.elements.push(newEl);
            this.storage.saveDataForDate(curDate, data);
            try {
                if (sound && sound.playTapeSlap) sound.playTapeSlap();
            } catch (err) {}
            this.selectElement(newEl.id);
            this.renderCurrentDay();

            if (window.showCozyToast) {
                window.showCozyToast("Görsel sayfaya yapıştırıldı! 🖼️");
            }
        };
        img.src = base64Src;
    }

    addStickyTaskNote(page = 'right') {
        const curDate = this.storage.getCurrentDate();
        const data = this.storage.getDataForDate(curDate);

        const existingTasks = (data.elements || []).filter(el => el.type === 'task');
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
            rotation: Math.round(Math.random() * 6 - 3),
            zIndex: 10 + (data.elements || []).length,
            page: page
        };

        if (!data.elements) data.elements = [];
        data.elements.push(newEl);
        this.storage.saveDataForDate(curDate, data);
        this.selectElement(newEl.id);
        this.renderCurrentDay();

        if (this.onTaskAdd) {
            this.onTaskAdd('Yeni Görev', 'routine');
        }
    }

    addSticker(emoji, page = 'right') {
        const curDate = this.storage.getCurrentDate();
        const data = this.storage.getDataForDate(curDate);

        const newEl = {
            id: 'el_stk_' + Date.now(),
            type: 'sticker',
            emoji: emoji,
            x: 80 + Math.random() * 50,
            y: 100 + Math.random() * 50,
            width: 65,
            height: 65,
            rotation: Math.round(Math.random() * 30 - 15),
            zIndex: 20 + (data.elements || []).length,
            page: page
        };

        if (!data.elements) data.elements = [];
        data.elements.push(newEl);
        this.storage.saveDataForDate(curDate, data);
        this.selectElement(newEl.id);
        this.renderCurrentDay();
    }

    addMoodStamp(moodKey, emoji, label, page = 'left') {
        const curDate = this.storage.getCurrentDate();
        const data = this.storage.getDataForDate(curDate);

        data.mood = moodKey;

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
            rotation: Math.round(Math.random() * 10 - 5),
            zIndex: 5,
            page: page
        };

        if (!data.elements) data.elements = [];
        data.elements.push(newEl);
        this.storage.saveDataForDate(curDate, data);
        this.selectElement(newEl.id);
        this.renderCurrentDay();

        if (this.onMoodChange) {
            this.onMoodChange(moodKey);
        }
    }

    deleteElement(elementId) {
        const curDate = this.storage.getCurrentDate();
        const data = this.storage.getDataForDate(curDate);

        if (data.elements) {
            data.elements = data.elements.filter(el => el.id !== elementId);
            this.storage.saveDataForDate(curDate, data);
            this.selectedElementId = null;
            this.renderCurrentDay();
            if (this.onDateChange) {
                this.onDateChange(curDate);
            }
        }
    }
}
