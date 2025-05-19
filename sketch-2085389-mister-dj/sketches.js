let mic, fft, amplitude;
let particles = [];

function setup() {
  createCanvas(710, 400);

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);

  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);

  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(200);
  let level = amplitude.getLevel();
  let spectrum = fft.analyze();

  for (let particle of particles) {
    particle.update(level);
    particle.show();
  }

  visualizeFrequency(spectrum);
}

function visualizeFrequency(spectrum) {
  noStroke();
  fill(255, 0, 0);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }
}

class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.size = random(5, 20);
  }

  update(level) {
    this.position.add(this.velocity);
    this.size = map(level, 0, 1, 5, 50);

    // Boundary conditions
    if (this.position.x > width || this.position.x < 0) {
      this.velocity.x *= -1;
    }
    if (this.position.y > height || this.position.y < 0) {
      this.velocity.y *= -1;
    }
  }

  show() {
    noStroke();
    fill(255);
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }
}
