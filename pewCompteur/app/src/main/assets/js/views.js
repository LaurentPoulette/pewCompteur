export const APP_VERSION = window.APP_VERSION_NATIVE || '1.11';

export const HomeView = (store, showOnlyFavorites = false) => {
    const allGames = store.getGames();
    const games = showOnlyFavorites ? allGames.filter(g => g.favorite) : allGames;
    
    return `
        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px; z-index:1001; position:relative;">
            <div></div>
            <h1 style="margin:0; text-align:center;">Jeux</h1>
            <button onclick="window.app.router.navigate('options')" style="background:none; color:var(--text-color); padding:8px; font-size:1.2rem; display:flex; align-items:center; gap:5px; justify-self:end;" title="Options">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            </button>
        </header>

        <div style="flex:1; overflow-y:auto; width:100%;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin:0; flex:1; text-align:center;">Choisissez votre jeu</h3>
            <button onclick="window.app.toggleFavoritesFilter()" style="background:none; border:none; cursor:pointer; padding:0; line-height:1; width:28px; height:28px;" title="${showOnlyFavorites ? 'Afficher tous les jeux' : 'Afficher uniquement les favoris'}">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="${showOnlyFavorites ? '#ffd700' : 'none'}" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
            </button>
        </div>
        <p style="text-align:center; color:#999; font-size:0.9em; margin:-10px 0 15px 0;">Appui long pour modifier</p>
        <div class="grid" style="padding-bottom:100px;">
            <!-- New Game Card -->
            <div class="card" onclick="window.app.router.navigate('createGame')" style="display:flex; align-items:center; justify-content:center; cursor:pointer; min-height:80px; border: 2px dashed #ccc; background:transparent;">
                 <div style="text-align:center; color:#888;">
                    <span style="font-size:2em;">+</span><br>Nouveau
                 </div>
            </div>

            ${games.map(g => `
                <div class="card game-card" data-game-id="${g.id}" onclick="window.app.selectGame('${g.id}')" style="position:relative; min-height:80px; display:flex; align-items:center; justify-content: center; cursor:pointer;">
                    <button onclick="event.stopPropagation(); window.app.toggleGameFavorite('${g.id}')" style="position:absolute; top:5px; right:5px; background:none; border:none; cursor:pointer; padding:0; line-height:1; z-index:10; width:24px; height:24px;" title="${g.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="${g.favorite ? '#ffd700' : 'none'}" stroke="${g.favorite ? '#ffd700' : '#ccc'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                    </button>
                    <div style="display:flex; align-items:center;">
                        <h3 style="margin:0;">${g.name}</h3>
                    </div>
                </div>
            `).join('')}
        </div>
        </div>
    `;
};

export const PlayerSelectView = (store, gameId, options = {}) => {
    const { 
        mode = 'game', // 'game' ou 'stats'
        onBack = null,
        onNext = null,
        subtitle = null
    } = options;

    const allPlayers = store.getPlayers();
    const game = mode === 'game' ? store.getGames().find(g => g.id === gameId) : null;
    const circles = store.getCircles();
    
    // Get current filter from app state (will be set by filter dropdown)
    const selectedCircleFilter = window.app?.selectedCircleFilter || 'all';
    
    // Utiliser statsState.players pour le mode stats, selectedPlayers pour le mode game
    const selectedPlayersList = mode === 'stats' 
        ? (window.app.statsState?.players || [])
        : (window.app.selectedPlayers || []);
    
    console.log('PlayerSelectView mode:', mode);
    console.log('PlayerSelectView selectedPlayersList:', selectedPlayersList);
    console.log('PlayerSelectView window.app.statsState:', window.app.statsState);
    
    // Filter players based on selected circle
    let players = allPlayers;
    if (selectedCircleFilter !== 'all') {
        players = allPlayers.filter(p => p.circles && p.circles.includes(selectedCircleFilter));
        
        // Filtrer aussi les joueurs sélectionnés pour ne garder que ceux du cercle
        if (mode === 'stats' && window.app.statsState) {
            window.app.statsState.players = window.app.statsState.players.filter(playerId => {
                const player = allPlayers.find(p => p.id === playerId);
                return player && player.circles && player.circles.includes(selectedCircleFilter);
            });
        } else if (mode === 'game' && window.app && window.app.selectedPlayers) {
            window.app.selectedPlayers = window.app.selectedPlayers.filter(playerId => {
                const player = allPlayers.find(p => p.id === playerId);
                return player && player.circles && player.circles.includes(selectedCircleFilter);
            });
        }
    }
    
    let subtitleText = subtitle || "Choisir les joueurs";
    if (mode === 'game' && game && game.minPlayers && game.maxPlayers) {
        if (game.minPlayers === game.maxPlayers) {
            subtitleText = `Choisir ${game.maxPlayers} joueur${game.maxPlayers > 1 ? 's' : ''}`;
        } else {
            subtitleText = `Choisir entre ${game.minPlayers} et ${game.maxPlayers} joueurs`;
        }
    } else if (mode === 'game' && game && game.minPlayers) {
        subtitleText = `Choisir au moins ${game.minPlayers} joueur${game.minPlayers > 1 ? 's' : ''}`;
    } else if (mode === 'game' && game && game.maxPlayers) {
        subtitleText = `Choisir au maximum ${game.maxPlayers} joueur${game.maxPlayers > 1 ? 's' : ''}`;
    }

    const backAction = onBack || "window.app.router.back()";
    const toggleAction = mode === 'stats' 
        ? `this.classList.toggle('selected'); window.app.toggleStatsPlayer('` 
        : `this.classList.toggle('selected'); window.app.togglePlayer('`;
    
    const showNewPlayerCard = mode === 'game';
    const showCircleFilter = mode === 'game' && circles.length > 0;
    const showLongPressHint = mode === 'game';
    
    const pageTitle = mode === 'game' && game ? game.name : 'Joueurs';
    
    return `
        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
            <button onclick="${backAction}" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            <h1 style="margin:0; text-align:center;">${pageTitle}</h1>
            <div></div>
        </header>
        <div style="flex:1; overflow-y:auto; width:100%;">
        <h3 style="margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">${subtitleText}</h3>
        
        ${showCircleFilter ? `
        <div style="margin-bottom:15px;">
            <select id="circle-filter" onchange="window.app.filterByCircle(this.value, '${gameId}')" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:8px; font-size:1em; background:white;">
                <option value="all" ${selectedCircleFilter === 'all' ? 'selected' : ''}>Tous les joueurs</option>
                ${circles.map(c => `<option value="${c.id}" ${selectedCircleFilter === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
        </div>
        ` : ''}
        
        ${showLongPressHint ? `<p style="text-align:center; color:#999; font-size:0.9em; margin:-10px 0 15px 0;">Appui long pour modifier</p>` : ''}
        
        <div class="grid" id="player-grid" style="padding-bottom: 100px;">
            ${showNewPlayerCard ? `
            <!-- New Player Card -->
            <div class="card" onclick="window.app.navigateCreatePlayer()" style="display:flex; align-items:center; justify-content:center; cursor:pointer; min-height:80px; border: 2px dashed #ccc; background:transparent;">
                 <div style="text-align:center; color:#888;">
                    <span style="font-size:2em;">+</span><br>Nouveau
                 </div>
            </div>
            ` : ''}

            ${players.map(p => {
        const isSelected = selectedPlayersList.includes(p.id);
        const isAvatarSelected = !p.photo && isSelected;
        const isPhotoSelected = p.photo && isSelected;

        return `
                <div class="card player-card ${isSelected ? 'selected' : ''}" data-id="${p.id}" data-player-id="${p.id}" data-mode="${mode}" style="cursor:pointer; padding:15px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <div style="display:flex; justify-content:center; align-items:center; margin-bottom:8px;">
                        <div style="width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
                             ${p.photo ? `<img src="${p.photo}" class="${isPhotoSelected ? 'selected-photo' : ''}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` : `<span class="${isAvatarSelected ? 'selected-avatar' : ''}" style="font-size:1.8em;">${p.avatar}</span>`}
                        </div>
                    </div>
                    <div style="text-align:center; width:100%;">
                        <h3 style="margin:0; font-size:1em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.name}</h3>
                    </div>
                </div>
            `;
    }).join('')}
        </div>
        
        </div>
        </div>
        
        ${mode === 'game' ? `
        <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100;">
            <button id="next-button" onclick="${onNext || `window.app.navigatePlayerOrder('${gameId}')`}" style="width:100%; padding: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">Suivant (${selectedPlayersList.length} joueur${selectedPlayersList.length > 1 ? 's' : ''})</button>
        </div>
        <script>
            setTimeout(() => window.app.updateNextButtonCount(), 50);
        </script>
        ` : `
        <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100;">
            <button class="player-select-button" onclick="${onNext || 'window.app.router.back()'}" style="width:100%; padding: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">Valider (${selectedPlayersList.length} joueur${selectedPlayersList.length > 1 ? 's' : ''})</button>
        </div>
        `}
        
        <script>
            // Attacher les event listeners aux cartes de joueurs
            document.querySelectorAll('.player-card').forEach(card => {
                card.addEventListener('click', function() {
                    const playerId = this.dataset.playerId;
                    const mode = this.dataset.mode;
                    this.classList.toggle('selected');
                    if (mode === 'stats') {
                        window.app.toggleStatsPlayer(playerId);
                    } else {
                        window.app.togglePlayer(playerId);
                    }
                });
            });
        </script>
        
        <style>
            .player-card.selected { border: 2px solid var(--primary-color); background-color: #e0f2fe; }
            .selected-avatar { text-shadow: 0 0 3px var(--primary-color); }
            .selected-photo { border: 2px solid var(--primary-color); box-shadow: 0 0 5px var(--primary-color); }
        </style>
`;
};

export const PlayerOrderView = (store, gameId) => {
    const game = store.getGames().find(g => g.id === gameId);
    const pageTitle = game ? game.name : 'Ordre';
    
    return `
        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
             <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            <h1 style="margin:0; text-align:center;">${pageTitle}</h1>
            <div></div>
        </header>
        <div style="flex:1; overflow-y:auto; width:100%;">
        <h3 style="margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">Glissez pour changer l'ordre</h3>
        
        <div id="selected-players-list" style="margin-bottom:80px;">
             <!-- Populated by window.app.updateSelectedPlayersUI() -->
        </div>

        </div>
        </div>

        <script>
            setTimeout(() => window.app.updateSelectedPlayersUI(), 0);
        </script>

        <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100;">
            <button onclick="window.app.proceedToSetup('${gameId}')" style="width:100%; padding: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">Suivant</button>
        </div>
`;
};

export const ActiveGameView = (store) => {
    const session = store.restoreSession();
    if (!session) return `<div class="card">Erreur: Pas de session active.</div>`;

    const game = store.getGames().find(g => g.id === session.gameId);
    const isLowestWin = game && game.winCondition === 'lowest';
    const hasFixedScore = game && (game.fixedRoundScore !== null && game.fixedRoundScore !== undefined && game.fixedRoundScore !== 0);
    const isWinsMode = game && game.scoreMode === 'wins';

    const players = session.players.map(sp => {
        const info = store.getPlayers().find(p => p.id === sp.id);
        return { ...sp, ...info };
    });

    // Players for columns (fixed order)
    const tablePlayers = [...players];

    // Players for leaderboard (sorted)
    const getLeaderboardHTML = () => {
        const sorted = [...players].sort((a, b) => isLowestWin ? a.score - b.score : b.score - a.score);
        
        // Calculer les rangs réels avec gestion des égalités
        let currentRank = 1;
        const ranksAndPlayers = sorted.map((p, i) => {
            if (i > 0 && sorted[i].score !== sorted[i - 1].score) {
                currentRank = i + 1;
            }
            return { player: p, rank: currentRank };
        });
        
        return `
    <table class="leaderboard-table">
        <tbody>
            <tr>
                ${ranksAndPlayers.map(({ player: p, rank }) => {
            let rankIcon = `#${rank}`;
            let rankSize = '1em';

            if (rank === 1) { rankIcon = '🥇'; rankSize = '1.3em'; }
            else if (rank === 2) { rankIcon = '🥈'; rankSize = '1.2em'; }
            else if (rank === 3) { rankIcon = '🥉'; rankSize = '1.2em'; }

            return `
                            <td class="leaderboard-cell">
                                 <div class="leaderboard-card" title="${p.name}" onclick="window.app.showPlayerNamePopupById('${p.id}')" style="flex-direction:column; justify-content:center; cursor:pointer;">
                                    <div style="margin-bottom:2px; font-weight:bold; font-size:0.9em;">
                                        <span class="leaderboard-rank" style="font-size:${rankSize};">${rankIcon}</span> ${p.score}
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
    };

    return `
    <div style="display:flex; flex-direction:column; height:100%; overflow:hidden;">
        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 10px; z-index:1001; position:relative; flex-shrink:0;">
            <div></div>
            <h1 style="margin:0; text-align:center;">${session.title}</h1>
            <button onclick="window.app.showEndGamePopup()" style="background:#dc3545; color:white; padding:8px; font-size:1.2rem; display:flex; align-items:center; gap:5px; justify-self:end; border-radius:6px; border:none; cursor:pointer;" title="Fermer la partie">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </header>

        ${(() => {
            const effectiveRounds = (session.config && session.config.rounds !== undefined) ? session.config.rounds : game.rounds;
            const effectiveTarget = (session.config && session.config.target !== undefined) ? session.config.target : game.target;
            const currentRoundsCount = session.history.length;
            
            let limitText = '';
            if (effectiveRounds && effectiveTarget) {
                limitText = `Limité à ${effectiveTarget} points ou ${effectiveRounds} tours`;
            } else if (effectiveTarget) {
                limitText = `Limité à ${effectiveTarget} points`;
            } else if (effectiveRounds) {
                limitText = `Limité à ${effectiveRounds} tours`;
            } else {
                limitText = `Aucune limite de point ni de tour`;
            }
            
            return `<div style="margin-bottom: 15px; padding:10px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); flex-shrink:0; font-size:0.95em; display: flex; align-items: center; justify-content: center; position: relative;">
                <button onclick="window.app.navigateUpdateLimits()" style="position: absolute; left: 10px; background: rgba(255,255,255,0.2); border: none; cursor: pointer; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center;" title="Modifier les limites">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <span>${limitText}</span>
            </div>`;
        })()}
        
        <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
            <div class="card" style="flex:1; overflow-y:auto; overflow-x:auto; max-width:100%;">
                <table class="history-table" style="text-align: center; border-collapse: collapse;">
                    <thead style="position: sticky; top: 0; z-index: 10;">
                        <tr style="background: linear-gradient(135deg, #5a67d8 0%, #4c51bf 100%);">
                            <th colspan="${tablePlayers.length + 1}" style="padding: 8px; color: white; font-weight: bold; font-size: 1em; position: relative;">
                                <button onclick="window.app.router.navigate('reorderPlayers')" style="position: absolute; left: 10px; background: rgba(255,255,255,0.2); border: none; cursor: pointer; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center;" title="Gérer les joueurs">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <span>Joueurs</span>
                            </th>
                        </tr>
                        <tr style="background: linear-gradient(135deg, #c3dafe 0%, #a3bffa 100%);">
                            <th class="history-header" style="background: transparent; padding: 2px; border-bottom: none; border-right: 1px solid white; color: #2d3748;">#</th>
                            ${tablePlayers.map(p => `
                                <th class="history-header" title="${p.name}" onclick="window.app.showPlayerNamePopupById('${p.id}')" style="cursor:pointer; background: transparent; padding: 2px;  color: #2d3748;">
                                    <div style="height:34px; display:flex; align-items:center; justify-content:center;">
                                        ${p.photo ? `<img src="${p.photo}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">` : `<span style="font-size:1.5em;">${p.avatar}</span>`}
                                    </div>
                                    <div style="font-size:0.8em;">
                                        <span class="name-full">${p.name}</span>
                                        <span class="name-initial">${p.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                </th>
                            `).join('')}
                        </tr>
                        <tr style="background: linear-gradient(135deg, #c3dafe 0%, #a3bffa 100%); font-weight:bold;">
                            <td class="history-header" style="background: transparent; padding: 2px; font-size: 1.3em; color: #2d3748;">Σ</td>
                            ${tablePlayers.map(p => `
                                <td class="history-header" data-player-id="${p.id}" style="font-size:1.1em; color: #2d3748; background: transparent; padding: 2px; ">${p.score}</td>
                            `).join('')}
                        </tr>
                        <tr style="background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);">
                            <th colspan="${tablePlayers.length + 1}" style="padding: 8px; color: white; font-weight: bold; font-size: 1em; border-bottom: 3px solid white;">
                                <div style="display: flex; justify-content: center; align-items: center; position: relative;">
                                    <button onclick="window.app.addRound()" style="position: absolute; left: 0; background: rgba(255,255,255,0.2); border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center;" title="Nouveau tour">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                    </button>
                                    <span>${(() => {
                                        const currentRoundsCount = session.history.length;
                                        const effectiveRounds = (session.config && session.config.rounds !== undefined) ? session.config.rounds : game.rounds;
                                        if (effectiveRounds) {
                                            return `Tours ${currentRoundsCount} sur ${effectiveRounds}`;
                                        } else {
                                            return `Tours (${currentRoundsCount})`;
                                        }
                                    })()}</span>
                                </div>
                            </th>
                        </tr>
                        ${(() => {
                            // Afficher le tour en cours dans le thead
                            if (session.history.length > 0) {
                                const currentRoundIndex = session.history.length - 1;
                                const round = session.history[currentRoundIndex];
                                let roundSum = 0;
                                tablePlayers.forEach(p => {
                                    const val = round[p.id];
                                    if (val !== undefined && val !== "") roundSum += parseInt(val);
                                });
                                const checkValue = hasFixedScore ? (game.fixedRoundScore - roundSum) : null;
                                
                                return `
                        <tr class="history-row-new" style="background: #e6f7ff; box-shadow: inset 0 0 0 3px black;">
                            <td class="history-cell-round" id="round-cell-${currentRoundIndex}">
                                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 20h9"></path>
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                    </svg>
                                    ${hasFixedScore ? `<span id="check-val-${currentRoundIndex}" style="font-size:0.8em; font-weight:bold; color:${checkValue === 0 ? 'var(--primary-color)' : '#ef4444'}; margin-top:2px;">${checkValue === 0 ? 'OK' : checkValue}</span>` : ''}
                                </div>
                            </td>
                            ${tablePlayers.map((p, pIndex) => {
                                if (isWinsMode) {
                                    const isChecked = round[p.id] === 1;
                                    return `
                            <td class="history-cell-score">
                                <input type="radio" 
                                       name="winner-round-${currentRoundIndex}"
                                       class="win-radio"
                                       ${isChecked ? 'checked' : ''}
                                       onchange="window.app.updateWinnerForRound('${currentRoundIndex}', '${p.id}')"
                                       onfocus="window.app.showPlayerNamePopupById('${p.id}')"
                                       style="width:20px; height:20px; cursor:pointer;">
                            </td>
                                    `;
                                } else {
                                    return `
                            <td class="history-cell-score">
                                <input type="text" 
                                       class="score-input"
                                       value="${round[p.id] !== undefined ? round[p.id] : ''}" 
                                       readonly
                                       onclick="window.app.showNumericKeypadById('${currentRoundIndex}', '${p.id}', this.value)"
                                       placeholder="-">
                            </td>
                                    `;
                                }
                            }).join('')}
                        </tr>
                                `;
                            }
                            return '';
                        })()}
                    </thead>
    <tbody>
        ${session.history.slice(0, -1).map((r, i) => ({ round: r, roundIndex: i }))
            .reverse()
            .map(({ round, roundIndex }) => {
                let roundSum = 0;
                tablePlayers.forEach(p => {
                    const val = round[p.id];
                    if (val !== undefined && val !== "") roundSum += parseInt(val);
                });
                const checkValue = hasFixedScore ? (game.fixedRoundScore - roundSum) : null;

                return `
                            <tr style="background: #e6f7ff;">
                                <td class="history-cell-round" id="round-cell-${roundIndex}">
                                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                                        <span style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border:2px solid var(--primary-color); border-radius:50%; font-weight:bold; color:var(--primary-color);">${roundIndex + 1}</span>
                                        ${hasFixedScore ? `<span id="check-val-${roundIndex}" style="font-size:0.8em; font-weight:bold; color:${checkValue === 0 ? 'var(--primary-color)' : '#ef4444'}; margin-top:2px;">${checkValue === 0 ? 'OK' : checkValue}</span>` : ''}
                                    </div>
                                </td>
                                ${tablePlayers.map((p, pIndex) => {
                                    
                                    if (isWinsMode) {
                                        const isChecked = round[p.id] === 1;
                                        const allowEdit = store.state.allowEditPastRounds !== false;
                                        return `
                                    <td class="history-cell-score">
                                        <input type="radio" 
                                               name="winner-round-${roundIndex}"
                                               class="win-radio"
                                               ${isChecked ? 'checked' : ''}
                                               ${!allowEdit ? 'disabled' : ''}
                                               onchange="window.app.updateWinnerForRound('${roundIndex}', '${p.id}')"
                                               onfocus="window.app.showPlayerNamePopupById('${p.id}')"
                                               style="width:20px; height:20px; cursor:${allowEdit ? 'pointer' : 'not-allowed'}; opacity:${allowEdit ? '1' : '0.5'};">
                                    </td>
                                        `;
                                    } else {
                                        const allowEdit = store.state.allowEditPastRounds !== false;
                                        return `
                                    <td class="history-cell-score">
                                        <input type="text" 
                                               class="score-input"
                                               value="${round[p.id] !== undefined ? round[p.id] : ''}" 
                                               readonly
                                               ${!allowEdit ? 'disabled' : ''}
                                               onclick="${allowEdit ? `window.app.showNumericKeypadById('${roundIndex}', '${p.id}', this.value)` : ''}"
                                               placeholder="-"
                                               style="${!allowEdit ? 'cursor:not-allowed; opacity:0.5;' : ''}">
                                    </td>
                                        `;
                                    }
                                }).join('')}
                            </tr>
                        `}).join('')}
        ${(() => {
            // Ajouter 20 lignes vides pour montrer la grille de saisie
            const emptyRows = [];
            for (let i = 0; i < 20; i++) {
                emptyRows.push(`
                            <tr style="background: #e6f7ff;">
                                <td class="history-cell-round" style="pointer-events: none;">
                                    <div style="height:28px;"></div>
                                </td>
                                ${tablePlayers.map(() => `
                                    <td class="history-cell-score" style="pointer-events: none;">
                                        <div style="height:40px;"></div>
                                    </td>
                                `).join('')}
                            </tr>
                `);
            }
            return emptyRows.join('');
        })()}
    </tbody>
                </table >
            </div >

        </div >

    <div id="sticky-leaderboard" style="padding:0; margin:0; border-radius:0; ${!store.state.showLeaderboardDuringGame ? 'display:none;' : ''}">
        <h3 style="margin: 10px 0 5px 0; padding: 8px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 8px; text-align: center; font-size: 1.1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Classement</h3>
        
        <div id="leaderboard-content" class="sticky-leaderboard-content">
            ${getLeaderboardHTML()}
        </div>
    </div>
            </div >
        </div >
    </div >
    
    <!-- Pavé numérique personnalisé -->
    <div id="numeric-keypad" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:9999; align-items:center; justify-content:center;" onclick="if(event.target === this) window.app.closeNumericKeypad()">
        <div style="background:white; border-radius:12px; padding:20px; max-width:320px; width:90%; box-shadow:0 4px 20px rgba(0,0,0,0.3);" onclick="event.stopPropagation()">
            <div id="keypad-player-name" style="text-align:center; font-size:1.1em; font-weight:bold; margin-bottom:10px; color:#333;"></div>
            <div id="keypad-display" style="background:#f0f0f0; padding:15px; border-radius:8px; text-align:center; font-size:2em; font-weight:bold; margin-bottom:15px; min-height:60px; display:flex; align-items:center; justify-content:center; color:#333;">0</div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:15px;">
                <button onclick="window.app.keypadInput('7')" style="padding:15px; font-size:1.5em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">7</button>
                <button onclick="window.app.keypadInput('8')" style="padding:15px; font-size:1.5em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">8</button>
                <button onclick="window.app.keypadInput('9')" style="padding:15px; font-size:1.5em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">9</button>
                <button onclick="window.app.keypadInput('4')" style="padding:15px; font-size:1.5em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">4</button>
                <button onclick="window.app.keypadInput('5')" style="padding:15px; font-size:1.5em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">5</button>
                <button onclick="window.app.keypadInput('6')" style="padding:15px; font-size:1.5em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">6</button>
                <button onclick="window.app.keypadInput('1')" style="padding:15px; font-size:1.5em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">1</button>
                <button onclick="window.app.keypadInput('2')" style="padding:15px; font-size:1.5em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">2</button>
                <button onclick="window.app.keypadInput('3')" style="padding:15px; font-size:1.5em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">3</button>
                <button onclick="window.app.keypadToggleSign()" style="padding:15px; font-size:1.5em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">+/-</button>
                <button onclick="window.app.keypadInput('0')" style="padding:15px; font-size:1.5em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">0</button>
                <button onclick="window.app.keypadBackspace()" style="padding:15px; font-size:1.2em; border:1px solid #ddd; border-radius:8px; background:white; color:#000; cursor:pointer; font-weight:bold;">⌫</button>
            </div>
            <div style="display:flex; gap:10px; margin-bottom:10px;">
                <button onclick="window.app.closeNumericKeypad()" style="flex:1; padding:15px; font-size:1.1em; border:1px solid #ddd; border-radius:8px; background:#f0f0f0; color:#000; cursor:pointer; font-weight:bold;">Annuler</button>
                <button onclick="window.app.validateKeypadInput()" style="flex:1; padding:15px; font-size:1.1em; border:none; border-radius:8px; background:var(--primary-color); color:white; cursor:pointer; font-weight:bold;">Valider</button>
            </div>
            <div style="display:flex;">
                <button onclick="window.app.validateKeypadInputAndNext()" style="width:100%; padding:15px; font-size:1.1em; border:none; border-radius:8px; background:#10b981; color:white; cursor:pointer; font-weight:bold;">Valider et suivant ➜</button>
            </div>
        </div>
    </div>
    `;
};
export const GameFormView = (store, gameId) => {
    const isEditMode = !!gameId;
    const game = isEditMode ? store.getGames().find(g => g.id === gameId) : null;
    
    if (isEditMode && !game) return '<div>Jeu introuvable</div>';

    const prefix = 'game';
    const scoreMode = game?.scoreMode || 'points';
    const winCondition = game?.winCondition || 'highest';
    
    return `
    <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1 style="margin:0; text-align:center;">${isEditMode ? 'Modifier Jeu' : 'Nouveau Jeu'}</h1>
        <div></div>
    </header>
    <div style="flex:1; overflow-y:auto; width:100%; padding-bottom:20px;">
    <div class="card">
        ${isEditMode ? `<input type="hidden" id="${prefix}-id" value="${game.id}">` : ''}
        
        ${isEditMode ? `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:0; margin-bottom:15px; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin:0; font-size:1.1rem; font-weight:bold;">Informations</h3>
            <button onclick="window.app.toggleGameFavorite('${game.id}')" style="background:none; border:none; cursor:pointer; padding:0; width:28px; height:28px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="${game.favorite ? '#ffd700' : 'none'}" stroke="${game.favorite ? '#fff' : '#fff'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
            </button>
        </div>
        ` : `
        <h3 style="margin-top:0; margin-bottom:15px; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Informations</h3>
        `}

        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <label for="${prefix}-name" style="font-weight:bold; width: 40%;">Nom du jeu</label>
            <input type="text" id="${prefix}-name" value="${game?.name || ''}" style="width:55%; padding:10px; border:1px solid #ccc; border-radius:5px; text-align:right;">
        </div>

        <h3 style="margin-top:25px; margin-bottom:15px; padding:12px 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Score</h3>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
            <div style="font-weight:bold; width:40%; display:flex; align-items:center; gap:8px;">
                <label for="${prefix}-score-mode">Mode de score</label>
                <span onclick="window.app.showHelpPopup(&quot;Choisissez si les joueurs accumulent des points ou si on compte juste les victoires (1 point par tour gagné)&quot;)" style="cursor:pointer; font-size:1.2em; color:#667eea;" title="Aide">ℹ️</span>
            </div>
            <select id="${prefix}-score-mode" onchange="document.getElementById('${prefix}-fixed-score-container').style.display = this.value === 'points' ? 'flex' : 'none';" style="width:55%; padding:15px; border:1px solid #ccc; border-radius:5px; text-align:right; background:white;">
                <option value="points" ${scoreMode === 'points' ? 'selected' : ''}>Points</option>
                <option value="wins" ${scoreMode === 'wins' ? 'selected' : ''}>Victoires</option>
            </select>
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
            <label for="${prefix}-type" style="font-weight:bold; width: 40%;">Vainqueur</label>
            <select id="${prefix}-type" style="width:55%; padding:15px; border:1px solid #ccc; border-radius:5px; text-align:right; background:white;">
                <option value="highest" ${winCondition === 'highest' ? 'selected' : ''}>Le plus grand</option>
                <option value="lowest" ${winCondition === 'lowest' ? 'selected' : ''}>Le plus petit</option>
            </select>
        </div>

        <div id="${prefix}-fixed-score-container" style="display:${scoreMode === 'points' ? 'flex' : 'none'}; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
            <div style="font-weight:bold; width:40%; display:flex; align-items:center; gap:8px;">
                <label for="${prefix}-fixed-score-value">Score fixe</label>
                <span onclick="window.app.showHelpPopup(&quot;Le score est fixé pour un tour de jeu, ce qui permet d'afficher un décompte lors de la saisie des scores&quot;)" style="cursor:pointer; font-size:1.2em; color:#667eea;" title="Aide">ℹ️</span>
            </div>
            <input type="number" id="${prefix}-fixed-score-value" value="${game?.fixedRoundScore || ''}" placeholder="Optionnel" style="width:55%; padding:15px; border:1px solid #ccc; border-radius:5px; text-align:right;">
        </div>

        <h3 style="margin-top:25px; margin-bottom:15px; padding:12px 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Fin de partie</h3>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
            <label for="${prefix}-target" style="font-weight:bold; width:40%;">Limite de score</label>
            <input type="number" id="${prefix}-target" value="${game?.target || ''}" placeholder="Illimité" style="width:55%; padding:15px; border:1px solid #ccc; border-radius:5px; text-align:right;">
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
            <label for="${prefix}-rounds" style="font-weight:bold; width:40%;">Limite de tours</label>
            <input type="number" id="${prefix}-rounds" value="${game?.rounds || ''}" placeholder="Illimité" style="width:55%; padding:15px; border:1px solid #ccc; border-radius:5px; text-align:right;">
        </div>

        <h3 style="margin-top:25px; margin-bottom:15px; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Nombre de joueurs</h3>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
            <label for="${prefix}-min-players" style="font-weight:bold; width:40%;">Minimum</label>
            <input type="number" id="${prefix}-min-players" value="${game?.minPlayers || ''}" placeholder="Optionnel" min="1" style="width:55%; padding:15px; border:1px solid #ccc; border-radius:5px; text-align:right;">
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
            <label for="${prefix}-max-players" style="font-weight:bold; width:40%;">Maximum</label>
            <input type="number" id="${prefix}-max-players" value="${game?.maxPlayers || ''}" placeholder="Optionnel" min="1" style="width:55%; padding:15px; border:1px solid #ccc; border-radius:5px; text-align:right;">
        </div>

    </div>
    </div>
    
    ${isEditMode ? `
    <div style="position:sticky; bottom:0; background:white; padding:15px; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); display:flex; gap:10px; z-index:100;">
        <button onclick="window.app.submitGameForm()" style="flex:1; padding:12px;">Enregistrer</button>
        <button onclick="window.app.navigateDeleteGame('${game.id}')" style="flex:1; padding:12px; background-color:#ef4444; color:white;">Supprimer</button>
    </div>
    ` : `
    <div style="padding-bottom:20px;">
        <button onclick="window.app.submitGameForm()" style="width:100%">Créer</button>
    </div>
    `}
    
    <style>
        .game-icon-opt.selected { background-color: var(--primary-color) !important; color: white; }
    </style>
`;
};

// Maintenir la compatibilité avec l'ancien code
export const CreateGameView = (store) => GameFormView(store);
export const EditGameView = (store, gameId) => GameFormView(store, gameId);

export const ConfirmDeleteGameView = (store, gameId) => {
    const game = store.getGames().find(g => g.id === gameId);
    if (!game) return '<div>Jeu introuvable</div>';

    return `
    <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1 style="margin:0; text-align:center;">Supprimer Jeu</h1>
        <div></div>
    </header>
    <div style="flex:1; overflow-y:auto; width:100%;">
    <div class="card" style="text-align:center; padding: 40px 20px;">
        <div style="font-size:4em; margin-bottom:10px; color:${game.color};">🎲</div>
        <h2 style="margin-bottom:10px;">Supprimer ${game.name} ?</h2>
        <p style="color:#666; margin-bottom:30px;">Cette action est irréversible. L'historique des parties de ce jeu ne sera plus accessible correctement.</p>

        <button onclick="window.app.executeDeleteGame('${gameId}')" style="width:100%; background-color:#ef4444; margin-bottom:15px; padding:15px;">Supprimer définitivement</button>
        <button onclick="window.app.router.back()" style="width:100%; background-color:#ddd; color:#333; padding:15px;">Annuler</button>
    </div>
    </div>
`;
};

export const AvatarSelectionView = (store) => {
    // Récupérer les données temporaires de la session
    const tempData = store.state.tempAvatarSelection || {};
    const currentAvatar = tempData.avatar || '👤';
    const currentPhoto = tempData.photo || '';
    const hasPhoto = !!currentPhoto;
    
    return `
    <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 15px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1 style="margin:0; text-align:center;">Choix de l'avatar</h1>
        <div></div>
    </header>
    <div style="flex:1; overflow-y:auto; width:100%;">
    <div class="card" style="padding-bottom:80px;">
        <h3 style="margin-top:0; margin-bottom:10px; padding:8px 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border-radius:8px; font-size:1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Aperçu</h3>

        <div style="display:flex; align-items:center; justify-content:center; margin-bottom:15px;">
            <div id="avatar-selection-preview" style="width:70px; height:70px; display:flex; align-items:center; justify-content:center; border-radius:50%; background:#eee; font-size:2.5em; border:3px solid var(--primary-color); box-shadow: 0 0 8px var(--primary-color);">
                <span id="avatar-selection-avatar-display" class="${!hasPhoto ? 'selected' : ''}" style="display:${!hasPhoto ? 'block' : 'none'};">${currentAvatar}</span>
                <img id="avatar-selection-photo-display" src="${currentPhoto}" class="${hasPhoto ? 'selected' : ''}" style="width:70px; height:70px; border-radius:50%; object-fit:cover; display:${hasPhoto ? 'block' : 'none'};">
            </div>
        </div>

        <h3 style="margin-top:15px; margin-bottom:10px; padding:8px 12px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color:white; border-radius:8px; font-size:1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Avatars</h3>

        <div style="margin-bottom:15px; text-align:center;">
            <div id="avatar-selection-image-selection" style="display:flex; justify-content:center; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
                ${['👤', '🧑‍🚀', '🦸', '🦹', '🧙', '🧟', '🧛', '🧞', '🧜', '🧚'].map(emoji => `
                <div onclick="window.app.selectAvatar('avatar-selection', '${emoji}');" class="avatar-opt ${currentAvatar === emoji && !hasPhoto ? 'selected' : ''}" style="font-size:1.8em; text-align:center; padding:6px; border-radius:6px; cursor:pointer; background:#eee; min-width:45px;">${emoji}</div>
            `).join('')}
            </div>
            <input type="hidden" id="avatar-selection-avatar" value="${currentAvatar}">
        </div>

        <h3 style="margin-top:15px; margin-bottom:10px; padding:8px 12px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Photo</h3>

        <div style="margin-bottom:10px; text-align:center;">
            <!-- Camera Actions -->
            <div id="avatar-selection-photo-actions" style="margin-bottom:10px;">
                <button onclick="window.app.startCamera('avatar-selection')" style="background:var(--primary-color); color:white; padding:10px 16px; border-radius:8px; border:none; font-size:1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">📷 Prendre une Photo</button>
            </div>

            <!-- Camera View -->
            <div id="avatar-selection-camera-container" style="display:none; margin-bottom:10px;">
                <video id="avatar-selection-camera-video" autoplay playsinline style="width:150px; height:150px; background:#000; border-radius:50%; object-fit:cover; margin-bottom:8px; border:3px solid var(--primary-color);"></video>
                <br>
                <button onclick="window.app.capturePhoto('avatar-selection')" style="background:var(--primary-color); color:white; padding:10px 16px; border-radius:20px; border:none; font-weight:bold; font-size:1rem;">📸 Capturer</button>
                <button onclick="window.app.stopCamera('avatar-selection')" style="background:#eee; color:#333; padding:10px 16px; border-radius:8px; margin-left:8px; font-size:1rem;">Annuler</button>
            </div>

            <!-- Photo capture display -->
            <div id="avatar-selection-photo-capture-preview" style="display:${hasPhoto ? 'block' : 'none'}; margin-top:10px;">
                <div style="position:relative; display:inline-block;">
                    <img id="avatar-selection-photo-capture-display" src="${currentPhoto}" onclick="window.app.reselectPhoto('avatar-selection');" style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:3px solid var(--primary-color); box-shadow: 0 0 8px var(--primary-color); cursor:pointer;">
                    <button onclick="event.stopPropagation(); window.app.deletePhoto('avatar-selection');" style="position:absolute; top:-5px; right:-5px; background:#ef4444; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; font-size:1.2em; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">×</button>
                </div>
            </div>
        </div>

    </div>
    </div>
    
    <div style="position:fixed; bottom:0; left:0; right:0; background:white; padding:15px; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index:100;">
        <button onclick="window.app.submitAvatarSelection()" style="width:100%; padding:15px; font-size:1.1rem; font-weight:bold;">Valider</button>
    </div>
    
    <style>
        .avatar-opt.selected { background-color: var(--primary-color); color: white; border: 2px solid var(--primary-color); }
        #avatar-selection-avatar-display.selected { text-shadow: 0 0 5px var(--primary-color); }
        #avatar-selection-photo-display.selected { border: 3px solid var(--primary-color); box-shadow: 0 0 10px var(--primary-color); }
    </style>
`;
};

export const PlayerFormView = (store, playerId) => {
    const isEditMode = !!playerId;
    const player = isEditMode ? store.getPlayers().find(p => p.id === playerId) : null;
    
    if (isEditMode && !player) return '<div>Joueur introuvable</div>';

    const prefix = 'player';
    const defaultAvatar = '👤';
    
    // Récupérer les données temporaires si elles existent
    const tempData = store.state.tempAvatarSelection || {};
    
    // Déterminer les valeurs à afficher : temp > player > défaut
    const currentName = tempData.name !== undefined ? tempData.name : (player?.name || '');
    const currentAvatar = tempData.avatar !== undefined ? tempData.avatar : (player?.avatar || defaultAvatar);
    const currentPhoto = tempData.photo !== undefined ? tempData.photo : (player?.photo || '');
    const hasPhoto = !!currentPhoto;
    
    // Récupérer les cercles
    const circles = store.getCircles();
    // Utiliser les cercles temporaires si disponibles, sinon les cercles du joueur
    const playerCircles = tempData.circles !== undefined ? tempData.circles : (player?.circles || []);
    
    return `
    <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.cancelPlayerForm()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1 style="margin:0; text-align:center;">${isEditMode ? 'Modifier Joueur' : 'Nouveau Joueur'}</h1>
        <div></div>
    </header>
    <div style="flex:1; overflow-y:auto; width:100%; padding-bottom:20px;">
    <div class="card">
        ${isEditMode ? `<input type="hidden" id="${prefix}-id" value="${player.id}">` : ''}
        <input type="hidden" id="${prefix}-avatar" value="${currentAvatar}">
        <input type="hidden" id="${prefix}-photo-data" value="${currentPhoto || ''}">

        <h3 style="margin-top:0; margin-bottom:15px; padding:12px 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Information</h3>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
            <label for="${prefix}-name" style="font-weight:bold; width: 40%;">Nom</label>
            <input type="text" id="${prefix}-name" value="${currentName}" style="width:55%; padding:10px; border:1px solid #ccc; border-radius:5px; text-align:right;">
        </div>
        
        <div onclick="window.app.openAvatarSelection()" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px; cursor:pointer;">
            <label style="font-weight:bold; width:40%;">Avatar</label>
            <div style="display:flex; align-items:center; gap:10px;">
                <div id="${prefix}-current-image-preview" style="width:50px; height:50px; display:flex; align-items:center; justify-content:center; border-radius:50%; background:#eee; font-size:2em; border:3px solid var(--primary-color); box-shadow: 0 0 5px var(--primary-color);">
                    <span id="${prefix}-avatar-display" class="${!hasPhoto ? 'selected' : ''}" style="display:${!hasPhoto ? 'block' : 'none'};">${currentAvatar}</span>
                    <img id="${prefix}-photo-display" src="${currentPhoto || ''}" class="${hasPhoto ? 'selected' : ''}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; display:${hasPhoto ? 'block' : 'none'};">
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </div>
        </div>

        <h3 style="margin-top:25px; margin-bottom:15px; padding:12px 15px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:space-between;">
            <span>Cercles</span>
            <button onclick="event.stopPropagation(); window.app.navigateCircleForm(${isEditMode ? `'${player.id}'` : 'null'})" style="background:rgba(255,255,255,0.3); border:none; color:white; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.5em; cursor:pointer; padding:0;">+</button>
        </h3>
        
        ${circles.length === 0 ? `
            <p style="text-align:center; color:#999; margin:20px 0;">Aucun cercle. Créez-en un avec le bouton +</p>
        ` : `
            ${circles.map(c => {
                const isChecked = playerCircles.includes(c.id);
                return `
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; padding:10px; border-radius:5px; background:#f9f9f9;">
                    <div style="display:flex; align-items:center; gap:10px; flex:1;">
                        <input type="checkbox" id="circle-${c.id}" ${isChecked ? 'checked' : ''} onchange="window.app.togglePlayerCircle(${isEditMode ? `'${player.id}'` : 'null'}, '${c.id}')" style="width:20px; height:20px; cursor:pointer;">
                        <label for="circle-${c.id}" style="cursor:pointer; flex:1;">${c.name}</label>
                    </div>
                    <div style="display:flex; gap:5px;">
                        <button onclick="event.stopPropagation(); window.app.navigateEditCircle('${c.id}', ${isEditMode ? `'${player.id}'` : 'null'})" style="background:none; border:none; cursor:pointer; padding:5px;" title="Modifier">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button onclick="event.stopPropagation(); window.app.confirmDeleteCircle('${c.id}', ${isEditMode ? `'${player.id}'` : 'null'})" style="background:none; border:none; cursor:pointer; padding:5px;" title="Supprimer">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                `;
            }).join('')}
        `}

    </div>
    </div>
    
    ${isEditMode ? `
    <div style="position:sticky; bottom:0; background:white; padding:15px; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); display:flex; gap:10px; z-index:100;">
        <button onclick="window.app.submitPlayerForm()" style="flex:1; padding:12px;">Enregistrer</button>
        <button onclick="window.app.router.navigate('confirmDeletePlayer', { playerId: '${player.id}' })" style="flex:1; padding:12px; background-color:#ef4444; color:white;">Supprimer</button>
    </div>
    ` : `
    <div style="padding-bottom:20px;">
        <button onclick="window.app.submitPlayerForm()" style="width:100%">Ajouter</button>
    </div>
    `}
    
    <style>
        #${prefix}-avatar-display.selected { text-shadow: 0 0 3px var(--primary-color); }
        #${prefix}-photo-display.selected { border: 3px solid var(--primary-color); box-shadow: 0 0 5px var(--primary-color); }
    </style>
`;
};

// Maintenir la compatibilité avec l'ancien code
export const CreatePlayerView = (store) => PlayerFormView(store);
export const EditPlayerView = (store, playerId) => PlayerFormView(store, playerId);

export const ConfirmDeletePlayerView = (store, playerId) => {
    const player = store.getPlayers().find(p => p.id === playerId);
    if (!player) return '<div>Joueur introuvable</div>';

    return `
        <div style="display:flex; align-items:center; justify-content:center; min-height:100%; padding:20px;">
            <div class="card" style="max-width:500px; width:100%; text-align:center;">
                <div style="display:flex; flex-direction:column; align-items:center; gap:15px; margin-bottom:20px;">
                    ${player.photo 
                        ? `<img src="${player.photo}" style="width:80px; height:80px; border-radius:50%; object-fit:cover; border:3px solid #ef4444;">`
                        : `<div style="font-size:4em;">${player.avatar}</div>`
                    }
                    <h2 style="margin:0; color:#333;">${player.name}</h2>
                </div>
                <p style="color:#666; margin-bottom:30px;">Voulez-vous vraiment supprimer ce joueur ? Il ne sera plus visible dans la liste des joueurs.</p>
                <button onclick="window.app.executeDeletePlayer('${playerId}')" style="width:100%; background-color:#ef4444; margin-bottom:15px; padding:15px;">Supprimer définitivement</button>
                <button onclick="window.app.router.back()" style="width:100%; background-color:#ddd; color:#333; padding:15px;">Annuler</button>
            </div>
        </div>
    `;
};

export const CircleFormView = (store, circleId, returnPlayerId) => {
    const isEditMode = !!circleId;
    const circle = isEditMode ? store.getCircles().find(c => c.id === circleId) : null;
    
    if (isEditMode && !circle) return '<div>Cercle introuvable</div>';

    return `
    <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1 style="margin:0; text-align:center;">${isEditMode ? 'Modifier Cercle' : 'Nouveau Cercle'}</h1>
        <div></div>
    </header>
    <div style="flex:1; overflow-y:auto; width:100%; padding-bottom:20px;">
    <div class="card">
        ${isEditMode ? `<input type="hidden" id="circle-id" value="${circle.id}">` : ''}
        ${returnPlayerId ? `<input type="hidden" id="circle-return-player" value="${returnPlayerId}">` : ''}

        <h3 style="margin-top:0; margin-bottom:15px; padding:12px 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Information</h3>

        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
            <label for="circle-name" style="font-weight:bold; width: 40%;">Nom</label>
            <input type="text" id="circle-name" value="${circle?.name || ''}" placeholder="Ex: Famille, Amis..." style="width:55%; padding:10px; border:1px solid #ccc; border-radius:5px; text-align:right;">
        </div>
    </div>
    </div>
    
    ${isEditMode ? `
    <div style="position:sticky; bottom:0; background:white; padding:15px; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); display:flex; gap:10px; z-index:100;">
        <button onclick="window.app.submitCircleForm()" style="flex:1; padding:12px;">Enregistrer</button>
        <button onclick="window.app.deleteCircle('${circle.id}')" style="flex:1; padding:12px; background-color:#ef4444; color:white;">Supprimer</button>
    </div>
    ` : `
    <div style="position:sticky; bottom:0; background:white; padding:15px; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index:100;">
        <button onclick="window.app.submitCircleForm()" style="width:100%; padding:12px;">Ajouter</button>
    </div>
    `}
`;
};

export const GameSetupView = (store, gameId) => {
    const game = store.getGames().find(g => g.id === gameId);
    if (!game) return '<div>Jeu introuvable</div>';

    // Default values from game definition
    const defaultRounds = game.rounds || '';
    const defaultTarget = game.target || '';

    return `
                        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1 style="margin:0; text-align:center;">${game.name}</h1>
                            <div></div>
                        </header>
                        <div style="flex:1; overflow-y:auto; width:100%;">
                        <div class="card" style="margin-bottom: 80px;">
                            <h3 style="margin-top:0; margin-bottom:15px; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">Adaptez si besoin</h3>

                            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
                                <label for="setup-score-limit" style="font-weight:bold; width: 60%;">Limite de Score</label>
                                <input type="number" id="setup-score-limit" value="${defaultTarget}" placeholder="Ex: 1000" style="width:30%; padding:10px; border:1px solid #ccc; border-radius:5px; text-align:right;">
                            </div>

                            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
                                <label for="setup-round-limit" style="font-weight:bold; width: 60%;">Nombre de tours</label>
                                <input type="number" id="setup-round-limit" value="${defaultRounds}" placeholder="Illimité" style="width:30%; padding:10px; border:1px solid #ccc; border-radius:5px; text-align:right;">
                            </div>
                        </div>
                        </div>

                        <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100;">
                            <button onclick="window.app.finishSetupAndStart('${gameId}')" style="width:100%; padding: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">Lancer la partie</button>
                        </div>
                        `;
};

export const UpdateLimitsView = (store) => {
    const session = store.restoreSession();
    if (!session) return '<div>Erreur</div>';

    // Get current effective limits
    const game = store.getGames().find(g => g.id === session.gameId);
    const currentRounds = (session.config && session.config.rounds !== undefined) ? session.config.rounds : (game.rounds || '');
    const currentTarget = (session.config && session.config.target !== undefined) ? session.config.target : (game.target || '');
    const gameTitle = game ? game.name : 'Fin de partie';

    return `
                        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1 style="margin:0; text-align:center;">${gameTitle}</h1>
                            <div></div>
                        </header>
                        <div style="flex:1; overflow-y:auto; width:100%;">
                        <div class="card" style="margin-bottom: 80px;">
                            <h3 style="margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">Adaptez si besoin</h3>

                            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
                                <label for="update-score-limit" style="font-weight:bold; width:60%;">Limite de score</label>
                                <input type="number" id="update-score-limit" value="${currentTarget}" placeholder="Illimité" style="width:30%; padding:10px; border:1px solid #ccc; border-radius:5px; text-align:right;">
                            </div>

                            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; border-bottom:1px solid #f0f0f0; padding-bottom:10px;">
                                <label for="update-round-limit" style="font-weight:bold; width:60%;">Limite de tours</label>
                                <input type="number" id="update-round-limit" value="${currentRounds}" placeholder="Illimité" style="width:30%; padding:10px; border:1px solid #ccc; border-radius:5px; text-align:right;">
                            </div>
                        </div>
                        </div>

                        <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100;">
                            <button onclick="window.app.submitUpdateLimits()" style="width:100%; padding: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">Valider et Continuer</button>
                        </div>
                        `;
};


export const AddIngamePlayerView = (store) => {
    // Show players NOT in current session
    const session = store.restoreSession();
    if (!session) return '<div>Erreur</div>';

    const existingIds = new Set(session.players.map(p => p.id));
    const allPlayers = store.getPlayers().filter(p => !existingIds.has(p.id));
    const circles = store.getCircles();
    const selectedCircleFilter = window.app?.selectedCircleFilter || 'all';
    
    // Filter players based on selected circle
    let availablePlayers = allPlayers;
    if (selectedCircleFilter !== 'all') {
        availablePlayers = allPlayers.filter(p => p.circles && p.circles.includes(selectedCircleFilter));
    }
    
    const game = store.getGames().find(g => g.id === session.gameId);
    const gameTitle = game ? game.name : 'Joueurs';

    return `
                        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1 style="margin:0; text-align:center;">${gameTitle}</h1>
                            <div></div>
                        </header>
                        <div style="flex:1; overflow-y:auto; width:100%; padding-bottom:20px;">
                        <h3 style="margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">Joueurs disponibles</h3>
                        ${circles.length > 0 ? `
                        <div style="margin-bottom:15px;">
                            <select id="circle-filter" onchange="window.app.filterIngamePlayersByCircle(this.value)" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:8px; font-size:1em; background:white;">
                                <option value="all" ${selectedCircleFilter === 'all' ? 'selected' : ''}>Tous les joueurs</option>
                                ${circles.map(c => `<option value="${c.id}" ${selectedCircleFilter === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                            </select>
                        </div>
                        ` : ''}
                        <div class="grid">
                            <!-- Option to create new -->
                            <div class="card" onclick="window.app.navigateCreatePlayer()" style="display:flex; align-items:center; justify-content:center; cursor:pointer; min-height:100px; border: 2px dashed #ccc; background:transparent;">
                                <div style="text-align:center; color:#888;">
                                    <span style="font-size:2em;">+</span><br>Nouveau
                                </div>
                            </div>

                            ${availablePlayers.map(p => `
            <div class="card" onclick="window.app.addPlayerToGame('${p.id}')" style="cursor:pointer; padding:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100px;">
                <div style="display:flex; justify-content:center; align-items:center; margin-bottom:8px;">
                    ${p.photo ? `<img src="${p.photo}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` : `<span style="font-size:2em;">${p.avatar}</span>`}
                </div>
                <h3 style="margin:0; font-size:1em; text-align:center;">${p.name}</h3>
            </div>
        `).join('')}
                        </div>
                        </div>
                        `;
};

export const ReplaceIngamePlayerView = (store, oldPlayerId) => {
    // Show players NOT in current session
    const session = store.restoreSession();
    if (!session) return '<div>Erreur</div>';

    const existingIds = new Set(session.players.map(p => p.id));
    const allPlayers = store.getPlayers().filter(p => !existingIds.has(p.id));
    const circles = store.getCircles();
    const selectedCircleFilter = window.app?.selectedCircleFilter || 'all';
    
    // Filter players based on selected circle
    let availablePlayers = allPlayers;
    if (selectedCircleFilter !== 'all') {
        availablePlayers = allPlayers.filter(p => p.circles && p.circles.includes(selectedCircleFilter));
    }
    
    const game = store.getGames().find(g => g.id === session.gameId);
    const gameTitle = game ? game.name : 'Joueurs';

    return `
                        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1 style="margin:0; text-align:center;">${gameTitle}</h1>
                            <div></div>
                        </header>
                        <div style="flex:1; overflow-y:auto; width:100%; padding-bottom:20px;">
                        <h3 style="margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">Remplacer par</h3>
                        ${circles.length > 0 ? `
                        <div style="margin-bottom:15px;">
                            <select id="circle-filter" onchange="window.app.filterIngamePlayersByCircle(this.value, '${oldPlayerId}')" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:8px; font-size:1em; background:white;">
                                <option value="all" ${selectedCircleFilter === 'all' ? 'selected' : ''}>Tous les joueurs</option>
                                ${circles.map(c => `<option value="${c.id}" ${selectedCircleFilter === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                            </select>
                        </div>
                        ` : ''}
                        <div class="grid">
                            <!-- Option to create new -->
                            <div class="card" onclick="window.app.navigateCreatePlayer()" style="display:flex; align-items:center; justify-content:center; cursor:pointer; min-height:100px; border: 2px dashed #ccc; background:transparent;">
                                <div style="text-align:center; color:#888;">
                                    <span style="font-size:2em;">+</span><br>Nouveau
                                </div>
                            </div>

                            ${availablePlayers.map(p => `
            <div class="card" onclick="window.app.confirmReplacePlayer('${oldPlayerId}', '${p.id}')" style="cursor:pointer; padding:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100px;">
                <div style="display:flex; justify-content:center; align-items:center; margin-bottom:8px;">
                    ${p.photo ? `<img src="${p.photo}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` : `<span style="font-size:2em;">${p.avatar}</span>`}
                </div>
                <h3 style="margin:0; font-size:1em; text-align:center;">${p.name}</h3>
            </div>
        `).join('')}
                        </div>
                        </div>
                        `;
};

export const RemoveIngamePlayerView = (store) => {
    const session = store.restoreSession();
    if (!session) return '<div>Erreur</div>';

    // Show players IN current session
    const players = session.players.map(sp => {
        const info = store.getPlayers().find(p => p.id === sp.id);
        return { ...sp, ...info };
    });

    const game = store.getGames().find(g => g.id === session.gameId);
    const gameTitle = game ? game.name : 'Supprimer un joueur';

    return `
                        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1 style="margin:0; text-align:center;">${gameTitle}</h1>
                            <div></div>
                        </header>
                        <div style="flex:1; overflow-y:auto; width:100%; padding-bottom:20px;">
                        <div class="card">
                            <h3 style="margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">Selectionnez le joueur à supprimer</h3>
                            <div class="grid">
                                ${players.map(p => `
                <div class="card" onclick="window.app.router.navigate('confirmRemoveIngamePlayer', { playerId: '${p.id}' })" style="cursor:pointer; padding:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100px;">
                    <div style="display:flex; justify-content:center; align-items:center; margin-bottom:8px;">
                        ${p.photo ? `<img src="${p.photo}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` : `<span style="font-size:2em;">${p.avatar}</span>`}
                    </div>
                    <h3 style="margin:0; font-size:1em; text-align:center;">${p.name}</h3>
                </div>
            `).join('')}
                            </div>
                        </div>
                        </div>
                        <style>
                            .grid {display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
                        </style>
                        `;
};

export const ReorderIngamePlayersView = (store) => {
    const session = store.restoreSession();
    if (!session) return '<div>Partie introuvable</div>';

    // We want to re-use the updateSelectedPlayersUI logic but strictly for this view.
    // However, the existing logic is tied to "selectedPlayers" property of App.
    // We can just initialize App.selectedPlayers with session players?
    // Be careful not to mess up "New Game" selection.
    // A safer way is to have a dedicated logic or state for this view in App.
    // Or just make this view self-contained with its own script.

    // Let's use window.app.ingameReorderList as temporary state?
    // Or better: Let App handle it via a new method.

    // We need to initialize the list
    if (!window.app.reorderIngameState) {
        window.app.reorderIngameState = session.players.map(p => p.id);
    }

    // The view will be static initially, then populated by updateReorderIngameUI()
    // We can call updateReorderIngameUI() immediately after render (like we did for navigate).

    const game = store.getGames().find(g => g.id === session.gameId);
    const gameTitle = game ? game.name : 'Joueurs';

    return `
                        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.saveReorderIngame()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1 style="margin:0; text-align:center;">${gameTitle}</h1>
                            <div></div>
                        </header>
                        <div style="flex:1; overflow-y:auto; width:100%;">
                        <div class="card" style="margin-bottom:80px;"> <!-- Margin bottom for fixed footer button space -->
                            <h3 style="margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">Glissez pour réorganiser</h3>
                            <div id="reorder-ingame-list"></div>
                        </div>
                        </div>

                        <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100;">
                            <button onclick="window.app.router.navigate('addIngamePlayer')" style="width:100%; padding: 15px; background:var(--primary-color); color:white; border:none; border-radius:10px; font-weight:bold; font-size:1.1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display:flex; align-items:center; justify-content:center; gap:10px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Ajouter un joueur
                            </button>
                        </div>

                        <!-- Script to init UI -->
                        <script>
                            setTimeout(() => window.app.updateReorderIngameUI(), 50);
                        </script>
                        `;
};

export const ConfirmRemoveIngamePlayerView = (store, playerId) => {
    const session = store.restoreSession();
    // find player in session or global store
    const player = store.getPlayers().find(p => p.id === playerId);

    if (!player) return '<div>Erreur: Joueur introuvable</div>';

    const game = store.getGames().find(g => g.id === session.gameId);
    const gameTitle = game ? game.name : 'Confirmation';

    return `
                        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1 style="margin:0; text-align:center;">${gameTitle}</h1>
                            <div></div>
                        </header>
                        <div style="flex:1; overflow-y:auto; width:100%;">
                        <div class="card" style="text-align:center; padding: 40px 20px;">
                            <div style="font-size:4em; margin-bottom:10px;">${player.avatar}</div>
                            <h2 style="margin-bottom:10px;">${player.name}</h2>
                            <p style="color:#666; margin-bottom:30px;">Voulez-vous vraiment supprimer ce joueur de la partie en cours ? Son score sera perdu.</p>

                            <button onclick="window.app.executeRemovePlayer('${playerId}')" style="width:100%; background-color:#ef4444; margin-bottom:15px; padding:15px;">Supprimer définitivement</button>
                            <button onclick="window.app.router.back()" style="width:100%; background-color:#ddd; color:#333; padding:15px;">Annuler</button>
                        </div>
                        </div>
                        `;
};

export const ConfirmEndGameView = (store) => {
    const session = store.restoreSession();
    const game = session ? store.getGames().find(g => g.id === session.gameId) : null;
    const gameTitle = game ? game.name : 'Fin de partie';

    return `
                        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1 style="margin:0; text-align:center;">${gameTitle}</h1>
                            <div></div>
                        </header>
                        <div class="card" style="text-align:center; padding: 40px 20px;">
                            <div style="font-size:4em; margin-bottom:10px;">🏁</div>
                            <h2 style="margin-bottom:10px;">Terminer la partie ?</h2>
                            <p style="color:#666; margin-bottom:30px;">La partie sera sauvegardée dans l'historique et vous retournerez à l'accueil.</p>

                            <button onclick="window.app.executeEndGame()" style="width:100%; background-color:var(--primary-color); margin-bottom:15px; padding:15px;">Terminer la partie</button>
                            <button onclick="window.app.router.back()" style="width:100%; background-color:#ddd; color:#333; padding:15px;">Annuler</button>
                        </div>
                        `;
};

export const ConfirmCancelGameView = (store) => {
    const session = store.restoreSession();
    const game = session ? store.getGames().find(g => g.id === session.gameId) : null;
    const gameTitle = game ? game.name : 'Annuler la partie';

    return `
                        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1 style="margin:0; text-align:center;">${gameTitle}</h1>
                            <div></div>
                        </header>
                        <div style="flex:1; overflow-y:auto; width:100%;">
                        <div class="card" style="text-align:center; padding: 40px 20px; margin-bottom:100px;">
                            <div style="font-size:4em; margin-bottom:10px; color:#ef4444;">🗑️</div>
                            <h2 style="margin-bottom:10px;">Tout effacer ?</h2>
                            <p style="color:#666;">Attention, si vous annulez, <strong>aucune donnée ne sera sauvegardée</strong>. L'historique de cette partie sera perdu.</p>
                        </div>
                        </div>
                        
                        <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100;">
                            <button onclick="window.app.executeCancelGame()" style="width:100%; padding:15px; background:#ef4444; color:white; border:none; border-radius:8px; font-weight:bold; font-size:1.1rem; cursor:pointer;">Annuler sans sauvegarder</button>
                        </div>
                    </div>
                    `;
};

export const GameOverView = (store) => {
    const session = store.restoreSession();
    if (!session) return '<div>Partie non trouvée</div>';

    const game = store.getGames().find(g => g.id === session.gameId);
    const isLowestWin = game && game.winCondition === 'lowest';
    const gameOverReason = session.gameOverReason || 'Partie terminée';
    const gameTitle = game ? game.name : 'Fin de partie';

    // Sort players
    const players = session.players.map(sp => {
        const info = store.getPlayers().find(p => p.id === sp.id);
        return { ...sp, ...info };
    }).sort((a, b) => isLowestWin ? a.score - b.score : b.score - a.score);

    const winner = players[0];

    return `
                    <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px; flex-shrink:0;">
                        <button onclick="window.app.router.navigate('game')" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                        <h1 style="margin:0; text-align:center;">${gameTitle}</h1>
                        <div></div>
                    </header>
                    <div style="flex:1; display:flex; flex-direction:column; width:100%;">
                    <div class="gameover-container" style="flex-shrink:0;">
                        <div class="gameover-icon">🏆</div>
                        <h1 class="gameover-title">${winner.name} a gagné !</h1>
                        <p class="gameover-subtitle">${gameOverReason}</p>

                        <div class="card" style="margin-bottom:20px;">
                            <h3 class="gameover-section-title">Classement Final</h3>
                            <div style="max-height:400px; overflow-y:auto;">
                                <table class="leaderboard-table">
                                    <tbody>
                                        ${(() => {
        // Calculer les rangs réels avec gestion des égalités
        let currentRank = 1;
        return players.map((p, i) => {
            if (i > 0 && players[i].score !== players[i - 1].score) {
                currentRank = i + 1;
            }
            
            let rankIcon = `#${currentRank}`;
            let size = '1em';

            if (currentRank === 1) { rankIcon = '🥇'; size = '1.5em'; }
            else if (currentRank === 2) { rankIcon = '🥈'; }
            else if (currentRank === 3) { rankIcon = '🥉'; }

            let rankClass = 'rank-text-default';
            if (currentRank === 1) rankClass = 'rank-text-0';
            else if (currentRank === 2) rankClass = 'rank-text-1';
            else if (currentRank === 3) rankClass = 'rank-text-2';

            return `
                        <tr>
                            <td class="gameover-rank-cell ${rankClass}">${rankIcon}</td>
                            <td class="gameover-name-cell">
                                <div class="gameover-name-flex">
                                    ${p.photo ? `<img src="${p.photo}" class="gameover-avatar" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">` : `<span class="gameover-avatar">${p.avatar}</span>`}
                                    <span class="gameover-name">${p.name}</span>
                                </div>
                            </td>
                            <td class="gameover-score-cell">${p.score}</td>
                        </tr>
             `;
        }).join('');
    })()}
                                        <tr>
                                            <td colspan="3" style="height:100px;"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    </div>
                    
                    <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100; background:white; padding:10px 0; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); border-radius:8px;">
                        <button onclick="window.app.executeEndGame()" style="width:100%; padding:15px; font-size:1.1rem; background-color:var(--primary-color); color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">Retour à l'accueil</button>
                    </div>
                    `;
};

export const AboutView = () => `
    <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1 style="margin:0; text-align:center;">A propos</h1>
        <div></div>
    </header>
    <div class="card">
        <h3>Compteur de Points</h3>
        <p>Version ${APP_VERSION}</p>
        <p style="margin-top:20px;">Une application simple et efficace pour compter les points de vos jeux de société favoris (Tarot, Belote, UNO, et bien d'autres).</p>
        <h4 style="margin-top:20px; margin-bottom:10px; color:var(--primary-color);">Nouveautés v1.11 :</h4>
        <ul style="line-height:1.8; padding-left:20px;">
            <li>Gestion avancée des joueurs en cours de partie (ajout, remplacement, suppression)</li>
            <li>Filtre par cercle sur toutes les pages de sélection de joueurs</li>
            <li>Confirmation de remplacement de joueur avec préservation des scores</li>
            <li>Amélioration de l'interface du tableau de scores avec sections colorées</li>
            <li>Optimisation de l'affichage et de l'ergonomie</li>
        </ul>
        <p style="margin-top:20px;">Développé avec passion.</p>
    </div>
`;

export const OptionsView = (store) => `
    <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1 style="margin:0; text-align:center;">Options</h1>
        <div></div>
    </header>
    
    <div style="flex:1; overflow-y:auto; width:100%; padding-bottom:20px;">
        <button onclick="window.app.router.navigate('statistics')" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:10px; display:flex; align-items:center; justify-content:flex-start; gap:15px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
            <span>Statistiques</span>
        </button>
        
        <button onclick="window.app.router.navigate('exportGames')" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:10px; display:flex; align-items:center; justify-content:flex-start; gap:15px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Exporter jeux</span>
        </button>
        <button onclick="window.app.router.navigate('importGames')" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:30px; display:flex; align-items:center; justify-content:flex-start; gap:15px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <span>Importer jeux</span>
        </button>
        
        <div>
            <h3 style="margin-bottom:15px; color:#333;">Paramètres</h3>
            <label style="display:flex; align-items:center; padding:15px; background:white; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:pointer; margin-bottom:10px;">
                <input type="checkbox" id="show-leaderboard-during-game" ${store.state.showLeaderboardDuringGame ? 'checked' : ''} onchange="window.app.toggleShowLeaderboardDuringGame(this.checked)" style="margin-right:12px; width:20px; height:20px; cursor:pointer;">
                <span style="font-size:1em; color:#333;">Afficher le classement en cours de partie</span>
            </label>
            <label style="display:flex; align-items:center; padding:15px; background:white; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:pointer; margin-bottom:10px;">
                <input type="checkbox" id="allow-edit-past-rounds" ${store.state.allowEditPastRounds ? 'checked' : ''} onchange="window.app.toggleAllowEditPastRounds(this.checked)" style="margin-right:12px; width:20px; height:20px; cursor:pointer;">
                <span style="font-size:1em; color:#333;">Modifier les score des tours terminés</span>
            </label>
            <label style="display:flex; align-items:center; padding:15px; background:white; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:pointer; margin-bottom:80px;">
                <input type="checkbox" id="hide-deleted-games" ${store.state.hideDeletedGamesInStats ? 'checked' : ''} onchange="window.app.toggleHideDeletedGames(this.checked)" style="margin-right:12px; width:20px; height:20px; cursor:pointer;">
                <span style="font-size:1em; color:#333;">Masquer les jeux supprimés dans les statistiques</span>
            </label>
        </div>
    </div>
    
    <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100;">
        <button onclick="window.app.router.navigate('about')" class="primary-button" style="width:100%; padding:15px; font-size:1em; display:flex; align-items:center; justify-content:center; gap:15px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <span>A propos</span>
        </button>
    </div>
`;

export const GameActionsView = (store) => {
    const session = store.restoreSession();
    if (!session) return `<div class="card">Erreur: Pas de session active.</div>`;

    const game = store.getGames().find(g => g.id === session.gameId);
    const gameTitle = game ? game.name : 'Actions';

    return `
    <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.navigate('game')" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1 style="margin:0; text-align:center;">${gameTitle}</h1>
        <div></div>
    </header>
    
    <div style="margin-bottom:20px;">
        <h3 style="margin-bottom:15px; color:#333;">Partie</h3>
        <button onclick="window.app.navigateEndGame()" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:10px; display:flex; align-items:center; justify-content:flex-start; gap:15px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Terminer la partie</span>
        </button>
        <button onclick="window.app.navigateCancelGame()" class="primary-button" style="width:100%; padding:15px; font-size:1em; background:#dc3545; border-color:#dc3545; display:flex; align-items:center; justify-content:flex-start; gap:15px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            <span>Annuler la partie</span>
        </button>
    </div>
    
    <div style="margin-bottom:20px;">
        <h3 style="margin-bottom:15px; color:#333;">Joueurs</h3>
        <button onclick="window.app.navigateAddPlayerInGame()" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:10px; display:flex; align-items:center; justify-content:flex-start; gap:15px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            <span>Ajouter un joueur</span>
        </button>
        <button onclick="window.app.navigateRemovePlayerInGame()" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:10px; display:flex; align-items:center; justify-content:flex-start; gap:15px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            <span>Supprimer un joueur</span>
        </button>
        <button onclick="window.app.navigateReorderPlayers()" class="primary-button" style="width:100%; padding:15px; font-size:1em; display:flex; align-items:center; justify-content:flex-start; gap:15px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
            <span>Ordre des joueurs</span>
        </button>
    </div>
    
    <div style="margin-top:30px;">
        <h3 style="margin-bottom:15px; color:#333;">Paramètres</h3>
        <button onclick="window.app.navigateUpdateLimits()" class="primary-button" style="width:100%; padding:15px; font-size:1em; display:flex; align-items:center; justify-content:flex-start; gap:15px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4z"/></svg>
            <span>Modifier les limites</span>
        </button>
    </div>
`;
};

export const StatisticsView = (store) => {
    // Initialize statsState if needed
    if (!window.app.statsState) {
        window.app.statsState = {
            game: 'all',
            players: [],
            tab: 'global' // 'comparator', 'history', 'global'
        };
    }
    const state = window.app.statsState;
    const hideDeletedGames = store.state.hideDeletedGamesInStats || false;
    
    // Filtrer les jeux supprimés si l'option est activée
    let games = store.getAllGames();
    if (hideDeletedGames) {
        games = games.filter(g => !g.deleted);
    }
    
    // Créer un Set des IDs de jeux visibles pour filtrer l'historique
    const visibleGameIds = new Set(games.map(g => g.id));
    
    // Filtrer l'historique pour exclure les parties de jeux supprimés
    let history = (store.state.history || []);
    if (hideDeletedGames) {
        history = history.filter(h => visibleGameIds.has(h.gameId));
    }
    history = history.sort((a, b) => b.startTime - a.startTime);
    
    const players = store.getAllPlayers();

    // ----------------------
    // FILTER LOGIC (Shared for Comparator & History)
    // ----------------------
    const filterGame = state.game;
    const filterPlayers = state.players || [];

    // ----------------------
    // TAB: GLOBAL CONTENT
    // ----------------------
    let globalContent = '';
    if (state.tab === 'global') {
        // L'onglet Global n'est jamais filtré
        const statsByGame = games.map(g => {
            const count = history.filter(h => h.gameId === g.id).length;
            return { ...g, count };
        }).sort((a, b) => b.count - a.count);

        globalContent = `
            <div class="card">
                <h3 style="margin-bottom:10px;">Parties Jouées</h3>
                <table style="width:100%; border-collapse:collapse;">
                    ${statsByGame.map(g => `
                        <tr style="border-bottom:1px solid #eee;">
                            <td style="padding:10px;">${g.name}</td>
                            <td style="padding:10px; text-align:right; font-weight:bold;">${g.count}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
    }

    // ----------------------
    // TAB: COMPARATOR CONTENT
    // ----------------------
    let comparatorContent = '';
    if (state.tab === 'comparator') {
        let resultsHtml = '';
        
        if (filterPlayers.length > 0) {
            // Si des joueurs sont sélectionnés : parties communes uniquement
            const commonGames = history.filter(h => {
                const playerIdsInGame = new Set(h.players.map(p => p.id));
                const playersMatch = filterPlayers.every(id => playerIdsInGame.has(id));
                const gameMatch = (filterGame === 'all') || (h.gameId === filterGame);
                return playersMatch && gameMatch;
            });

            if (commonGames.length === 0) {
                resultsHtml = '<p style="text-align:center; color:#999;">Aucune partie commune trouvée.</p>';
            } else {
                const stats = {};
                filterPlayers.forEach(id => { stats[id] = { wins: 0, sumRank: 0, count: 0 }; });

                commonGames.forEach(g => {
                    const gameDef = games.find(gd => gd.id === g.gameId);
                    const isLowest = gameDef && gameDef.winCondition === 'lowest';
                    const sorted = [...g.players].sort((a, b) => isLowest ? a.score - b.score : b.score - a.score);

                    filterPlayers.forEach(id => {
                        const rankIndex = sorted.findIndex(p => p.id === id);
                        if (rankIndex !== -1) {
                            stats[id].count++;
                            stats[id].sumRank += (rankIndex + 1);
                            if (rankIndex === 0) stats[id].wins++;
                        }
                    });
                });

                resultsHtml = `
                    <div style="margin-bottom:20px; text-align:center; font-weight:bold;">
                        ${commonGames.length} partie(s) commune(s)
                    </div>
                    <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
                        <thead>
                            <tr style="background:#eee; font-size:0.9em;">
                                <th style="padding:5px;">Joueur</th>
                                <th style="padding:5px; text-align:center;">Victoires</th>
                                <th style="padding:5px; text-align:center;">Rang Moyen</th>
                                <th style="padding:5px; text-align:center;">Win %</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                filterPlayers.forEach(id => {
                    const s = stats[id];
                    const pDef = players.find(p => p.id === id);
                    const avgRank = s.count ? (s.sumRank / s.count).toFixed(1) : '-';
                    const winRate = s.count ? Math.round((s.wins / s.count) * 100) : 0;
                    resultsHtml += `
                        <tr style="border-bottom:1px solid #eee;">
                            <td style="padding:5px;">${pDef.avatar} ${pDef.name}</td>
                            <td style="padding:5px; text-align:center; font-weight:bold;">${s.wins}</td>
                            <td style="padding:5px; text-align:center;">${avgRank}</td>
                            <td style="padding:5px; text-align:center;">${winRate}%</td>
                        </tr>
                    `;
                });
                resultsHtml += `</tbody></table>`;
            }
        } else {
            // Si aucun joueur sélectionné : stats individuelles pour tous les joueurs
            const relevantGames = history.filter(h => (filterGame === 'all') || (h.gameId === filterGame));
            
            if (relevantGames.length === 0) {
                resultsHtml = '<p style="text-align:center; color:#999;">Aucune partie trouvée.</p>';
            } else {
                const stats = {};
                
                // Calculer les stats pour chaque joueur
                relevantGames.forEach(g => {
                    const gameDef = games.find(gd => gd.id === g.gameId);
                    const isLowest = gameDef && gameDef.winCondition === 'lowest';
                    const sorted = [...g.players].sort((a, b) => isLowest ? a.score - b.score : b.score - a.score);

                    g.players.forEach(p => {
                        if (!stats[p.id]) {
                            stats[p.id] = { wins: 0, sumRank: 0, count: 0 };
                        }
                        const rankIndex = sorted.findIndex(sp => sp.id === p.id);
                        if (rankIndex !== -1) {
                            stats[p.id].count++;
                            stats[p.id].sumRank += (rankIndex + 1);
                            if (rankIndex === 0) stats[p.id].wins++;
                        }
                    });
                });

                // Trier les joueurs par nombre de victoires
                const sortedPlayers = Object.keys(stats).sort((a, b) => stats[b].wins - stats[a].wins);

                resultsHtml = `
                    <div style="margin-bottom:20px; text-align:center; font-weight:bold;">
                        ${relevantGames.length} partie(s) analysée(s)
                    </div>
                    <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
                        <thead>
                            <tr style="background:#eee; font-size:0.9em;">
                                <th style="padding:5px;">Joueur</th>
                                <th style="padding:5px; text-align:center;">Parties</th>
                                <th style="padding:5px; text-align:center;">Victoires</th>
                                <th style="padding:5px; text-align:center;">Rang Moyen</th>
                                <th style="padding:5px; text-align:center;">Win %</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                sortedPlayers.forEach(id => {
                    const s = stats[id];
                    const pDef = players.find(p => p.id === id);
                    if (pDef) {
                        const avgRank = s.count ? (s.sumRank / s.count).toFixed(1) : '-';
                        const winRate = s.count ? Math.round((s.wins / s.count) * 100) : 0;
                        resultsHtml += `
                            <tr style="border-bottom:1px solid #eee;">
                                <td style="padding:5px;">${pDef.avatar} ${pDef.name}</td>
                                <td style="padding:5px; text-align:center;">${s.count}</td>
                                <td style="padding:5px; text-align:center; font-weight:bold;">${s.wins}</td>
                                <td style="padding:5px; text-align:center;">${avgRank}</td>
                                <td style="padding:5px; text-align:center;">${winRate}%</td>
                            </tr>
                        `;
                    }
                });
                resultsHtml += `</tbody></table>`;
            }
        }

        comparatorContent = `
            <div class="card">
                ${resultsHtml}
            </div>
        `;
    }

    // ----------------------
    // TAB: HISTORY CONTENT
    // ----------------------
    let historyContent = '';
    if (state.tab === 'history') {
        const filteredHistory = history.filter(session => {
            let gameMatch = (filterGame === 'all') || (session.gameId === filterGame);

            // Player Match: Checks if ALL selected players are in the session (Intersection logic)
            // If NO player selected, show ALL? Or show NONE? 
            // In history view, usually "No filter" means "All".
            // But if I have a "Filter Players" section, and none selected, implies "No filter".
            // Let's assume empty selection = All.

            let playerMatch = true;
            if (filterPlayers.length > 0) {
                const sessionPlayerIds = new Set(session.players.map(p => p.id));
                playerMatch = filterPlayers.every(id => sessionPlayerIds.has(id));
            }
            return gameMatch && playerMatch;
        });

        let historyMessage = '';
        if (filterPlayers.length > 0) {
            if (filteredHistory.length === 0) {
                historyMessage = '<p style="text-align:center; color:#999;">Aucune partie commune trouvée.</p>';
            } else {
                historyMessage = `<div style="margin-bottom:20px; text-align:center; font-weight:bold;">
                    ${filteredHistory.length} partie(s) commune(s)
                </div>`;
            }
        }

        historyContent = `
            <div style="flex:1; overflow-y:auto; width:100%; padding-bottom:20px;">
                ${historyMessage}
                <div id="history-list">
                    ${filteredHistory.length === 0 && filterPlayers.length === 0 ? '<p style="text-align:center; color:#666;">Aucune partie trouvée.</p>' : filteredHistory.map(session => {
            const game = games.find(g => g.id === session.gameId);
            const gameName = game ? game.name : 'Jeu inconnu';
            const gameColor = game ? game.color : '#ccc';
            const date = new Date(session.startTime).toLocaleDateString() + ' ' + new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const isLowestWin = game && game.winCondition === 'lowest';
            const sortedPlayers = [...session.players].sort((a, b) => isLowestWin ? a.score - b.score : b.score - a.score);
            const roundsCount = session.history.length;

            const leaderboardHtml = sortedPlayers.map((p, i) => {
                const info = players.find(pl => pl.id === p.id) || { name: '?', avatar: '?' };
                let rankIcon = `#${i + 1}`;
                if (i === 0) rankIcon = '🥇';
                if (i === 1) rankIcon = '🥈';
                if (i === 2) rankIcon = '🥉';
                return `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:2px 0;">
                        <div style="display:flex; align-items:center; gap:5px;">
                            <span style="width:20px; text-align:center;">${rankIcon}</span>
                            <span>${info.avatar} ${info.name}</span>
                        </div>
                        <span style="font-weight:bold;">${p.score}</span>
                    </div>`;
            }).join('');

            const detailsId = `history-details-${session.sessionId}`;
            const historyTableHtml = `
                    <div id="${detailsId}" style="display:none; margin-top:15px; border-top:1px solid #eee; padding-top:10px;">
                        <h4 style="margin-bottom:10px; color:#666;">Détail des tours</h4>
                        <div style="overflow-x:auto;">
                            <table class="history-table" style="text-align:center; font-size:0.9em;">
                                <thead>
                                    <tr>
                                        <th style="padding:5px;">#</th>
                                        ${session.players.map(p => {
                const info = players.find(pl => pl.id === p.id) || { name: '?', avatar: '?' };
                return `<th style="padding:5px;">${info.avatar}</th>`;
            }).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${session.history.map((round, i) => `
                                        <tr>
                                            <td style="padding:5px; border-bottom:1px solid #eee;">${i + 1}</td>
                                            ${session.players.map(p => {
                const val = round[p.id];
                return `<td style="padding:5px; border-bottom:1px solid #eee;">${val !== undefined ? val : '-'}</td>`;
            }).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>`;

            return `
                    <div class="card" onclick="window.app.toggleHistoryDetails('${session.sessionId}')" style="margin-bottom:10px; padding:10px; cursor:pointer;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                            <div>
                                <div style="font-weight:bold; font-size:1.1em;">${gameName}</div>
                                <div style="font-size:0.8em; color:#666;">${date}</div>
                            </div>
                            <div style="text-align:right;">
                                <div style="font-size:0.8em; color:#666;">${session.players.length} joueurs</div>
                                <div style="font-size:0.8em; color:#666;">${roundsCount} tours</div>
                            </div>
                        </div>
                        <div style="background:#f9f9f9; padding:10px; border-radius:8px;">${leaderboardHtml}</div>
                        <div style="text-align:center; margin-top:5px; color:#999; font-size:0.8em;">▼ Toucher pour voir le détail</div>
                        ${historyTableHtml}
                    </div>`;
        }).join('')}
                </div>
            </div>`;
    }

    return `
        <div style="position:absolute; top:0; left:0; right:0; bottom:0; display:flex; flex-direction:column; overflow:hidden;">
            <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom: 20px; flex-shrink: 0; padding: 2px;">
                <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <h1 style="margin:0; text-align:center;">Statistiques</h1>
                <div></div>
            </header>

            <div style="flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; overflow-x:hidden; padding: 0 2px 180px 2px;">

        <!-- TABS -->
        <div style="display:flex; margin-bottom:20px; border-bottom:1px solid #ccc;">
            <button onclick="window.app.updateStatisticsState('tab', 'global')" style="flex:1; padding:10px; border:none; background:${state.tab === 'global' ? 'white' : '#e5e5e5'}; color: #333; border-bottom:${state.tab === 'global' ? '3px solid var(--primary-color)' : 'none'}; font-weight:${state.tab === 'global' ? 'bold' : 'normal'}; cursor:pointer;">Global</button>
            <button onclick="window.app.updateStatisticsState('tab', 'history')" style="flex:1; padding:10px; border:none; background:${state.tab === 'history' ? 'white' : '#e5e5e5'}; color: #333; border-bottom:${state.tab === 'history' ? '3px solid var(--primary-color)' : 'none'}; font-weight:${state.tab === 'history' ? 'bold' : 'normal'}; cursor:pointer;">Historique</button>
            <button onclick="window.app.updateStatisticsState('tab', 'comparator')" style="flex:1; padding:10px; border:none; background:${state.tab === 'comparator' ? 'white' : '#e5e5e5'}; color: #333; border-bottom:${state.tab === 'comparator' ? '3px solid var(--primary-color)' : 'none'}; font-weight:${state.tab === 'comparator' ? 'bold' : 'normal'}; cursor:pointer;">Comparaison</button>
        </div>

        <!-- CONTENT -->
        <div>
            ${state.tab === 'comparator' ? comparatorContent : ''}
            ${state.tab === 'history' ? historyContent : ''}
            ${state.tab === 'global' ? globalContent : ''}
        </div>

            </div>

            <!-- STICKY FILTERS -->
            <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100; background:var(--surface-color); padding:15px; border-radius:10px; box-shadow: 0 -4px 10px rgba(0,0,0,0.2);">
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <select onchange="window.app.updateStatisticsState('game', this.value)" style="flex:1; padding:10px; border:1px solid #ccc; border-radius:5px; background:white; font-size:1em;">
                        <option value="all">Tous les jeux</option>
                        ${games.filter(g => !hideDeletedGames || !g.deleted).map(g => `<option value="${g.id}" ${filterGame === g.id ? 'selected' : ''}>${g.name}</option>`).join('')}
                    </select>
                    <button onclick="window.app.navigateStatsPlayerSelect()" class="primary-button" style="flex:1; padding:10px; font-size:1em; display:flex; align-items:center; justify-content:center; gap:8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span>Joueurs (${filterPlayers.length})</span>
                    </button>
                </div>
                ${filterPlayers.length > 0 ? `
                    <div style="display:flex; flex-wrap:wrap; gap:8px;">
                        ${filterPlayers.map(pid => {
                            const p = players.find(pl => pl.id === pid);
                            if (!p) return '';
                            return `
                                <div style="display:flex; align-items:center; gap:5px; padding:5px 10px; background:#e0f2fe; border:1px solid var(--primary-color); border-radius:15px; font-size:0.9em;">
                                    <span>${p.avatar}</span>
                                    <span>${p.name}</span>
                                    <button onclick="window.app.updateStatisticsState('togglePlayer', '${pid}'); event.stopPropagation();" style="background:none; border:none; color:#666; padding:0; margin-left:5px; cursor:pointer; font-size:1.2em; line-height:1;">×</button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
};

export const ExportGamesView = (store) => {
    const games = store.getGames();
    return `
        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom:20px;">
            <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            <h1 style="margin:0; text-align:center;">Exporter jeux</h1>
            <div></div>
        </header>

        ${games.length === 0 ? `
            <p style="text-align:center; color:#999; padding:40px 20px;">Aucun jeu à exporter</p>
        ` : `
            <p style="color:#666; margin-bottom:15px;">Sélectionnez les jeux à exporter :</p>
            
            <div style="margin-bottom:20px;">
                ${games.map(g => `
                    <label style="display:flex; align-items:center; padding:12px; background:white; border-radius:8px; margin-bottom:10px; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:pointer;">
                        <input type="checkbox" id="export-game-${g.id}" value="${g.id}" style="margin-right:12px; width:20px; height:20px; cursor:pointer;" checked>
                        <span style="font-weight:500;">${g.name}</span>
                    </label>
                `).join('')}
            </div>

            <button onclick="window.app.exportSelectedGames()" class="primary-button" style="width:100%; padding:15px; font-size:1em;">
                Partager la sélection
            </button>
        `}
    `;
};

export const ImportGamesView = (store) => {
    return `
        <header style="display:grid; grid-template-columns:1fr auto 1fr; align-items:center; margin-bottom:20px;">
            <button onclick="window.app.router.back()" style="padding: 8px 12px; display:flex; align-items:center; justify-self:start;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            <h1 style="margin:0; text-align:center;">Importer jeux</h1>
            <div></div>
        </header>

        <p style="color:#666; margin-bottom:15px;">Collez le JSON des jeux à importer :</p>

        <textarea id="import-json-input" placeholder='[{"id":"...","name":"..."}]' style="width:100%; min-height:150px; padding:12px; border:1px solid #ddd; border-radius:8px; font-family:monospace; font-size:0.9em; margin-bottom:15px; resize:vertical;"></textarea>

        <button onclick="window.app.parseImportGames()" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:20px;">
            Analyser
        </button>

        <div id="import-games-list"></div>
    `;
};
