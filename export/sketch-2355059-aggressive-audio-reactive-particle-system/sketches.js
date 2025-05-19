let mic, fft;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize microphone input
  mic = new p5.AudioIn();
  mic.start();

  // Initialize FFT analyzer with lower smoothing for faster response
  fft = new p5.FFT(0.7, 128); // Decreased smoothing, increased bins
  fft.setInput(mic);

  // Create more particles for a denser effect
  for (let i = 0; i < 800; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0, 40); // Lower alpha for longer trails

  // Analyze the audio input
  let spectrum = fft.analyze();
  let bassEnergy = fft.getEnergy("bass");
  let trebleEnergy = fft.getEnergy("treble");
  let midEnergy = fft.getEnergy("mid");

  // Update and display particles
  particles.forEach((p, index) => {
    let freqIndex = map(index, 0, particles.length, 0, spectrum.length);
    let energy = spectrum[floor(freqIndex)];
    p.update(energy, bassEnergy, midEnergy, trebleEnergy);
    p.show();
  });
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.size = random(1, 3);
    this.color = [random(255), random(255), random(255)];
  }

  update(energy, bass, mid, treble) {
    // Movement influenced by audio energy and randomness
    let angle = noise(this.pos.x * 0.01, this.pos.y * 0.01) * TWO_PI * 4;
    this.acc = p5.Vector.fromAngle(angle);
    this.acc.mult(energy * 0.01); // Increased multiplier for aggressiveness

    // Adding randomness to movement for unpredictability
    let randomForce = p5.Vector.random2D().mult(0.5);
    this.acc.add(randomForce);

    this.vel.add(this.acc);
    this.vel.limit(map(energy, 0, 255, 2, 12)); // Higher max speed

    this.pos.add(this.vel);

    // Change size based on combined energies
    this.size = map(energy, 0, 255, 2, 25); // Larger size for impact

    // Dynamic color changes based on different frequency energies
    this.color = [
      map(bass, 0, 255, 50, 255),  // Red channel reacts to bass
      map(mid, 0, 255, 50, 255),   // Green channel reacts to mid frequencies
      map(treble, 0, 255, 50, 255) // Blue channel reacts to treble
    ];

    // Edge wrapping
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;

    // Reset acceleration
    this.acc.mult(0);
  }

  show() {
    fill(this.color[0], this.color[1], this.color[2], 220);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}
