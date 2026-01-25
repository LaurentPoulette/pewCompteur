export class Store {
    constructor() {
        this.state = {
            games: [], // List of defined game types
            players: [], // List of known players
            circles: [], // List of player circles
            activeGame: null, // Current running game state
            history: [], // Past games
            lastSelectedPlayers: [], // IDs of players selected in the last game
            homeFilterFavorites: false, // Filter favorites on home page
            playerCircleFilter: 'all', // Filter players by circle
            hideDeletedGamesInStats: false, // Hide deleted games in statistics
            showLeaderboardDuringGame: true, // Show leaderboard during game
            allowEditPastRounds: true // Allow editing scores of completed rounds
        };
        this.load();
    }

    load() {
        const stored = localStorage.getItem('point_counter_db');
        if (stored) {
            const loadedState = JSON.parse(stored);
            // Fusionner avec les valeurs par défaut pour gérer les nouveaux champs
            this.state = {
                games: loadedState.games || [],
                players: loadedState.players || [],
                circles: loadedState.circles || [],
                activeGame: loadedState.activeGame || null,
                history: loadedState.history || [],
                lastSelectedPlayers: loadedState.lastSelectedPlayers || [],
                homeFilterFavorites: loadedState.homeFilterFavorites || false,
                playerCircleFilter: loadedState.playerCircleFilter || 'all',
                hideDeletedGamesInStats: loadedState.hideDeletedGamesInStats || false,
                showLeaderboardDuringGame: loadedState.showLeaderboardDuringGame !== undefined ? loadedState.showLeaderboardDuringGame : true,
                allowEditPastRounds: loadedState.allowEditPastRounds !== undefined ? loadedState.allowEditPastRounds : true
            };
        } else {
            this.seedDefaults();
        }
    }

    save() {
        localStorage.setItem('point_counter_db', JSON.stringify(this.state));
    }

    seedDefaults() {
        // Default games
        this.state.games =

            [
                {
                    "id": "uno",
                    "name": "UNO",
                    "winCondition": "lowest",
                    "target": 500,
                    "scoreMode": "points",
                    "rounds": null,
                    "fixedRoundScore": null,
                    "minPlayers": 2,
                    "maxPlayers": 10,
                    "trackDealer": true
                },
                {
                    "id": "5R",
                    "name": "Cinq rois",
                    "winCondition": "lowest",
                    "target": 0,
                    "rounds": 13,
                    "scoreMode": "points",
                    "fixedRoundScore": null,
                    "minPlayers": 2,
                    "maxPlayers": 7,
                    "trackDealer": true
                },
                {
                    "id": "papayoo",
                    "name": "Papayoo",
                    "winCondition": "lowest",
                    "target": 0,
                    "rounds": null,
                    "scoreMode": "points",
                    "fixedRoundScore": null,
                    "minPlayers": 3,
                    "maxPlayers": 8,
                    "trackDealer": true
                },
                {
                    "id": "django",
                    "name": "Django",
                    "winCondition": "highest",
                    "target": 7,
                    "rounds": null,
                    "scoreMode": "wins",
                    "fixedRoundScore": null,
                    "minPlayers": 3,
                    "maxPlayers": 5,
                    "trackDealer": false
                }
            ];
        // Default players (example)
        this.state.players = [
            { id: 'p1', name: 'Joueur 1', avatar: '👤' },
            { id: 'p2', name: 'Joueur 2', avatar: '👤' },
            { id: 'p3', name: 'Joueur 3', avatar: '👤' },
            { id: 'p4', name: 'Joueur 4', avatar: '👤' },
        ];
        this.save();
    }

    getGames() {
        return this.state.games.filter(g => !g.deleted).sort((a, b) => a.name.localeCompare(b.name));
    }
    getPlayers() {
        return this.state.players.filter(p => !p.deleted);
    }

    // Pour les statistiques : inclure les jeux et joueurs archivés
    getAllGames() {
        return this.state.games.sort((a, b) => a.name.localeCompare(b.name));
    }
    getAllPlayers() {
        return this.state.players;
    }

    addPlayer(name, avatar, photo = null) {
        const id = 'p_' + Date.now();
        this.state.players.push({ id, name, avatar: avatar || '👤', photo, circles: [] });
        this.save();
        return id;
    }

    updatePlayer(id, name, avatar, photo = null) {
        const player = this.state.players.find(p => p.id === id);
        if (player) {
            player.name = name;
            player.avatar = avatar;
            if (photo !== null) player.photo = photo;
            // Initialize circles array if not exists (for backward compatibility)
            if (!player.circles) player.circles = [];
            this.save();
        }
    }

    createGame(config) {
        this.state.games.push({ ...config, id: 'g_' + Date.now(), favorite: false });
        this.save();
    }

    updateGame(id, config) {
        const gameIndex = this.state.games.findIndex(g => g.id === id);
        if (gameIndex !== -1) {
            this.state.games[gameIndex] = { ...this.state.games[gameIndex], ...config };
            this.save();
        }
    }

    deleteGame(id) {
        const game = this.state.games.find(g => g.id === id);
        if (game) {
            game.deleted = true;
            game.deletedAt = Date.now();
            this.save();
        }
    }

    deletePlayer(id) {
        const player = this.state.players.find(p => p.id === id);
        if (player) {
            player.deleted = true;
            player.deletedAt = Date.now();
            this.save();
        }
    }

    // Circle methods
    getCircles() {
        return this.state.circles || [];
    }

    addCircle(name) {
        const id = 'c_' + Date.now();
        if (!this.state.circles) this.state.circles = [];
        this.state.circles.push({ id, name });
        this.save();
        return id;
    }

    updateCircle(id, name) {
        if (!this.state.circles) this.state.circles = [];
        const circle = this.state.circles.find(c => c.id === id);
        if (circle) {
            circle.name = name;
            this.save();
        }
    }

    deleteCircle(id) {
        if (!this.state.circles) this.state.circles = [];
        this.state.circles = this.state.circles.filter(c => c.id !== id);

        // Remove circle from all players
        this.state.players.forEach(player => {
            if (player.circles) {
                player.circles = player.circles.filter(cid => cid !== id);
            }
        });
        this.save();
    }

    togglePlayerCircle(playerId, circleId) {
        const player = this.state.players.find(p => p.id === playerId);
        if (player) {
            if (!player.circles) player.circles = [];
            const index = player.circles.indexOf(circleId);
            if (index > -1) {
                player.circles.splice(index, 1);
            } else {
                player.circles.push(circleId);
            }
            this.save();
        }
    }

    startNewSession(gameId, playerIds, title, config = {}, initialDealerId = null) {
        this.state.activeGame = {
            sessionId: 's_' + Date.now(),
            gameId,
            title: title || new Date().toLocaleString(),
            config, // Store the game configuration (limits)
            players: playerIds.map(pid => ({ id: pid, score: 0, rounds: [] })),
            currentRound: 1,
            history: [{}], // Start with one empty round
            startTime: Date.now(),
            dealerId: initialDealerId // ID du donneur actuel
        };
        this.save();
    }

    addEmptyRound() {
        if (!this.state.activeGame) return;
        this.state.activeGame.history.push({});
        this.state.activeGame.currentRound++;

        // Faire tourner le donneur si activé
        if (this.state.activeGame.dealerId) {
            const currentDealerIndex = this.state.activeGame.players.findIndex(p => p.id === this.state.activeGame.dealerId);
            if (currentDealerIndex !== -1) {
                const nextDealerIndex = (currentDealerIndex + 1) % this.state.activeGame.players.length;
                this.state.activeGame.dealerId = this.state.activeGame.players[nextDealerIndex].id;
            }
        }

        this.save();
    }

    updateSessionConfig(newConfig) {
        console.log('Updating session config:', newConfig);
        if (!this.state.activeGame) return;
        // Merge with existing config
        this.state.activeGame.config = { ...this.state.activeGame.config, ...newConfig };
        this.save();
    }

    changeDealer(newDealerId) {
        if (!this.state.activeGame) return;
        this.state.activeGame.dealerId = newDealerId;
        this.save();
    }

    updateRoundScore(roundIndex, playerId, value) {
        if (!this.state.activeGame) return;

        // Update history
        if (!this.state.activeGame.history[roundIndex]) {
            this.state.activeGame.history[roundIndex] = {};
        }
        
        // En mode victoire, convertir en 1 (gagnant) ou 0 (perdant)
        const game = this.getGames().find(g => g.id === this.state.activeGame.gameId);
        const isWinsMode = game && game.scoreMode === 'wins';
        
        if (isWinsMode) {
            // En mode victoire : 1 point si valeur > 0, sinon 0
            const numVal = (value === undefined || value === "" || value === null) ? 0 : (typeof value === 'number' ? value : parseInt(value));
            const storedValue = numVal > 0 ? 1 : 0;
            console.log(`Mode victoire: valeur ${value} -> ${numVal} -> stocké ${storedValue}`);
            this.state.activeGame.history[roundIndex][playerId] = storedValue;
        } else {
            // En mode points : stocker la valeur telle quelle
            this.state.activeGame.history[roundIndex][playerId] = value;
        }

        // Recalculate totals
        this.recalculateTotals();
        this.save();
    }

    recalculateTotals() {
        if (!this.state.activeGame) return;

        // Reset scores
        this.state.activeGame.players.forEach(p => p.score = 0);

        // Sum up history (fonctionne pour mode points et victoires)
        this.state.activeGame.history.forEach(round => {
            this.state.activeGame.players.forEach(p => {
                const val = round[p.id] || 0;
                p.score += val;
            });
        });
        
        console.log(`Totaux recalculés:`, this.state.activeGame.players.map(p => ({ nom: p.name, score: p.score })));
    }

    addPlayerToSession(playerId) {
        if (!this.state.activeGame) return;

        // Add to players list with 0 score
        this.state.activeGame.players.push({ id: playerId, score: 0, rounds: [] });

        // Ensure history rows have this player (optional, but good for table rendering)
        // Actually, the view handles undefined, so we don't strict need to back-fill history
        // But let's Recalculate just in case
        this.recalculateTotals();
        this.save();
    }
    reorderSessionPlayers(newPlayerIdsStartOrder) {
        if (!this.state.activeGame) return;

        // Current players
        const currentPlayers = this.state.activeGame.players;

        // Reorder players array based on the list of IDs
        // Note: newPlayerIdsStartOrder might contain all players. 
        // We just map the IDs back to the player objects.

        const newOrder = newPlayerIdsStartOrder.map(pid => currentPlayers.find(p => p.id === pid)).filter(p => p !== undefined);

        // Safety check if something missing
        if (newOrder.length === currentPlayers.length) {
            this.state.activeGame.players = newOrder;
            this.save();
        }
    }

    removePlayerFromSession(playerId) {
        if (!this.state.activeGame) return;

        // Remove from players array
        this.state.activeGame.players = this.state.activeGame.players.filter(p => p.id !== playerId);

        // We ideally should remove their data from history too, 
        // effectively deleting the property from each round object to keep it clean.
        this.state.activeGame.history.forEach(round => {
            delete round[playerId];
        });

        this.recalculateTotals();
        this.save();
    }

    restoreSession() {
        return this.state.activeGame;
    }

    clearSession() {
        if (this.state.activeGame) {
            this.state.history.push(this.state.activeGame);
            this.state.activeGame = null;
            this.save();
        }
    }

    cancelSession() {
        this.state.activeGame = null;
        this.save();
    }
}
