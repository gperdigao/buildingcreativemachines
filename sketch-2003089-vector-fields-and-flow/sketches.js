let cols, rows;
let resolution = 20;
let vectors = [];
let particles = [];
let particleCount = 100;

function setup() {
  createCanvas(600, 400);
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  initializeVectors();
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(220);
  displayVectors();
  for (let p of particles) {
    p.follow(vectors);
    p.update();
    p.display();
  }
}

function mousePressed() {
  particles.push(new Particle(createVector(mouseX, mouseY)));
}

function initializeVectors() {
  for (let x = 0; x < cols; x++) {
    vectors[x] = [];
    for (let y = 0; y < rows; y++) {
      let v = p5.Vector.fromAngle(random(TWO_PI));
      vectors[x][y] = v;
    }
  }
}

function displayVectors() {
  for (let x = 0; x < vectors.length; x++) {
    for (let y = 0; y < vectors[x].length; y++) {
      push();
      let posX = x * resolution;
      let posY = y * resolution;
      translate(posX, posY);
      let hueValue = map(vectors[x][y].heading(), 0, TWO_PI, 0, 360);
      stroke(hueValue, 100, 100);
      rotate(vectors[x][y].heading());
      let len = vectors[x][y].mag() * resolution;
      line(0, 0, len, 0);
      pop();
    }
  }
}

class Particle {
  constructor(position = createVector(random(width), random(height))) {
    this.pos = position;
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
  }

  follow(vectors) {
    let x = floor(this.pos.x / resolution);
    let y = floor(this.pos.y / resolution);
    let force = vectors[x][y];
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(4);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.edges();
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  display() {
    noStroke();
    fill(0, 5);
    ellipse(this.pos.x, this.pos.y, 4);
  }
}
