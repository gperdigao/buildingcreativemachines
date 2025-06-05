let squares = [];

class MovingSquare {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.offX = random(1000);
    this.offY = random(1000);
    this.hue = random(360);
  }
  update() {
    this.x += map(noise(this.offX), 0, 1, -2, 2);
    this.y += map(noise(this.offY), 0, 1, -2, 2);
    this.offX += 0.01;
    this.offY += 0.01;
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
  display() {
    push();
    colorMode(HSL, 360, 100, 100);
    noStroke();
    fill(this.hue, 60, 50);
    square(this.x, this.y, this.size);
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10; i++) {
    squares.push(new MovingSquare(random(width), random(height), random(20, 60)));
  }
}

function draw() {
  background(0, 0, 95);
  for (let s of squares) {
    s.update();
    s.display();
  }
}

function mousePressed() {
  squares.push(new MovingSquare(mouseX, mouseY, random(20, 60)));
}
