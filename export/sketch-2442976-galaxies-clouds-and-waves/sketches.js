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

  // Initialize first organic formation
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
  // Generate a new organic form on mouse click
  setFormation();
}

function setFormation() {
  // Randomly choose between clouds, galaxies, and waves
  let formations = [generateCloud, generateGalaxy, generateWaves];
  let formationIndex = floor(random(formations.length));
  let organicPoints = formations[formationIndex]();

  // Assign target positions to particles
  for (let i = 0; i < particles.length; i++) {
    let idx = i % organicPoints.length;
    let targetData = organicPoints[idx];
    particles[i].setTarget(targetData.x, targetData.y);
    particles[i].setColor(targetData.color);
  }
}

// Function to generate cloud points
function generateCloud() {
  let points = [];
  let centerX = random(width * 0.3, width * 0.7);
  let centerY = random(height * 0.3, height * 0.7);
  let maxRadius = random(50, 150);
  let numBlobs = floor(random(3, 7));

  for (let i = 0; i < numBlobs; i++) {
    let blobCenterX = centerX + random(-maxRadius, maxRadius);
    let blobCenterY = centerY + random(-maxRadius, maxRadius);
    let blobRadius = random(30, maxRadius);

    // Generate points for each blob
    for (let angle = 0; angle < TWO_PI; angle += TWO_PI / 100) {
      let r = blobRadius + random(-10, 10);
      let x = blobCenterX + r * cos(angle);
      let y = blobCenterY + r * sin(angle);
      points.push({ x: x, y: y, color: color(255, 255, 255, random(100, 200)) });
    }
  }

  return points;
}

// Function to generate galaxy points
function generateGalaxy() {
  let points = [];
  let centerX = width / 2;
  let centerY = height / 2;
  let arms = floor(random(2, 6)); // Number of spiral arms
  let armOffset = random(PI / 4, PI / 2);
  let maxRadius = min(width, height) / 2;

  for (let i = 0; i < numParticles; i++) {
    let angle = random(TWO_PI);
    let radius = pow(random(0, 1), 2) * maxRadius;
    let armAngle = floor((angle / TWO_PI) * arms) * (TWO_PI / arms);
    let offset = armOffset * radius / maxRadius;
    let x = centerX + radius * cos(angle + offset);
    let y = centerY + radius * sin(angle + offset);
    let brightness = map(radius, 0, maxRadius, 255, 50);
    points.push({ x: x, y: y, color: color(brightness, brightness, brightness) });
  }

  return points;
}

// Function to generate wave points
function generateWaves() {
  let points = [];
  let waveHeight = random(50, 150);
  let waveLength = random(100, 300);
  let numWaves = floor(random(1, 3));
  let amplitude = random(20, 50);

  for (let i = 0; i < numParticles; i++) {
    let x = map(i, 0, numParticles, 0, width);
    let y = height / 2;
    for (let n = 1; n <= numWaves; n++) {
      y += sin((x / waveLength) * TWO_PI + (n * t)) * (amplitude / n);
    }
    y += random(-5, 5); // Add some noise
    points.push({ x: x, y: y, color: color(0, 105, 148) }); // Ocean blue
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

  setColor(c) {
    this.color = c;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setFormation();
}
