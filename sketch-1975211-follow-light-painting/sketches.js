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
      particles[i].show();
    }
  }
  
  // Create new particles
  if (frameCount % 5 == 0) { // Create new particles every 5 frames
    let p = new Particle(width / 2, height / 2, random(255));
    particles.push(p);
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
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.hue = hue;
  this.lifespan = 255;

  this.update = function() {
    let mouse = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(mouse, this.pos);
    dir.setMag(0.5);
    this.acc = dir;
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 0.5;
  }

this.follow = function(flowfield) {
    let x = constrain(floor(this.pos.x / flowfield.res), 0, flowfield.cols - 1);
    let y = constrain(floor(this.pos.y / flowfield.res), 0, flowfield.rows - 1);
    let index = x + y * flowfield.cols;
    let force = flowfield.field[index];
    this.applyForce(force);
}

  this.applyForce = function(force) {
    let f = force.copy();
    f.mult(0.02);
    this.acc.add(f);
  }

  this.show = function() {
    stroke(this.hue, 255, 255, this.lifespan);
    strokeWeight(4);
    point(this.pos.x, this.pos.y);
  }

  this.isFinished = function() {
    return this.lifespan < 0;
  }
}
