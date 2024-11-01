const testTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "Practice makes perfect, so keep typing to improve your speed.",
    "The typing test is a great way to improve your typing accuracy.",
    "Coding is fun, but improving your typing speed is also important."
];
const textDisplay = document.getElementById('text-display');
const inputArea = document.getElementById('text-input');
const timeDisplay = document.getElementById('time');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const progressBar = document.getElementById('progress-bar');
const restartButton = document.getElementById('restart-btn');
const timeLimitSelector = document.getElementById('time-limit');
const bestWpmDisplay = document.getElementById('best-wpm').querySelector('span');
const bestAccuracyDisplay = document.getElementById('best-accuracy').querySelector('span');

let startTime = 0, timeLimit = 15, timer, isTestActive = false;
let correctChars = 0;
let currentText = "";

function startTest() {
    if (!isTestActive) {
        isTestActive = true;
        inputArea.disabled = false;
        inputArea.focus();
        inputArea.value = "";
        startTime = new Date().getTime();
        timeLimit = parseInt(timeLimitSelector.value, 10);
        correctChars = 0;
        currentText = getRandomText();
        textDisplay.innerText = currentText;
        timeDisplay.innerText = `${timeLimit}`;
        // setInterval(function, delay): executes a specified function at a set interval of time, measured in milliseconds
        timer = setInterval(updateTimer, 250);
    }
}
function endTest() {
    isTestActive = false;
    clearInterval(timer); // stop setInterval()
    calculateResults();
    saveBestResult();
    inputArea.value = "";
    inputArea.value = "start typing here..."
    textDisplay.innerText = "";
    inputArea.disabled = true;
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const timeRemaining = timeLimit - elapsedTime;
    if (timeRemaining <= 0) {
        timeDisplay.innerText = "0";
        progressBar.style.setProperty('--progress-width', `100%`);
        endTest();
    } else {
        // timeDisplay.innerText = `Time: ${timeRemaining} seconds`;
        timeDisplay.innerText = timeRemaining;
        updateProgressBar(timeRemaining);
    }
    calculateLiveStats();
}

function updateProgressBar(timeRemaining) {
    const percentage = ((timeLimit - timeRemaining) / timeLimit) * 100;
    progressBar.style.setProperty('--progress-width', `${percentage}%`);
}


function calculateResults() {
    const typedText = inputArea.value;
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const elapsedTime = (new Date().getTime() - startTime) / (1000 * 60);
    const wpm = Math.floor(wordsTyped / elapsedTime);

    const accuracy = Math.floor((correctChars / currentText.length) * 100);

    wpmDisplay.innerText = `WPM: ${wpm}`;
    accuracyDisplay.innerText = `Accuracy: ${accuracy}%`;
}

function calculateLiveStats() {
    const typedText = inputArea.value;
    correctChars = compareTexts(currentText, typedText);

    const wordsTyped = typedText.trim().split(/\s+/).length;
    const elapsedTime = (new Date().getTime() - startTime) / (1000 * 60);
    const wpm = Math.floor(wordsTyped / elapsedTime);

    const accuracy = Math.floor((correctChars / currentText.length) * 100);

    wpmDisplay.innerText = `${wpm}`;
    accuracyDisplay.innerText = `${accuracy}%`;
}

function compareTexts(testText, typedText) {
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] == testText[i]) {
            correctChars++;
        } else {

        }
    }
    return correctChars;
}

function getRandomText() {
    const randomIndex = Math.floor(Math.random() * testTexts.length);
    return testTexts[randomIndex];
}

function saveBestResult() {
    const currentWpm = parseint(wpmDisplay.innerText.split(' ')[1], 10);
    const currentAccuracy = parseInt(accuracyDisplay.innerText.split("%")[0], 10);

    const bestWpm = localStorage.getItem('bestWpm') || 0;
    const bestAccuracy = localStorage.getItem('bestAccuracy') || 0;

    if (currentWpm > bestWpm) {
        localStorage.setItem('bestWpm', currentWpm);
        bestWpmDisplay.innerText = currentWpm;
    }

    if (currentAccuracy > bestAccuracy) {
        localStorage.setItem('bestAccuracy', currentAccuracy);
        bestAccuracyDisplay.innerText = currentAccuracy;
    }
}

timeLimitSelector.addEventListener('change', function () {
    timeLimit = parseInt(timeLimitSelector.value, 10);
    timeDisplay.innerText = `${timeLimit}`;
});

inputArea.addEventListener('input', startTest);
restartButton.addEventListener('click', function () {
    clearInterval(timer);
    isTestActive = false;
    progressBar.style.setProperty('--progress-width', `${0}%`);
    timeDisplay.innerText = timeLimit;
    wpmDisplay.innerText = "0";
    accuracyDisplay.innerText = "100%";
    inputArea.value = "";
    inputArea.value = "start typing here...";
    textDisplay.innerText = "";
    inputArea.disabled = false;
});

window.onload = () => {
    const bestWpm = localStorage.getItem('bestWpm') || 0;
    const bestAccuracy = localStorage.getItem('bestAccuracy') || 0;

    bestWpmDisplay.innerText = bestWpm;
    bestAccuracyDisplay.innerText = bestAccuracy;
}