const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startBtn');
const stopButton = document.getElementById('stopBtn');
const add5MinButton = document.getElementById('add5MinBtn');
const minutesInput = document.getElementById('minutesInput');

let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isPaused = false;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startOrPauseTimer() {
    if (timerId === null) {
        if (!isPaused) {
            timeLeft = parseInt(minutesInput.value) * 60;
        }
        isPaused = false;
        startButton.textContent = 'Pause';
        minutesInput.disabled = true;
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                alert('Time is up!');
                resetTimer();
            }
        }, 1000);
    } else {
        // Pause
        clearInterval(timerId);
        timerId = null;
        isPaused = true;
        startButton.textContent = 'Start';
    }
}

function stopTimer() {
    resetTimer();
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isPaused = false;
    timeLeft = parseInt(minutesInput.value) * 60;
    updateDisplay();
    startButton.textContent = 'Start';
    minutesInput.disabled = false;
}

function addFiveMinutes() {
    timeLeft += 5 * 60;
    updateDisplay();
}

// Event listeners
startButton.addEventListener('click', startOrPauseTimer);
stopButton.addEventListener('click', stopTimer);
add5MinButton.addEventListener('click', addFiveMinutes);
minutesInput.addEventListener('change', () => {
    if (!timerId && !isPaused) {
        timeLeft = parseInt(minutesInput.value) * 60;
        updateDisplay();
    }
});

// Initial setup
startButton.textContent = 'Start';
updateDisplay(); 