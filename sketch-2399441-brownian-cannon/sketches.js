// "Survival" 🏕 #WCCChallenge 21/10/2024 v.10
// Built by Gonçalo Perdigão https://openprocessing.org/user/392648

let bullets = [];
let blocks = [];
let blockLimit = 10; // Starting blocks
let lives = 3; // Number of lives
let wallX; // Position of the wall
let bulletFrequency = 500; // Bullet fired every 0.5 second
let lastBulletTime = 0;
let blockCooldown = 1000; // Time to gain a new block (1 second)
let lastBlockGainTime = 0;
let blockWidth = 10; // Width of the blocks
let wallHit = false;
let gameIsOver = false; // Flag to track game over state
let score = 0; // Initialize score
let startTime; // Start time for the game

function setup() {
  createCanvas(windowWidth, windowHeight);
  wallX = width * 0.8; // Wall positioned at 80% of canvas width
  strokeWeight(1); // Thin lines for elegant traces
  textSize(14); // Reduced font size for elegance
  startTime = millis(); // Set the game start time
}

function draw() {
  background(20, 40, 70); // Elegant background

  // Draw the wall
  stroke(255); // White wall
  line(wallX, 0, wallX, height); 

  if (gameIsOver) {
    drawGameOverScreen();
    return;
  }

  // Draw blocks
  for (let i = blocks.length - 1; i >= 0; i--) {
    blocks[i].show();
  }

  // Generate new bullet every second
  let currentTime = millis();
  if (currentTime - lastBulletTime > bulletFrequency) {
    bullets.push(new Bullet());
    lastBulletTime = currentTime;
  }

  // Update and show bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();

    // Check collision with blocks
    for (let j = blocks.length - 1; j >= 0; j--) {
      if (bullets[i].hits(blocks[j])) {
        bullets.splice(i, 1); // Bullet is destroyed
        blocks.splice(j, 1); // Block is destroyed
        blockLimit--; // Reduce block count
        score += 20; // Add 20 points for successful block
        break;
      }
    }

    // Check if bullet hits the wall
    if (bullets[i] && bullets[i].x >= wallX) {
      bullets.splice(i, 1); // Remove bullet
      lives--; // Lose 1 life
      wallHit = true; // Trigger animation for wall hit
      if (lives <= 0) {
        gameIsOver = true; // Set game over flag
      }
    }

    // Remove bullets if they touch the top or bottom of the canvas
    if (bullets[i] && (bullets[i].y <= 0 || bullets[i].y >= height)) {
      bullets.splice(i, 1); // Remove bullet
    }
  }

  // Gain new block every second, up to the limit of 10
  if (currentTime - lastBlockGainTime > blockCooldown && blockLimit < 10) {
    blockLimit++;
    lastBlockGainTime = currentTime;
  }

  // Add 1 point per second of game time
  score = floor((millis() - startTime) / 1000) + score % 1; // Ensures score continues correctly

  // Show remaining blocks, lives, and score
  fill(255);
  text("Blocks Available: " + blockLimit, 20, 20);
  text("Lives: " + lives, 20, 40);
  text("Score: " + score, 20, 60); // Display score

  // Handle wall hit animation (brief flash)
  if (wallHit) {
    stroke(255, 0, 0);
    line(wallX, 0, wallX, height); // Flash red wall
    wallHit = false;
  }
}

function mousePressed() {
  if (gameIsOver) {
    restartGame(); // Restart the game if it's over
  } else if (blockLimit > 0 && mouseX < wallX) {
    // Place a block when the mouse is pressed, if blocks are available and inside the canvas
    blocks.push(new Block(mouseX, mouseY));
    blockLimit--;
  }
}

// Bullet class (Brownian motion)
class Bullet {
  constructor() {
    this.x = 0;
    this.y = height / 2;
    this.stepSize = 2; // Speed of the bullet
    this.drift = 0;
    this.trace = [];
  }

  update() {
    // Move the bullet horizontally
    this.x += this.stepSize;

    // Narrow Brownian motion for vertical movement
    this.drift += random(-0.2, 0.2); // Narrow vertical drift for smooth, controlled movement
    this.y += this.drift;

    // Store the trail
    this.trace.push({ x: this.x, y: this.y });
    if (this.trace.length > 200) {
      this.trace.shift();
    }
  }

  show() {
    stroke(255); // Simple white lines for the trail

    // Draw the trail of the bullet
    noFill(); // No filling to avoid visual artifacts
    beginShape();
    for (let i = 0; i < this.trace.length; i++) {
      vertex(this.trace[i].x, this.trace[i].y);
    }
    endShape();

    // Draw the bullet itself
    stroke(255);
    ellipse(this.x, this.y, 5, 5);
  }

  hits(block) {
    // Check if bullet hits a block
    return this.x > block.x && this.x < block.x + blockWidth && this.y > block.y && this.y < block.y + block.height;
  }
}

// Block class
class Block {
  constructor(x, y) {
    this.x = wallX - blockWidth; // Block position at the wall
    this.y = y;
    this.height = 50; // Block height
  }

  show() {
    stroke(100, 200, 255); // Elegant blue block
    fill(100, 200, 255);
    rect(this.x, this.y, blockWidth, this.height);
  }
}

function drawGameOverScreen() {
  fill(255);
  textSize(32);
  text("Game Over", width / 2 - 100, height / 2);
  textSize(14); // Reset the text size
  text("Click to restart", width / 2 - 60, height / 2 + 30);
}

function restartGame() {
  // Reset all game parameters
  bullets = [];
  blocks = [];
  blockLimit = 10;
  lives = 3;
  lastBulletTime = 0;
  lastBlockGainTime = 0;
  score = 0; // Reset score
  startTime = millis(); // Reset start time
  gameIsOver = false;
  loop(); // Restart the game loop
}
