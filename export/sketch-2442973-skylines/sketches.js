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

  // Initialize first skyline formation
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
  // Generate a new skyline on mouse click
  setFormation();
}

function setFormation() {
  // Generate skyline points
  let skylinePoints = generateSkyline();

  // Assign target positions to particles
  for (let i = 0; i < particles.length; i++) {
    let idx = i % skylinePoints.length;
    let targetData = skylinePoints[idx];
    particles[i].setTarget(targetData.x, targetData.y);
    particles[i].setColor(targetData.color);
  }
}

function generateSkyline() {
  let points = [];
  let numBuildings = floor(random(5, 20)); // Random number of buildings
  let buildingWidth = width / numBuildings;
  let maxBuildingHeight = height * random(0.3, 0.7);
  let groundLevel = height * 0.9; // Ground level position

  for (let i = 0; i < numBuildings; i++) {
    let x = i * buildingWidth;
    let buildingHeight = random(maxBuildingHeight * 0.5, maxBuildingHeight);

    // Create building shape points
    let buildingPoints = createBuilding(x, groundLevel, buildingWidth, buildingHeight);
    points = points.concat(buildingPoints);
  }

  // Add some random stars in the sky
  let numStars = floor(random(50, 150));
  for (let i = 0; i < numStars; i++) {
    let starX = random(width);
    let starY = random(height * 0.5);
    points.push({ x: starX, y: starY, color: color(255, 255, 255) });
  }

  return points;
}

function createBuilding(x, groundLevel, buildingWidth, buildingHeight) {
  let points = [];
  let buildingColor = color(random(50, 200), random(50, 200), random(50, 200));

  // Outline of the building
  let numPointsVertical = floor(buildingHeight / 5);
  for (let i = 0; i <= numPointsVertical; i++) {
    let y = groundLevel - (i * buildingHeight) / numPointsVertical;
    points.push({ x: x, y: y, color: buildingColor });
    points.push({ x: x + buildingWidth, y: y, color: buildingColor });
  }

  // Top of the building
  let numPointsHorizontal = floor(buildingWidth / 5);
  for (let i = 0; i <= numPointsHorizontal; i++) {
    let xi = x + (i * buildingWidth) / numPointsHorizontal;
    let y = groundLevel - buildingHeight;
    points.push({ x: xi, y: y, color: buildingColor });
  }

  // Optional: Add windows
  let numWindowsX = floor(buildingWidth / 20);
  let numWindowsY = floor(buildingHeight / 20);
  for (let ix = 1; ix < numWindowsX; ix++) {
    for (let iy = 1; iy < numWindowsY; iy++) {
      let windowX = x + (ix * buildingWidth) / numWindowsX;
      let windowY = groundLevel - (iy * buildingHeight) / numWindowsY;
      if (random() < 0.5) { // Randomly decide whether a window is lit
        points.push({ x: windowX, y: windowY, color: color(255, 215, 0) }); // Yellow light
      }
    }
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
