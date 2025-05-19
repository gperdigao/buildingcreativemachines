// "Jump Scare" 😱 #WCCChallenge
// by Gonçalo Perdigão, Building  Creative Machines

let shapes = [];
let currentShapeIndex = 0;
let particleShapes = [];
let disintegrate = false;
let interactionCount = 0;
let jumpScare = false;
let scareTime;

function setup() {
  createCanvas(800, 600);
  background(20);
  noStroke();
  scareTime = millis() + 20000; // Jump scare after 20 seconds

  // Create particle shapes
  createParticleShapes();

  // Start with the first shape
  shapes.push(new Shape(particleShapes[currentShapeIndex]));
}

function draw() {
  background(20);

  if (!jumpScare) {
    // Update and display shapes
    for (let s of shapes) {
      s.update();
      s.display();
    }

    // Check for disintegration
    for (let s of shapes) {
      s.checkDisintegration();
    }

    // Remove shapes that have completed reintegration
    shapes = shapes.filter(s => !s.isFinished());

    // If no shapes are left, create the next shape
    if (shapes.length === 0 && !disintegrate) {
      currentShapeIndex = (currentShapeIndex + 1) % particleShapes.length;
      shapes.push(new Shape(particleShapes[currentShapeIndex]));
    }

    // Trigger jump scare after interactions or time
    if (interactionCount >= 30 || millis() > scareTime) {
      jumpScare = true;
    }
  } else {
    // Display jump scare
    drawScaryFace();
  }
}

function createParticleShapes() {
  // Create off-screen graphics to draw shapes
  let ghostGfx = createGraphics(200, 200);
  ghostGfx.noStroke();
  ghostGfx.fill(255);
  ghostGfx.beginShape();
  ghostGfx.vertex(100, 20);
  ghostGfx.bezierVertex(150, 20, 180, 80, 100, 180);
  ghostGfx.bezierVertex(20, 80, 50, 20, 100, 20);
  ghostGfx.endShape(CLOSE);
  // Eyes
  ghostGfx.fill(0);
  ghostGfx.ellipse(80, 80, 20, 30);
  ghostGfx.ellipse(120, 80, 20, 30);

  let batGfx = createGraphics(200, 200);
  batGfx.noStroke();
  batGfx.fill(150, 0, 150);
  batGfx.beginShape();
  batGfx.vertex(100, 50);
  batGfx.vertex(130, 80);
  batGfx.vertex(160, 50);
  batGfx.vertex(190, 80);
  batGfx.vertex(160, 110);
  batGfx.vertex(190, 140);
  batGfx.vertex(160, 170);
  batGfx.vertex(130, 140);
  batGfx.vertex(100, 170);
  batGfx.vertex(70, 140);
  batGfx.vertex(40, 170);
  batGfx.vertex(10, 140);
  batGfx.vertex(40, 110);
  batGfx.vertex(10, 80);
  batGfx.vertex(40, 50);
  batGfx.vertex(70, 80);
  batGfx.endShape(CLOSE);

  let pumpkinGfx = createGraphics(200, 200);
  pumpkinGfx.noStroke();
  pumpkinGfx.fill(255, 140, 0);
  pumpkinGfx.ellipse(100, 100, 150, 150);
  // Stem
  pumpkinGfx.fill(139, 69, 19);
  pumpkinGfx.rect(90, 40, 20, 30);
  // Eyes
  pumpkinGfx.fill(0);
  pumpkinGfx.triangle(70, 80, 85, 60, 100, 80);
  pumpkinGfx.triangle(100, 80, 115, 60, 130, 80);
  // Mouth
  pumpkinGfx.rect(70, 120, 60, 20);

  // Create particle arrays from graphics
  particleShapes.push(getParticlesFromGraphics(ghostGfx));
  particleShapes.push(getParticlesFromGraphics(batGfx));
  particleShapes.push(getParticlesFromGraphics(pumpkinGfx));
}

function getParticlesFromGraphics(gfx) {
  let particles = [];
  gfx.loadPixels();
  for (let x = 0; x < gfx.width; x += 4) {
    for (let y = 0; y < gfx.height; y += 4) {
      let index = (x + y * gfx.width) * 4;
      let alpha = gfx.pixels[index + 3];
      if (alpha > 128) {
        let col = color(
          gfx.pixels[index],
          gfx.pixels[index + 1],
          gfx.pixels[index + 2],
          alpha
        );
        let pos = createVector(x, y);
        particles.push(new Particle(pos, col));
      }
    }
  }
  return particles;
}

class Shape {
  constructor(particles) {
    this.particles = particles.map(p => p.copy());
    this.position = createVector(random(100, width - 300), random(100, height - 300));
    this.velocity = p5.Vector.random2D().mult(random(1, 2));
    this.disintegrate = false;
    this.reintegrateTimer = 0;
    this.finished = false;
  }

  update() {
    if (!this.disintegrate) {
      this.position.add(this.velocity);
      // Bounce off edges
      if (this.position.x < 0 || this.position.x > width - 200) {
        this.velocity.x *= -1;
      }
      if (this.position.y < 0 || this.position.y > height - 200) {
        this.velocity.y *= -1;
      }
    }

    for (let p of this.particles) {
      p.update(this.position, this.disintegrate);
    }
  }

  display() {
    for (let p of this.particles) {
      p.show();
    }
  }

  checkDisintegration() {
    let d = dist(mouseX, mouseY, this.position.x + 100, this.position.y + 100);
    if (d < 100 && !this.disintegrate) {
      this.disintegrate = true;
      interactionCount++;
      for (let p of this.particles) {
        let force = p5.Vector.sub(p.pos, createVector(mouseX, mouseY));
        force.setMag(random(2, 5));
        p.applyForce(force);
      }
      // Schedule reintegration
      this.reintegrateTimer = millis() + 2000;
    }
    if (this.disintegrate && millis() > this.reintegrateTimer) {
      this.disintegrate = false;
      // Move shape near mouse position
      this.position = createVector(mouseX - 100, mouseY - 100);
      for (let p of this.particles) {
        p.reset(this.position);
      }
      if (interactionCount >= 3) {
        this.finished = true;
      }
    }
  }

  isFinished() {
    return this.finished;
  }
}

class Particle {
  constructor(pos, col) {
    this.home = pos.copy();
    this.pos = pos.copy();
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.col = col;
  }

  copy() {
    return new Particle(this.home, this.col);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update(shapePos, disintegrate) {
    if (!disintegrate) {
      let target = p5.Vector.add(shapePos, this.home);
      let force = p5.Vector.sub(target, this.pos);
      force.mult(0.2);
      this.applyForce(force);
    } else {
      // Apply gravity effect if needed
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.mult(0.95); // Friction
  }

  reset(shapePos) {
    this.pos = p5.Vector.add(shapePos, this.home);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
  }

  show() {
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, 4, 4);
  }
}

function drawScaryFace() {
  background(0);
  fill(255, 0, 0);
  textSize(100);
  textAlign(CENTER, CENTER);
  text('BOO!', width / 2, height / 2);
}
