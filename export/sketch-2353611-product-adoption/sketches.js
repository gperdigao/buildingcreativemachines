let particles = [];
let totalParticles = 300;
let adoptionThreshold = 0.2; // Critical mass threshold
let adoptionRate = 0.05;     // Base adoption probability
let churnRate = 0.01;        // Probability of churn per frame

function setup() {
  createCanvas(800, 600);
  // Initialize particles
  for (let i = 0; i < totalParticles; i++) {
    particles.push(new Particle());
  }
  // Introduce initial adopters
  for (let i = 0; i < 5; i++) {
    particles[i].state = 'adopted';
  }
}

function draw() {
  background(30);
  
  // Calculate current adoption percentage
  let adoptedCount = particles.filter(p => p.state === 'adopted').length;
  let adoptionPercentage = adoptedCount / totalParticles;
  
  // Adjust adoption rate based on critical mass
  let currentAdoptionRate = adoptionRate;
  if (adoptionPercentage > adoptionThreshold) {
    currentAdoptionRate += (adoptionPercentage - adoptionThreshold) * 0.5;
  }
  
  // Update and display particles
  for (let particle of particles) {
    particle.update(currentAdoptionRate);
    particle.display();
  }
  
  // Display adoption stats
  fill(255);
  noStroke();
  textSize(16);
  text(`Adoption: ${(adoptionPercentage * 100).toFixed(1)}%`, 10, height - 20);
}

function mousePressed() {
  // Introduce new adopters where the mouse is clicked
  for (let particle of particles) {
    let d = dist(mouseX, mouseY, particle.position.x, particle.position.y);
    if (d < 50) {
      particle.state = 'adopted';
    }
  }
}

// Particle class
class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(1);
    this.state = 'nonAdopted'; // States: 'nonAdopted', 'adopted', 'churned'
    this.timer = 0;
  }
  
  update(adoptionRate) {
    // Move particle
    this.position.add(this.velocity);
    this.edges();
    
    // Interaction with other particles
    if (this.state === 'nonAdopted') {
      for (let other of particles) {
        if (other.state === 'adopted') {
          let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
          if (d < 20 && random() < adoptionRate) {
            this.state = 'adopted';
            break;
          }
        }
      }
    } else if (this.state === 'adopted') {
      // Churn process
      if (random() < churnRate) {
        this.state = 'churned';
      }
    }
  }
  
  display() {
    noStroke();
    if (this.state === 'nonAdopted') {
      fill(200);
    } else if (this.state === 'adopted') {
      fill(100, 200, 100);
    } else if (this.state === 'churned') {
      fill(200, 100, 100);
    }
    ellipse(this.position.x, this.position.y, 8, 8);
  }
  
  edges() {
    // Wrap around edges
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }
}
