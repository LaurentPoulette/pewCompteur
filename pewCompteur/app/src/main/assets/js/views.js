export const APP_VERSION = window.APP_VERSION_NATIVE || '1.7';

export const HomeView = (store, showOnlyFavorites = false) => {
    const allGames = store.getGames();
    const games = showOnlyFavorites ? allGames.filter(g => g.favorite) : allGames;
    
    return `
        <header style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; z-index:1001; position:relative;">
            <h1>Jeux</h1>
            <button onclick="window.app.router.navigate('options')" style="background:none; color:var(--text-color); padding:8px; font-size:1.2rem; display:flex; align-items:center; gap:5px;" title="Options">
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

export const PlayerSelectView = (store, gameId) => {
    const allPlayers = store.getPlayers();
    const game = store.getGames().find(g => g.id === gameId);
    const circles = store.getCircles();
    
    // Get current filter from app state (will be set by filter dropdown)
    const selectedCircleFilter = window.app?.selectedCircleFilter || 'all';
    
    // Filter players based on selected circle
    let players = allPlayers;
    if (selectedCircleFilter !== 'all') {
        players = allPlayers.filter(p => p.circles && p.circles.includes(selectedCircleFilter));
    }
    
    let subtitle = "Sélectionnez les joueurs";
    if (game && game.minPlayers && game.maxPlayers) {
        if (game.minPlayers === game.maxPlayers) {
            subtitle = `Sélectionnez ${game.maxPlayers} joueur${game.maxPlayers > 1 ? 's' : ''}`;
        } else {
            subtitle = `Sélectionnez entre ${game.minPlayers} et ${game.maxPlayers} joueurs`;
        }
    } else if (game && game.minPlayers) {
        subtitle = `Sélectionnez au moins ${game.minPlayers} joueur${game.minPlayers > 1 ? 's' : ''}`;
    } else if (game && game.maxPlayers) {
        subtitle = `Sélectionnez au maximum ${game.maxPlayers} joueur${game.maxPlayers > 1 ? 's' : ''}`;
    }
    
    return `
        <header style="display:flex; align-items:center; margin-bottom: 20px;">
            <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            <h1>Joueurs</h1>
        </header>
        <div style="flex:1; overflow-y:auto; width:100%;">
        <h3 style="margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">${subtitle}</h3>
        
        ${circles.length > 0 ? `
        <div style="margin-bottom:15px;">
            <select id="circle-filter" onchange="window.app.filterByCircle(this.value, '${gameId}')" style="width:100%; padding:12px; border:1px solid #ccc; border-radius:8px; font-size:1em; background:white;">
                <option value="all" ${selectedCircleFilter === 'all' ? 'selected' : ''}>Tous les joueurs</option>
                ${circles.map(c => `<option value="${c.id}" ${selectedCircleFilter === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
        </div>
        ` : ''}
        
        <p style="text-align:center; color:#999; font-size:0.9em; margin:-10px 0 15px 0;">Appui long pour modifier</p>
        <div class="grid" id="player-grid" style="padding-bottom: 100px;">
            <!-- New Player Card -->
            <div class="card" onclick="window.app.navigateCreatePlayer()" style="display:flex; align-items:center; justify-content:center; cursor:pointer; min-height:80px; border: 2px dashed #ccc; background:transparent;">
                 <div style="text-align:center; color:#888;">
                    <span style="font-size:2em;">+</span><br>Nouveau
                 </div>
            </div>

            ${players.map(p => {
        const isSelected = window.app.selectedPlayers.includes(p.id);
        // Determine if the selected element is an avatar or a photo
        const isAvatarSelected = !p.photo && isSelected;
        const isPhotoSelected = p.photo && isSelected;

        return `
                <div class="card player-card ${isSelected ? 'selected' : ''}" data-id="${p.id}" data-player-id="${p.id}" onclick="this.classList.toggle('selected'); window.app.togglePlayer('${p.id}')" style="cursor:pointer; padding:10px;">
                    <div style="display:flex; justify-content:center; align-items:center; margin-bottom:5px;">
                        <div style="width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
                             ${p.photo ? `<img src="${p.photo}" class="${isPhotoSelected ? 'selected-photo' : ''}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">` : `<span class="${isAvatarSelected ? 'selected-avatar' : ''}" style="font-size:1.8em;">${p.avatar}</span>`}
                        </div>
                    </div>
                    <div style="text-align:center;">
                        <h3 style="margin:0; font-size:1em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.name}</h3>
                    </div>
                </div>
            `;
    }).join('')}
        </div>
        
        </div>
        </div>
        
        <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100;">
            <button onclick="window.app.navigatePlayerOrder('${gameId}')" style="width:100%; padding: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">Suivant</button>
        </div>
        <style>
            .player-card.selected { border: 2px solid var(--primary-color); background-color: #e0f2fe; }
            .selected-avatar { text-shadow: 0 0 3px var(--primary-color); }
            .selected-photo { border: 2px solid var(--primary-color); box-shadow: 0 0 5px var(--primary-color); }
        </style>
`;
};

export const PlayerOrderView = (store, gameId) => {
    return `
        <header style="display:flex; align-items:center; margin-bottom: 20px;">
             <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            <h1>Ordre</h1>
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
        return `
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
                                 <div class="leaderboard-card ${themeClass}" title="${p.name}" onclick="window.app.showPlayerNamePopupById('${p.id}')" style="flex-direction:column; justify-content:center; cursor:pointer;">
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
    };

    return `
    <div style="display:flex; flex-direction:column; height:100%; overflow:hidden;">
        <header style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px; z-index:1001; position:relative; flex-shrink:0;">
            <h1 style="margin:0;">${session.title}</h1>
            <button onclick="window.app.router.navigate('gameActions')" style="background:none; color:var(--text-color); padding:8px; font-size:1.2rem; display:flex; align-items:center; gap:5px;" title="Actions">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        </header>

        ${(() => {
            const effectiveRounds = (session.config && session.config.rounds !== undefined) ? session.config.rounds : game.rounds;
            const effectiveTarget = (session.config && session.config.target !== undefined) ? session.config.target : game.target;
            
            let limitText = '';
            if (effectiveRounds && effectiveTarget) {
                limitText = `Limiter à ${effectiveTarget} points ou ${effectiveRounds} tours`;
            } else if (effectiveTarget) {
                limitText = `Limiter à ${effectiveTarget} points`;
            } else if (effectiveRounds) {
                limitText = `Limiter à ${effectiveRounds} tours`;
            }
            
            if (limitText) {
                return `<div style="margin-bottom: 15px; padding:10px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); flex-shrink:0; text-align:center; font-size:0.95em;">${limitText}</div>`;
            }
            return '';
        })()}
        
        <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
            <div class="card" style="flex:1; overflow-y:auto; overflow-x:auto; max-width:100%;">
                <table class="history-table" style="text-align: center; border-collapse: collapse;">
                    <thead style="position: sticky; top: 0; z-index: 10;">
                        <tr style="background: #f8f9fa;">
                            <th class="history-header" style="background: #f8f9fa; padding: 5px; border-bottom: none;">#</th>
                            ${tablePlayers.map(p => `
                                <th class="history-header" title="${p.name}" onclick="window.app.showPlayerNamePopupById('${p.id}')" style="cursor:pointer; background: #f8f9fa; padding: 5px; border-bottom: none;">
                                    <div style="height:34px; display:flex; align-items:center; justify-content:center;">
                                        ${p.photo ? `<img src="${p.photo}" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">` : `<span style="font-size:1.5em;">${p.avatar}</span>`}
                                    </div>
                                    <div style="font-size:0.8em;">
                                        <span class="name-full">${p.name}</span>
                                        <span class="name-initial">${p.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                </th>
                            `).join('')}
                        </tr>
                        <tr style="background: #e3f2fd; font-weight:bold;">
                            <td class="history-header" onclick="window.app.addRound()" style="cursor:pointer; background: #e3f2fd; padding: 5px; border-top: none;" title="Nouveau tour">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                            </td>
                            ${tablePlayers.map(p => `
                                <td class="history-header" data-player-id="${p.id}" style="font-size:1.1em; color:var(--primary-color); background: #e3f2fd; padding: 5px; border-top: none;">${p.score}</td>
                            `).join('')}
                        </tr>
                    </thead>
    <tbody>
        ${session.history.map((r, i) => ({ round: r, roundIndex: i }))
            .reverse()
            .map(({ round, roundIndex }, displayIndex) => {
                let roundSum = 0;
                tablePlayers.forEach(p => {
                    const val = round[p.id];
                    if (val !== undefined && val !== "") roundSum += parseInt(val);
                });
                const checkValue = hasFixedScore ? (game.fixedRoundScore - roundSum) : null;
                const rowClass = displayIndex === 0 ? 'history-row-new' : '';

                return `
                            <tr class="${rowClass}">
                                <td class="history-cell-round" id="round-cell-${roundIndex}">
                                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center;">
                                        <span>${roundIndex + 1}</span>
                                        ${hasFixedScore ? `<span id="check-val-${roundIndex}" style="font-size:0.8em; font-weight:bold; color:${checkValue === 0 ? 'var(--primary-color)' : '#ef4444'}">${checkValue === 0 ? 'OK' : checkValue}</span>` : '<br>'}
                                    </div>
                                </td>
                                ${tablePlayers.map(p => {
                                    if (isWinsMode) {
                                        const isChecked = round[p.id] === 1;
                                        return `
                                    <td class="history-cell-score">
                                        <input type="radio" 
                                               name="winner-round-${roundIndex}"
                                               class="win-radio"
                                               ${isChecked ? 'checked' : ''}
                                               onchange="window.app.updateWinnerForRound('${roundIndex}', '${p.id}')"
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
                                               onclick="window.app.showNumericKeypadById('${roundIndex}', '${p.id}', this.value)"
                                               placeholder="-">
                                    </td>
                                        `;
                                    }
                                }).join('')}
                            </tr>
                        `}).join('')}
    </tbody>
                </table >
            </div >

        </div >

    <div id="sticky-leaderboard" style="padding:0; margin:0; border-radius:0;">
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
            <div style="display:flex; gap:10px;">
                <button onclick="window.app.closeNumericKeypad()" style="flex:1; padding:15px; font-size:1.1em; border:1px solid #ddd; border-radius:8px; background:#f0f0f0; color:#000; cursor:pointer; font-weight:bold;">Annuler</button>
                <button onclick="window.app.validateKeypadInput()" style="flex:1; padding:15px; font-size:1.1em; border:none; border-radius:8px; background:var(--primary-color); color:white; cursor:pointer; font-weight:bold;">Valider</button>
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
    <header style="display:flex; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1>${isEditMode ? 'Modifier Jeu' : 'Nouveau Jeu'}</h1>
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
    <header style="display:flex; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1>Supprimer Jeu</h1>
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
    <header style="display:flex; align-items:center; margin-bottom: 15px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1>Choix de l'avatar</h1>
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
    <header style="display:flex; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.cancelPlayerForm()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1>${isEditMode ? 'Modifier Joueur' : 'Nouveau Joueur'}</h1>
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
    <header style="display:flex; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1>${isEditMode ? 'Modifier Cercle' : 'Nouveau Cercle'}</h1>
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
                        <header style="display:flex; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1>Fin de partie</h1>
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

    return `
                        <header style="display:flex; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1>Fin de partie</h1>
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
    const availablePlayers = store.getPlayers().filter(p => !existingIds.has(p.id));

    return `
                        <header style="display:flex; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1>Joueurs</h1>
                        </header>
                        <div style="flex:1; overflow-y:auto; width:100%; padding-bottom:20px;">
                        <h3 style="margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">Joueurs disponibles</h3>
                        <div class="grid">
                            <!-- Option to create new -->
                            <div class="card" onclick="window.app.navigateCreatePlayer()" style="display:flex; align-items:center; justify-content:center; cursor:pointer; min-height:100px; border: 2px dashed #ccc; background:transparent;">
                                <div style="text-align:center; color:#888;">
                                    <span style="font-size:2em;">+</span><br>Nouveau
                                </div>
                            </div>

                            ${availablePlayers.map(p => `
            <div class="card" onclick="window.app.addPlayerToGame('${p.id}')" style="cursor:pointer; text-align:center;">
                <span style="font-size:2em;">${p.avatar}</span>
                <h3>${p.name}</h3>
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

    return `
                        <header style="display:flex; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1>Supprimer un joueur</h1>
                        </header>
                        <div style="flex:1; overflow-y:auto; width:100%; padding-bottom:20px;">
                        <div class="card">
                            <h3 style="margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">Selectionnez le joueur à supprimer</h3>
                            <div class="grid">
                                ${players.map(p => `
                <div class="card" onclick="window.app.router.navigate('confirmRemoveIngamePlayer', { playerId: '${p.id}' })" style="cursor:pointer; text-align:center;">
                    <span style="font-size:2em;">${p.avatar}</span>
                    <h3>${p.name}</h3>
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

    return `
                        <header style="display:flex; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.cancelReorderIngame()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1>Joueurs</h1>
                        </header>
                        <div style="flex:1; overflow-y:auto; width:100%;">
                        <div class="card" style="margin-bottom:80px;"> <!-- Margin bottom for fixed footer button space -->
                            <h3 style="margin:0 0 20px 0; padding:12px 15px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color:white; border-radius:8px; font-size:1.1rem; font-weight:bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align:center;">Glissez pour réorganiser</h3>
                            <div id="reorder-ingame-list"></div>
                        </div>
                        </div>

                        <div style="position:fixed; bottom:20px; left:20px; right:20px; z-index:100;">
                            <button onclick="window.app.saveReorderIngame()" style="width:100%; padding: 15px; background:var(--primary-color); color:white; border:none; border-radius:10px; font-weight:bold; font-size:1.1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">Enregistrer l'ordre</button>
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

    return `
                        <header style="display:flex; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1>Confirmation</h1>
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
    return `
                        <header style="display:flex; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1>Fin de partie</h1>
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
    return `
                        <header style="display:flex; align-items:center; margin-bottom: 20px;">
                            <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                            <h1>Annuler la partie</h1>
                        </header>
                        <div class="card" style="text-align:center; padding: 40px 20px;">
                            <div style="font-size:4em; margin-bottom:10px; color:#ef4444;">🗑️</div>
                            <h2 style="margin-bottom:10px;">Tout effacer ?</h2>
                            <p style="color:#666; margin-bottom:30px;">Attention, si vous annulez, <strong>aucune donnée ne sera sauvegardée</strong>. L'historique de cette partie sera perdu.</p>

                            <button onclick="window.app.executeCancelGame()" style="width:100%; background-color:#ef4444; margin-bottom:15px; padding:15px;">Annuler sans sauvegarder</button>
                            <button onclick="window.app.router.back()" style="width:100%; background-color:#ddd; color:#333; padding:15px;">Retour au jeu</button>
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

    // Sort players
    const players = session.players.map(sp => {
        const info = store.getPlayers().find(p => p.id === sp.id);
        return { ...sp, ...info };
    }).sort((a, b) => isLowestWin ? a.score - b.score : b.score - a.score);

    const winner = players[0];

    return `
                    <div style="flex:1; overflow-y:auto; width:100%;">
                    <div class="gameover-container">
                        <div class="gameover-icon">🏆</div>
                        <h1 class="gameover-title">${winner.name} a gagné !</h1>
                        <p class="gameover-subtitle">${gameOverReason}</p>

                        <div class="card">
                            <h3 class="gameover-section-title">Classement Final</h3>
                            <table class="leaderboard-table">
                                <tbody>
                                    ${players.map((p, i) => {
        let rankIcon = `#${i + 1}`;
        let size = '1em';

        if (i === 0) { rankIcon = '🥇'; size = '1.5em'; }
        if (i === 1) rankIcon = '🥈';
        if (i === 2) rankIcon = '🥉';

        let rankClass = 'rank-text-default';
        if (i === 0) rankClass = 'rank-text-0';
        else if (i === 1) rankClass = 'rank-text-1';
        else if (i === 2) rankClass = 'rank-text-2';

        return `
                        <tr>
                            <td class="gameover-rank-cell ${rankClass}">${rankIcon}</td>
                            <td class="gameover-name-cell">
                                <div class="gameover-name-flex">
                                    <span class="gameover-avatar">${p.avatar}</span>
                                    <span class="gameover-name">${p.name}</span>
                                </div>
                            </td>
                            <td class="gameover-score-cell">${p.score}</td>
                        </tr>
                 `}).join('')}
                                </tbody>
                            </table>
                        </div>

                        ${gameOverReason === "Terminé manuellement" ? `
                            <button onclick="window.app.continueGame()" style="width:100%; margin-top:20px; padding:15px; font-size:1.1rem; background-color:#4caf50;">Continuer la partie</button>
                            <button onclick="window.app.executeEndGame()" style="width:100%; margin-top:10px; padding:15px; font-size:1.1rem; background-color:#ddd; color:#333;">Retour à l'accueil</button>
                        ` : `
                            <button onclick="window.app.navigateUpdateLimitsFromGameOver()" style="width:100%; margin-top:20px; padding:15px; font-size:1.1rem; background-color:var(--primary-color);">Modifier les limites</button>
                            <button onclick="window.app.executeEndGame()" style="width:100%; margin-top:10px; padding:15px; font-size:1.1rem;">Retour à l'accueil</button>
                        `}
                    </div>
                    </div>
                    `;
};

export const AboutView = () => `
    <header style="display:flex; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1>A propos</h1>
    </header>
    <div class="card">
        <h3>Compteur de Points</h3>
        <p>Version ${APP_VERSION}</p>
        <p style="margin-top:20px;">Une application simple et efficace pour compter les points de vos jeux de société favoris (Tarot, Belote, UNO, et bien d'autres).</p>
        <p style="margin-top:20px;">Développé avec passion.</p>
    </div>
`;

export const OptionsView = (store) => `
    <header style="display:flex; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1>Options</h1>
    </header>
    
    <div style="margin-bottom:20px;">
        <h3 style="margin-bottom:15px; color:#333;">Navigation</h3>
        <button onclick="window.app.router.navigate('statistics')" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:10px;">
            Statistiques
        </button>
        <button onclick="window.app.router.navigate('about')" class="primary-button" style="width:100%; padding:15px; font-size:1em;">
            A propos
        </button>
    </div>
    
    <div style="margin-top:30px;">
        <h3 style="margin-bottom:15px; color:#333;">Import / Export</h3>
        <button onclick="window.app.router.navigate('exportGames')" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:10px;">
            Exporter jeux
        </button>
        <button onclick="window.app.router.navigate('importGames')" class="primary-button" style="width:100%; padding:15px; font-size:1em;">
            Importer jeux
        </button>
    </div>
    
    <div style="margin-top:30px;">
        <h3 style="margin-bottom:15px; color:#333;">Statistiques</h3>
        <label style="display:flex; align-items:center; padding:15px; background:white; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:pointer;">
            <input type="checkbox" id="hide-deleted-games" ${store.state.hideDeletedGamesInStats ? 'checked' : ''} onchange="window.app.toggleHideDeletedGames(this.checked)" style="margin-right:12px; width:20px; height:20px; cursor:pointer;">
            <span style="font-size:1em; color:#333;">Masquer les jeux supprimés dans les statistiques</span>
        </label>
    </div>
`;

export const GameActionsView = (store) => {
    const session = store.restoreSession();
    if (!session) return `<div class="card">Erreur: Pas de session active.</div>`;

    return `
    <header style="display:flex; align-items:center; margin-bottom: 20px;">
        <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
        <h1>Actions</h1>
    </header>
    
    <div style="margin-bottom:20px;">
        <h3 style="margin-bottom:15px; color:#333;">Joueurs</h3>
        <button onclick="window.app.navigateAddPlayerInGame()" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:10px;">
            Ajouter un joueur
        </button>
        <button onclick="window.app.navigateRemovePlayerInGame()" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:10px;">
            Supprimer un joueur
        </button>
        <button onclick="window.app.navigateReorderPlayers()" class="primary-button" style="width:100%; padding:15px; font-size:1em;">
            Ordre des joueurs
        </button>
    </div>
    
    <div style="margin-top:30px;">
        <h3 style="margin-bottom:15px; color:#333;">Partie</h3>
        <button onclick="window.app.navigateUpdateLimits()" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:10px;">
            Modifier les limites
        </button>
        <button onclick="window.app.navigateEndGame()" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:10px;">
            Terminer la partie
        </button>
        <button onclick="window.app.navigateCancelGame()" class="primary-button" style="width:100%; padding:15px; font-size:1em; background:#dc3545; border-color:#dc3545;">
            Annuler la partie
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
            tab: 'comparator' // 'comparator', 'history', 'global'
        };
    }
    const state = window.app.statsState;
    const history = (store.state.history || []).sort((a, b) => b.startTime - a.startTime);
    const games = store.getAllGames();
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
        const statsByGame = games.map(g => {
            const count = history.filter(h => {
                const gameMatch = h.gameId === g.id;
                let playerMatch = true;
                if (filterPlayers.length > 0) {
                    const sessionPlayerIds = new Set(h.players.map(p => p.id));
                    playerMatch = filterPlayers.every(id => sessionPlayerIds.has(id));
                }
                return gameMatch && playerMatch;
            }).length;
            return { ...g, count };
        }).sort((a, b) => b.count - a.count);

        globalContent = `
            <div class="card">
                <h3 style="margin-bottom:10px;">Parties Jouées (${filterPlayers.length > 0 ? 'Filtré' : 'Global'})</h3>
                <table style="width:100%; border-collapse:collapse;">
                    ${statsByGame.map(g => `
                        <tr style="border-bottom:1px solid #eee;">
                            <td style="padding:10px; border-left: 4px solid ${g.color}">${g.name}</td>
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
        // Computation Logic
        // Filter games where ALL selected players participated AND match game filter
        const commonGames = history.filter(h => {
            const playerIdsInGame = new Set(h.players.map(p => p.id));
            const playersMatch = filterPlayers.length > 0 ? filterPlayers.every(id => playerIdsInGame.has(id)) : false; // If no players selected, showing nothing or global? Logic says "Select players..."
            // If no player selected, we show help text.

            const gameMatch = (filterGame === 'all') || (h.gameId === filterGame);

            if (filterPlayers.length === 0) return false;
            return playersMatch && gameMatch;
        });

        let resultsHtml = '';
        if (filterPlayers.length === 0) {
            resultsHtml = '<p style="text-align:center; color:#999; font-style:italic;">Sélectionnez au moins un joueur ci-dessus...</p>';
        } else if (commonGames.length === 0) {
            resultsHtml = '<p style="text-align:center; color:#999;">Aucune partie commune trouvée.</p>';
        } else {
            // Helper to compute
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

        historyContent = `
            <div style="flex:1; overflow-y:auto; width:100%; padding-bottom:20px;">
                <div id="history-list">
                    ${filteredHistory.length === 0 ? '<p style="text-align:center; color:#666;">Aucune partie trouvée.</p>' : filteredHistory.map(session => {
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
                    <div class="card" onclick="window.app.toggleHistoryDetails('${session.sessionId}')" style="border-left: 4px solid ${gameColor}; margin-bottom:10px; padding:10px; cursor:pointer;">
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
            <header style="display:flex; align-items:center; margin-bottom: 20px; flex-shrink: 0; padding: 2px;">
                <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
                <h1>Statistiques</h1>
            </header>

            <div style="flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; overflow-x:hidden; padding: 0 2px 20px 2px;">

        <!-- FILTERS -->
        <div class="card" style="margin-bottom: 20px;">
            <div style="margin-bottom:10px;">
                 <label style="font-weight:bold; font-size:0.9em; display:block; margin-bottom:5px;">Jeu</label>
                 <select onchange="window.app.updateStatisticsState('game', this.value)" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:5px; background:white;">
                    <option value="all">Tous les jeux</option>
                    ${games.map(g => `<option value="${g.id}" ${filterGame === g.id ? 'selected' : ''}>${g.name}</option>`).join('')}
                </select>
            </div>
            <div>
                <label style="font-weight:bold; font-size:0.9em; display:block; margin-bottom:5px;">Joueurs (filtre)</label>
                <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap:5px;">
                     ${players.map(p => {
        const isSelected = filterPlayers.includes(p.id);
        return `
                            <div onclick="window.app.updateStatisticsState('togglePlayer', '${p.id}')" style="cursor:pointer; text-align:center; padding:5px; border:1px solid ${isSelected ? 'var(--primary-color)' : '#eee'}; background-color: ${isSelected ? '#e0f2fe' : 'transparent'}; border-radius:8px;">
                                <div style="font-size:1.5em;">${p.avatar}</div>
                                <div style="font-size:0.7em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.name}</div>
                            </div>
                         `;
    }).join('')}
                </div>
            </div>
        </div>

        <!-- TABS -->
        <div style="display:flex; margin-bottom:20px; border-bottom:1px solid #ccc;">
            <button onclick="window.app.updateStatisticsState('tab', 'comparator')" style="flex:1; padding:10px; border:none; background:${state.tab === 'comparator' ? 'white' : '#e5e5e5'}; color: #333; border-bottom:${state.tab === 'comparator' ? '3px solid var(--primary-color)' : 'none'}; font-weight:${state.tab === 'comparator' ? 'bold' : 'normal'}; cursor:pointer;">Comparateur</button>
            <button onclick="window.app.updateStatisticsState('tab', 'history')" style="flex:1; padding:10px; border:none; background:${state.tab === 'history' ? 'white' : '#e5e5e5'}; color: #333; border-bottom:${state.tab === 'history' ? '3px solid var(--primary-color)' : 'none'}; font-weight:${state.tab === 'history' ? 'bold' : 'normal'}; cursor:pointer;">Historique</button>
            <button onclick="window.app.updateStatisticsState('tab', 'global')" style="flex:1; padding:10px; border:none; background:${state.tab === 'global' ? 'white' : '#e5e5e5'}; color: #333; border-bottom:${state.tab === 'global' ? '3px solid var(--primary-color)' : 'none'}; font-weight:${state.tab === 'global' ? 'bold' : 'normal'}; cursor:pointer;">Global</button>
        </div>

        <!-- CONTENT -->
        <div>
            ${state.tab === 'comparator' ? comparatorContent : ''}
            ${state.tab === 'history' ? historyContent : ''}
            ${state.tab === 'global' ? globalContent : ''}
        </div>

            </div>
        </div>
    `;
};

export const ExportGamesView = (store) => {
    const games = store.getGames();
    return `
        <header style="display:flex; align-items:center; margin-bottom:20px;">
            <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            <h1 style="margin:0;">Exporter jeux</h1>
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
        <header style="display:flex; align-items:center; margin-bottom:20px;">
            <button onclick="window.app.router.back()" style="padding: 8px 12px; margin-right: 10px; display:flex; align-items:center;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            <h1 style="margin:0;">Importer jeux</h1>
        </header>

        <p style="color:#666; margin-bottom:15px;">Collez le JSON des jeux à importer :</p>

        <textarea id="import-json-input" placeholder='[{"id":"...","name":"..."}]' style="width:100%; min-height:150px; padding:12px; border:1px solid #ddd; border-radius:8px; font-family:monospace; font-size:0.9em; margin-bottom:15px; resize:vertical;"></textarea>

        <button onclick="window.app.parseImportGames()" class="primary-button" style="width:100%; padding:15px; font-size:1em; margin-bottom:20px;">
            Analyser
        </button>

        <div id="import-games-list"></div>
    `;
};
