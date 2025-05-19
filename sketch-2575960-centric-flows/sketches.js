// Epic p5.js Visual Experience for OpenProcessing
// No external files required – fully responsive and optimized for desktop and mobile

let particles = [];
let numParticles;

function setup() {
  // Create a canvas that fills the window and optimize pixel density for performance
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  
  // Dynamically set the number of particles based on screen size (capped for performance)
  numParticles = min(1000, floor((width * height) / 2500));
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Draw a translucent black rectangle to gradually fade the previous frame,
  // creating smooth trails without overloading the CPU.
  noStroke();
  fill(0, 0, 0, 15);
  rect(0, 0, width, height);
  
  // Draw a central rotating epic shape for added visual impact
  push();
  translate(width / 2, height / 2);
  rotate(frameCount * 0.01);
  noFill();
  stroke(200, 80, 100);
  strokeWeight(2);
  // Draw concentric circles
  for (let i = 0; i < 10; i++) {
    ellipse(0, 0, 50 + i * 30, 50 + i * 30);
  }
  pop();
  
  // Use additive blend mode for luminous particle trails
  blendMode(ADD);
  for (let p of particles) {
    p.update();
    p.show();
  }
  blendMode(BLEND);
}

class Particle {
  constructor() {
    // Start each particle at a random location on the canvas
    this.pos = createVector(random(width), random(height));
    this.prevPos = this.pos.copy();
    // Random speed to add variety in movement
    this.speed = random(1, 3);
    // Initialize with a random hue value for vibrant trails
    this.hue = random(360);
  }
  
  update() {
    // Use Perlin noise to determine a dynamic angle for fluid motion
    let angle = noise(this.pos.x * 0.005, this.pos.y * 0.005, frameCount * 0.005) * TWO_PI * 2;
    let velocity = p5.Vector.fromAngle(angle);
    velocity.setMag(this.speed);
    this.pos.add(velocity);
    
    // If the mouse is pressed, add a subtle attraction force towards the pointer
    if (mouseIsPressed) {
      let mouseVec = createVector(mouseX, mouseY);
      let attraction = p5.Vector.sub(mouseVec, this.pos);
      attraction.setMag(0.2);
      this.pos.add(attraction);
    }
    
    // Wrap particles around screen edges to ensure continuous flow
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prevPos = this.pos.copy();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prevPos = this.pos.copy();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prevPos = this.pos.copy();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prevPos = this.pos.copy();
    }
    
    // Gradually cycle through hues for a mesmerizing color effect
    this.hue = (this.hue + 0.5) % 360;
  }
  
  show() {
    // Draw a line from the previous position to the current position for a trail effect
    stroke(this.hue, 80, 100, 50);
    strokeWeight(2);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    // Update previous position for the next frame's trail
    this.prevPos = this.pos.copy();
  }
}

function windowResized() {
  // Resize the canvas when the window size changes and clear the background
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
