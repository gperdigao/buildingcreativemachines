// ErrorFlux  
// A rare and epic p5.js sketch where ephemeral glitch-like Errors emerge, swirl, and fade away in a cosmic dance—shaped by your cursor's presence.  

let errors = [];
let bgColor;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  bgColor = color(230, 20, 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class ErrorBlob {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(30, 100);
    this.hue = random(300, 360);
    this.life = random(80, 200);
    this.maxLife = this.life;
  }

  update() {
    // Mouse interaction: repel if close, else gentle noise drift
    let m = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(this.pos, m);
    let d = dir.mag();
    if (d < 150) {
      dir.normalize().mult((150 - d) * 0.02);
      this.vel.add(dir);
    } else {
      // subtle perlin noise influence
      let angle = noise(this.pos.x * 0.002, this.pos.y * 0.002, frameCount * 0.005) * TWO_PI * 4;
      this.vel.add(p5.Vector.fromAngle(angle).mult(0.05));
    }
    this.pos.add(this.vel);
    this.life--;
  }

  display() {
    let alpha = map(this.life, 0, this.maxLife, 0, 1);
    noStroke();
    fill(this.hue, 80, 100, alpha);
    let noiseFactor = noise(this.pos.x * 0.005, this.pos.y * 0.005, frameCount * 0.01);
    let sz = this.size * (0.5 + noiseFactor * 0.5);
    // layered drawing for depth
    for (let i = 1; i > 0; i -= 0.2) {
      ellipse(
        this.pos.x + sin(frameCount * 0.01 + i) * 5,
        this.pos.y + cos(frameCount * 0.01 + i) * 5,
        sz * i,
        sz * i * (0.8 + noiseFactor * 0.2)
      );
    }
  }

  isDead() {
    return this.life <= 0;
  }
}

function draw() {
  blendMode(BLEND);
  background(bgColor);
  blendMode(ADD);

  // spawn new errors dynamically
  if (frameCount % 4 === 0) {
    let x = random(width);
    let y = random(height);
    errors.push(new ErrorBlob(x, y));
  }

  // update & display all
  for (let i = errors.length - 1; i >= 0; i--) {
    let e = errors[i];
    e.update();
    e.display();
    if (e.isDead()) errors.splice(i, 1);
  }
}