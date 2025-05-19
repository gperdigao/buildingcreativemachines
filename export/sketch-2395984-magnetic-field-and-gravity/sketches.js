// Magnetic Field Simulation with Gravity and Interactive Fields

let particles = [];
let magneticFields = [];
let gravity;

const maxParticles = 1000;

let sliders = {};
let params = {
  magneticStrength: 2
};

function setup() {
  createCanvas(800, 600);
  background(0);
  
  // Initialize gravity
  gravity = createVector(0, 0.2);
  
  // Create sliders
  createSliders();
}

function draw() {
  background(0, 20); // Trail effect
  
  // Update magnetic strength from slider
  params.magneticStrength = sliders['magneticStrength'].value();
  
  // Display field strength value
  displayFields();
  
  // Spawn new particles
  if (frameCount % 2 === 0 && particles.length < maxParticles) {
    particles.push(new Particle(random(width), 0));
  }
  
  // Update and display particles
  for (let p of particles) {
    p.applyForce(gravity.copy());
    
    // Apply magnetic forces
    for (let field of magneticFields) {
      let force = field.calculateForce(p);
      p.applyForce(force);
    }
    
    p.update();
    p.display();
  }
  
  // Remove particles that are out of bounds
  particles = particles.filter(p => p.position.y < height + 50);
  
  // Display magnetic fields
  for (let field of magneticFields) {
    field.display();
  }
}

// Particle class
class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, random(0.5, 1.5)); // Reduced initial velocity for smoother motion
    this.acceleration = createVector(0, 0);
    this.size = 4;
    this.color = color(0, 255, 255);
  }
  
  applyForce(force) {
    this.acceleration.add(force);
  }
  
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // Reset acceleration
    
    // Keep particles within canvas horizontally
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    
    // Optional: Bounce at bottom (disabled to keep particles falling smoothly)
    // if (this.position.y > height) {
    //   this.position.y = height;
    //   this.velocity.y *= -0.5;
    // }
  }
  
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.size);
  }
}

// MagneticField class
class MagneticField {
  constructor(x, y, strength) {
    this.position = createVector(x, y);
    this.strength = strength;
    this.radius = 100;
  }
  
  calculateForce(particle) {
    let dir = p5.Vector.sub(this.position, particle.position);
    let distance = dir.mag();
    if (distance < this.radius && distance > 10) { // Avoid division by zero and extremely strong forces
      // Calculate perpendicular force
      let forceDir = createVector(-dir.y, dir.x);
      forceDir.normalize();
      
      // Force magnitude decreases with distance
      let forceMag = (this.strength * (1 - distance / this.radius));
      let force = forceDir.mult(forceMag);
      
      return force;
    } else {
      return createVector(0, 0);
    }
  }
  
  display() {
    noFill();
    stroke(255, 0, 255);
    strokeWeight(2);
    ellipse(this.position.x, this.position.y, this.radius * 2);
    
    // Magnetic field direction indicator
    push();
    translate(this.position.x, this.position.y);
    rotate(frameCount * 0.05);
    stroke(255, 0, 255);
    line(0, 0, 20, 0);
    pop();
  }
}

// Handle mouse clicks to add/remove magnetic fields
function mousePressed() {
  // Ensure clicks are within the canvas
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  
  // Check if clicked near an existing field
  let clicked = false;
  for (let i = 0; i < magneticFields.length; i++) {
    let field = magneticFields[i];
    if (p5.Vector.dist(createVector(mouseX, mouseY), field.position) < field.radius) {
      magneticFields.splice(i, 1);
      clicked = true;
      break;
    }
  }
  
  // If not clicked on an existing field, add a new one
  if (!clicked && magneticFields.length < 10) {
    magneticFields.push(new MagneticField(mouseX, mouseY, params.magneticStrength));
  }
}

// Function to create sliders with labels
function createSliders() {
  // Magnetic Field Strength Slider
  let label = createP('Magnetic Field Strength');
  label.style('color', '#00FFFF');
  label.position(20, height + 10); // Positioned below the canvas
  label.style('font-size', '14px');
  
  sliders['magneticStrength'] = createSlider(1, 5, params.magneticStrength, 0.1);
  sliders['magneticStrength'].position(20, height + 30);
  sliders['magneticStrength'].style('width', '200px');
  
  // Instructions
  let instruction = createP('Click on the canvas to add/remove magnetic fields.');
  instruction.style('color', '#00FFFF');
  instruction.position(250, height + 10);
  instruction.style('font-size', '14px');
}

// Function to display current field strength
function displayFields() {
  noStroke();
  fill(0, 255, 255);
  textSize(14);
  text(`Magnetic Strength: ${params.magneticStrength.toFixed(1)}`, 20, height - 20);
}
