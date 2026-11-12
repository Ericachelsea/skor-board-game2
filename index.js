(function () {
    "use strict";

    const STORAGE_KEY = "skorBoardGameV1";

    function initialState() {
        return {
            round: 1,
            nextId: 4,
            players: [
                { id: 1, name: "Pemain 1", total: 0, roundScore: 0 },
                { id: 2, name: "Pemain 2", total: 0, roundScore: 0 },
                { id: 3, name: "Pemain 3", total: 0, roundScore: 0 }
            ],
            history: []
        };
    }

    function loadState() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (
                saved &&
                Number.isInteger(saved.round) && saved.round > 0 &&
                Array.isArray(saved.players) &&
                Array.isArray(saved.history) &&
                Number.isInteger(saved.nextId)
            ) {
                saved.players = saved.players.filter(function (player) {
                    return player && Number.isInteger(player.id) &&
                        typeof player.name === "string" &&
                        Number.isFinite(player.total) &&
                        Number.isFinite(player.roundScore);
                });
                return saved;
            }
        } catch (error) {
            console.warn("Data tersimpan tidak dapat dibaca; memakai data awal.", error);
        }
        return initialState();
    }

    let state = loadState();

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            // Permainan tetap bisa digunakan selama halaman masih terbuka.
        }
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    function signedNumber(number) {
        return number > 0 ? "+" + number : String(number);
    }

    document.addEventListener("DOMContentLoaded", function () {
        const playerForm = document.getElementById("playerForm");
        const playerName = document.getElementById("playerName");
        const playersContainer = document.getElementById("playersContainer");
        const roundNumber = document.getElementById("roundNumber");
        const finishRound = document.getElementById("finishRound");
        const historyList = document.getElementById("historyList");

        function renderHistory() {
            if (state.history.length === 0) {
                historyList.innerHTML = '<p class="empty">Belum ada riwayat ronde.</p>';
                return;
            }

            historyList.innerHTML = state.history.slice().reverse().map(function (item) {
                const scores = Array.isArray(item.scores) ? item.scores : [];
                return '<div class="history-item">' +
                    '<strong>Ronde ' + escapeHTML(item.round) + '</strong>' +
                    '<p>' + scores.map(function (score) {
                        return escapeHTML(score.name) + ': ' +
                            signedNumber(score.points) + ' (total ' +
                            escapeHTML(score.total) + ')';
                    }).join(' · ') + '</p></div>';
            }).join("");
        }

        function renderPlayers() {
            roundNumber.textContent = String(state.round);
            playersContainer.innerHTML = state.players.map(function (player) {
                return '<article class="player-card" data-player-id="' + player.id + '">' +
                    '<div class="player-head"><h3>' + escapeHTML(player.name) + '</h3>' +
                    '<button type="button" class="remove-button" data-action="remove" ' +
                    'aria-label="Hapus pemain ' + escapeHTML(player.name) + '">×</button></div>' +
                    '<div class="score-bar"><span>Total Skor</span><strong>' +
                    escapeHTML(player.total) + '</strong></div>' +
                    '<p class="round-score">Skor ronde ini: ' +
                    signedNumber(player.roundScore) + '</p>' +
                    '<div class="score-actions">' +
                    '<button type="button" data-action="score" data-delta="-5">-5</button>' +
                    '<button type="button" data-action="score" data-delta="-1">-1</button>' +
                    '<button type="button" data-action="score" data-delta="1">+1</button>' +
                    '<button type="button" data-action="score" data-delta="5">+5</button>' +
                    '</div></article>';
            }).join("");

            renderHistory();
            saveState();
        }

        playerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = playerName.value.trim();
            if (!name) return;

            if (state.players.some(function (player) {
                return player.name.toLocaleLowerCase() === name.toLocaleLowerCase();
            })) {
                alert("Nama pemain tersebut sudah digunakan.");
                playerName.focus();
                return;
            }

            state.players.push({
                id: state.nextId++,
                name: name,
                total: 0,
                roundScore: 0
            });
            playerName.value = "";
            renderPlayers();
            playerName.focus();
        });

        playersContainer.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-action]");
            if (!button) return;

            const card = button.closest("[data-player-id]");
            if (!card) return;

            const playerId = Number(card.dataset.playerId);
            const player = state.players.find(function (item) {
                return item.id === playerId;
            });
            if (!player) return;

            if (button.dataset.action === "score") {
                const delta = Number(button.dataset.delta);
                if (![-5, -1, 1, 5].includes(delta)) return;

                player.total += delta;
                player.roundScore += delta;

                if (navigator.vibrate) {
                    try { navigator.vibrate(25); } catch (error) { /* Optional feature. */ }
                }
                renderPlayers();
            }

            if (button.dataset.action === "remove") {
                if (state.players.length <= 1) {
                    alert("Minimal harus ada satu pemain.");
                    return;
                }

                if (!window.confirm("Hapus pemain " + player.name + "?")) return;

                state.players = state.players.filter(function (item) {
                    return item.id !== playerId;
                });
                renderPlayers();
            }
        });

        finishRound.addEventListener("click", function () {
            if (state.players.length === 0) {
                alert("Tambahkan minimal satu pemain sebelum menyelesaikan ronde.");
                return;
            }

            state.history.push({
                round: state.round,
                scores: state.players.map(function (player) {
                    return {
                        name: player.name,
                        points: player.roundScore,
                        total: player.total
                    };
                })
            });

            state.round += 1;
            state.players.forEach(function (player) {
                player.roundScore = 0;
            });
            renderPlayers();
        });

        renderPlayers();
    });
}());
