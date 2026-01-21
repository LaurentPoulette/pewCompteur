import { Store } from './store.js';
import { Router } from './router.js';
import { HomeView, PlayerSelectView, PlayerOrderView, ActiveGameView, GameFormView, PlayerFormView, AvatarSelectionView, ConfirmDeletePlayerView, CircleFormView, GameSetupView, AddIngamePlayerView, RemoveIngamePlayerView, ReorderIngamePlayersView, ConfirmRemoveIngamePlayerView, ConfirmEndGameView, AboutView, StatisticsView, ConfirmDeleteGameView, ConfirmCancelGameView, GameOverView, UpdateLimitsView, ExportGamesView, ImportGamesView } from './views.js';

class App {
    constructor() {
        this.store = new Store();
        this.router = new Router(document.getElementById('app'));

        this.selectedPlayers = [];
        
        // Restaurer les filtres sauvegardés
        this.selectedCircleFilter = this.store.state.playerCircleFilter || 'all';
        this.homeFilterFavorites = this.store.state.homeFilterFavorites || false;

        // Initialize persistent selection from store immediately
        if (this.store.state.lastSelectedPlayers && Array.isArray(this.store.state.lastSelectedPlayers)) {
            const allIds = new Set(this.store.getPlayers().map(p => p.id));
            this.store.state.lastSelectedPlayers.forEach(pid => {
                if (allIds.has(pid)) this.selectedPlayers.push(pid);
            });
        }

        this.init();
    }

    init() {
        // Register Routes
        this.router.register('home', () => HomeView(this.store, this.homeFilterFavorites));
        this.router.register('playerSelect', ({ gameId }) => {
            // Filtrer les joueurs sélectionnés selon le filtre de cercle actif
            if (this.selectedCircleFilter !== 'all') {
                const allPlayers = this.store.getPlayers();
                this.selectedPlayers = this.selectedPlayers.filter(playerId => {
                    const player = allPlayers.find(p => p.id === playerId);
                    return player && player.circles && player.circles.includes(this.selectedCircleFilter);
                });
                // Sauvegarder la sélection filtrée
                this.store.state.lastSelectedPlayers = [...this.selectedPlayers];
                this.store.save();
            }
            return PlayerSelectView(this.store, gameId);
        });
        this.router.register('playerOrder', ({ gameId }) => PlayerOrderView(this.store, gameId));
        this.router.register('game', () => ActiveGameView(this.store));
        this.router.register('createGame', () => GameFormView(this.store));
        this.router.register('createPlayer', () => {
            // Initialiser tempAvatarSelection seulement si vide (première visite)
            if (!this.store.state.tempAvatarSelection) {
                this.store.state.tempAvatarSelection = {
                    name: '',
                    avatar: '👤',
                    photo: '',
                    circles: []
                };
            }
            return PlayerFormView(this.store);
        });
        this.router.register('editPlayer', ({ playerId }) => {
            // Initialiser tempAvatarSelection avec les données du joueur seulement si vide
            if (!this.store.state.tempAvatarSelection) {
                const player = this.store.getPlayers().find(p => p.id === playerId);
                if (player) {
                    this.store.state.tempAvatarSelection = {
                        name: player.name,
                        avatar: player.avatar,
                        photo: player.photo || '',
                        circles: [...(player.circles || [])]
                    };
                }
            }
            return PlayerFormView(this.store, playerId);
        });
        this.router.register('avatarSelection', () => AvatarSelectionView(this.store));
        this.router.register('confirmDeletePlayer', ({ playerId }) => ConfirmDeletePlayerView(this.store, playerId));
        this.router.register('createCircle', ({ returnPlayerId }) => CircleFormView(this.store, null, returnPlayerId));
        this.router.register('editCircle', ({ circleId, returnPlayerId }) => CircleFormView(this.store, circleId, returnPlayerId));
        this.router.register('gameSetup', ({ gameId }) => GameSetupView(this.store, gameId));
        this.router.register('addIngamePlayer', () => AddIngamePlayerView(this.store));
        this.router.register('removeIngamePlayer', () => RemoveIngamePlayerView(this.store));
        this.router.register('reorderPlayers', () => ReorderIngamePlayersView(this.store));
        this.router.register('confirmRemoveIngamePlayer', ({ playerId }) => ConfirmRemoveIngamePlayerView(this.store, playerId));
        this.router.register('confirmEndGame', () => ConfirmEndGameView(this.store));
        this.router.register('confirmCancelGame', () => ConfirmCancelGameView(this.store));
        this.router.register('gameOver', () => GameOverView(this.store));
        this.router.register('about', () => AboutView());
        this.router.register('statistics', () => StatisticsView(this.store));
        this.router.register('editGame', ({ gameId }) => GameFormView(this.store, gameId));
        this.router.register('confirmDeleteGame', ({ gameId }) => ConfirmDeleteGameView(this.store, gameId));
        this.router.register('updateLimits', () => UpdateLimitsView(this.store));
        this.router.register('exportGames', () => ExportGamesView(this.store));
        this.router.register('importGames', () => ImportGamesView(this.store));
        // History is now part of Statistics


        // Restore state or go home
        const session = this.store.restoreSession();
        if (session) {
            this.router.navigate('game', {}, 'active');
        } else {
            this.router.navigate('home', {}, 'active');
        }

        // Global exposing for inline onclicks (simple implementation)
        window.app = this;

        this.initCropper();
    }

    initLongPress() {
        // Don't initialize long press if we're in a drag-and-drop context
        if (document.querySelector('.draggable-item')) {
            return; // Skip long press if there are draggable items on the page
        }

        // Long press for game cards
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            let longPressTimer = null;
            let longPressTriggered = false;
            let startPos = { x: 0, y: 0 };

            const startLongPress = (e) => {
                longPressTriggered = false;
                startPos = { x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY };
                longPressTimer = setTimeout(() => {
                    longPressTriggered = true;
                    const gameId = card.dataset.gameId;
                    if (gameId) {
                        this.editGame(gameId);
                    }
                }, 500); // 500ms for long press
            };

            const cancelLongPress = (e) => {
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
                // Reset flag after a short delay to allow click to be prevented
                setTimeout(() => { longPressTriggered = false; }, 100);
            };

            const checkMove = (e) => {
                const currentPos = { x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY };
                const distance = Math.sqrt(Math.pow(currentPos.x - startPos.x, 2) + Math.pow(currentPos.y - startPos.y, 2));
                if (distance > 10) { // If moved more than 10px, cancel
                    if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    }
                }
            };

