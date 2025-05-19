// Module aliases
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

let engine;
let world;
let particles = [];
let boundaries = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);

  engine = Engine.create();
  world = engine.world;

  // Create ground boundary
  boundaries.push(new Boundary(width / 2, height + 50, width * 2, 100, 0));

  // Create moving obstacles
  for (let i = 0; i < 8; i++) {
    let w = random(150, 300);
    let h = 20;
    let x = random(width * 0.1, width * 0.9);
    let y = random(height * 0.2, height * 0.8);
    let angle = random(-PI / 6, PI / 6);
    boundaries.push(new MovingBoundary(x, y, w, h, angle));
  }

  Engine.run(engine);
}

function mouseDragged() {
  particles.push(new Particle(mouseX, mouseY, random(5, 15)));
}

function draw() {
  drawGradient();

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].show();
    if (particles[i].isOffScreen()) {
      particles[i].removeFromWorld();
      particles.splice(i, 1);
    }
  }

  // Update and display boundaries
  for (let boundary of boundaries) {
    boundary.update();
    boundary.show();
  }
}

function drawGradient() {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(230, 80, 20), color(260, 50, 50), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// Particle class
class Particle {
  constructor(x, y, r) {
    let options = {
      friction: 0.005,
      restitution: 0.6,
    };
    this.body = Bodies.circle(x, y, r, options);
    this.r = r;
    World.add(world, this.body);
    this.trail = [];
  }

  isOffScreen() {
    let pos = this.body.position;
    return pos.y > height + 100;
  }

  removeFromWorld() {
    World.remove(world, this.body);
  }

  show() {
    let pos = this.body.position;
    let angle = this.body.angle;
    this.trail.push({ x: pos.x, y: pos.y });
    if (this.trail.length > 25) {
      this.trail.shift();
    }

    // Draw trail
    noFill();
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      let t = map(i, 0, this.trail.length, 0, 1);
      stroke(200, 100, 80, t * 100);
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();

    // Draw particle
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    noStroke();
    fill(200, 100, 80);
    ellipse(0, 0, this.r * 2);
    pop();
  }
}

// Boundary class
class Boundary {
  constructor(x, y, w, h, angle) {
    let options = {
      isStatic: true,
      angle: angle,
      friction: 0.3,
    };
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    this.color = color(random(180, 220), 50, 70);
    World.add(world, this.body);
  }

  update() {
    // Static boundary does not update
  }

  show() {
    let pos = this.body.position;
    let angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    noStroke();
    fill(this.color);
    rect(0, 0, this.w, this.h, 10);
    pop();
  }
}

// MovingBoundary class
class MovingBoundary extends Boundary {
  constructor(x, y, w, h, angle) {
    super(x, y, w, h, angle);
    this.initialY = y;
    this.amplitude = random(50, 150);
    this.frequency = random(0.005, 0.02);
  }

  update() {
    let pos = this.body.position;
    let newY = this.initialY + sin(frameCount * this.frequency) * this.amplitude;
    Matter.Body.setPosition(this.body, { x: pos.x, y: newY });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
