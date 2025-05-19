let img;
let particles = [];

function preload() {
  img = loadImage('cat.png');
}

function setup() {
  createCanvas(800, 800);
  pixelDensity(1);
  img.loadPixels();
}

function draw() {
  background(0, 50); // Semi-transparent background (creates trails)
  
  // Draw the cat image in the background with some transparency
  tint(255, 128); // Apply transparency to the image
  image(img, 0, 0, width, height); // Draw the image to fit the entire canvas
  
  // Generate new particles
  for (let i = 0; i < 5; i++) {
    let x = mouseX + random(-5, 5);
    let y = mouseY + random(-5, 5);
    let color = img.get(int(x), int(y));
    let particle = new Particle(x, y, color);
    particles.push(particle);
  }
  
  // Update and show particles
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    } else {
      particles[i].update();
      particles[i].show();
    }
  }
}

function Particle(x, y, color) {
  this.pos = createVector(x, y);
  this.vel = p5.Vector.random2D().mult(random(1, 2));
  this.acc = createVector(0, 0);
  this.alpha = 255;
  this.color = color;

  this.update = function() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.alpha -= 2;
  }

  this.show = function() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.alpha / 2); // Make particles slightly transparent
    ellipse(this.pos.x, this.pos.y, 16);
  }
}
