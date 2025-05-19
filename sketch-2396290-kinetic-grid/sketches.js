let backgroundColor;
let shapes = [];
let noiseFilter;
let gridCount = 18;
let gridSize;
let mouseForceRadius = 150;
let gravity;
let colors = ['#f56983', '#f71735', '#067bc2', '#ffd91c', '#99d5f7', '#14234f'];
let damping = 0.9;

function setup() {
  createCanvas(900, 900);
  rectMode(CENTER);
  gridSize = width / gridCount;
  backgroundColor = color(20); // Dark background for better visibility
  noiseFilter = createImage(width, height);
  
  // Initialize noise filter with subtle noise
  noiseFilter.loadPixels();
  for (let i = 0; i < noiseFilter.pixels.length; i += 4) {
    let noiseVal = noise(i * 0.0001, frameCount * 0.001) * 255;
    noiseFilter.pixels[i] = noiseVal;
    noiseFilter.pixels[i + 1] = noiseVal;
    noiseFilter.pixels[i + 2] = noiseVal;
    noiseFilter.pixels[i + 3] = 20; // Low alpha for subtle overlay
  }
  noiseFilter.updatePixels();

  // Initialize shapes grid with physics properties
  for (let i = 0; i < gridCount; i++) {
    for (let j = 0; j < gridCount; j++) {
      let x = i * gridSize + gridSize / 2;
      let y = j * gridSize + gridSize / 2;
      let type = int(random(0, 25)); // Shape type as per your superShape function
      let c1 = random(colors);
      let c2 = random(colors);
      shapes.push(new KineticShape(x, y, gridSize - 4, type, c1, c2));
    }
  }
}

function draw() {
  // Apply a semi-transparent background for trailing effect
  background(backgroundColor.levels[0], backgroundColor.levels[1], backgroundColor.levels[2], 25);
  
  // Overlay noise filter for texture
  image(noiseFilter, 0, 0, width, height);

  // Calculate mouse attraction/repulsion force
  let mousePos = createVector(mouseX, mouseY);
  
  for (let shape of shapes) {
    // Calculate distance to mouse
    let dir = p5.Vector.sub(mousePos, shape.pos);
    let distance = dir.mag();
    
    if (distance < mouseForceRadius) {
      dir.normalize();
      // Stronger force when closer to mouse
      let strength = map(distance, 0, mouseForceRadius, 5, 0);
      // Repel or attract based on mouse interaction
      let force = dir.mult(strength);
      shape.applyForce(force);
    }
    
    // Apply global gravity
    shape.applyForce(createVector(0, 0.05)); // Gentle downward force
    
    // Update physics
    shape.update();
    
    // Display the shape
    shape.display();
  }
}

// Optional: Save the canvas with 'S' key
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('InteractiveKineticGrid', 'png');
  }
}

// KineticShape Class with Physics
class KineticShape {
  constructor(x, y, w, type, c1, c2) {
    this.origin = createVector(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.w = w;
    this.type = type;
    this.c1 = c1;
    this.c2 = c2;
    this.angle = 0;
    this.angularVel = random(-0.02, 0.02);
    this.angularAcc = 0;
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    // Update velocity and position
    this.vel.add(this.acc);
    this.vel.mult(damping); // Damping for friction
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Update rotation
    this.angularVel += this.angularAcc;
    this.angularVel *= damping;
    this.angle += this.angularVel;
    this.angularAcc = 0;
    
    // Optional: Oscillate size or color based on movement
    // This can be expanded for more dynamic effects
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    
    // Dynamic fill based on velocity magnitude
    let speed = this.vel.mag();
    let dynamicColor = lerpColor(color(this.c1), color(this.c2), map(speed, 0, 5, 0, 1));
    fill(dynamicColor);
    noStroke();
    
    // Draw the shape based on type
    superShape(0, 0, this.w, this.type, this.c1, this.c2);
    
    pop();
  }
}

// SuperShape Function with Enhanced Visuals
function superShape(x, y, w, type, c1, c2) {
  push();
  translate(x, y);
  
  // Optional: Add glow effect
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = color(c2).toString();
  
  noStroke();
  fill(c1);
  
  switch(type) {
    case 0:
      // Checkerboard Pattern
      let n = 4;
      let ww = w / n;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if ((i + j) % 2 === 0) {
            fill(c1);
          } else {
            fill(c2);
          }
          square(i * ww - w / 2 + ww / 2, j * ww - w / 2 + ww / 2, ww - 2);
        }
      }
      break;
    case 1:
      // Dynamic Triangle
      fill(c1);
      let offset = sin(frameCount * 0.05) * (w / 4);
      triangle(-w / 2, w / 2 + offset, w / 2, w / 2 + offset, 0, -w / 2 - offset);
      break;
    case 2:
      // Clustered Circles
      fill(c2);
      let d = w / 3;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          circle(i * d, j * d, d * 0.8);
        }
      }
      break;
    case 3:
      // Concentric Circles with Dynamic Fill
      noFill();
      stroke(c2);
      strokeWeight(w * 0.05);
      circle(0, 0, w * 0.8);
      fill(c1);
      noStroke();
      circle(0, 0, w * 0.3);
      break;
    case 4:
      // Star-like Triangle
      fill(c1);
      triangle(w / 2, w / 2, -w / 2, -w / 2, w / 2, -w / 2);
      break;
    case 5:
      // Pointed Triangle
      fill(c1);
      triangle(w / 2, w / 2, -w / 2, w / 2, 0, -w / 2);
      break;
    case 6:
      // Central Circle
      fill(c1);
      circle(0, 0, w * 0.8);
      break;
    case 7:
      // Cross Lines
      stroke(c2);
      strokeWeight(w * 0.1);
      line(0, w * 0.3, 0, -w * 0.3);
      line(w * 0.3, 0, -w * 0.3, 0);
      break;
    case 8:
      // Grid of Small Circles
      let m = 3;
      let ww_small = (w * 0.8) / m;
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < m; j++) {
          circle(i * ww_small - (w * 0.4) + ww_small / 2, j * ww_small - (w * 0.4) + ww_small / 2, ww_small * 0.75);
        }
      }
      break;
    // Add more cases (9 to 24) with unique visual transformations
    // For brevity, only a few are implemented here
    default:
      // Default Square
      fill(c1);
      square(0, 0, w * 0.8);
      break;
  }
  
  pop();
}
