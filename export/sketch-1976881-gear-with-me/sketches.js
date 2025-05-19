let prevSec;
let easing = 0.05;
let targetAngle, angle = 0;
let gear1, gear2, gear3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  prevSec = second();

  // Initialize gears
  gear1 = new Gear(0, 150, 0.1, 60); // Connected to the hour hand
  gear2 = new Gear(0, 50, 2, 40);  // Connected to the minute hand
  gear3 = new Gear(0, -50, 6, 20);   // Connected to the second hand
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  rotate(-90);

  let hr = hour();
  let mn = minute();
  let sc = second();

  // Smooth transition of second hand
  if (prevSec != sc) {
    prevSec = sc;
    targetAngle = sc * 6;
  }
  let dTheta = targetAngle - angle;
  angle += dTheta * easing;

  strokeWeight(8);
  noFill();

  // Draw the second hand
  stroke(255, 100, 150);
  let secondAngle = map(sc, 0, 60, 0, 360);
  arc(0, 0, 300, 300, 0, secondAngle);

  // Draw the minute hand
  stroke(150, 100, 255);
  let minuteAngle = map(mn, 0, 60, 0, 360);
  arc(0, 0, 280, 280, 0, minuteAngle);

  // Draw the hour hand
  stroke(150, 255, 100);
  let hourAngle = map(hr % 12, 0, 12, 0, 360);
  arc(0, 0, 260, 260, 0, hourAngle);

  // Update and display gears
  gear1.update(hourAngle);
  gear1.display();

  gear2.update(minuteAngle);
  gear2.display();

  gear3.update(secondAngle);
  gear3.display();

  push();
  rotate(secondAngle);
  stroke(255, 100, 150);
  line(0, 0, 100, 0);
  pop();

  push();
  rotate(minuteAngle);
  stroke(150, 100, 255);
  line(0, 0, 75, 0);
  pop();

  push();
  rotate(hourAngle);
  stroke(150, 255, 100);
  line(0, 0, 50, 0);
  pop();

  stroke(255);
  point(0, 0);
}

class Gear {
  constructor(x, y, speed, size) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.size = size;
    this.angle = 0;
  }

  update(connectedAngle) {
    this.angle = connectedAngle * this.speed;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    stroke(255);
    for (let i = 0; i < 12; i++) {
      line(this.size, 0, this.size + 10, 0);
      rotate(360 / 12);
    }
    pop();
  }
}
