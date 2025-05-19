//2025 New Year's Celebration

let fireworks = [];
let confetti = [];
let stars = [];
let gravity;
let globalHue = 0;
let textWave = 0;
let colorShiftSpeed = 0.5; // Speed for hue shifting

// Particle for fireworks
class Particle {
  constructor(x, y, color, vel, isFirework = false) {
    this.pos = createVector(x, y);
    this.vel = vel.copy();
    this.acc = createVector(0, 0);
    this.lifespan = 255;
    this.isFirework = isFirework;
    this.color = color;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.isFirework) {
      this.vel.mult(0.98); 
      this.lifespan -= 4;  
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  done() {
    return (this.lifespan < 0);
  }

  show() {
    colorMode(HSB, 360, 100, 100, 255);
    strokeWeight(this.isFirework ? 4 : 2);
    stroke(
      (hue(this.color) + globalHue) % 360,
      saturation(this.color),
      brightness(this.color),
      this.lifespan
    );
    point(this.pos.x, this.pos.y);
  }
}

// Firework class
class Firework {
  constructor() {
    this.firework = new Particle(
      random(width),
      height + random(0, 50),
      color(random(360), 100, 100),
      createVector(0, random(-15, -12)),
      true
    );
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();
      
      // Once the 'rocket' slows down, explode
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    // Generate many sparkly particles in a circular blast
    let total = random(80, 120);
    for (let i = 0; i < total; i++) {
      let angle = random(TWO_PI);
      let speed = random(2, 6);
      let vel = p5.Vector.fromAngle(angle);
      vel.mult(speed);
      let p = new Particle(
        this.firework.pos.x,
        this.firework.pos.y,
        this.firework.color,
        vel
      );
      this.particles.push(p);
    }
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }
    for (let p of this.particles) {
      p.show();
    }
  }
}

// Confetti class for swirling color chips
class Confetti {
  constructor() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.size = random(5, 12);
    this.angle = random(TWO_PI);
    this.speed = random(0.5, 2);
    this.spin = random(-0.1, 0.1);
    this.hue = random(360);
  }

  update() {
    this.angle += this.spin;
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(-50, 0);
      this.x = random(width);
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    colorMode(HSB, 360, 100, 100);
    fill((this.hue + globalHue) % 360, 80, 90);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size, this.size * 1.2);
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  gravity = createVector(0, 0.15);

  // Create an initial set of fireworks
  for (let i = 0; i < 5; i++) {
    fireworks.push(new Firework());
  }

  // Create stars for the background
  for (let i = 0; i < 200; i++) {
    let star = {
      x: random(width),
      y: random(height),
      brightness: random(20, 80),
      size: random(1, 3),
      twinkleSpeed: random(0.01, 0.05),
      offset: random(TWO_PI)
    };
    stars.push(star);
  }

  // Populate confetti array
  for (let i = 0; i < 150; i++) {
    confetti.push(new Confetti());
  }
}

function draw() {
  // Translucent background for trailing
  background(0, 0, 0, 20);
  drawStars();

  // Update global hue for color shifting
  globalHue += colorShiftSpeed;
  
  // Fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }

  // Occasionally add new fireworks
  if (random(1) < 0.02) {
    fireworks.push(new Firework());
  }

  // Confetti swirl
  for (let c of confetti) {
    c.update();
    c.show();
  }

  // Waving "HAPPY 2025" text
  drawNewYearMessage();
}

function drawStars() {
  // Draw starfield
  noStroke();
  fill(255);
  for (let star of stars) {
    let twinkle = sin(frameCount * star.twinkleSpeed + star.offset) * 0.5 + 0.5;
    let alphaVal = map(twinkle, 0, 1, 50, 255);
    fill(255, alphaVal);
    ellipse(star.x, star.y, star.size, star.size);
  }
}

function drawNewYearMessage() {
  // Fun wave animation for the text
  push();
  textWave += 0.02;
  let waveOffset = sin(textWave) * 10;
  
  textAlign(CENTER, CENTER);
  textSize(min(width, height) / 8);
  fill((globalHue) % 360, 100, 100);
  stroke(0);
  strokeWeight(2);
  
  // Slight vertical wave movement
  let centerY = height / 2 + waveOffset;
  text("HAPPY 2025", width / 2, centerY);
  pop();
}

// Click/tap spawns fireworks
function mousePressed() {
  fireworks.push(new Firework());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
