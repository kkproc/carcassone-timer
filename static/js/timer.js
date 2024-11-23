class CarcassonneTimer {
    constructor() {
        this.player1Time = 600; // 10 minutes in seconds
        this.player2Time = 600;
        this.player1Total = 0;
        this.player2Total = 0;
        this.currentPlayer = 1;
        this.isRunning = false;
        this.timerInterval = null;
        
        // Sound setup
        this.synth = new Tone.Synth().toDestination();
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.lever = document.getElementById('lever');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        
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
        this.lever.addEventListener('click', () => this.togglePlayer());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
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
        
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.lever.classList.toggle('player2-active');
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
        this.player1Time = 600;
        this.player2Time = 600;
        this.player1Total = 0;
        this.player2Total = 0;
        this.currentPlayer = 1;
        this.isRunning = false;
        this.lever.classList.remove('player2-active');
        this.pauseBtn.textContent = 'Pause';
        this.updateDisplay();
    }

    gameOver(player) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        alert(`Game Over! Player ${player} ran out of time!`);
        this.resetTimer();
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CarcassonneTimer();
});
