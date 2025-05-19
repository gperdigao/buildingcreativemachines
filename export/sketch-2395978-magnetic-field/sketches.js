let particles = [];
let fieldStrength = 1;
let sliders = {};

function setup() {
  createCanvas(800, 600);
  background(0);
  createSliders();
  
  // Initialize particles on different field lines
  let numParticles = 5;
  let maxRadius = min(width, height) / 2 - 50;
  let step = maxRadius / numParticles;
  
  for (let i = 1; i <= numParticles; i++) {
    particles.push(new Particle(i * step, fieldStrength));
  }
}

function draw() {
  background(0, 20);
  
  // Update field strength from slider
  fieldStrength = sliders['fieldStrength'].value();
  
  // Draw magnetic field lines
  stroke(0, 255, 255, 100);
  strokeWeight(1);
  noFill();
  let maxRadius = min(width, height) / 2 - 50;
  for (let r = 50; r <= maxRadius; r += 50) {
    ellipse(0, 0, r * 2);
  }
  
  // Update and display particles
  for (let p of particles) {
    p.update(fieldStrength);
    p.display();
  }
  
  // Display slider labels
  fill(0, 255, 255);
  noStroke();
  textSize(14);
  text("Magnetic Field Strength", sliders['fieldStrength'].x + 10, sliders['fieldStrength'].y - 10);
}

class Particle {
  constructor(r, field) {
    this.radius = r;
    this.angle = random(TWO_PI);
    this.speed = map(field, 0.1, 5, 0.005, 0.05);
    this.color = color(0, 255, 255);
  }
  
  update(field) {
    this.speed = map(field, 0.1, 5, 0.005, 0.05);
    this.angle += this.speed;
  }
  
  display() {
    let x = this.radius * cos(this.angle);
    let y = this.radius * sin(this.angle);
    
    fill(this.color);
    noStroke();
    ellipse(x, y, 8);
  }
}

function createSliders() {
  // Magnetic Field Strength Slider
  createP('').style('color', '#00FFFF').position(20, height - 60);
  sliders['fieldStrength'] = createSlider(0.1, 5, 1, 0.1);
  sliders['fieldStrength'].position(20, height - 40);
}
