let balls = []; // Array to hold all the balls
let ballFrequency = 500; // Time interval (in milliseconds) to fire new balls
let lastBallTime = 0; // To keep track of time for new balls

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(1); // Thin lines for elegant traces
  noFill();
}

function draw() {
  background(20, 40, 70, 25); // Background fades slightly, leaving a trace of the ball paths
  let currentTime = millis(); // Current time in milliseconds
  
  // Add a new ball every 0.5 seconds
  if (currentTime - lastBallTime > ballFrequency) {
    balls.push(new Ball());
    lastBallTime = currentTime;
  }
  
  // Update and draw all balls
  for (let i = balls.length - 1; i >= 0; i--) {
    balls[i].update();
    balls[i].show();

    // Remove the ball once it reaches the right edge of the screen
    if (balls[i].x > width) {
      balls.splice(i, 1);
    }
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
