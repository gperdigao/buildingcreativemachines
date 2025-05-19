let balls = []; // Array to hold all the balls
let ballFrequency = 100; // Time interval (in milliseconds) to fire new balls
let lastBallTime = 0; // To keep track of time for new balls
let wallX; // Position of the vertical wall
let wallResolution = 100; // Number of segments in the wall for probability tracking
let wallImpact; // Array to track impact probabilities on the wall

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(1); // Thin lines for elegant traces
  noFill();

  // Wall position and setup
  wallX = width * 0.75; // Wall is 75% of the way across the screen
  wallImpact = new Array(wallResolution).fill(0); // Initialize wall impact array with zeros
}

function draw() {
  background(20, 40, 70, 25); // Background fades slightly, leaving a trace of the ball paths
  let currentTime = millis(); // Current time in milliseconds

  // Add a new ball every X seconds
  if (currentTime - lastBallTime > ballFrequency) {
    balls.push(new Ball());
    lastBallTime = currentTime;
  }

  // Update and draw all balls
  for (let i = balls.length - 1; i >= 0; i--) {
    balls[i].update();
    balls[i].show();

    // Check if ball reaches the wall
    if (balls[i].x >= wallX) {
      registerImpact(balls[i].y); // Register impact on the wall
      balls.splice(i, 1); // Remove ball after it hits the wall
    }
  }

  drawWall(); // Draw the probability wall
}

function drawWall() {
  // Draw the wall with a vertical gradient based on impact probability
  for (let i = 0; i < wallResolution; i++) {
    let y1 = map(i, 0, wallResolution, 0, height);
    let y2 = map(i + 1, 0, wallResolution, 0, height);
    let colorVal = map(wallImpact[i], 0, max(wallImpact), 255, 0); // White (0 impact) to Black (high impact)
    stroke(colorVal);
    line(wallX, y1, wallX, y2); // Draw the thin line representing the wall segment
  }
}

function registerImpact(y) {
  // Map the Y position of the ball to a specific segment of the wall
  let wallIndex = floor(map(y, 0, height, 0, wallResolution));

  // Increment the impact count at that wall index (clamp to valid array indices)
  if (wallIndex >= 0 && wallIndex < wallResolution) {
    wallImpact[wallIndex]++;
  }
}

class Ball {
  constructor() {
    this.x = 0; // Start at the left edge
    this.y = height / 2; // Start vertically in the middle
    this.stepSize = 2; // Step size in X direction (how fast it moves horizontally)
    this.drift = 0; // Current random vertical drift (Brownian movement)
    this.trace = []; // Array to hold the trail of positions
  }

  update() {
    // Move the ball horizontally by a constant step size
    this.x += this.stepSize;

    // Apply Brownian movement (small random vertical adjustments)
    this.drift += random(-1, 1); // Slight random change in the Y direction
    this.y += this.drift;

    // Store the current position in the trace
    this.trace.push({ x: this.x, y: this.y });

    // Limit the trace array length to avoid memory issues
    if (this.trace.length > 200) {
      this.trace.shift();
    }
  }

  show() {
    stroke(255, 150); // Soft white trace for elegance

    // Draw the trail of the ball
    beginShape();
    for (let i = 0; i < this.trace.length; i++) {
      vertex(this.trace[i].x, this.trace[i].y);
    }
    endShape();

    // Draw the ball itself
    stroke(255, 255, 255);
    ellipse(this.x, this.y, 5, 5); // Small circle representing the ball
  }
}
