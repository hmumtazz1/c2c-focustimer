const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startBtn');
const stopButton = document.getElementById('stopBtn');
const add5MinButton = document.getElementById('add5MinBtn');
const modeLabel = document.getElementById('modeLabel');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const settingsForm = document.getElementById('settingsForm');
const workDurationInput = document.getElementById('workDurationInput');
const restDurationInput = document.getElementById('restDurationInput');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');

let workDuration = 25 * 60; // in seconds
let restDuration = 5 * 60; // in seconds
let timeLeft = workDuration;
let timerId = null;
let isPaused = false;
let isWorkMode = true; // true = work, false = rest

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function playChime() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.1;
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.4);
    o.onended = () => ctx.close();
}

function updateModeLabel() {
    modeLabel.textContent = isWorkMode ? 'Work' : 'Rest';
}

function openSettingsModal() {
    workDurationInput.value = Math.floor(workDuration / 60);
    restDurationInput.value = Math.floor(restDuration / 60);
    settingsModal.classList.add('show');
}

function closeSettingsModal() {
    settingsModal.classList.remove('show');
}

function startOrPauseTimer() {
    if (timerId === null) {
        if (!isPaused) {
            timeLeft = isWorkMode ? workDuration : restDuration;
        }
        isPaused = false;
        startButton.textContent = 'Pause';
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                playChime();
                isWorkMode = !isWorkMode;
                updateModeLabel();
                timeLeft = isWorkMode ? workDuration : restDuration;
                updateDisplay();
                startOrPauseTimer();
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
    isWorkMode = true;
    updateModeLabel();
    timeLeft = workDuration;
    updateDisplay();
    startButton.textContent = 'Start';
}

function addFiveMinutes() {
    timeLeft += 5 * 60;
    updateDisplay();
}

// Event listeners
startButton.addEventListener('click', startOrPauseTimer);
stopButton.addEventListener('click', stopTimer);
add5MinButton.addEventListener('click', addFiveMinutes);
settingsBtn.addEventListener('click', openSettingsModal);
cancelSettingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeSettingsModal();
});
settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newWork = parseInt(workDurationInput.value);
    const newRest = parseInt(restDurationInput.value);
    if (newWork > 0 && newRest > 0) {
        workDuration = newWork * 60;
        restDuration = newRest * 60;
        if (isWorkMode) {
            timeLeft = workDuration;
        } else {
            timeLeft = restDuration;
        }
        updateDisplay();
        closeSettingsModal();
    }
});

// Initial setup
startButton.textContent = 'Start';
updateDisplay();
updateModeLabel(); 