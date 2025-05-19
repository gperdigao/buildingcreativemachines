let particles = [];
let numParticles = 3000;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize particles at random positions
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  // Initialize first tree formation
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
  // Generate a new tree on mouse click
  setFormation();
}

function setFormation() {
  // Generate tree points
  let treePoints = generateTree();

  // Assign target positions to particles
  for (let i = 0; i < particles.length; i++) {
    let idx = i % treePoints.length;
    let targetData = treePoints[idx];
    particles[i].setTarget(targetData.pos.x, targetData.pos.y);
    // Set color based on depth to simulate trunk, branches, and leaves
    particles[i].setDepth(targetData.depth);
  }
}

function generateTree() {
  // Starting position at the bottom center of the canvas
  let startPos = createVector(width / 2, height);
  let branchLength = random(100, 300);
  let angleRange = random(PI / 6, PI / 4);
  let maxDepth = floor(random(5, 8)); // Randomize max depth for infinite variations

  let points = [];

  function branch(pos, length, angle, depth) {
    if (depth > maxDepth || length < 2) {
      return;
    }

    let endPos = p5.Vector.add(pos, p5.Vector.fromAngle(angle, length));

    // Store points along the branch
    let numPoints = floor(length / 5);
    for (let i = 0; i <= numPoints; i++) {
      let point = p5.Vector.lerp(pos, endPos, i / numPoints);
      points.push({ pos: point, depth: depth });
    }

    // Randomly decide number of child branches (1 to 3)
    let numBranches = floor(random(1, 4));

    for (let i = 0; i < numBranches; i++) {
      let newLength = length * random(0.6, 0.8);
      let newAngle = angle + random(-angleRange, angleRange);
      branch(endPos, newLength, newAngle, depth + 1);
    }
  }

  branch(startPos, branchLength, -PI / 2, 0);

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
    this.depth = 0;
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

  setDepth(depth) {
    this.depth = depth;
    // Set color based on depth (trunk, branches, leaves)
    if (depth < 2) {
      // Trunk
      this.color = color(139, 69, 19); // Brown
    } else if (depth < 4) {
      // Branches
      this.color = color(160, 82, 45); // Sienna
    } else {
      // Leaves
      this.color = color(random(34, 85), random(100, 255), random(34, 85)); // Greens
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setFormation();
}
