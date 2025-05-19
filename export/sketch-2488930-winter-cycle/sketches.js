// "Winter" ❄ #WCCChallenge
// by Gonçalo Perdigão www.buildingcreativemachines.com

let font;
let points = [];
let snowflakes = [];
const NUM_SNOWFLAKES = 2500; // Total number of snowflakes
const TARGET_POINTS = []; // Points forming the word "Winter"
const word = "WINTER";
let phase = "building"; // Current phase: 'building' or 'exploding'
let explosionTimer = 0; // Timer for explosion phase
const explosionDuration = 120; // Frames to wait during explosion (e.g., 120 frames = 2 seconds at 60 FPS)
let fontSize;
let wordBounds;
let centerOffset;

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  noStroke();
  
  // Define font size based on canvas size
  fontSize = min(width, height) / 5;
  
  // Get the bounding box of the word to center it
  wordBounds = font.textBounds(word, 0, 0, fontSize);
  
  centerOffset = createVector(
    -wordBounds.x + (width / 2) - (wordBounds.w / 2),
    -wordBounds.y + (height / 2) - (wordBounds.h / 2)
  );
  
  // Get points for the word "Winter"
  points = font.textToPoints(word, 0, 0, fontSize, {
    sampleFactor: 0.2, // Adjust for point density
    simplifyThreshold: 0
  });
  
  // Shift points to center the word
  for (let pnt of points) {
    let shifted = createVector(pnt.x, pnt.y).add(centerOffset);
    TARGET_POINTS.push(shifted);
  }
  
  // Initialize snowflakes and assign each to a target point
  for (let i = 0; i < NUM_SNOWFLAKES; i++) {
    let target;
    if (i < TARGET_POINTS.length) {
      target = TARGET_POINTS[i];
    } else {
      // Extra snowflakes have random targets near the word
      target = createVector(random(width / 2 - wordBounds.w, width / 2 + wordBounds.w),
                           random(height / 2 - wordBounds.h, height / 2 + wordBounds.h));
    }
    let flake = new Snowflake(target);
    snowflakes.push(flake);
  }
}

function draw() {
  setGradient(0, 0, width, height, color(20, 24, 82), color(135, 206, 235), 'Y_AXIS');
  
  for (let flake of snowflakes) {
    flake.update();
    flake.display();
  }
  
  // Check phase transitions
  if (phase === "building") {
    // Check if all snowflakes have reached their targets
    let allAtTargets = snowflakes.every(flake => flake.atTarget);
    if (allAtTargets) {
      phase = "exploding";
      explosionTimer = explosionDuration;
      
      // Trigger explosion for all snowflakes
      for (let flake of snowflakes) {
        flake.explode();
      }
    }
  } else if (phase === "exploding") {
    explosionTimer--;
    if (explosionTimer <= 0) {
      // Reset snowflakes to start building again
      phase = "building";
      for (let flake of snowflakes) {
        flake.reset();
      }
    }
  }
}

// Snowflake class definition
class Snowflake {
  constructor(target) {
    this.initialPosition = createVector(random(width), random(-height, 0));
    this.pos = this.initialPosition.copy();
    this.target = target.copy();
    this.vel = createVector(0, 0);
    this.size = random(2, 5);
    this.opacity = random(150, 255);
    this.atTarget = false;
    this.exploded = false;
  }
  
  update() {
    if (phase === "building" && !this.atTarget) {
      // Move towards target with easing
      let force = p5.Vector.sub(this.target, this.pos);
      force.setMag(0.1); // Adjust the magnitude for speed
      this.vel.add(force);
      this.vel.limit(2); // Limit maximum speed
      this.pos.add(this.vel);
      
      // Check if reached target
      if (p5.Vector.dist(this.pos, this.target) < 1) {
        this.pos = this.target.copy();
        this.atTarget = true;
        this.vel.mult(0);
      }
    } else if (phase === "exploding") {
      // Explosion phase: snowflakes have velocity from explosion
      this.pos.add(this.vel);
      
      // Optional: Add slight gravity or wind effects during explosion
      // this.vel.y += 0.05; // Gravity
    }
  }
  
  display() {
    fill(255, this.opacity);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
  
  explode() {
    if (!this.exploded) {
      // Calculate direction away from the center of the word
      let center = createVector(width / 2, height / 2);
      let direction = p5.Vector.sub(this.pos, center);
      direction.normalize();
      direction.mult(random(2, 5)); // Explosion speed
      
      this.vel = direction;
      this.exploded = true;
    }
  }
  
  reset() {
    // Reset position to initial and clear state
    this.pos = this.initialPosition.copy();
    this.atTarget = false;
    this.exploded = false;
    this.vel = createVector(0, 0);
  }
}

// Function to create a vertical or horizontal gradient
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === 'Y_AXIS') {  // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === 'X_AXIS') {  // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

// Adjust canvas size when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Recalculate font size and center offset
  fontSize = min(width, height) / 5;
  wordBounds = font.textBounds(word, 0, 0, fontSize);
  centerOffset = createVector(
    -wordBounds.x + (width / 2) - (wordBounds.w / 2),
    -wordBounds.y + (height / 2) - (wordBounds.h / 2)
  );
  
  // Update target points and reassign to snowflakes
  TARGET_POINTS.length = 0; // Clear existing points
  points = font.textToPoints(word, 0, 0, fontSize, {
    sampleFactor: 0.2, // Adjust for point density
    simplifyThreshold: 0
  });
  
  for (let pnt of points) {
    let shifted = createVector(pnt.x, pnt.y).add(centerOffset);
    TARGET_POINTS.push(shifted);
  }
  
  for (let i = 0; i < snowflakes.length; i++) {
    if (i < TARGET_POINTS.length) {
      snowflakes[i].target = TARGET_POINTS[i].copy();
    } else {
      // Extra snowflakes have random targets near the word
      snowflakes[i].target = createVector(random(width / 2 - wordBounds.w, width / 2 + wordBounds.w),
                                         random(height / 2 - wordBounds.h, height / 2 + wordBounds.h));
    }
  }
}
