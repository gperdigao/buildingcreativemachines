// Faultline Reverie  

let shards = [];
let bgHue;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  bgHue = random(200, 260);
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Shard {
  constructor() {
    // Spawn from a random screen edge
    const edge = floor(random(4));
    switch (edge) {
      case 0: this.pos = createVector(random(width), -20); break;
      case 1: this.pos = createVector(random(width), height + 20); break;
      case 2: this.pos = createVector(-20, random(height)); break;
      case 3: this.pos = createVector(width + 20, random(height)); break;
    }
    // Initial velocity towards center with slight scatter
    const center = createVector(width/2, height/2);
    this.vel = p5.Vector.sub(center, this.pos).rotate(random(-PI/8, PI/8)).setMag(random(1, 3));
    this.size = random(20, 80);
    this.angle = random(TWO_PI);
    this.hue = random(0, 360);
    this.life = this.maxLife = random(120, 300);
  }

  update() {
    // Glitchy jitter and drift
    this.pos.add(p5.Vector.random2D().mult(0.5));
    this.pos.add(this.vel);
    this.angle += map(sin(frameCount * 0.05), -1, 1, -0.05, 0.05);
    this.life--;
  }

  display() {
    const alpha = map(this.life, 0, this.maxLife, 0, 1);
    push();
      translate(this.pos.x, this.pos.y);
      rotate(this.angle);
      blendMode(ADD);
      fill((this.hue + frameCount) % 360, 80, 100, alpha);
      beginShape();
        vertex(-this.size/2, -this.size/4);
        vertex(0, -this.size/2);
        vertex(this.size/2, -this.size/4);
        vertex(this.size/4, 0);
        vertex(this.size/2, this.size/4);
        vertex(0, this.size/2);
        vertex(-this.size/2, this.size/4);
        vertex(-this.size/4, 0);
      endShape(CLOSE);
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}

function draw() {
  background(bgHue, 20, 10);

  // Automatic spawning
  if (frameCount % 5 === 0) {
    shards.push(new Shard());
  }

  // Mouse-triggered shards
  if (frameCount % 10 === 0 && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    const s = new Shard();
    s.pos = createVector(mouseX, mouseY);
    shards.push(s);
  }

  // Update and render
  for (let i = shards.length - 1; i >= 0; i--) {
    const s = shards[i];
    s.update();
    s.display();
    if (s.isDead()) {
      shards.splice(i, 1);
    }
  }
}