            // Remove existing onclick to avoid conflicts
            const onclickAttr = card.getAttribute('onclick');
            if (onclickAttr) {
                card.removeAttribute('onclick');
                card.addEventListener('click', (e) => {
                    if (!longPressTriggered) {
                        // Execute the original onclick
                        const gameId = card.dataset.gameId;
                        if (gameId) {
                            this.selectGame(gameId);
                        }
                    } else {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }

            card.addEventListener('touchstart', startLongPress, { passive: true });
            card.addEventListener('touchend', cancelLongPress);
            card.addEventListener('touchmove', checkMove);
            card.addEventListener('mousedown', startLongPress);
            card.addEventListener('mouseup', cancelLongPress);
            card.addEventListener('mousemove', checkMove);
        });

        // Long press for player cards
        const playerCards = document.querySelectorAll('.player-card[data-player-id]');
        playerCards.forEach(card => {
            let longPressTimer = null;
            let longPressTriggered = false;
            let startPos = { x: 0, y: 0 };

            const startLongPress = (e) => {
                longPressTriggered = false;
                startPos = { x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY };
                longPressTimer = setTimeout(() => {
                    longPressTriggered = true;
                    const playerId = card.dataset.playerId;
                    if (playerId) {
                        this.editPlayer(playerId);
                    }
                }, 500); // 500ms for long press
            };

            const cancelLongPress = (e) => {
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
                // Reset flag after a short delay to allow click to be prevented
                setTimeout(() => { longPressTriggered = false; }, 100);
            };

            const checkMove = (e) => {
                const currentPos = { x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY };
                const distance = Math.sqrt(Math.pow(currentPos.x - startPos.x, 2) + Math.pow(currentPos.y - startPos.y, 2));
                if (distance > 10) { // If moved more than 10px, cancel
                    if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    }
                }
            };

            // Remove existing onclick to avoid conflicts
            const onclickAttr = card.getAttribute('onclick');
            if (onclickAttr) {
                card.removeAttribute('onclick');
                card.addEventListener('click', (e) => {
                    if (!longPressTriggered) {
                        // Execute the original onclick: toggle selection
                        card.classList.toggle('selected');
                        const playerId = card.dataset.playerId;
                        if (playerId) {
                            this.togglePlayer(playerId);
                        }
                    } else {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }

            card.addEventListener('touchstart', startLongPress, { passive: true });
            card.addEventListener('touchend', cancelLongPress);
            card.addEventListener('touchmove', checkMove);
            card.addEventListener('mousedown', startLongPress);
            card.addEventListener('mouseup', cancelLongPress);
            card.addEventListener('mousemove', checkMove);
        });
    }

    initCropper() {
        const modalHtml = `
            <div id="cropper-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:2000; flex-direction:column; align-items:center; justify-content:center;">
                <h3 style="color:white; margin-bottom:10px;">Ajuster la photo</h3>
                
                <div id="crop-container" style="width:250px; height:250px; border:2px solid white; overflow:hidden; position:relative; background:#000;">
                    <img id="crop-image" style="position:absolute; top:0; left:0; transform-origin: top left; pointer-events:none;">
                    <!-- Overlay for touch events to avoid dragging image directly which can be tricky -->
                    <div id="crop-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; cursor:move;"></div>
                </div>
                
                <div style="margin-top:20px; width:250px;">
                    <label style="color:white;">Zoom</label>
                    <input type="range" id="crop-zoom" min="0.5" max="3" step="0.1" value="1" style="width:100%;">
                </div>
                
                <div style="margin-top:20px; display:flex; gap:20px;">
                    <button onclick="window.app.closeCropper()" style="padding:10px 20px; background:#eee; border:none; border-radius:5px;">Annuler</button>
                    <button onclick="window.app.confirmCrop()" style="padding:10px 20px; background:var(--primary-color); color:white; border:none; border-radius:5px;">Valider</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        this.cropper = {
            modal: document.getElementById('cropper-modal'),
            img: document.getElementById('crop-image'),
            overlay: document.getElementById('crop-overlay'),
            zoom: document.getElementById('crop-zoom'),
            callback: null,
            state: { x: 0, y: 0, scale: 1, imgW: 0, imgH: 0 }
        };

        // Drag Logic
        let isDragging = false;
        let startX, startY, initialImgX, initialImgY;

        const onStart = (clientX, clientY) => {
            isDragging = true;
            startX = clientX;
            startY = clientY;
            initialImgX = this.cropper.state.x;
            initialImgY = this.cropper.state.y;
        };

        const onMove = (clientX, clientY) => {
            if (!isDragging) return;
            const dx = clientX - startX;
            const dy = clientY - startY;

            this.cropper.state.x = initialImgX + dx;
            this.cropper.state.y = initialImgY + dy;
            this.updateCropperImage();
        };

        const onEnd = () => {
            isDragging = false;
        };

        // Touch
        this.cropper.overlay.addEventListener('touchstart', e => { e.preventDefault(); onStart(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
        this.cropper.overlay.addEventListener('touchmove', e => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
        this.cropper.overlay.addEventListener('touchend', onEnd);

        // Mouse
        this.cropper.overlay.addEventListener('mousedown', e => { onStart(e.clientX, e.clientY); });
        window.addEventListener('mousemove', e => { onMove(e.clientX, e.clientY); });
        window.addEventListener('mouseup', onEnd);

        // Zoom
        this.cropper.zoom.addEventListener('input', e => {
            this.cropper.state.scale = parseFloat(e.target.value);
            this.updateCropperImage();
        });
    }

    openCropper(imageSrc, callback) {
        this.cropper.callback = callback;
        this.cropper.img.src = imageSrc;
        this.cropper.img.onload = () => {
            // Center and Fit logic
            const containerS = 250;
            const imgW = this.cropper.img.naturalWidth;
            const imgH = this.cropper.img.naturalHeight;

            // Initial scale to cover
            const scale = Math.max(containerS / imgW, containerS / imgH);

            this.cropper.state = {
                scale: scale,
                x: (containerS - imgW * scale) / 2,
                y: (containerS - imgH * scale) / 2,
                imgW: imgW,
                imgH: imgH
            };
            this.cropper.zoom.value = scale;
            this.cropper.zoom.min = scale * 0.5;
            this.cropper.zoom.max = scale * 3;

            this.updateCropperImage();
            this.cropper.modal.style.display = 'flex';
        };
    }

    closeCropper() {
        this.cropper.modal.style.display = 'none';
        this.cropper.img.src = '';
    }

    updateCropperImage() {
        const { x, y, scale } = this.cropper.state;
        this.cropper.img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }

    confirmCrop() {
        const containerS = 250;
        const canvas = document.createElement('canvas');
        canvas.width = containerS;
        canvas.height = containerS;
        const ctx = canvas.getContext('2d');

        // We need to draw what is visible in the 250x250 container
        // Image is drawn at x, y with scale.
        // So effectively:
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, containerS, containerS);

        const s = this.cropper.state.scale;
        const x = this.cropper.state.x; // offset of image top-left relative to container top-left
        const y = this.cropper.state.y;

        // drawImage(image, dx, dy, dWidth, dHeight)
        ctx.drawImage(this.cropper.img, x, y, this.cropper.state.imgW * s, this.cropper.state.imgH * s);

        // Final resize to 150x150 for storage
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = 150;
        finalCanvas.height = 150;
        const fCtx = finalCanvas.getContext('2d');
        fCtx.drawImage(canvas, 0, 0, 150, 150);

        const dataUrl = finalCanvas.toDataURL('image/jpeg', 0.85);
        if (this.cropper.callback) this.cropper.callback(dataUrl);
        this.closeCropper();
    }

    /* Actions attached to window.app */

    selectGame(gameId) {
        this.router.navigate('playerSelect', { gameId });
    }

    navigatePlayerOrder(gameId) {
        const game = this.store.getGames().find(g => g.id === gameId);
        const playerCount = this.selectedPlayers.length;

        if (playerCount === 0) {
            this.showHelpPopup("Sélectionnez au moins un joueur !");
            return;
        }

        // Vérifier le nombre minimum de joueurs
        if (game && game.minPlayers && playerCount < game.minPlayers) {
            this.showHelpPopup(`Ce jeu nécessite au moins ${game.minPlayers} joueur${game.minPlayers > 1 ? 's' : ''}. Vous en avez sélectionné ${playerCount}.`);
            return;
        }

        // Vérifier le nombre maximum de joueurs
        if (game && game.maxPlayers && playerCount > game.maxPlayers) {
            this.showHelpPopup(`Ce jeu accepte au maximum ${game.maxPlayers} joueur${game.maxPlayers > 1 ? 's' : ''}. Vous en avez sélectionné ${playerCount}.`);
            return;
        }

        this.router.navigate('playerOrder', { gameId });
    }
    togglePlayer(playerId) {
        const index = this.selectedPlayers.indexOf(playerId);
        if (index !== -1) {
            this.selectedPlayers.splice(index, 1);
        } else {
            this.selectedPlayers.push(playerId);
        }
        
        // Sauvegarder la sélection dans le store
        this.store.state.lastSelectedPlayers = [...this.selectedPlayers];
        this.store.save();
        
        this.updateSelectedPlayersUI();
        
        // Mettre à jour le compteur dans le bouton "Suivant"
        const nextButton = document.querySelector('button[onclick*="navigatePlayerOrder"]');
        if (nextButton) {
            nextButton.textContent = `Suivant (${this.selectedPlayers.length})`;
        }
    }

    movePlayer(index, direction) {
        if (direction === -1 && index > 0) {
            // Move Up
            [this.selectedPlayers[index], this.selectedPlayers[index - 1]] = [this.selectedPlayers[index - 1], this.selectedPlayers[index]];
        } else if (direction === 1 && index < this.selectedPlayers.length - 1) {
            // Move Down
            [this.selectedPlayers[index], this.selectedPlayers[index + 1]] = [this.selectedPlayers[index + 1], this.selectedPlayers[index]];
        }
        this.updateSelectedPlayersUI();
    }

    updateSelectedPlayersUI() {
        const listContainer = document.getElementById('selected-players-list');
        if (!listContainer) return;

        const players = this.store.getPlayers();

        if (this.selectedPlayers.length === 0) {
            listContainer.innerHTML = '<p style="color:#999; text-align:center; padding:10px;">Aucun joueur sélectionné</p>';
            return;
        }

        listContainer.innerHTML = this.selectedPlayers.map((pid, index) => {
            const p = players.find(pl => pl.id === pid);
            if (!p) return '';

            return `
                <div class="card draggable-item" draggable="true" data-index="${index}" style="display:flex; align-items:center; padding:10px; margin-bottom:10px; cursor: move; user-select: none; touch-action: none;">
                    <div style="margin-right:15px; cursor:move; font-size:1.2em; color:#ccc;">☰</div>
                    <div style="margin-right:10px; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
                        ${p.photo ? `<img src="${p.photo}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` : `<span style="font-size:1.5em;">${p.avatar}</span>`}
                    </div>
                    <span style="flex:1; font-weight:bold;">${p.name}</span>
                </div>
            `;
        }).join('');

        this.initDragAndDrop();
    }

    initDragAndDrop() {
        const container = document.getElementById('selected-players-list');
        if (!container) return;

        let draggedItem = null;
        let originalIndex = null;

        const items = container.querySelectorAll('.draggable-item');

        const onDragStart = (e, index) => {
            draggedItem = items[index];
            originalIndex = index;
            e.dataTransfer?.setData('text/plain', index);
            draggedItem.classList.add('dragging-source');
        };

        const onDragEnd = () => {
            if (draggedItem) draggedItem.classList.remove('dragging-source');
            draggedItem = null;
            originalIndex = null;
            items.forEach(item => item.classList.remove('drag-over'));
        };

        const onDragOver = (e) => {
            e.preventDefault();
            const target = e.target.closest('.draggable-item');
            if (target && target !== draggedItem) {
                // Remove drag-over from all others
                items.forEach(item => item !== target && item.classList.remove('drag-over'));
                target.classList.add('drag-over');
            }
        };

        const onDrop = (e) => {
            e.preventDefault();
            const target = e.target.closest('.draggable-item');
            if (target && draggedItem) {
                const targetIndex = parseInt(target.dataset.index);
                const sourceIndex = originalIndex;

                if (sourceIndex !== targetIndex) {
                    // Update array - Remove from source, insert at target
                    const [removed] = this.selectedPlayers.splice(sourceIndex, 1);
                    this.selectedPlayers.splice(targetIndex, 0, removed);

                    // Allow UI update
                    this.updateSelectedPlayersUI();
                }
            }
        };

        // Standard Drag Events
        items.forEach((item, index) => {
            item.addEventListener('dragstart', (e) => onDragStart(e, index));
            item.addEventListener('dragend', onDragEnd);
        });

        container.addEventListener('dragover', onDragOver);
        container.addEventListener('drop', onDrop);

        // Touch Events for Mobile
        let touchStartIndex = null;
        let mirrorElement = null;
        let touchedItem = null;

        const onTouchStart = (e) => {
            const item = e.target.closest('.draggable-item');
            if (!item) return;

            // Prevent context menu and other long-press behaviors
            e.preventDefault();

            touchedItem = item;
            touchStartIndex = parseInt(item.dataset.index);

            // Create "mirror" element (visual clone)
            mirrorElement = item.cloneNode(true);
            mirrorElement.classList.add('draggable-mirror');

            // Calculate position to center under finger or keep relative offset
            const rect = item.getBoundingClientRect();
            // We want the mirror to visually align initially
            mirrorElement.style.position = 'fixed';
            mirrorElement.style.zIndex = '9999';
            mirrorElement.style.width = `${rect.width}px`;
            mirrorElement.style.left = `${rect.left}px`;
            mirrorElement.style.top = `${rect.top}px`;
            mirrorElement.style.pointerEvents = 'none';

            document.body.appendChild(mirrorElement);
            item.classList.add('dragging-source');
        };

        const onTouchMove = (e) => {
            if (!mirrorElement) return;
            e.preventDefault(); // Prevent scrolling based on CSS touch-action: none

            const touch = e.touches[0];

            // Move the mirror to wrap the finger
            mirrorElement.style.left = `${touch.clientX - mirrorElement.offsetWidth / 2}px`;
            mirrorElement.style.top = `${touch.clientY - mirrorElement.offsetHeight / 2}px`;

            const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
            const targetItem = elementUnder ? elementUnder.closest('.draggable-item') : null;

            // Visual feedback on potential target
            items.forEach(item => item.classList.remove('drag-over'));
            if (targetItem && targetItem !== touchedItem) {
                targetItem.classList.add('drag-over');
            }
        };

        const onTouchEnd = (e) => {
            if (!touchedItem) return;

            touchedItem.classList.remove('dragging-source');
            items.forEach(item => item.classList.remove('drag-over'));

            if (mirrorElement) {
                mirrorElement.remove();
                mirrorElement = null;
            }

            const changedTouch = e.changedTouches[0];
            const elementUnder = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
            const targetItem = elementUnder ? elementUnder.closest('.draggable-item') : null;

            if (targetItem) {
                const targetIndex = parseInt(targetItem.dataset.index);
                if (touchStartIndex !== null && targetIndex !== null && touchStartIndex !== targetIndex && !isNaN(targetIndex)) {
                    const [removed] = this.selectedPlayers.splice(touchStartIndex, 1);
                    this.selectedPlayers.splice(targetIndex, 0, removed);
                    this.updateSelectedPlayersUI();
                }
            }
            touchedItem = null;
            touchStartIndex = null;
        };

        items.forEach(item => {
            item.addEventListener('touchstart', onTouchStart, { passive: false });
            item.addEventListener('touchmove', onTouchMove, { passive: false });
            item.addEventListener('touchend', onTouchEnd);
        });
    }

    proceedToSetup(gameId) {
        const game = this.store.getGames().find(g => g.id === gameId);
        const playerCount = this.selectedPlayers.length;

        if (playerCount === 0) {
            this.showHelpPopup("Sélectionnez au moins un joueur !");
            return;
        }

        // Vérifier le nombre minimum de joueurs
        if (game.minPlayers && playerCount < game.minPlayers) {
            this.showHelpPopup(`Ce jeu nécessite au moins ${game.minPlayers} joueur${game.minPlayers > 1 ? 's' : ''}. Vous en avez sélectionné ${playerCount}.`);
            return;
        }

        // Vérifier le nombre maximum de joueurs
        if (game.maxPlayers && playerCount > game.maxPlayers) {
            this.showHelpPopup(`Ce jeu accepte au maximum ${game.maxPlayers} joueur${game.maxPlayers > 1 ? 's' : ''}. Vous en avez sélectionné ${playerCount}.`);
            return;
        }

        this.router.navigate('gameSetup', { gameId });
    }

    finishSetupAndStart(gameId) {
        const scoreLimitInput = document.getElementById('setup-score-limit');
        const roundLimitInput = document.getElementById('setup-round-limit');

        const config = {
            target: scoreLimitInput.value ? parseInt(scoreLimitInput.value) : null,
            rounds: roundLimitInput.value ? parseInt(roundLimitInput.value) : null
        };

        const game = this.store.getGames().find(g => g.id === gameId);

        // Save selected players for next time (in store) - Order is preserved
        const playersList = [...this.selectedPlayers];
        this.store.state.lastSelectedPlayers = playersList;
        this.store.save();

        this.store.startNewSession(gameId, playersList, game.name, config);
        this.router.navigate('game');
    }

    // Removed handleImageUpload as it's no longer used for file input

    async startCamera(prefix) {
        const container = document.getElementById(`${prefix}-camera-container`);
        const video = document.getElementById(`${prefix}-camera-video`);
        const actions = document.getElementById(`${prefix}-photo-actions`);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showHelpPopup("L'appareil photo n'est pas accessible (HTTPS requis ou pas de caméra détectée).");
            return;
        }

        try {
            this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
            video.srcObject = this.cameraStream;
            container.style.display = 'block';
            actions.style.display = 'none';
        } catch (err) {
            console.error("Erreur caméra:", err);
            this.showHelpPopup("Erreur d'accès à la caméra: " + err.message);
        }
    }

    capturePhoto(prefix) {
        const video = document.getElementById(`${prefix}-camera-video`);
        const canvas = document.createElement('canvas');

        // Capture full frame
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

        this.stopCamera(prefix);

        // Open cropper
        this.openCropper(dataUrl, (croppedDataUrl) => {
            const previewEl = document.getElementById(`${prefix}-photo-display`); // Main preview at top
            const capturePreviewContainer = document.getElementById(`${prefix}-photo-capture-preview`); // Container below button
            const capturePreviewEl = document.getElementById(`${prefix}-photo-capture-display`); // Photo below button
            const avatarEl = document.getElementById(`${prefix}-avatar-display`);
            const avatarInput = document.getElementById(`${prefix}-avatar`);
            const imageSelectionDiv = document.getElementById(`${prefix}-image-selection`);

            // Update main preview (top)
            if (previewEl) {
                previewEl.src = croppedDataUrl;
                previewEl.style.display = 'block';
                previewEl.classList.add('selected');
            }
            
            // Update and show photo below button
            if (capturePreviewEl) {
                capturePreviewEl.src = croppedDataUrl;
            }
            if (capturePreviewContainer) {
                capturePreviewContainer.style.display = 'block';
            }
            
            if (avatarEl) {
                avatarEl.style.display = 'none';
                avatarEl.classList.remove('selected');
            }
            if (avatarInput) avatarInput.value = '';

            // Remove selected class from all avatar options
            if (imageSelectionDiv) {
                imageSelectionDiv.querySelectorAll('.avatar-opt').forEach(el => el.classList.remove('selected'));
            }
        });
    }

    stopCamera(prefix) {
        const container = document.getElementById(`${prefix}-camera-container`);
        const actions = document.getElementById(`${prefix}-photo-actions`);

        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }

        if (container) container.style.display = 'none';
        if (actions) actions.style.display = 'block';
    }

    selectAvatar(prefix, emoji) {
        const avatarInput = document.getElementById(`${prefix}-avatar`);
        const avatarDisplay = document.getElementById(`${prefix}-avatar-display`);
        const photoDisplay = document.getElementById(`${prefix}-photo-display`);
        const capturePreviewEl = document.getElementById(`${prefix}-photo-capture-display`);
        const imageSelectionDiv = document.getElementById(`${prefix}-image-selection`);

        if (avatarInput) avatarInput.value = emoji;

        if (avatarDisplay) {
            avatarDisplay.textContent = emoji;
            avatarDisplay.style.display = 'block';
            avatarDisplay.classList.add('selected');
        }

        if (photoDisplay) {
            photoDisplay.style.display = 'none';
            photoDisplay.classList.remove('selected');
        }

        // Remove blue border from photo below button (but keep photo visible)
        if (capturePreviewEl) {
            capturePreviewEl.style.border = '3px solid #ccc';
            capturePreviewEl.style.boxShadow = 'none';
        }

        // Ensure only the clicked avatar-opt has 'selected' class
        if (imageSelectionDiv) {
            imageSelectionDiv.querySelectorAll('.avatar-opt').forEach(el => el.classList.remove('selected'));
            // Find and select the clicked avatar option
            const selectedAvatarOpt = Array.from(imageSelectionDiv.querySelectorAll('.avatar-opt')).find(el => el.textContent === emoji);
            if (selectedAvatarOpt) {
                selectedAvatarOpt.classList.add('selected');
            }
        }
    }

    removePhoto(prefix) {
        const avatarInput = document.getElementById(`${prefix}-avatar`);
        const avatarDisplay = document.getElementById(`${prefix}-avatar-display`);
        const photoDisplay = document.getElementById(`${prefix}-photo-display`);
        const capturePreviewContainer = document.getElementById(`${prefix}-photo-capture-preview`);
        const imageSelectionDiv = document.getElementById(`${prefix}-image-selection`);
        const removePhotoBtn = event.target; // The button that was clicked

        if (photoDisplay) {
            photoDisplay.src = '';
            photoDisplay.style.display = 'none';
            photoDisplay.classList.remove('selected');
        }

        // Hide the photo below the button
        if (capturePreviewContainer) {
            capturePreviewContainer.style.display = 'none';
        }

        // Set default avatar and select it
        const defaultAvatar = '👤'; // Or player.avatar if editing, if we want to revert to original.
        if (avatarInput) avatarInput.value = defaultAvatar;
        if (avatarDisplay) {
            avatarDisplay.textContent = defaultAvatar;
            avatarDisplay.style.display = 'block';
            avatarDisplay.classList.add('selected');
        }

        // Remove selected class from all avatar options, then add to default
        if (imageSelectionDiv) {
            imageSelectionDiv.querySelectorAll('.avatar-opt').forEach(el => el.classList.remove('selected'));
            const defaultAvatarOpt = Array.from(imageSelectionDiv.querySelectorAll('.avatar-opt')).find(el => el.textContent === defaultAvatar);
            if (defaultAvatarOpt) {
                defaultAvatarOpt.classList.add('selected');
            }
        }
        // Hide the "Supprimer photo" button itself
        if(removePhotoBtn) removePhotoBtn.style.display = 'none';
    }

    reselectPhoto(prefix) {
        const photoDisplay = document.getElementById(`${prefix}-photo-display`);
        const capturePreviewEl = document.getElementById(`${prefix}-photo-capture-display`);
        const avatarDisplay = document.getElementById(`${prefix}-avatar-display`);
        const avatarInput = document.getElementById(`${prefix}-avatar`);
        const imageSelectionDiv = document.getElementById(`${prefix}-image-selection`);
        const capturePreviewContainer = document.getElementById(`${prefix}-photo-capture-preview`);

        // Get the photo from the capture preview
        const photoSrc = capturePreviewEl ? capturePreviewEl.src : '';

        if (photoSrc && photoDisplay) {
            // Show photo in main preview
            photoDisplay.src = photoSrc;
            photoDisplay.style.display = 'block';
            photoDisplay.classList.add('selected');

            // Restore blue border on photo below button
            if (capturePreviewEl) {
                capturePreviewEl.style.border = '3px solid var(--primary-color)';
                capturePreviewEl.style.boxShadow = '0 0 5px var(--primary-color)';
            }

            // Hide avatar in main preview
            if (avatarDisplay) {
                avatarDisplay.style.display = 'none';
                avatarDisplay.classList.remove('selected');
            }

            // Clear avatar input
            if (avatarInput) {
                avatarInput.value = '';
            }

            // Remove selected class from all avatar options
            if (imageSelectionDiv) {
                imageSelectionDiv.querySelectorAll('.avatar-opt').forEach(el => el.classList.remove('selected'));
            }

            // Ensure capture preview remains visible
            if (capturePreviewContainer) {
                capturePreviewContainer.style.display = 'block';
            }
        }
    }

    deletePhoto(prefix) {
        const photoDisplay = document.getElementById(`${prefix}-photo-display`);
        const capturePreviewContainer = document.getElementById(`${prefix}-photo-capture-preview`);
        const avatarDisplay = document.getElementById(`${prefix}-avatar-display`);
        const avatarInput = document.getElementById(`${prefix}-avatar`);
        const imageSelectionDiv = document.getElementById(`${prefix}-image-selection`);

        // Clear main photo preview
        if (photoDisplay) {
            photoDisplay.src = '';
            photoDisplay.style.display = 'none';
            photoDisplay.classList.remove('selected');
        }

        // Hide photo capture preview
        if (capturePreviewContainer) {
            capturePreviewContainer.style.display = 'none';
        }

        // Select default avatar (first icon)
        const defaultAvatar = '👤';
        if (avatarInput) {
            avatarInput.value = defaultAvatar;
        }
        if (avatarDisplay) {
            avatarDisplay.textContent = defaultAvatar;
            avatarDisplay.style.display = 'block';
            avatarDisplay.classList.add('selected');
        }

        // Remove selected class from all avatar options, then select the first one
        if (imageSelectionDiv) {
            imageSelectionDiv.querySelectorAll('.avatar-opt').forEach(el => el.classList.remove('selected'));
            const defaultAvatarOpt = Array.from(imageSelectionDiv.querySelectorAll('.avatar-opt')).find(el => el.textContent === defaultAvatar);
            if (defaultAvatarOpt) {
                defaultAvatarOpt.classList.add('selected');
            }
        }
    }


    submitPlayerForm() {
        const prefix = 'player';
        const idInput = document.getElementById(`${prefix}-id`);
        const nameInput = document.getElementById(`${prefix}-name`);
        const avatarInput = document.getElementById(`${prefix}-avatar`);
        const photoDataInput = document.getElementById(`${prefix}-photo-data`);

        const isEditMode = idInput && idInput.value;
        const name = nameInput.value.trim();
        const avatar = avatarInput.value;
        const photoData = photoDataInput ? photoDataInput.value : '';

        // Déterminer la valeur de photo à passer au store
        let photo = null;
        if (photoData && photoData.startsWith('data:')) {
            photo = photoData;
        } else if (photoData === '') {
            // Photo explicitement supprimée
            photo = '';
        }
        // Sinon photo = null (pas de changement)

        if (name) {
            if (isEditMode) {
                this.store.updatePlayer(idInput.value, name, avatar, photo);
                // Appliquer les cercles
                const player = this.store.state.players.find(p => p.id === idInput.value);
                if (player && this.store.state.tempAvatarSelection?.circles) {
                    player.circles = [...this.store.state.tempAvatarSelection.circles];
                }
            } else {
                const playerId = this.store.addPlayer(name, avatar, photo);
                // Appliquer les cercles temporaires si présents
                if (this.store.state.tempAvatarSelection?.circles) {
                    const player = this.store.state.players.find(p => p.id === playerId);
                    if (player) {
                        player.circles = [...this.store.state.tempAvatarSelection.circles];
                    }
                }
            }
            
            // Nettoyer les données temporaires
            delete this.store.state.tempAvatarSelection;
            this.store.save();
            
            this.router.back();
        } else {
            this.showHelpPopup("Le nom est obligatoire");
        }
    }

    cancelPlayerForm() {
        // Nettoyer les données temporaires
        delete this.store.state.tempAvatarSelection;
        this.store.save();
        this.router.back();
    }

    navigateCreatePlayer() {
        // Nettoyer les données temporaires avant d'aller sur la page de création
        delete this.store.state.tempAvatarSelection;
        this.store.save();
        this.router.navigate('createPlayer');
    }

    // Maintenir la compatibilité avec l'ancien code
    submitCreatePlayer() {
        this.submitPlayerForm();
    }

    editPlayer(playerId) {
        this.router.navigate('editPlayer', { playerId });
    }

    submitEditPlayer() {
        this.submitPlayerForm();
    }

    openAvatarSelection() {
        // Sauvegarder l'avatar, la photo et le nom actuels dans une variable temporaire
        const nameInput = document.getElementById('player-name');
        const avatarInput = document.getElementById('player-avatar');
        const photoDataInput = document.getElementById('player-photo-data');
        
        // Récupérer les cercles actuels si on en a (soit existants dans tempAvatarSelection, soit vide)
        const currentCircles = this.store.state.tempAvatarSelection?.circles || [];
        
        // Mettre à jour avec les valeurs actuelles du formulaire
        this.store.state.tempAvatarSelection = {
            name: nameInput ? nameInput.value.trim() : '',
            avatar: avatarInput ? avatarInput.value : '👤',
            photo: photoDataInput ? photoDataInput.value : '',
            circles: currentCircles
        };
        this.store.save();
        
        this.router.navigate('avatarSelection');
    }

    submitAvatarSelection() {
        // Récupérer les valeurs sélectionnées
        const avatarInput = document.getElementById('avatar-selection-avatar');
        const photoDisplay = document.getElementById('avatar-selection-photo-display');
        
        const avatar = avatarInput ? avatarInput.value : '👤';
        let photo = '';
        
        if (photoDisplay && photoDisplay.style.display !== 'none' && photoDisplay.src) {
            photo = photoDisplay.src;
        }
        
        // Mettre à jour les données temporaires (préserver le nom et les cercles qui étaient déjà sauvegardés)
        const existingData = this.store.state.tempAvatarSelection || {};
        this.store.state.tempAvatarSelection = {
            name: existingData.name || '',
            avatar: avatar,
            photo: photo,
            circles: existingData.circles || []
        };
        this.store.save();
        
        // Retourner à la page précédente
        this.router.back();
    }

    submitGameForm() {
        const prefix = 'game';
        const idInput = document.getElementById(`${prefix}-id`);
        const nameInput = document.getElementById(`${prefix}-name`);
        const typeInput = document.getElementById(`${prefix}-type`);
        const roundsInput = document.getElementById(`${prefix}-rounds`);
        const scoreModeInput = document.getElementById(`${prefix}-score-mode`);
        const fixedScoreValue = document.getElementById(`${prefix}-fixed-score-value`);
        const minPlayersInput = document.getElementById(`${prefix}-min-players`);
        const maxPlayersInput = document.getElementById(`${prefix}-max-players`);
        const targetInput = document.getElementById(`${prefix}-target`);

        const isEditMode = idInput && idInput.value;
        const name = nameInput.value.trim();
        const minPlayers = minPlayersInput.value ? parseInt(minPlayersInput.value) : null;
        const maxPlayers = maxPlayersInput.value ? parseInt(maxPlayersInput.value) : null;

        // Validation: si les deux sont renseignés, min doit être <= max
        if (minPlayers && maxPlayers && minPlayers > maxPlayers) {
            this.showHelpPopup("Le nombre minimum de joueurs ne peut pas être supérieur au maximum.");
            return;
        }

        if (name) {
            const gameData = {
                name,
                winCondition: typeInput.value,
                scoreMode: scoreModeInput.value || 'points',
                target: targetInput.value ? parseInt(targetInput.value) : 0,
                rounds: roundsInput.value ? parseInt(roundsInput.value) : null,
                fixedRoundScore: fixedScoreValue.value ? parseInt(fixedScoreValue.value) : null,
                minPlayers: minPlayers,
                maxPlayers: maxPlayers
            };

            if (isEditMode) {
                this.store.updateGame(idInput.value, gameData);
            } else {
                this.store.createGame(gameData);
            }
            this.router.back();
        } else {
            this.showHelpPopup("Le nom est obligatoire");
        }
    }

    // Maintenir la compatibilité avec l'ancien code
    submitCreateGame() {
        this.submitGameForm();
    }

    submitEditGame() {
        this.submitGameForm();
    }

    showHelpPopup(message) {
        // Créer la popup modale
        const overlay = document.createElement('div');
        overlay.className = 'help-popup-overlay';
        overlay.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;';
        
        const popup = document.createElement('div');
        popup.style.cssText = 'background:white; border-radius:12px; padding:25px; max-width:400px; width:100%; box-shadow:0 10px 40px rgba(0,0,0,0.3); animation:slideIn 0.3s ease;';
        
        popup.innerHTML = `
            <style>
                @keyframes slideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px;">
                <span style="font-size:1.8em; color:#667eea;">ℹ️</span>
                <h3 style="margin:0; color:#333;">Information</h3>
            </div>
            <p style="color:#666; line-height:1.5; margin-bottom:20px;">${message}</p>
            <button onclick="document.querySelector('.help-popup-overlay')?.remove()" style="width:100%; padding:12px; background:var(--primary-color); color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer; font-size:1rem;">OK</button>
        `;
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        
        // Fermer en cliquant sur l'overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    showPlayerNamePopup(playerName) {
        // Remove any existing popup
        const existingPopup = document.getElementById('player-name-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Create popup
        const popup = document.createElement('div');
        popup.id = 'player-name-popup';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 1.2em;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            animation: fadeInOut 1s ease-in-out;
            pointer-events: none;
        `;
        popup.textContent = playerName;

        // Add animation style if not already present
        if (!document.getElementById('player-popup-style')) {
            const style = document.createElement('style');
            style.id = 'player-popup-style';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(popup);

        // Remove after 1 second
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    editGame(gameId) {
        this.router.navigate('editGame', { gameId });
    }

    navigateDeleteGame(gameId) {
        this.router.navigate('confirmDeleteGame', { gameId });
    }

    executeDeleteGame(gameId) {
        this.store.deleteGame(gameId);
        this.router.history = [];
        this.router.navigate('home');
    }

    toggleGameFavorite(gameId) {
        const game = this.store.getGames().find(g => g.id === gameId);
        if (!game) return;
        
        this.store.updateGame(gameId, {
            favorite: !game.favorite
        });
        
        // Re-render the current view without transition
        const current = this.router.history[this.router.history.length - 1];
        if (current) {
            this.router.history.pop();
            this.router.navigate(current.name, current.params, 'none');
        }
    }

    toggleFavoritesFilter() {
        // Toggle the filter
        this.homeFilterFavorites = !this.homeFilterFavorites;
        
        // Sauvegarder dans le store
        this.store.state.homeFilterFavorites = this.homeFilterFavorites;
        this.store.save();
        
        // Re-render the home view without transition
        this.router.history.pop();
        this.router.navigate('home', {}, 'none');
    }

    executeDeletePlayer(playerId) {
        this.store.deletePlayer(playerId);
        // Go back 2 levels: confirmation page + edit page, to return to player list
        this.router.back();
        this.router.back();
    }

    // Circle management methods
    navigateCircleForm(returnPlayerId = null) {
        // Sauvegarder les données du formulaire joueur avant de naviguer
        this.savePlayerFormToTemp();
        this.router.navigate('createCircle', { returnPlayerId });
    }

    navigateEditCircle(circleId, returnPlayerId = null) {
        // Sauvegarder les données du formulaire joueur avant de naviguer
        this.savePlayerFormToTemp();
        this.router.navigate('editCircle', { circleId, returnPlayerId });
    }

    savePlayerFormToTemp() {
        const nameInput = document.getElementById('player-name');
        const avatarInput = document.getElementById('player-avatar');
        const photoDataInput = document.getElementById('player-photo-data');
        const idInput = document.getElementById('player-id');
        
        if (!this.store.state.tempAvatarSelection) {
            this.store.state.tempAvatarSelection = {};
        }
        
        // Sauvegarder les valeurs actuelles du formulaire
        this.store.state.tempAvatarSelection.name = nameInput ? nameInput.value.trim() : (this.store.state.tempAvatarSelection.name || '');
        this.store.state.tempAvatarSelection.avatar = avatarInput ? avatarInput.value : (this.store.state.tempAvatarSelection.avatar || '👤');
        this.store.state.tempAvatarSelection.photo = photoDataInput ? photoDataInput.value : (this.store.state.tempAvatarSelection.photo || '');
        
        // Sauvegarder l'état des cercles cochés
        const circles = this.store.getCircles();
        const checkedCircles = [];
        circles.forEach(c => {
            const checkbox = document.getElementById(`circle-${c.id}`);
            if (checkbox && checkbox.checked) {
                checkedCircles.push(c.id);
            }
        });
        this.store.state.tempAvatarSelection.circles = checkedCircles;
        
        this.store.save();
    }

    submitCircleForm() {
        const nameInput = document.getElementById('circle-name');
        const idInput = document.getElementById('circle-id');
        const returnPlayerInput = document.getElementById('circle-return-player');
        
        const isEditMode = idInput && idInput.value;
        const name = nameInput.value.trim();
        
        if (name) {
            // Check for duplicate name (case-insensitive)
            const circles = this.store.getCircles();
            const duplicate = circles.find(c => 
                c.name.toLowerCase() === name.toLowerCase() && 
                (!isEditMode || c.id !== idInput.value)
            );
            
            if (duplicate) {
                this.showHelpPopup("Un cercle avec ce nom existe déjà");
                return;
            }
            
            if (isEditMode) {
                this.store.updateCircle(idInput.value, name);
            } else {
                this.store.addCircle(name);
            }
            
            // Return to player edit if we came from there
            if (returnPlayerInput && returnPlayerInput.value) {
                if (returnPlayerInput.value === 'null') {
                    // Retour vers création de joueur
                    this.router.navigate('createPlayer', {}, 'back');
                } else {
                    // Retour vers édition de joueur
                    this.router.navigate('editPlayer', { playerId: returnPlayerInput.value }, 'back');
                }
            } else {
                this.router.back();
            }
        } else {
            this.showHelpPopup("Le nom est obligatoire");
        }
    }

    confirmDeleteCircle(circleId, returnPlayerId = null) {
        const circle = this.store.getCircles().find(c => c.id === circleId);
        if (!circle) return;
        
        if (confirm(`Voulez-vous vraiment supprimer le cercle "${circle.name}" ? Il sera retiré de tous les joueurs.`)) {
            this.store.deleteCircle(circleId);
            
            // Retirer le cercle des sélections temporaires
            if (this.store.state.tempAvatarSelection?.circles) {
                this.store.state.tempAvatarSelection.circles = this.store.state.tempAvatarSelection.circles.filter(id => id !== circleId);
                this.store.save();
            }
            
            // Refresh the view
            if (returnPlayerId) {
                if (returnPlayerId === 'null') {
                    this.router.navigate('createPlayer', {}, 'none');
                } else {
                    this.router.navigate('editPlayer', { playerId: returnPlayerId }, 'none');
                }
            }
        }
    }

    deleteCircle(circleId) {
        const returnPlayerInput = document.getElementById('circle-return-player');
        
        if (confirm("Voulez-vous vraiment supprimer ce cercle ? Il sera retiré de tous les joueurs.")) {
            this.store.deleteCircle(circleId);
            
            // Retirer le cercle des sélections temporaires
            if (this.store.state.tempAvatarSelection?.circles) {
                this.store.state.tempAvatarSelection.circles = this.store.state.tempAvatarSelection.circles.filter(id => id !== circleId);
                this.store.save();
            }
            
            // Return to player edit if we came from there
            if (returnPlayerInput && returnPlayerInput.value) {
                if (returnPlayerInput.value === 'null') {
                    this.router.navigate('createPlayer', {}, 'back');
                } else {
                    this.router.navigate('editPlayer', { playerId: returnPlayerInput.value }, 'back');
                }
            } else {
                this.router.back();
            }
        }
    }

    togglePlayerCircle(playerId, circleId) {
        // Toujours utiliser tempAvatarSelection pour gérer les cercles en édition
        const nameInput = document.getElementById('player-name');
        const avatarInput = document.getElementById('player-avatar');
        const photoDataInput = document.getElementById('player-photo-data');
        
        if (!this.store.state.tempAvatarSelection) {
            this.store.state.tempAvatarSelection = {};
        }
        if (!this.store.state.tempAvatarSelection.circles) {
            this.store.state.tempAvatarSelection.circles = [];
        }
        
        // Sauvegarder les valeurs du formulaire
        this.store.state.tempAvatarSelection.name = nameInput ? nameInput.value.trim() : '';
        this.store.state.tempAvatarSelection.avatar = avatarInput ? avatarInput.value : '👤';
        this.store.state.tempAvatarSelection.photo = photoDataInput ? photoDataInput.value : '';
        
        const index = this.store.state.tempAvatarSelection.circles.indexOf(circleId);
        if (index > -1) {
            this.store.state.tempAvatarSelection.circles.splice(index, 1);
        } else {
            this.store.state.tempAvatarSelection.circles.push(circleId);
        }
        this.store.save();
    }

    filterByCircle(circleId, gameId) {
        this.selectedCircleFilter = circleId;
        
        // Filtrer les joueurs sélectionnés : ne garder que ceux du cercle actif
        if (circleId !== 'all') {
            const allPlayers = this.store.getPlayers();
            this.selectedPlayers = this.selectedPlayers.filter(playerId => {
                const player = allPlayers.find(p => p.id === playerId);
                return player && player.circles && player.circles.includes(circleId);
            });
        }
        
        // Sauvegarder la sélection et le filtre dans le store
        this.store.state.lastSelectedPlayers = [...this.selectedPlayers];
        this.store.state.playerCircleFilter = circleId;
        this.store.save();
        
        // Re-render the player select view without adding to history
        this.router.history.pop();
        this.router.navigate('playerSelect', { gameId }, 'none');
    }

    addRound() {
        this.store.addEmptyRound();
        const content = ActiveGameView(this.store);
        document.querySelector('.view:last-child').innerHTML = content;
    }

    updateRound(roundIndex, playerId, value) {
        // Treat empty as 0
        const numValue = value === "" ? 0 : parseInt(value);
        if (isNaN(numValue)) return;

        this.store.updateRoundScore(roundIndex, playerId, numValue);

        // Refresh Leaderboard Only
        const session = this.store.restoreSession();
        const game = this.store.getGames().find(g => g.id === session.gameId);

        // Update Check Value in Round Column if exists
        const checkValSpan = document.getElementById(`check-val-${roundIndex}`);
        const hasFixedScore = game && (game.fixedRoundScore !== null && game.fixedRoundScore !== undefined && game.fixedRoundScore !== 0);

        if (checkValSpan && hasFixedScore) {
            const roundData = session.history[roundIndex];
            let roundSum = 0;
            session.players.forEach(p => {
                const val = roundData[p.id];
                if (val !== undefined && val !== "") roundSum += parseInt(val);
            });
            const diff = game.fixedRoundScore - roundSum;
            checkValSpan.textContent = diff === 0 ? 'OK' : diff;
            checkValSpan.style.color = diff === 0 ? 'var(--primary-color)' : '#ef4444';
        }

        const isLowestWin = game && game.winCondition === 'lowest';
        const players = session.players.map(sp => {
            const info = this.store.getPlayers().find(p => p.id === sp.id);
            return { ...sp, ...info };
        });

        const sorted = [...players].sort((a, b) => isLowestWin ? a.score - b.score : b.score - a.score);

        const html = `
            <table class="leaderboard-table">
                <tbody>
                    <tr>
                        ${sorted.map((p, i) => {
            let themeClass = 'theme-default';

            if (i === 0) {
                themeClass = 'theme-first';
            } else if (i === sorted.length - 1 && sorted.length > 1) {
                themeClass = 'theme-last';
            }

            return `
                            <td class="leaderboard-cell">
                                 <div class="leaderboard-card ${themeClass}" style="flex-direction:column; justify-content:center;">
                                    <div style="margin-bottom:2px; font-weight:bold; font-size:0.9em;">
                                        <span class="leaderboard-rank">${i + 1}</span>:${p.score}
                                    </div>
                                    <div style="display:flex; align-items:center; gap:4px;">
                                        ${p.photo ? `<img src="${p.photo}" style="width:16px; height:16px; border-radius:50%; object-fit:cover;">` : `<span style="font-size:0.9em;">${p.avatar}</span>`} 
                                        <span class="name-full" style="font-size:0.85em;">${p.name}</span>
                                        <span class="name-initial" style="font-size:0.85em;">${p.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                </div>
                            </td>
                     `}).join('')}
                    </tr>
                </tbody>
            </table>
        `;

        const container = document.getElementById('leaderboard-content');
        if (container) container.innerHTML = html;

        // CHECK FOR GAME OVER CONDITIONS
        const reason = this.checkGameEndCondition(session, game);

        // AUTO-ADD NEW ROUND LOGIC
        // If NO game over and the LAST round is fully filled, add a new one automatically.
        if (!reason) {
            const currentRoundData = session.history[roundIndex];
            // We only care if we just updated the *last* round
            const isLastRound = parseInt(roundIndex) === session.history.length - 1;

            if (isLastRound) {
                const isRoundComplete = session.players.every(p => currentRoundData[p.id] !== undefined && currentRoundData[p.id] !== "");
                if (isRoundComplete) {
                    // Auto-add new round
                    // Warning: if we just update innerHTML of the whole view, focus will be lost.
                    // The requirement "when entering LAST score... create new round".
                    // Ideally we want to just append the row to the table without full re-render, 
                    // OR re-render but put focus on the first cell of the new row?

                    // Adding a round updates store history.
                    this.store.addEmptyRound();

                    // Re-render view to show new round
                    // To avoid jarring experience, maybe small delay? 
                    // Or immediate.
                    // IMPORTANT: We need to preserve focus or at least scrolling.
                    // Full re-render kills focus. 

                    // Let's re-render. User has finished typing. They might be looking for next box.
                    const content = ActiveGameView(this.store);
                    document.querySelector('.view:last-child').innerHTML = content;

                    // Attempt to scroll to bottom or focus new row?
                    // Let's rely on standard render.
                }
            }
        }
    }

    updateWinnerForRound(roundIndex, winnerId) {
        const session = this.store.restoreSession();
        if (!session) return;

        // Set all players to 0 for this round
        session.players.forEach(p => {
            this.store.updateRoundScore(roundIndex, p.id, 0);
        });

        // Set winner to 1
        this.store.updateRoundScore(roundIndex, winnerId, 1);

        // Refresh Leaderboard
        const game = this.store.getGames().find(g => g.id === session.gameId);
        const isLowestWin = game && game.winCondition === 'lowest';
        const players = session.players.map(sp => {
            const info = this.store.getPlayers().find(p => p.id === sp.id);
            return { ...sp, ...info };
        });

        const sorted = [...players].sort((a, b) => isLowestWin ? a.score - b.score : b.score - a.score);

        const html = `
    <table class="leaderboard-table">
        <tbody>
            <tr>
                ${sorted.map((p, i) => {
            let themeClass = 'theme-default';
            if (i === 0) {
                themeClass = 'theme-first';
            } else if (i === sorted.length - 1 && sorted.length > 1) {
                themeClass = 'theme-last';
            }
            return `
                            <td class="leaderboard-cell">
                                 <div class="leaderboard-card ${themeClass}" title="${p.name}" onclick="window.app.showPlayerNamePopup('${p.name.replace(/'/g, "\\'")}')" style="flex-direction:column; justify-content:center; cursor:pointer;">
                                    <div style="margin-bottom:2px; font-weight:bold; font-size:0.9em;">
                                        <span class="leaderboard-rank">${i + 1}</span>:${p.score}
                                    </div>
                                    <div style="display:flex; align-items:center; gap:4px;">
                                        ${p.photo ? `<img src="${p.photo}" style="width:16px; height:16px; border-radius:50%; object-fit:cover;">` : `<span style="font-size:0.9em;">${p.avatar}</span>`} 
                                        <span class="name-full" style="font-size:0.85em;">${p.name}</span>
                                        <span class="name-initial" style="font-size:0.85em;">${p.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                </div>
                            </td>
                     `;
        }).join('')}
            </tr>
        </tbody>
    </table>
    `;

        document.getElementById('leaderboard-content').innerHTML = html;

        // Check for game end
        const reason = this.checkGameEndCondition(session, game);
        if (!reason) {
            // Auto-add new round if this was the last round and it's complete
            const isLastRound = parseInt(roundIndex) === session.history.length - 1;
            if (isLastRound) {
                const currentRoundData = session.history[roundIndex];
                const isRoundComplete = session.players.every(p => currentRoundData[p.id] !== undefined && currentRoundData[p.id] !== "");
                if (isRoundComplete) {
                    this.store.addEmptyRound();
                    const content = ActiveGameView(this.store);
                    document.querySelector('.view:last-child').innerHTML = content;
                }
            }
        }
    }

    checkGameEndCondition(session, game) {
        // 1. Check if all scores for the current round are filled
        // We only check the LAST round (or all rounds, but typically the game ends on the latest activity)
        // Actually, we should check if ANY end condition is met, but usually we wait for the round to be "complete"
        // Let's check if the CURRENT round (last in history) is fully filled
        const currentRound = session.history[session.history.length - 1];
        if (!currentRound) return;

        const isRoundComplete = session.players.every(p => currentRound[p.id] !== undefined && currentRound[p.id] !== "");
        let reason = null;

        // Determine effective limits (session config overrides game defaults if present)
        const effectiveRounds = (session.config && session.config.rounds) !== undefined ? session.config.rounds : game.rounds;
        const effectiveTarget = (session.config && session.config.target) !== undefined ? session.config.target : game.target;

        if (isRoundComplete) {
            // Check Max Rounds
            if (effectiveRounds && session.history.length >= effectiveRounds) {
                reason = "Limite de tours atteinte";
            } else if (effectiveTarget && effectiveTarget > 0) {
                // Check if any player has reached the target
                const anyReached = session.players.some(p => p.score >= effectiveTarget);
                if (anyReached) reason = "Limite de score atteinte";
            }
        }

        const bannerContainer = document.getElementById('game-over-banner-bottom');
        const newRoundBtn = document.getElementById('btn-new-round');

        if (bannerContainer && newRoundBtn) {
            if (reason) {
                // Only show if not manually dismissed (we can track this in state or simply re-show it on update? 
                // The user request implies "Continue Game" dismisses it. 
                // If we check every update, it might reappear if we don't track dismissal.
                // For now, let's assume if condition is met, we show it, unless we are in "continued" mode.
                // But we don't have "continued" mode in state. 
                // Let's just update DOM.
                // If "Continue Game" is clicked, we'll probably want to ignore this check until next round?
                // Let's keeping it simple: Update shows it. "Continue" hides it.
                // If user updates score again, it might reappear if condition still met. That seems correct.

                // Wait, if I click "Continue", I want to add a round.
                // So "Continue" just hides banner and shows button.
                // Then I click "Add Round", which adds round.
                // Then condition (rounds limit) might be valid or not depending on if limit was "reached" or "exceeded".
                // If limit was 10 rounds, and we are at 10. Banner shows.
                // "Continue". Banner hides. Button shows.
                // Click "New Round". Now 11 rounds.
                // Update checks... 11 >= 10. Banner shows again?
                // Probably yes. The user wants to "Force" continue.
                // Maybe we should only show banner if `!session.continued`?
                // Let's implement `continueGame` to set a flag in session?

                // For this step, let's just do the DOM update as requested.
                // If the user wants to truly "disable" the limit, they should probably change config.
                // But "Continuer la partie" implies ignoring the CURRENT stop.

                bannerContainer.innerHTML = `
                    <div style="background-color:var(--primary-color); color:white; padding:15px; border-radius:8px; margin-bottom:10px; text-align:center; box-shadow: 0 44px 6px rgba(0,0,0,0.1);">
                        <div style="font-size:1.2em; font-weight:bold;">🏁 Partie Terminée</div>
                        <div style="opacity:0.9; margin-bottom:10px;">${reason}</div>
                        <div style="display:flex; justify-content:center; gap:10px;">
                             <button onclick="window.app.navigateUpdateLimits()" style="background:rgba(255,255,255,0.2); border:1px solid rgba(255,255,255,0.5); color:white; padding:8px 12px; font-size:0.9rem; border-radius:4px; flex:1;">Continuer</button>
                             <button onclick="window.app.navigateEndGame()" style="background:white; color:var(--primary-color); border:none; padding:8px 12px; font-size:0.9rem; border-radius:4px; font-weight:bold; flex:1;">Terminer</button>
                        </div>
                    </div>
                `;
                bannerContainer.style.display = 'block';
                newRoundBtn.style.display = 'none';
            } else {
                bannerContainer.innerHTML = '';
                bannerContainer.style.display = 'none';
                newRoundBtn.style.display = 'block';
            }
        }
        return reason;
    }

    navigateUpdateLimits() {
        this.router.navigate('updateLimits');
    }

    submitUpdateLimits() {
        const scoreLimitInput = document.getElementById('update-score-limit');
        const roundLimitInput = document.getElementById('update-round-limit');

        const newTarget = scoreLimitInput.value ? parseInt(scoreLimitInput.value) : null;
        const newRounds = roundLimitInput.value ? parseInt(roundLimitInput.value) : null;

        // Update session config
        this.store.updateSessionConfig({
            target: newTarget,
            rounds: newRounds
        });

        this.router.back();
    }

    navigateReorderPlayers() {
        this.reorderIngameState = null; // Clear state
        this.router.navigate('reorderPlayers');
    }

    cancelReorderIngame() {
        this.reorderIngameState = null;
        this.router.back();
    }

    saveReorderIngame() {
        if (this.reorderIngameState) {
            this.store.reorderSessionPlayers(this.reorderIngameState);
        }
        this.reorderIngameState = null;
        this.router.back();
    }

    updateReorderIngameUI() {
        const listContainer = document.getElementById('reorder-ingame-list');
        if (!listContainer || !this.reorderIngameState) return;

        const players = this.store.getPlayers();

        listContainer.innerHTML = this.reorderIngameState.map((pid, index) => {
            const p = players.find(pl => pl.id === pid);
            if (!p) return '';

            return `
                <div class="card draggable-ingame-item" draggable="true" data-index="${index}" style="display:flex; align-items:center; padding:10px; margin-bottom:10px; cursor: move; user-select: none; touch-action: none;">
                    <div style="margin-right:15px; cursor:move; font-size:1.2em; color:#ccc;">☰</div>
                    <div style="margin-right:10px; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
                        ${p.photo ? `<img src="${p.photo}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` : `<span style="font-size:1.5em;">${p.avatar}</span>`}
                    </div>
                    <span style="flex:1; font-weight:bold;">${p.name}</span>
                </div>
            `;
        }).join('');

        this.initDragAndDropIngame();
    }

    initDragAndDropIngame() {
        const container = document.getElementById('reorder-ingame-list');
        if (!container) return;

        let draggedItem = null;
        let originalIndex = null;
        const items = container.querySelectorAll('.draggable-ingame-item');

        const onDragStart = (e, index) => {
            draggedItem = items[index];
            originalIndex = index;
            e.dataTransfer?.setData('text/plain', index);
            draggedItem.classList.add('dragging-source');
        };

        const onDragEnd = () => {
            if (draggedItem) draggedItem.classList.remove('dragging-source');
            draggedItem = null;
            originalIndex = null;
            items.forEach(item => item.classList.remove('drag-over'));
        };

        const onDragOver = (e) => {
            e.preventDefault();
            const target = e.target.closest('.draggable-ingame-item');
            if (target && target !== draggedItem) {
                items.forEach(item => item !== target && item.classList.remove('drag-over'));
                target.classList.add('drag-over');
            }
        };

        const onDrop = (e) => {
            e.preventDefault();
            const target = e.target.closest('.draggable-ingame-item');
            if (target && draggedItem) {
                const targetIndex = parseInt(target.dataset.index);
                const sourceIndex = originalIndex;

                if (sourceIndex !== targetIndex) {
                    const [removed] = this.reorderIngameState.splice(sourceIndex, 1);
                    this.reorderIngameState.splice(targetIndex, 0, removed);
                    this.updateReorderIngameUI();
                }
            }
        };

        // Standard Drag Events
        items.forEach((item, index) => {
            item.addEventListener('dragstart', (e) => onDragStart(e, index));
            item.addEventListener('dragend', onDragEnd);
        });

        container.addEventListener('dragover', onDragOver);
        container.addEventListener('drop', onDrop);

        // Touch Events for Mobile (Reusing logic structure but simplified)
        let touchStartIndex = null;
        let mirrorElement = null;
        let touchedItem = null;

        const onTouchStart = (e) => {
            const item = e.target.closest('.draggable-ingame-item');
            if (!item) return;

            touchedItem = item;
            touchStartIndex = parseInt(item.dataset.index);

            mirrorElement = item.cloneNode(true);
            mirrorElement.classList.add('draggable-mirror');
            const rect = item.getBoundingClientRect();
            mirrorElement.style.width = scrollX + rect.width + 'px'; // Fix width
            mirrorElement.style.left = rect.left + 'px';
            mirrorElement.style.top = rect.top + 'px';

            document.body.appendChild(mirrorElement);
            item.classList.add('dragging-source');
        };

        const onTouchMove = (e) => {
            if (!mirrorElement) return;
            e.preventDefault();
            const touch = e.touches[0];
            mirrorElement.style.left = `${touch.clientX - mirrorElement.offsetWidth / 2}px`;
            mirrorElement.style.top = `${touch.clientY - mirrorElement.offsetHeight / 2}px`;

            const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
            const targetItem = elementUnder ? elementUnder.closest('.draggable-ingame-item') : null;

            items.forEach(item => item.classList.remove('drag-over'));
            if (targetItem && targetItem !== touchedItem) {
                targetItem.classList.add('drag-over');
            }
        };

        const onTouchEnd = (e) => {
            if (!touchedItem) return;

            touchedItem.classList.remove('dragging-source');
            items.forEach(item => item.classList.remove('drag-over'));

            if (mirrorElement) {
                mirrorElement.remove();
                mirrorElement = null;
            }

            const changedTouch = e.changedTouches[0];
            const elementUnder = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
            const targetItem = elementUnder ? elementUnder.closest('.draggable-ingame-item') : null;

            if (targetItem) {
                const targetIndex = parseInt(targetItem.dataset.index);
                if (touchStartIndex !== null && targetIndex !== null && touchStartIndex !== targetIndex && !isNaN(targetIndex)) {
                    const [removed] = this.reorderIngameState.splice(touchStartIndex, 1);
                    this.reorderIngameState.splice(targetIndex, 0, removed);
                    this.updateReorderIngameUI();
                }
            }
            touchedItem = null;
            touchStartIndex = null;
        };

        items.forEach(item => {
            item.addEventListener('touchstart', onTouchStart, { passive: false });
            item.addEventListener('touchmove', onTouchMove, { passive: false });
            item.addEventListener('touchend', onTouchEnd);
        });
    }

    navigateAddPlayerInGame() {
        this.router.navigate('addIngamePlayer');
    }

    navigateRemovePlayerInGame() {
        this.router.navigate('removeIngamePlayer');
    }

    addPlayerToGame(playerId) {
        const session = this.store.restoreSession();
        const game = this.store.getGames().find(g => g.id === session.gameId);
        const currentPlayerCount = session.players.length;

        // Vérifier le nombre maximum de joueurs
        if (game.maxPlayers && currentPlayerCount >= game.maxPlayers) {
            this.showHelpPopup(`Ce jeu accepte au maximum ${game.maxPlayers} joueur${game.maxPlayers > 1 ? 's' : ''}. Impossible d'ajouter un joueur supplémentaire.`);
            return;
        }

        this.store.addPlayerToSession(playerId);
        this.router.navigate('game', {}, 'back');
    }

    // New method for the confirmation view action
    executeRemovePlayer(playerId) {
        const session = this.store.restoreSession();
        const game = this.store.getGames().find(g => g.id === session.gameId);
        const currentPlayerCount = session.players.length;

        // Vérifier le nombre minimum de joueurs
        if (game.minPlayers && currentPlayerCount <= game.minPlayers) {
            this.showHelpPopup(`Ce jeu nécessite au moins ${game.minPlayers} joueur${game.minPlayers > 1 ? 's' : ''}. Impossible de supprimer un joueur.`);
            this.router.navigate('game', {}, 'back');
            return;
        }

        this.store.removePlayerFromSession(playerId);
        // We need to go back twice ideally (Confirm -> RemoveList -> Game), 
        // OR just navigate explicitly to game.
        // If we navigate to 'game', we might lose history stack, but that's okay for now.
        // Better: store.restoreSession() is reliable.
        this.router.navigate('game', {}, 'back');
        // Note: 'back' animation might be weird if we jump multiple steps, but acceptable. 
        // Actually router 'back' just reverses animation direction.
        // It doesn't pop multiple states. 
        // Navigation to 'game' is safer.
    }

    // Deprecated / Unused: old method with confirm
    // removePlayerFromGame(playerId) {
    //     if (confirm("Êtes-vous sûr de vouloir supprimer ce joueur de la partie ?")) {
    //         this.store.removePlayerFromSession(playerId);
    //         this.router.navigate('game', {}, 'back');
    //     }
    // }

    updateStatisticsState(action, value) {
        if (!this.statsState) {
            this.statsState = { game: 'all', players: [], tab: 'comparator' };
        }

        if (action === 'game') {
            this.statsState.game = value;
        } else if (action === 'togglePlayer') {
            const playerId = value;
            const index = this.statsState.players.indexOf(playerId);
            if (index === -1) {
                this.statsState.players.push(playerId);
            } else {
                this.statsState.players.splice(index, 1);
            }
        } else if (action === 'tab') {
            this.statsState.tab = value;
        }

        // Re-render
        const html = StatisticsView(this.store);
        const app = document.getElementById('app');
        if (app) app.innerHTML = html;
    }

    toggleHistoryDetails(sessionId) {
        const el = document.getElementById(`history-details-${sessionId}`);
        if (el) {
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Navigate to confirmation page
    navigateEndGame() {
        this.router.navigate('confirmEndGame');
    }

    // Actual execution
    executeEndGame() {
        this.store.clearSession();
        // Clear history to prevent back button from returning to the game
        this.router.history = [];
        this.router.navigate('home');
    }

    navigateCancelGame() {
        this.router.navigate('confirmCancelGame');
    }

    executeCancelGame() {
        this.store.cancelSession();
        this.router.history = [];
        this.router.navigate('home');
    }

    exportSelectedGames() {
        const checkboxes = document.querySelectorAll('[id^="export-game-"]:checked');
        const selectedIds = Array.from(checkboxes).map(cb => cb.value);
        
        if (selectedIds.length === 0) {
            this.showHelpPopup('Veuillez sélectionner au moins un jeu à exporter');
            return;
        }

        const games = this.store.getGames();
        const gamesToExport = games.filter(g => selectedIds.includes(g.id));
        const jsonString = JSON.stringify(gamesToExport, null, 2);

        // Use Android share API if available
        if (window.Android && window.Android.shareText) {
            window.Android.shareText('Configuration des jeux', jsonString);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(jsonString).then(() => {
                this.showHelpPopup('JSON copié dans le presse-papiers !');
            }).catch(err => {
                this.showHelpPopup('Erreur lors de la copie : ' + err);
            });
        }
    }

    parseImportGames() {
        const textarea = document.getElementById('import-json-input');
        const jsonText = textarea.value.trim();

        if (!jsonText) {
            this.showHelpPopup('Veuillez coller le JSON à importer');
            return;
        }

        try {
            const importedGames = JSON.parse(jsonText);
            
            if (!Array.isArray(importedGames)) {
                this.showHelpPopup('Le JSON doit être un tableau de jeux');
                return;
            }

            const existingGames = this.store.getAllGames();
            const existingNames = new Set(existingGames.map(g => g.name.toLowerCase()));

            const listHtml = `
                <div style="border-top:1px solid #ddd; padding-top:15px;">
                    <p style="color:#666; margin-bottom:15px; font-weight:500;">Jeux à importer :</p>
                    ${importedGames.map(g => {
                        const existingGame = existingGames.find(eg => eg.name.toLowerCase() === g.name.toLowerCase());
                        const exists = !!existingGame;
                        const isArchived = exists && existingGame.deleted;
                        const label = exists ? (isArchived ? ' (archivé - sera réactivé)' : ' (mettre à jour ?)') : '';
                        return `
                            <label style="display:flex; align-items:center; padding:12px; background:white; border-radius:8px; margin-bottom:10px; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:pointer; ${exists ? 'border: 2px solid #ff4444;' : ''}">
                                <input type="checkbox" class="import-game-checkbox" data-game='${JSON.stringify(g).replace(/'/g, "&apos;")}' style="margin-right:12px; width:20px; height:20px; cursor:pointer;" ${exists ? '' : 'checked'}>
                                <span style="font-weight:500; ${exists ? 'color:#ff4444;' : ''}">${g.name}${label}</span>
                            </label>
                        `;
                    }).join('')}

                    <button onclick="window.app.confirmImportGames()" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-top:10px;">
                        Importer la sélection
                    </button>
                </div>
            `;

            document.getElementById('import-games-list').innerHTML = listHtml;

        } catch (err) {
            this.showHelpPopup('Erreur lors de l\'analyse du JSON : ' + err.message);
        }
    }

    confirmImportGames() {
        const checkboxes = document.querySelectorAll('.import-game-checkbox:checked');
        
        if (checkboxes.length === 0) {
            this.showHelpPopup('Veuillez sélectionner au moins un jeu à importer');
            return;
        }

        let imported = 0;
        let updated = 0;
        let reactivated = 0;
        const existingGames = this.store.getAllGames();
        
        checkboxes.forEach(cb => {
            const gameData = JSON.parse(cb.dataset.game);
            
            // Check if a game with the same name already exists (including archived)
            const existingGame = existingGames.find(g => g.name.toLowerCase() === gameData.name.toLowerCase());
            
            if (existingGame) {
                // Update existing game with all new data and reactivate if archived
                const updateData = { ...gameData };
                if (existingGame.deleted) {
                    // Remove archived status to reactivate
                    updateData.deleted = false;
                    updateData.deletedAt = null;
                    reactivated++;
                } else {
                    updated++;
                }
                this.store.updateGame(existingGame.id, updateData);
            } else {
                // Create new game with new ID
                const newGame = {
                    ...gameData,
                    id: 'game-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
                };
                this.store.createGame(newGame);
                imported++;
            }
        });

        let message = '';
        if (reactivated > 0 && updated > 0 && imported > 0) {
            message = `${imported} jeu(x) importé(s), ${updated} mis à jour, ${reactivated} réactivé(s) !`;
        } else if (reactivated > 0 && updated > 0) {
            message = `${updated} jeu(x) mis à jour, ${reactivated} réactivé(s) !`;
        } else if (reactivated > 0 && imported > 0) {
            message = `${imported} jeu(x) importé(s), ${reactivated} réactivé(s) !`;
        } else if (updated > 0 && imported > 0) {
            message = `${imported} jeu(x) importé(s), ${updated} mis à jour !`;
        } else if (reactivated > 0) {
            message = `${reactivated} jeu(x) réactivé(s) !`;
        } else if (updated > 0) {
            message = `${updated} jeu(x) mis à jour !`;
        } else {
            message = `${imported} jeu(x) importé(s) !`;
        }
        this.showHelpPopup(message);
        setTimeout(() => this.router.navigate('home'), 1500);
    }

    // Old method deprecated
    // resetGame() { ... }
}

// Start

window.requestBackAction = () => {
    if (window.app && window.app.router) {
        const history = window.app.router.history;
        const state = {
            history: history.length,
            page: history.length > 0 ? history[history.length - 1].name : 'home'
        };
        if (window.Android && window.Android.handleBackButtonState) {
            window.Android.handleBackButtonState(JSON.stringify(state));
        } else {
            // Fallback for when the interface is not available (e.g. testing in browser)
            // Or if the timing is off. This provides a default graceful fallback.
            if (history.length > 1) {
                window.app.router.back();
            }
        }
    } else {
        // App not yet initialized, or in a weird state. Assume we can quit.
        const state = { history: 1, page: 'home' };
        if (window.Android && window.Android.handleBackButtonState) {
            window.Android.handleBackButtonState(JSON.stringify(state));
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Viewport Height Fix
    const setAppHeight = () => {
        const doc = document.documentElement;
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', setAppHeight);
    setAppHeight();

    new App();
});
