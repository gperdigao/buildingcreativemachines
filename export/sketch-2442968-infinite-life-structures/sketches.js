let particles = [];
let numParticles = 1000;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize particles at random positions
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  // Initialize first fractal pattern
  setFormation();
}

function draw() {
  background(10, 10, 30, 50);

  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }

  t += 0.01;
}

function mousePressed() {
  // Generate a new fractal pattern on mouse click
  setFormation();
}

function setFormation() {
  // Generate fractal pattern points
  let fractalPoints = generateFractalPattern();

  // Assign target positions to particles
  for (let i = 0; i < particles.length; i++) {
    let idx = i % fractalPoints.length;
    let targetPos = fractalPoints[idx];
    particles[i].setTarget(targetPos.x, targetPos.y);
    // Optionally set color based on depth or other properties
  }
}

function generateFractalPattern() {
  let points = [];
  let centerX = width / 2;
  let centerY = height / 2;
  let radius = random(100, min(width, height) / 3);
  let numBranches = floor(random(3, 8)); // Number of main branches for symmetry
  let maxDepth = floor(random(3, 6)); // Depth of recursion

  function branch(x, y, len, angle, depth) {
    if (depth > maxDepth || len < 2) {
      return;
    }

    let endX = x + len * cos(angle);
    let endY = y + len * sin(angle);

    // Store points along the branch
    let numPoints = floor(len / 5);
    for (let i = 0; i <= numPoints; i++) {
      let px = lerp(x, endX, i / numPoints);
      let py = lerp(y, endY, i / numPoints);
      points.push(createVector(px, py));
    }

    // Create two child branches at each branch end
    let angleOffset = random(PI / 6, PI / 3);
    let newLen = len * random(0.5, 0.8);
    branch(endX, endY, newLen, angle + angleOffset, depth + 1);
    branch(endX, endY, newLen, angle - angleOffset, depth + 1);
  }

  // Generate symmetrical branches
  for (let i = 0; i < numBranches; i++) {
    let angle = TWO_PI * i / numBranches;
    branch(centerX, centerY, radius, angle, 0);
  }

  return points;
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.maxSpeed = 10;
    this.maxForce = 1;
    this.color = color(255, 255, 255);
    this.size = random(1, 3);
  }

  update() {
    // Arrival behavior towards target
    let desired = p5.Vector.sub(this.target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);

    this.acc.add(steer);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Fade color based on speed
    let speedMag = this.vel.mag();
    let alpha = map(speedMag, 0, this.maxSpeed, 50, 255);
    this.color.setAlpha(alpha);
  }

  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  setTarget(x, y) {
    this.target = createVector(x, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setFormation();
}
