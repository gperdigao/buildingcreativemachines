let particles = [];
let blockSize;
let hoverRadius = 50;
let springStrength = 0.08;
let damping = 0.92;
let repelStrength = 1.2;
let particleSpacing = 3; // spacing between particles within each pixel block

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  initializeParticles();
}

function initializeParticles() {
  particles = []; // Reset particles array to handle window resizing

  // Define the shape as a 2D array
  let shape = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Top waistband
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], // Second row
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // Third row
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], // Fourth row
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // Fifth row
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0], // Sixth row
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // Seventh row
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], // Eighth row
  ];

  // Calculate blockSize based on both width and height
  let designWidth = 16; // Number of columns in the widest row
  let designHeight = shape.length; // Number of rows in the design

  // Calculate blockSize to fit within 80% of both width and height
  let maxBlockSizeWidth = (width * 0.8) / designWidth;
  let maxBlockSizeHeight = (height * 0.8) / designHeight;
  blockSize = min(maxBlockSizeWidth, maxBlockSizeHeight);

  // Center the shape on the screen
  let startY = (height - designHeight * blockSize) / 2;
  let centerX = width / 2;

  // Create particles based on the shape
  let currentY = startY;
  for (let row of shape) {
    let rowWidth = row.length * blockSize;
    let startX = centerX - rowWidth / 2;
    for (let col = 0; col < row.length; col++) {
      if (row[col] === 1) {
        // Create particles within this "pixel block"
        let blockX = startX + col * blockSize;
        createParticlesInBlock(blockX, currentY);
      }
    }
    currentY += blockSize;
  }
}

function createParticlesInBlock(blockX, blockY) {
  // Fill a block with a grid of particles
  for (let px = blockX; px < blockX + blockSize; px += particleSpacing) {
    for (let py = blockY; py < blockY + blockSize; py += particleSpacing) {
      particles.push(new Particle(px, py));
    }
  }
}

function draw() {
  background(255);

  let mx = mouseX;
  let my = mouseY;
  if (touches.length > 0) {
    mx = touches[0].x;
    my = touches[0].y;
  }

  // Update and draw particles
  for (let p of particles) {
    p.applyForces(mx, my);
    p.update();
    p.show();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.ox = x; // original position
    this.oy = y;
    this.vx = 0;
    this.vy = 0;
    this.r = particleSpacing * 0.5; // radius of particle
  }

  applyForces(mx, my) {
    // Spring force to return to original position
    let dx = this.ox - this.x;
    let dy = this.oy - this.y;
    this.vx += dx * springStrength;
    this.vy += dy * springStrength;

    // Repel if near the mouse
    let distSq = (mx - this.x) ** 2 + (my - this.y) ** 2;
    if (distSq < hoverRadius ** 2) {
      let d = sqrt(distSq);
      let ux = (this.x - mx) / d;
      let uy = (this.y - my) / d;
      this.vx += ux * repelStrength;
      this.vy += uy * repelStrength;
    }

    // Damping to reduce velocity over time
    this.vx *= damping;
    this.vy *= damping;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  show() {
    fill(0);
    ellipse(this.x, this.y, this.r * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeParticles(); // Recalculate layout on resize
}
