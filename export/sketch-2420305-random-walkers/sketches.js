let walkers = [];

function setup() {
  createCanvas(600, 600);
  background(255);
  noStroke();
  
  // Initialize multiple random walkers with random colors and positions
  for (let i = 0; i < 200; i++) {
    walkers.push(new Walker(random(width), random(height), color(random(255), random(255), random(255), 100)));
  }
}

function draw() {
  // Update and display each walker
  for (let walker of walkers) {
    walker.update();
    walker.display();
  }
}

// Walker class
class Walker {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.col = col;
  }

  update() {
    // Random movement with a slight bias to create organic flow
    let step = p5.Vector.random2D();
    step.mult(random(0.5, 2));
    this.pos.add(step);

    // Wrap edges
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }

  display() {
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, 2, 2);
  }
}
