let gears = [];
let pendulum;
let lastSecond = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // Initialize pendulum with period close to 1 second
  pendulum = new Pendulum(0, -200, 200);

  // Initialize gears with correct gear ratios
  // Teeth numbers chosen to match real clock ratios
  let secondGear = new Gear(0, 0, 60, 50);  // Second gear (60 teeth)
  let minuteGear = new Gear(0, 0, 60, 40);  // Minute gear (60 teeth)
  let hourGear = new Gear(0, 0, 12, 30);    // Hour gear (12 teeth)

  // Connect gears
  secondGear.connectTo(minuteGear);
  minuteGear.connectTo(hourGear);

  gears.push(secondGear, minuteGear, hourGear);
}

function draw() {
  background(255);
  translate(width / 2, height / 2);

  // Update pendulum
  pendulum.update();
  pendulum.display();

  // Get current time in Lisbon
  let { hr, mn, sc } = getLisbonTime();

  // If the second has changed, advance the second gear
  if (sc !== lastSecond) {
    lastSecond = sc;
    gears[0].advance();
  }

  // Update and display gears
  for (let gear of gears) {
    gear.update();
    gear.display();
  }

  // Draw clock hands
  drawClockHands(hr, mn, sc);
}

// Function to get the current time in Lisbon
function getLisbonTime() {
  let now = new Date();
  let lisbonNow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));
  let hr = lisbonNow.getHours();
  let mn = lisbonNow.getMinutes();
  let sc = lisbonNow.getSeconds();
  return { hr, mn, sc };
}

// Pendulum class
class Pendulum {
  constructor(x, y, length) {
    this.origin = createVector(x, y);
    this.position = createVector();
    this.length = length;
    this.angle = 30; // Initial angle
    this.aVelocity = 0;
    this.aAcceleration = 0;
    this.damping = 0.999;
    this.gravity = 1;
  }

  update() {
    this.aAcceleration = (-this.gravity / this.length) * sin(this.angle);
    this.aVelocity += this.aAcceleration;
    this.aVelocity *= this.damping;
    this.angle += this.aVelocity;

    this.position.set(
      this.origin.x + this.length * sin(this.angle),
      this.origin.y + this.length * cos(this.angle)
    );
  }

  display() {
    stroke(0);
    strokeWeight(2);
    line(this.origin.x, this.origin.y, this.position.x, this.position.y);
    fill(0);
    ellipse(this.position.x, this.position.y, 20, 20);
  }
}

// Gear class
class Gear {
  constructor(x, y, teeth, radius) {
    this.position = createVector(x, y);
    this.teeth = teeth;
    this.radius = radius;
    this.angle = 0;
    this.connectedGears = [];
    this.rotationSpeed = 0;
  }

  connectTo(gear) {
    this.connectedGears.push(gear);
  }

  advance() {
    // Advance by one tooth per second
    this.rotationSpeed += 360 / this.teeth;
  }

  update() {
    this.angle += this.rotationSpeed;
    this.rotationSpeed = 0; // Reset after each update

    for (let gear of this.connectedGears) {
      gear.angle += -this.rotationSpeed * (this.teeth / gear.teeth);
    }
  }

  display() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    stroke(0);
    strokeWeight(1);
    noFill();
    ellipse(0, 0, this.radius * 2);

    // Draw gear teeth
    for (let i = 0; i < this.teeth; i++) {
      line(this.radius, 0, this.radius + 5, 0);
      rotate(360 / this.teeth);
    }
    pop();
  }
}

// Function to draw clock hands
function drawClockHands(hr, mn, sc) {
  // Calculate angles based on current time
  let secondAngle = map(sc, 0, 60, 0, 360);
  let minuteAngle = map(mn + sc / 60, 0, 60, 0, 360);
  let hourAngle = map((hr % 12) + mn / 60, 0, 12, 0, 360);

  // Draw hour hand
  push();
  rotate(hourAngle - 90);
  stroke(0);
  strokeWeight(6);
  line(0, 0, 50, 0);
  pop();

  // Draw minute hand
  push();
  rotate(minuteAngle - 90);
  stroke(0);
  strokeWeight(4);
  line(0, 0, 70, 0);
  pop();

  // Draw second hand
  push();
  rotate(secondAngle - 90);
  stroke(255, 0, 0);
  strokeWeight(2);
  line(0, 0, 90, 0);
  pop();

  // Draw clock center
  fill(0);
  noStroke();
  ellipse(0, 0, 10, 10);
}
