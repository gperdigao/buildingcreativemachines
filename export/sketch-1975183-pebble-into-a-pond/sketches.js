let circles = [];

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 255);
  noStroke();
}

function draw() {
  background(0);

  for (let i = circles.length - 1; i >= 0; i--) {
    circles[i].grow();
    circles[i].show();

    if (circles[i].isFinished()) {
      circles.splice(i, 1);
    }
  }
}

function mouseClicked() {
  let hue = random(255);
  circles.push(new Circle(mouseX, mouseY, hue));
}

function Circle(x, y, hue) {
  this.x = x;
  this.y = y;
  this.hue = hue;
  this.radius = 1;
  this.lifespan = 255;

  this.grow = function() {
    if (this.lifespan > 0) {
      this.radius += 2;
      this.lifespan -= 1;
    }
  }

  this.show = function() {
    fill(this.hue, 255, 255, this.lifespan);
    ellipse(this.x, this.y, this.radius * 2);
  }

  this.isFinished = function() {
    return this.lifespan <= 0;
  }
}
