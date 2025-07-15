const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('startBtn');
const stopButton = document.getElementById('stopBtn');
const add5MinButton = document.getElementById('add5MinBtn');
const modeLabel = document.getElementById('modeLabel');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const settingsForm = document.getElementById('settingsForm');
const workDurationMinutesInput = document.getElementById('workDurationMinutesInput');
const workDurationSecondsInput = document.getElementById('workDurationSecondsInput');
const restDurationMinutesInput = document.getElementById('restDurationMinutesInput');
const restDurationSecondsInput = document.getElementById('restDurationSecondsInput');
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
    // First oscillator (main bell tone)
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = 'triangle';
    o1.frequency.value = 1047; // C6, bell-like
    g1.gain.value = 0.0;
    o1.connect(g1).connect(ctx.destination);
    o1.start();
    g1.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.01); // soft attack
    g1.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.6); // gentle decay
    o1.stop(ctx.currentTime + 0.6);

    // Second oscillator (higher overtone, for notification feel)
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = 'triangle';
    o2.frequency.value = 1568; // G6, a fifth above
    g2.gain.value = 0.0;
    o2.connect(g2).connect(ctx.destination);
    o2.start(ctx.currentTime + 0.08); // comes in slightly after
    g2.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.10);
    g2.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.5);
    o2.stop(ctx.currentTime + 0.5);

    // Clean up
    o1.onended = () => ctx.close();
}

function updateModeLabel() {
    modeLabel.textContent = isWorkMode ? 'Work' : 'Rest';
}

function openSettingsModal() {
    workDurationMinutesInput.value = Math.floor(workDuration / 60);
    workDurationSecondsInput.value = workDuration % 60;
    restDurationMinutesInput.value = Math.floor(restDuration / 60);
    restDurationSecondsInput.value = restDuration % 60;
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
    const newWorkMin = parseInt(workDurationMinutesInput.value) || 0;
    const newWorkSec = parseInt(workDurationSecondsInput.value) || 0;
    const newRestMin = parseInt(restDurationMinutesInput.value) || 0;
    const newRestSec = parseInt(restDurationSecondsInput.value) || 0;
    const newWork = newWorkMin * 60 + newWorkSec;
    const newRest = newRestMin * 60 + newRestSec;
    if (newWork > 0 && newRest > 0) {
        workDuration = newWork;
        restDuration = newRest;
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