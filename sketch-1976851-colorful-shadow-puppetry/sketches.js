let shadows = [];

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(0);
  shadows.push(new Shadow(mouseX, mouseY));

  for (let i = shadows.length - 1; i >= 0; i--) {
    shadows[i].update();
    shadows[i].show();
    if (shadows[i].finished()) {
      shadows.splice(i, 1);
    }
  }
}

class Shadow {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 255;
    this.color = color(random(0, 360), 100, 100);
    this.size = random(20, 80);
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    this.alpha -= 5;
    this.size += 1;
  }

  show() {
    noStroke();
    fill(this.color, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}
