let particles = [];
let userInput = "Reality is merely an illusion, albeit a very persistent one.";
let fontSize = 64; // Reduced font size for longer sentences
let pg; // Graphics buffer for text
let step = 3; // Step size for pixel sampling
let hueShift = 0;
let mic, fft;

function preload() {
  // Preload fonts if adding multiple fonts
  // fonts.push(loadFont('assets/Arial.ttf'));
}

function setup() {
  createCanvas(800, 400);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  // Create and configure the text graphics buffer
  pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.textAlign(LEFT, TOP); // Changed alignment for wrapping
  pg.textSize(fontSize);
  pg.colorMode(HSB, 360, 100, 100, 100);
  pg.background(0, 0, 0, 0);
  pg.fill(0, 0, 0, 100);

  // Initialize audio
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);

  // Input for user text
  let textInput = createInput(userInput);
  textInput.position(10, height + 10);
  textInput.size(400);
  textInput.input(updateUserText);

  generateParticles();
}

function draw() {
  // Animated Gradient Background
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(200, 50, 100), color(300, 50, 100), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Update and display particles
  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");
  hueShift = (hueShift + 0.5) % 360;

  for (let p of particles) {
    p.behaviors(bass, hueShift);
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
  pg.clear();

  // Render the text inside a rectangle to allow wrapping
  pg.background(0, 0, 0, 0);
  pg.textAlign(LEFT, TOP); // Changed alignment for wrapping
  pg.textSize(fontSize);
  pg.fill(0, 0, 0, 100);
  pg.text(userInput, 10, 10, pg.width - 20, pg.height - 20); // Added width and height for wrapping

  pg.loadPixels();

  // Iterate through pixels with the specified step size
  for (let x = 0; x < pg.width; x += step) {
    for (let y = 0; y < pg.height; y += step) {
      let index = (x + y * pg.width) * 4;
      // Check if the pixel is not transparent (alpha > 128)
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
    this.maxSpeed = 5;
    this.maxForce = 0.5;
    this.size = random(2, 5);
  }

  show() {
    let noiseVal = noise(this.pos.x * 0.01, this.pos.y * 0.01);
    stroke((noiseVal * 360 + hueShift) % 360, 80, 100, 80);
    strokeWeight(this.size);
    point(this.pos.x, this.pos.y);
  }

  behaviors(bass, hueShift) {
    let arrive = this.arrive(this.target);
    let gravity = createVector(0, 0.05 * (1 + bass / 255));
    let mouse = createVector(mouseX, mouseY);
    let flee = this.flee(mouse);

    arrive.mult(1);
    flee.mult(5);
    gravity.mult(1);

    this.applyForce(arrive);
    this.applyForce(flee);
    this.applyForce(gravity);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Wrap around edges
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  show() {
    stroke((hueShift + this.pos.x / width * 360) % 360, 80, 100, 80);
    strokeWeight(this.size);
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
