let flowfield;
let particles = [];
let zoff = 0;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 255);
  background(0);
  flowfield = new FlowField(20);
}

function draw() {
  background(0, 0.1); // Semi-transparent background (creates trails)
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    } else {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }
  }
  
  // Create new particles
  if (mouseIsPressed) {
    for (let i = 0; i < 5; i++) { // Create multiple particles at once
      particles.push(new Particle(mouseX, mouseY, random(255)));
    }
  }
  
  // Update flow field
  flowfield.update();
}

function FlowField(res) {
  this.res = res;
  this.cols = width / this.res;
  this.rows = height / this.res;
  this.field = new Array(this.cols * this.rows);
  
  this.update = function() {
    let yoff = 0;
    for (let y = 0; y < this.rows; y++) {
      let xoff = 0;
      for (let x = 0; x < this.cols; x++) {
        let index = x + y * this.cols;
        let angle = noise(xoff, yoff, zoff) * TWO_PI * 4; // Increase the range of the noise function
        let v = p5.Vector.fromAngle(angle);
        this.field[index] = v;
        xoff += 0.1;
      }
      yoff += 0.1;
    }
    zoff += 0.01;
  }
  
  this.lookup = function(lookup) {
    let column = int(lookup.x / this.res);
    let row = int(lookup.y / this.res);
    let index = column + row * this.cols;
    return this.field[index];
  }
}

function Particle(x, y, hue) {
  this.pos = createVector(x, y);
  this.vel = p5.Vector.random2D().mult(2); // Increase the initial speed
  this.acc = createVector(0, 0);
  this.hue = hue;
  this.lifespan = 255;
  
  this.applyForce = function(force) {
    this.acc.add(force);
  }
  
  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 0.5;
  }
  
  this.follow = function(flowfield) {
    let index = floor(this.pos.x / flowfield.res) + floor(this.pos.y / flowfield.res) * flowfield.cols;
    let force = flowfield.field[index];
    this.applyForce(force);
  }
  
  this.edges = function() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }
  
  this.show = function() {
    noStroke();
    fill(this.hue, 255, 255, this.lifespan / 2); // Make particles slightly transparent
    ellipse(this.pos.x, this.pos.y, 8); // Increase the size of the particles
  }
  
  this.isFinished = function() {
    return this.lifespan < 0;
  }
}
