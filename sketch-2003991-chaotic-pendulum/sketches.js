let pendulum;

function setup() {
  createCanvas(600, 600);
  pendulum = new DoublePendulum(width / 2, height / 4);
}

function draw() {
  background(220);
  pendulum.update();
  pendulum.show();
}

class DoublePendulum {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.r1 = 125;
    this.r2 = 75;
    this.angle1 = PI / 4;
    this.angle2 = PI / 4;
    this.aVel1 = 0;
    this.aVel2 = 0;
    this.aAcc1 = 0;
    this.aAcc2 = 0;
    this.g = 0.4;
  }

  update() {
    let num1 = -this.g * (2 * sin(this.angle1) + sin(this.angle2));
    let num2 = -sin(this.angle1 - this.angle2);
    let num3 = this.aVel2 * this.aVel2 * this.r2 + this.aVel1 * this.aVel1 * this.r1 * cos(this.angle1 - this.angle2);
    let den = this.r1 * (2 - cos(this.angle1 - this.angle2));
    this.aAcc1 = (num1 + num2 * num3) / den;

    num1 = 2 * sin(this.angle1 - this.angle2);
    num2 = this.aVel1 * this.aVel1 * this.r1 + this.g * cos(this.angle1);
    num3 = this.aVel2 * this.aVel2 * this.r2 * cos(this.angle1 - this.angle2);
    den = this.r2 * (2 - cos(this.angle1 - this.angle2));
    this.aAcc2 = (num1 * (num2 + num3)) / den;

    this.angle1 += this.aVel1;
    this.angle2 += this.aVel2;

    this.aVel1 += this.aAcc1;
    this.aVel2 += this.aAcc2;

    this.aVel1 *= 0.99;
    this.aVel2 *= 0.99;
  }

  show() {
    let x1 = this.origin.x + this.r1 * sin(this.angle1);
    let y1 = this.origin.y + this.r1 * cos(this.angle1);

    let x2 = x1 + this.r2 * sin(this.angle2);
    let y2 = y1 + this.r2 * cos(this.angle2);

    fill(127);
    stroke(0);
    strokeWeight(2);
    line(this.origin.x, this.origin.y, x1, y1);
    ellipse(x1, y1, 16, 16);

    line(x1, y1, x2, y2);
    ellipse(x2, y2, 16, 16);
  }
}
