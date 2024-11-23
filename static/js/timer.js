class CarcassonneTimer {
    constructor() {
        this.initializeElements();
        this.timePreset = parseInt(this.timePresetSelect.value); // Get initial preset value
        this.player1Time = this.timePreset;
        this.player2Time = this.timePreset;
        this.player1Total = 0;
        this.player2Total = 0;
        this.currentPlayer = 1;
        this.isRunning = false;
        this.timerInterval = null;
        
        // Sound setup
        this.synth = new Tone.Synth().toDestination();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.playerSwitch = document.getElementById('player-switch');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.timePresetSelect = document.getElementById('time-preset');
        
        // Player 1 elements
        this.p1Minutes = document.getElementById('player1-minutes');
        this.p1Seconds = document.getElementById('player1-seconds');
        this.p1Total = document.getElementById('player1-total');
        
        // Player 2 elements
        this.p2Minutes = document.getElementById('player2-minutes');
        this.p2Seconds = document.getElementById('player2-seconds');
        this.p2Total = document.getElementById('player2-total');
    }

    setupEventListeners() {
        this.playerSwitch.addEventListener('change', () => this.togglePlayer());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.timePresetSelect.addEventListener('change', () => this.updateTimePreset());
    }

    updateTimePreset() {
        if (!this.isRunning) {
            this.timePreset = parseInt(this.timePresetSelect.value);
            this.player1Time = this.timePreset;
            this.player2Time = this.timePreset;
            this.updateDisplay();
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        // Player 1 display
        this.p1Minutes.textContent = Math.floor(this.player1Time / 60).toString().padStart(2, '0');
        this.p1Seconds.textContent = (this.player1Time % 60).toString().padStart(2, '0');
        this.p1Total.textContent = this.formatTime(this.player1Total);
        
        // Player 2 display
        this.p2Minutes.textContent = Math.floor(this.player2Time / 60).toString().padStart(2, '0');
        this.p2Seconds.textContent = (this.player2Time % 60).toString().padStart(2, '0');
        this.p2Total.textContent = this.formatTime(this.player2Total);
    }

    togglePlayer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTimer();
        }
        
        // Play switch sound
        this.synth.triggerAttackRelease("C4", "8n");
        
        // Reset current player's time before switching
        if (this.currentPlayer === 1) {
            this.player1Time = this.timePreset;
        } else {
            this.player2Time = this.timePreset;
        }
        
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.playerSwitch.checked = this.currentPlayer === 2;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.currentPlayer === 1) {
                this.player1Time--;
                this.player1Total++;
                if (this.player1Time <= 0) {
                    this.gameOver(1);
                }
            } else {
                this.player2Time--;
                this.player2Total++;
                if (this.player2Time <= 0) {
                    this.gameOver(2);
                }
            }
            this.updateDisplay();
        }, 1000);
    }

    togglePause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.pauseBtn.textContent = 'Resume';
        } else {
            this.startTimer();
            this.pauseBtn.textContent = 'Pause';
        }
        this.isRunning = !this.isRunning;
    }

    resetTimer() {
        clearInterval(this.timerInterval);
        this.timePreset = parseInt(this.timePresetSelect.value);
        this.player1Time = this.timePreset;
        this.player2Time = this.timePreset;
        this.player1Total = 0;
        this.player2Total = 0;
        this.currentPlayer = 1;
        this.isRunning = false;
        this.playerSwitch.checked = false;
        this.pauseBtn.textContent = 'Pause';
        this.updateDisplay();
    }

    async gameOver(player) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        
        // Save match result
        const matchData = {
            player1_total: this.player1Total,
            player2_total: this.player2Total,
            winner: player === 1 ? 2 : 1, // The other player wins when time runs out
            time_preset: this.timePreset
        };
        
        try {
            const response = await fetch('/api/matches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(matchData)
            });
            
            if (response.ok) {
                alert(`Game Over! Player ${player} ran out of time! Match saved to history.`);
            } else {
                alert(`Game Over! Player ${player} ran out of time! Failed to save match.`);
            }
        } catch (error) {
            console.error('Failed to save match:', error);
            alert(`Game Over! Player ${player} ran out of time! Failed to save match.`);
        }
        
        this.resetTimer();
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CarcassonneTimer();
});
