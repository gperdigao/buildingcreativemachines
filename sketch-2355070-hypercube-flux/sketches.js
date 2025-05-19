// Hypercube Flux
// Visualizing a rotating hypercube projected onto 3D space with interactive 3D navigation.

let easycam;
let particles = [];
let numParticles = 500;
let hypercubeVertices = [];
let angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);

  // Initialize EasyCam for 3D navigation
  easycam = createEasyCam();
  document.oncontextmenu = function() { return false; } // Disable right-click context menu

  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  background(0);
}

function draw() {
  background(0, 0, 0, 20); // Slight trail effect

  // Update and draw hypercube
  hypercubeVertices = generateHypercubeVertices(angle);
  angle += 0.01;

  // Draw particles
  for (let p of particles) {
    p.update(hypercubeVertices);
    p.show();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(0, 0, 0);
    this.vel = p5.Vector.random3D().mult(random(0.5, 1.5));
    this.color = color(random(360), 80, 100, 80);
    this.size = random(2, 5);
  }

  update(vertices) {
    // Attract particle towards a random hypercube vertex
    let target = random(vertices);
    let force = p5.Vector.sub(target, this.pos);
    force.setMag(0.05);
    this.vel.add(force);
    this.vel.limit(5);
    this.pos.add(this.vel);

    // Wrap around space
    if (this.pos.mag() > 500) {
      this.pos.mult(-1);
    }
  }

  show() {
    push();
    noStroke();
    fill(this.color);
    translate(this.pos.x, this.pos.y, this.pos.z);
    sphere(this.size);
    pop();
  }
}

function generateHypercubeVertices(a) {
  let vertices = [];
  let coords = [-1, 1];
  for (let x of coords) {
    for (let y of coords) {
      for (let z of coords) {
        for (let w of coords) {
          // 4D rotation matrices (rotation in the wx and yz planes)
          let r = 200;
          let x1 = x * cos(a) - w * sin(a);
          let w1 = x * sin(a) + w * cos(a);
          let y1 = y * cos(a) - z * sin(a);
          let z1 = y * sin(a) + z * cos(a);

          // Project from 4D to 3D space (ignoring w1)
          let factor = r / (r + w1);
          let x2 = x1 * factor;
          let y2 = y1 * factor;
          let z2 = z1 * factor;

          vertices.push(createVector(x2, y2, z2));
        }
      }
    }
  }
  return vertices;
}
