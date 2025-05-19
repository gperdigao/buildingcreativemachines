let word = "Hello"; // Default word
let wordParticles = [];
let starParticles = [];
let input;
let pg; // Graphics buffer for word

// Star parameters
const STAR_POINTS = 5; // Number of star points
const OUTER_RADIUS = 200;
const INNER_RADIUS = 100;
const STAR_DENSITY = 10; // Distance between star particles

// Rotation parameters
const ROTATION_THRESHOLD = 100; // Distance threshold for rotation
const ROTATION_SPEED = 0.05; // Rotation speed for particles

function setup() {
  createCanvas(800, 800);
  background(0);

  // Create input field for the word
  input = createInput(word);
  input.position(10, height + 10);
  input.size(200);
  input.input(updateWord);

  // Create a graphics buffer for the word
  pg = createGraphics(width, height);
  pg.pixelDensity(1); // Ensure consistent pixel density

  // Generate particles for both word and star
  createParticles();
}

function createParticles() {
  wordParticles = [];
  starParticles = [];

  // Generate word particles
  generateWordParticles();

  // Generate star particles
  generateStarParticles();
}

function generateWordParticles() {
  // Clear the graphics buffer
  pg.clear();
  pg.background(0);

  // Set text properties
  pg.textSize(200);
  pg.textAlign(CENTER, CENTER);
  pg.fill(255);
  pg.noStroke();

  // Draw the text onto the graphics buffer
  pg.text(word, width / 2, height / 2);

  // Load the pixel data from the graphics buffer
  pg.loadPixels();

  // Iterate over the pixels to find where the text is
  let density = 8; // Adjust for particle density (lower is denser)
  for (let y = 0; y < pg.height; y += density) {
    for (let x = 0; x < pg.width; x += density) {
      let index = (x + y * pg.width) * 4;
      let r = pg.pixels[index];
      // If the pixel is white (part of the text)
      if (r > 128) { // Threshold can be adjusted
        // Center the word
        let px = x - width / 2;
        let py = y - height / 2;
        wordParticles.push(new Particle(px, py));
      }
    }
  }
}

function generateStarParticles() {
  // Generate star points
  let points = generateStarPoints(0, 0, OUTER_RADIUS, INNER_RADIUS, STAR_POINTS, STAR_DENSITY);

  // Create particles for each star point
  for (let pt of points) {
    starParticles.push(new Particle(pt.x, pt.y));
  }
}

function generateStarPoints(centerX, centerY, outerR, innerR, nPoints, density) {
  let angleStep = TWO_PI / (nPoints * 2);
  let points = [];

  // Calculate the vertices of the star
  for (let i = 0; i < nPoints * 2; i++) {
    let r = (i % 2 === 0) ? outerR : innerR;
    let x = centerX + r * cos(i * angleStep - HALF_PI);
    let y = centerY + r * sin(i * angleStep - HALF_PI);
    points.push(createVector(x, y));
  }

  let sampledPoints = [];

  // Sample points along the star's edges
  for (let i = 0; i < points.length; i++) {
    let start = points[i];
    let end = points[(i + 2) % points.length]; // Connect every other point to form a star

    let totalDist = p5.Vector.dist(start, end);
    let steps = floor(totalDist / density);

    for (let j = 0; j < steps; j++) {
      let t = j / steps;
      let x = lerp(start.x, end.x, t);
      let y = lerp(start.y, end.y, t);
      sampledPoints.push(createVector(x, y));
    }
  }

  return sampledPoints;
}

function updateWord() {
  word = this.value();
  createParticles();
}

function draw() {
  background(0, 20); // Semi-transparent background for trailing effect
  translate(width / 2, height / 2);

  // Calculate mouse position relative to center
  let mouseRelX = mouseX - width / 2;
  let mouseRelY = mouseY - height / 2;

  // Display word particles
  for (let p of wordParticles) {
    p.update(mouseRelX, mouseRelY);
    p.show();
  }

  // Display star particles
  for (let p of starParticles) {
    p.update(mouseRelX, mouseRelY);
    p.show();
  }
}

class Particle {
  constructor(x, y) {
    this.origin = createVector(x, y); // Fixed position
    this.pos = this.origin.copy(); // Current position
    this.size = random(1, 3); // Particle size
    this.rotationAngle = 0; // Current rotation angle
  }

  update(mouseX, mouseY) {
    // Calculate distance from particle to mouse
    let distance = dist(this.origin.x, this.origin.y, mouseX, mouseY);

    if (distance < ROTATION_THRESHOLD) {
      // Rotate the particle around its origin
      this.rotationAngle += ROTATION_SPEED;
      let r = 20; // Radius of rotation around origin
      this.pos.x = this.origin.x + r * cos(this.rotationAngle);
      this.pos.y = this.origin.y + r * sin(this.rotationAngle);
    } else {
      // Reset to origin if not near mouse
      this.pos = this.origin.copy();
      this.rotationAngle = 0;
    }
  }

  show() {
    stroke(255);
    strokeWeight(this.size);
    point(this.pos.x, this.pos.y);
  }
}
