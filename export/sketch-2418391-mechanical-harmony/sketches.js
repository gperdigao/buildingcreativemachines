let gears = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(0);
  noFill();

  // Create the main gear
  let mainGear = new Gear(width / 2, height / 2, 80, 40);
  mainGear.angularVelocity = 0.005;

  // Create gears around the main gear at different angles
  let angles = [0, PI / 3, (2 * PI) / 3, PI, (4 * PI) / 3, (5 * PI) / 3];
  let radii = [30, 40, 50, 30, 40, 50];

  for (let i = 0; i < angles.length; i++) {
    let angle = angles[i];
    let radius = radii[i];
    let x = mainGear.x + (mainGear.radius + radius) * cos(angle);
    let y = mainGear.y + (mainGear.radius + radius) * sin(angle);
    let numTeeth = Math.floor(radius / 2);
    let gear = new Gear(x, y, radius, numTeeth);
    mainGear.connectTo(gear);
    gears.push(gear);
  }

  gears.push(mainGear);
}

function draw() {
  background(255);
  let visited = new Set();
  gears[gears.length - 1].update(visited); // Start updating from the main gear
  for (let gear of gears) {
    gear.draw();
  }
}

class Gear {
  constructor(x, y, radius, numTeeth, initialAngle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.numTeeth = numTeeth;
    this.angle = initialAngle || 0;
    this.angularVelocity = 0;
    this.connections = [];
  }

  connectTo(otherGear) {
    // Calculate position to ensure gears touch
    let dx = otherGear.x - this.x;
    let dy = otherGear.y - this.y;
    let angleBetween = atan2(dy, dx);
    otherGear.x = this.x + (this.radius + otherGear.radius) * cos(angleBetween);
    otherGear.y = this.y + (this.radius + otherGear.radius) * sin(angleBetween);
    this.connections.push(otherGear);
  }

  update(visited) {
    if (!visited) {
      visited = new Set();
    }
    if (visited.has(this)) return;
    visited.add(this);
    this.angle += this.angularVelocity;
    for (let otherGear of this.connections) {
      otherGear.angularVelocity =
        -this.angularVelocity * (this.radius / otherGear.radius);
      otherGear.update(visited);
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    stroke(0);
    noFill();
    beginShape();
    let teeth = this.numTeeth;
    let rOuter = this.radius;
    let rInner = this.radius * 0.8;
    let angleStep = TWO_PI / (teeth * 2);
    for (let i = 0; i < teeth * 2; i++) {
      let r = i % 2 === 0 ? rOuter : rInner;
      let a = i * angleStep;
      vertex(r * cos(a), r * sin(a));
    }
    endShape(CLOSE);
    pop();
  }
}
