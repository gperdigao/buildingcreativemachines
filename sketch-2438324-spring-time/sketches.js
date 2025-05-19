let flowers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  background(255, 10); // Semi-transparent background for fade effect

  for (let flower of flowers) {
    flower.update();
    flower.display();
  }
}

function mousePressed() {
  flowers.push(new Flower(mouseX, mouseY));
  loop();
}

class Flower {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.maxPetalSize = random(50, 150);
    this.petalSize = 0;
    this.growthRate = 2;
    this.numPetals = int(random(12, 24));
    this.angleOffset = random(360);
    this.petalColor = color(random(200, 255), random(100, 200), random(100, 200));
    this.centerColor = color(random(200, 255), random(200, 255), 0);
    this.grown = false;
  }

  update() {
    if (this.petalSize < this.maxPetalSize) {
      this.petalSize += this.growthRate;
    } else {
      this.grown = true;
      noLoop();
    }
  }

  display() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angleOffset);
    noStroke();

    // Draw petals with Bézier curves for maximum definition
    for (let i = 0; i < this.numPetals; i++) {
      let angle = (360 / this.numPetals) * i;
      push();
      rotate(angle);
      fill(this.petalColor);
      beginShape();
      vertex(0, 0);
      bezierVertex(
        -this.petalSize * 0.2,
        -this.petalSize * 0.2,
        -this.petalSize * 0.2,
        -this.petalSize * 0.8,
        0,
        -this.petalSize
      );
      bezierVertex(
        this.petalSize * 0.2,
        -this.petalSize * 0.8,
        this.petalSize * 0.2,
        -this.petalSize * 0.2,
        0,
        0
      );
      endShape(CLOSE);
      pop();
    }

    // Draw flower center with gradient
    noStroke();
    for (let r = this.petalSize * 0.2; r > 0; r -= 2) {
      fill(lerpColor(this.centerColor, color(255), r / (this.petalSize * 0.2)));
      ellipse(0, 0, r * 2);
    }

    pop();
  }
}
