// Chaos Rider
// A fractal-inspired arcade collecting game using p5.js only.
// Inspired by the Clifford Attractor and a basic game scenario.
// Move your ship with arrow keys or WASD to collect orbs before they vanish.
// Enjoy the swirling fractal background and aim for a high score.

// ---------------------------------------
// GLOBALS
// ---------------------------------------
let shipX, shipY;
let shipSpeed = 30;
let score = 0;
let gameOver = false;
let timeLimit = 60; // seconds
let startTime;

let orbs = [];
let orbSpawnInterval = 2000; // ms
let lastOrbSpawn = 0;
let orbLifetime = 10000; // ms

let attractorPoints = [];
let attractorSamples = 50000;
let attractorScale = 200;
let attractorFade = 20;
let a = -1.4;
let b = 1.6;
let c = 1.0;
let d = 0.7;

// For subtle attractor-based forces on the player
let fieldStrength = 0.02;

// Player movement input
let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;

// ---------------------------------------
// SETUP
// ---------------------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  
  // Initialize ship position in center
  shipX = width/2;
  shipY = height/2;
  
  // Generate attractor points once
  // We'll animate their colors over time instead of re-generating
  let x = random(-1,1);
  let y = random(-1,1);
  for (let i = 0; i < attractorSamples; i++) {
    let x1 = sin(a * y) + c * cos(a * x);
    let y1 = sin(b * x) + d * cos(b * y);
    x = x1;
    y = y1;
    attractorPoints.push({x: x, y: y});
  }

  startTime = millis();
}

// ---------------------------------------
// DRAW LOOP
// ---------------------------------------
function draw() {
  if (gameOver) {
    drawGameOver();
    return;
  }

  let elapsed = (millis() - startTime)/1000;
  if (elapsed >= timeLimit) {
    gameOver = true;
    return;
  }

  // Draw fractal background
  background(0,0,0,100);
  push();
  translate(width/2, height/2);
  scale(attractorScale);
  noStroke();
  let hueOffset = (frameCount * 0.1) % 360;
  for (let i = 0; i < attractorPoints.length; i++) {
    let p = attractorPoints[i];
    // Color shifts slowly over time
    let h = (hueOffset + i*0.001) % 360;
    fill(h, 60, 80, 5);
    rect(p.x, p.y, 0.002, 0.002);
  }
  pop();

  // Handle orbs
  spawnOrbs();
  updateOrbs();
  drawOrbs();

  // Update player
  updateShip();
  drawShip();

  // HUD
  drawHUD(elapsed);

  // Check collisions with orbs
  checkCollisions();
}

// ---------------------------------------
// SHIP FUNCTIONS
// ---------------------------------------
function updateShip() {
  // Attractor-based subtle influence on movement
  // Convert ship position to attractor coords
  let ax = (shipX - width/2)/attractorScale;
  let ay = (shipY - height/2)/attractorScale;

  // Compute "force" from attractor gradient (simple approximation)
  // We'll pick the closest attractor point and nudge the ship slightly.
  // This is just a simple trick, not a real gradient calc.
  let nearestDist = Infinity;
  let nearestP = null;
  for (let i = 0; i < 20; i++) {
    let idx = floor(random(attractorPoints.length));
    let p = attractorPoints[idx];
    let dx = p.x - ax;
    let dy = p.y - ay;
    let dd = dx*dx+dy*dy;
    if (dd < nearestDist) {
      nearestDist = dd;
      nearestP = p;
    }
  }
  // Apply a small force pulling the ship toward the nearest attractor point
  if (nearestP) {
    let dx = ((nearestP.x*attractorScale + width/2)-shipX)*fieldStrength;
    let dy = ((nearestP.y*attractorScale + height/2)-shipY)*fieldStrength;
    shipX += dx;
    shipY += dy;
  }

  // Player input movement
  let vx = 0;
  let vy = 0;
  if (moveUp) vy -= shipSpeed;
  if (moveDown) vy += shipSpeed;
  if (moveLeft) vx -= shipSpeed;
  if (moveRight) vx += shipSpeed;

  shipX += vx;
  shipY += vy;

  // Keep ship within screen bounds
  shipX = constrain(shipX, 0, width);
  shipY = constrain(shipY, 0, height);
}

function drawShip() {
  fill(120,100,100);
  noStroke();
  push();
  translate(shipX, shipY);
  ellipse(0,0,20,20);
  pop();
}

// ---------------------------------------
// ORBS FUNCTIONS
// ---------------------------------------
function spawnOrbs() {
  let now = millis();
  // Spawn orbs at intervals
  if (now - lastOrbSpawn > orbSpawnInterval) {
    lastOrbSpawn = now;
    let ox = random(40, width-40);
    let oy = random(100, height-100);
    orbs.push({x: ox, y: oy, born: now});
  }
}

function updateOrbs() {
  let now = millis();
  // Remove old orbs
  orbs = orbs.filter(o => now - o.born < orbLifetime);
}

function drawOrbs() {
  let now = millis();
  for (let o of orbs) {
    let age = now - o.born;
    let lifeRatio = 1 - age/orbLifetime;
    let orbSize = 20 * (0.5 + 0.5*lifeRatio);
    let orbHue = map(lifeRatio,0,1,0,120);
    fill(orbHue,100,100);
    noStroke();
    ellipse(o.x, o.y, orbSize, orbSize);
  }
}

function checkCollisions() {
  // Check if ship touches an orb
  for (let i = orbs.length-1; i >= 0; i--) {
    let o = orbs[i];
    let distSq = (o.x - shipX)*(o.x - shipX)+(o.y - shipY)*(o.y - shipY);
    if (distSq < 20*20) {
      // collected
      orbs.splice(i,1);
      score++;
    }
  }
}

// ---------------------------------------
// HUD, GAME OVER, ETC
// ---------------------------------------
function drawHUD(elapsed) {
  fill(0,0,100);
  textSize(20);
  textAlign(LEFT,TOP);
  text("Score: "+score, 10,10);
  let remaining = max(0,floor(timeLimit - elapsed));
  text("Time: "+remaining, 10, 40);
}

function drawGameOver() {
  background(0);
  fill(0,0,100);
  textAlign(CENTER,CENTER);
  textSize(32);
  text("GAME OVER\nScore: "+score+"\nPress any key to restart", width/2, height/2);
}

// ---------------------------------------
// INPUT HANDLING
// ---------------------------------------
function keyPressed() {
  if (gameOver) {
    restartGame();
    return;
  }
  if (key === 'W' || keyCode === UP_ARROW) moveUp = true;
  if (key === 'S' || keyCode === DOWN_ARROW) moveDown = true;
  if (key === 'A' || keyCode === LEFT_ARROW) moveLeft = true;
  if (key === 'D' || keyCode === RIGHT_ARROW) moveRight = true;
}

function keyReleased() {
  if (key === 'W' || keyCode === UP_ARROW) moveUp = false;
  if (key === 'S' || keyCode === DOWN_ARROW) moveDown = false;
  if (key === 'A' || keyCode === LEFT_ARROW) moveLeft = false;
  if (key === 'D' || keyCode === RIGHT_ARROW) moveRight = false;
}

function restartGame() {
  score = 0;
  gameOver = false;
  startTime = millis();
  orbs = [];
  shipX = width/2;
  shipY = height/2;
}
  
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Keep ship on screen
  shipX = constrain(shipX,0,width);
  shipY = constrain(shipY,0,height);
}
