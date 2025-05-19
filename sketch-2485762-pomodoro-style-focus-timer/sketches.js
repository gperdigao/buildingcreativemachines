<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Productivity Station</title>
<style>
  body, html {
    margin: 0; padding: 0;
    font-family: 'Helvetica Neue', sans-serif;
    overflow: hidden;
    color: #ffffff;
  }

  #overlayUI {
    position: absolute;
    top: 0; left:0; right:0;
    padding: 20px;
    display: flex; 
    flex-wrap: wrap; 
    gap: 20px;
    pointer-events: none;
    box-sizing: border-box;
  }

  .panel {
    background: rgba(0,0,0,0.3);
    border-radius: 10px;
    padding: 15px;
    pointer-events: auto;
    max-width: 300px;
  }

  #timerPanel {
    flex: 1 1 200px;
  }

  #quotePanel {
    flex: 1 1 200px;
  }

  #notesPanel {
    flex: 1 1 300px;
  }

  h2, h3 {
    margin: 0 0 10px 0; 
    padding:0;
  }

  #timerDisplay {
    font-size: 3em;
    margin: 10px 0;
    text-align: center;
  }

  .timer-controls button {
    background: #ffffff22; 
    border: none;
    padding: 5px 10px; 
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    margin: 5px;
    font-size: 1em;
  }

  #quoteText {
    font-size:1.1em;
    font-style:italic;
    margin-bottom:10px;
    text-align:center;
  }

  #noteArea {
    width: 100%;
    height: 150px;
    border-radius: 5px;
    border: none;
    padding: 10px;
    box-sizing: border-box;
  }

  #saveNotes {
    background: #ffffff22; 
    border: none; 
    padding: 5px 10px;
    border-radius: 5px;
    color: #fff; 
    cursor: pointer;
    margin-top: 10px;
    display: inline-block;
  }
</style>
</head>
<body>
<div id="overlayUI">
  <div id="timerPanel" class="panel">
    <h2>Focus Timer</h2>
    <div id="timerDisplay">25:00</div>
    <div class="timer-controls" style="text-align:center;">
      <button id="startTimer">Start</button>
      <button id="pauseTimer">Pause</button>
      <button id="resetTimer">Reset</button>
    </div>
  </div>

  <div id="quotePanel" class="panel">
    <h2>Daily Inspiration</h2>
    <div id="quoteText">Loading quote...</div>
  </div>

  <div id="notesPanel" class="panel">
    <h2>Daily Notes</h2>
    <textarea id="noteArea" placeholder="Write your notes here..."></textarea>
    <button id="saveNotes">Save Notes</button>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
<script>
/**
 * Productivity Station:
 *  - Pomodoro-style focus timer
 *  - Local random quotes
 *  - Local storage notes
 *  - Animated geometric background
 */

// -------------------------------------
// Global Variables
// -------------------------------------
let timerSeconds = 1500; // 25 min * 60 = 1500 seconds
let timerRunning = false;
let timerInterval;

// Sample quotes array (local, no external API)
const quotes = [
  "Productivity is being able to do things that you were never able to do before.",
  "Focus on being productive instead of busy.",
  "Your mind is for having ideas, not holding them.",
  "If you spend too much time thinking about a thing, you'll never get it done.",
  "The way to get started is to quit talking and begin doing.",
  "Well done is better than well said.",
  "Action is the foundational key to all success.",
  "Simplicity boils down to two steps: Identify the essential. Eliminate the rest."
];

// Randomly select a quote once per day and store it
function getDailyQuote() {
  let storedDate = localStorage.getItem('quoteDate');
  let storedQuote = localStorage.getItem('dailyQuote');
  let today = new Date().toDateString();

  if (storedDate === today && storedQuote) {
    return storedQuote;
  } else {
    let q = random(quotes);
    localStorage.setItem('dailyQuote', q);
    localStorage.setItem('quoteDate', today);
    return q;
  }
}

// -------------------------------------
// Setup and p5 Draw
// -------------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  angleMode(DEGREES);

  // Set quote
  document.getElementById('quoteText').textContent = getDailyQuote();

  // Load notes
  let savedNotes = localStorage.getItem('dailyNotes');
  if (savedNotes) {
    document.getElementById('noteArea').value = savedNotes;
  }

  // Event listeners for timer buttons
  document.getElementById('startTimer').addEventListener('click', startTimer);
  document.getElementById('pauseTimer').addEventListener('click', pauseTimer);
  document.getElementById('resetTimer').addEventListener('click', resetTimer);

  // Save notes event
  document.getElementById('saveNotes').addEventListener('click', saveNotes);

  // Update timer display initially
  updateTimerDisplay();
}

function draw() {
  // Animated gradient background
  let c1 = color((frameCount * 0.1) % 360, 40, 70);
  let c2 = color(((frameCount * 0.1) + 120) % 360, 40, 40);
  setGradient(c1, c2);

  // Draw some geometric lines and arcs as background patterns
  stroke(255, 150);
  strokeWeight(1);
  let step = 50;
  for (let x = 0; x < width; x += step) {
    line(x + (frameCount % step), 0, x, height);
  }

  // Arcs at random positions
  noFill();
  strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    let cx = (width / 2) + sin(frameCount + i * 40) * width/3;
    let cy = (height / 2) + cos(frameCount + i * 40) * height/3;
    stroke(255, 100);
    arc(cx, cy, 100, 100, frameCount + i * 20, frameCount + i*20 + 180);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// -------------------------------------
// Utility Functions
// -------------------------------------
function setGradient(c1, c2) {
  colorMode(HSB);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let col = lerpColor(c1, c2, inter);
    stroke(col);
    line(0, y, width, y);
  }
  colorMode(RGB);
}

// Timer functions
function updateTimerDisplay() {
  let min = floor(timerSeconds / 60);
  let sec = timerSeconds % 60;
  document.getElementById('timerDisplay').textContent = nf(min,2) + ":" + nf(sec,2);
}

function startTimer() {
  if (!timerRunning) {
    timerRunning = true;
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerRunning = false;
        // Optional: notify user time is up
      }
    }, 1000);
  }
}

function pauseTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
  }
}

function resetTimer() {
  pauseTimer();
  timerSeconds = 1500; // reset to 25:00
  updateTimerDisplay();
}

// Save notes
function saveNotes() {
  let notes = document.getElementById('noteArea').value;
  localStorage.setItem('dailyNotes', notes);
}
</script>
</body>
</html>
