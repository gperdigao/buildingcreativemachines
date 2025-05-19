let gearHour, gearMinute, gearSecond;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // Initialize gears
  gearSecond = new Gear(200, 0, 60, 60);   // Second gear with 60 teeth
  gearMinute = new Gear(0, 0, 60, 120);    // Minute gear with 60 teeth
  gearHour = new Gear(-200, 0, 40, 80);    // Hour gear with 40 teeth
}

function draw() {
  background(30);
  translate(width / 2, height / 2);
  rotate(-90);

  // Get current time in Lisbon
  let { hr, mn, sc } = getLisbonTime();

  // Compute angles for clock hands
  let secondAngle = map(sc, 0, 60, 0, 360);
  let minuteAngle = map(mn + sc / 60, 0, 60, 0, 360);
  let hourAngle = map(hr % 12 + mn / 60, 0, 12, 0, 360);

  // Update gears to rotate opposite to the clock hands
  gearSecond.angle = -secondAngle;
  gearMinute.angle = -minuteAngle;
  gearHour.angle = -hourAngle;

  // Display gears
  gearSecond.display();
  gearMinute.display();
  gearHour.display();

  // Draw clock face
  stroke(255);
  strokeWeight(8);
  noFill();
  ellipse(0, 0, 400, 400);

  // Draw clock hands
  drawHand(secondAngle, 150, 2, color(255, 100, 150)); // Second hand
  drawHand(minuteAngle, 120, 4, color(150, 100, 255)); // Minute hand
  drawHand(hourAngle, 90, 6, color(150, 255, 100));    // Hour hand

  // Draw clock center
  stroke(255);
  point(0, 0);
}

// Function to draw each clock hand
function drawHand(angle, length, weight, col) {
  push();
  rotate(angle);
  stroke(col);
  strokeWeight(weight);
  line(0, 0, length, 0);
  pop();
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

// Gear class definition
class Gear {
  constructor(x, y, teeth, radius) {
    this.x = x;
    this.y = y;
    this.teeth = teeth;
    this.radius = radius;
    this.angle = 0;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    stroke(200);
    noFill();
    ellipse(0, 0, this.radius * 2);

    // Draw gear teeth
    for (let i = 0; i < this.teeth; i++) {
      line(this.radius, 0, this.radius + 10, 0);
      rotate(360 / this.teeth);
    }
    pop();
  }
}
