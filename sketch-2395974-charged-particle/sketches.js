// Charged Particle in Electric and Magnetic Fields

let particle;
let trails = [];
const maxTrails = 500;

let sliders = {};
let params = {
  E_x: 1,
  E_y: 0,
  B_z: 0.5
};

function setup() {
  createCanvas(800, 600);
  background(0);
  
  // Initialize particle at center with zero velocity
  particle = new Particle(createVector(width / 2, height / 2), createVector(0, 0));
  
  // Create sliders
  createSliders();
  
  // Text settings
  textSize(14);
}

function draw() {
  background(0, 20); // Trail effect
  
  // Update parameters from sliders
  params.E_x = sliders['E_x'].value();
  params.E_y = sliders['E_y'].value();
  params.B_z = sliders['B_z'].value();
  
  // Display field values
  displayFields();
  
  // Calculate Lorentz force: F = E + v x B
  let E = createVector(params.E_x, params.E_y);
  let B = createVector(0, 0, params.B_z);
  let v = createVector(particle.velocity.x, particle.velocity.y, 0);
  let F = p5.Vector.add(E, p5.Vector.cross(v, B));
  
  // Update particle with damping
  particle.applyForce(p5.Vector.mult(F, 0.1)); // Scale force
  particle.applyDamping(0.99); // Damping factor
  particle.update();
  particle.display();
  
  // Store trail
  trails.push(particle.position.copy());
  if (trails.length > maxTrails) {
    trails.shift();
  }
  
  // Draw trails
  noFill();
  stroke(0, 255, 255, 100);
  strokeWeight(2);
  beginShape();
  for (let pos of trails) {
    vertex(pos.x, pos.y);
  }
  endShape();
}

// Particle class
class Particle {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
    this.mass = 1;
    this.charge = 1;
  }
  
  applyForce(force) {
    // F = m * a => a = F / m
    let acceleration = p5.Vector.div(force, this.mass);
    this.velocity.add(acceleration);
  }
  
  applyDamping(damping) {
    this.velocity.mult(damping);
  }
  
  update() {
    this.position.add(this.velocity);
    
    // Wrap around the edges
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }
  
  display() {
    fill(0, 255, 255);
    noStroke();
    ellipse(this.position.x, this.position.y, 8);
  }
}

// Function to create sliders with labels
function createSliders() {
  // Electric Field X
  createP('Electric Field X (E_x)').style('color', '#00FFFF').position(20, height - 120);
  sliders['E_x'] = createSlider(-5, 5, params.E_x, 0.1);
  sliders['E_x'].position(200, height - 110);
  
  // Electric Field Y
  createP('Electric Field Y (E_y)').style('color', '#00FFFF').position(20, height - 80);
  sliders['E_y'] = createSlider(-5, 5, params.E_y, 0.1);
  sliders['E_y'].position(200, height - 70);
  
  // Magnetic Field Z
  createP('Magnetic Field Z (B_z)').style('color', '#00FFFF').position(20, height - 40);
  sliders['B_z'] = createSlider(-5, 5, params.B_z, 0.1);
  sliders['B_z'].position(200, height - 30);
}

// Function to display field values
function displayFields() {
  noStroke();
  fill(0, 255, 255);
  text(`E_x: ${params.E_x.toFixed(1)}`, 420, height - 100);
  text(`E_y: ${params.E_y.toFixed(1)}`, 420, height - 60);
  text(`B_z: ${params.B_z.toFixed(1)}`, 420, height - 20);
}
