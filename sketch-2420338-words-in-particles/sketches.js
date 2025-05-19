let particles = [];
let userInput = "Building";
let fontSize = 128;
let pg; // Graphics buffer for text
let step = 3; // Step size for pixel sampling (adjust for density)

function setup() {
  createCanvas(800, 400);
  fill(0);
  noStroke();

  // Create and configure the text graphics buffer
  pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(fontSize);
  pg.fill(0);
  pg.noStroke();

  // Input for user text
  let textInput = createInput(userInput);
  textInput.position(10, height + 10);
  textInput.size(200);
  textInput.input(updateUserText);

  generateParticles();
}

function draw() {
  background(255);

  // Update and display particles
  for (let p of particles) {
    p.behaviors();
    p.update();
    p.show();
  }
}

function updateUserText() {
  userInput = this.value();
  generateParticles();
}

function generateParticles() {
  particles = [];

  // Clear the graphics buffer
  pg.clear();

  // Calculate vertical centering
  let yOffset = height / 2;
  
  // Render the text centered horizontally and vertically
  pg.textAlign(CENTER, CENTER);
  pg.text(userInput, width / 2, yOffset);

  pg.loadPixels();

  // Iterate through pixels with the specified step size
  for (let x = 0; x < pg.width; x += step) {
    for (let y = 0; y < pg.height; y += step) {
      let index = (x + y * pg.width) * 4;
      // Check if the pixel is not transparent (alpha > 128 for better visibility)
      if (pg.pixels[index + 3] > 128) {
        let posX = x;
        let posY = y;
        let particle = new Particle(posX, posY);
        particles.push(particle);
      }
    }
  }

  pg.updatePixels();
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(random(width), random(height));
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.maxSpeed = 10;
    this.maxForce = 1;
  }

  behaviors() {
    let arrive = this.arrive(this.target);
    let mouse = createVector(mouseX, mouseY);
    let flee = this.flee(mouse);

    arrive.mult(1);
    flee.mult(5);

    this.applyForce(arrive);
    this.applyForce(flee);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    stroke(0);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  flee(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    if (d < 50) {
      desired.setMag(this.maxSpeed);
      desired.mult(-1);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }
}
