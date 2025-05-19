// Ethereal Pulse Grid: Interactive Physics-Driven Art

let colors = ['#f56983', '#f71735', '#067bc2', '#ffd91c', '#99d5f7', '#14234f'];
let backgroundColor;
let grid = [];
let gridCount = 20;
let gridSize;
let noiseFilter;
let connections = [];
let mouseInfluenceRadius = 200;
let springConstant = 0.05;
let damping = 0.85;

function setup() {
  createCanvas(900, 900);
  rectMode(CENTER);
  gridSize = width / gridCount;
  backgroundColor = color(20); // Dark background for better visibility
  
  // Initialize grid points with physics properties
  for (let i = 0; i < gridCount; i++) {
    for (let j = 0; j < gridCount; j++) {
      let x = i * gridSize + gridSize / 2;
      let y = j * gridSize + gridSize / 2;
      let type = int(random(0, 25)); // Shape type as per your superShape function
      let c1 = random(colors);
      let c2 = random(colors);
      grid.push(new GridPoint(x, y, gridSize - 4, type, c1, c2));
    }
  }
  
  // Establish connections between neighboring grid points
  for (let i = 0; i < gridCount; i++) {
    for (let j = 0; j < gridCount; j++) {
      let index = i * gridCount + j;
      let current = grid[index];
      
      // Connect to the right neighbor
      if (i < gridCount - 1) {
        let right = grid[(i + 1) * gridCount + j];
        connections.push(new Spring(current, right));
      }
      
      // Connect to the bottom neighbor
      if (j < gridCount - 1) {
        let bottom = grid[i * gridCount + (j + 1)];
        connections.push(new Spring(current, bottom));
      }
      
      // Optionally connect diagonally for a denser network
      if (i < gridCount - 1 && j < gridCount - 1) {
        let diag = grid[(i + 1) * gridCount + (j + 1)];
        connections.push(new Spring(current, diag));
      }
    }
  }
  
  // Initialize noise filter for subtle background texture
  noiseFilter = createImage(width, height);
  noiseFilter.loadPixels();
  for (let i = 0; i < noiseFilter.pixels.length; i += 4) {
    let noiseVal = random(50, 100);
    noiseFilter.pixels[i] = noiseVal;
    noiseFilter.pixels[i + 1] = noiseVal;
    noiseFilter.pixels[i + 2] = noiseVal;
    noiseFilter.pixels[i + 3] = 15; // Low alpha for subtle overlay
  }
  noiseFilter.updatePixels();
}

function draw() {
  // Apply semi-transparent background for trailing effect
  background(backgroundColor.levels[0], backgroundColor.levels[1], backgroundColor.levels[2], 25);
  
  // Overlay noise filter for texture
  image(noiseFilter, 0, 0, width, height);
  
  // Calculate mouse influence
  let mousePos = createVector(mouseX, mouseY);
  
  // Update and display connections (springs)
  for (let spring of connections) {
    spring.update();
    spring.display();
  }
  
  // Update and display grid points
  for (let point of grid) {
    // Apply mouse interaction forces
    let dir = p5.Vector.sub(mousePos, point.pos);
    let distance = dir.mag();
    if (distance < mouseInfluenceRadius) {
      dir.normalize();
      let forceMagnitude = map(distance, 0, mouseInfluenceRadius, 5, 0);
      let force = dir.mult(forceMagnitude);
      point.applyForce(force);
    }
    
    // Apply global damping
    point.vel.mult(damping);
    
    // Update physics
    point.update();
    
    // Display the shape
    point.display();
  }
}

// GridPoint Class with Physics
class GridPoint {
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
    this.angularVel = 0;
    this.angularAcc = 0;
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    // Update velocity and position
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Update rotation based on velocity
    this.angularAcc = this.vel.x * 0.001;
    this.angularVel += this.angularAcc;
    this.angularVel *= damping;
    this.angle += this.angularVel;
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    
    // Dynamic coloring based on velocity
    let speed = this.vel.mag();
    let dynamicColor = lerpColor(color(this.c1), color(this.c2), map(speed, 0, 10, 0, 1));
    fill(dynamicColor);
    noStroke();
    
    // Draw the shape based on type
    superShape(0, 0, this.w, this.type, this.c1, this.c2);
    
    pop();
  }
}

// Spring Class to connect two GridPoints
class Spring {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.restLength = p5.Vector.dist(a.pos, b.pos);
    this.k = springConstant;
  }
  
  update() {
    let force = p5.Vector.sub(this.b.pos, this.a.pos);
    let currentLength = force.mag();
    let x = currentLength - this.restLength;
    force.normalize();
    force.mult(this.k * x);
    this.a.applyForce(force);
    force.mult(-1);
    this.b.applyForce(force);
  }
  
  display() {
    stroke(200, 100);
    strokeWeight(2);
    line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);
  }
}

// Enhanced SuperShape Function with More Visual Variety
function superShape(x, y, w, type, c1, c2) {
  push();
  translate(x, y);
  
  // Optional: Add subtle glow effect
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = color(c2).toString();
  
  noStroke();
  
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
      // Pulsating Triangle
      let offset = sin(frameCount * 0.05 + this.angle) * (w / 4);
      fill(c1);
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
      // Star-like Shape
      fill(c1);
      beginShape();
      for (let i = 0; i < 5; i++) {
        let angle = radians(i * 72 - 90);
        let x = cos(angle) * (w / 2);
        let y = sin(angle) * (w / 2);
        vertex(x, y);
        angle += radians(36);
        x = cos(angle) * (w / 4);
        y = sin(angle) * (w / 4);
        vertex(x, y);
      }
      endShape(CLOSE);
      break;
    case 5:
      // Rotating Hexagon
      fill(c1);
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = radians(i * 60);
        let x = cos(angle) * (w / 2);
        let y = sin(angle) * (w / 2);
        vertex(x, y);
      }
      endShape(CLOSE);
      break;
    case 6:
      // Fractal-like Nested Squares
      fill(c1);
      square(0, 0, w * 0.8);
      fill(c2);
      square(0, 0, w * 0.4);
      break;
    case 7:
      // Dynamic Wave Pattern
      noFill();
      stroke(c2);
      strokeWeight(w * 0.05);
      beginShape();
      for (let i = -w / 2; i <= w / 2; i += 10) {
        let y = sin(i * 0.1 + frameCount * 0.05) * (w / 4);
        vertex(i, y);
      }
      endShape();
      break;
    case 8:
      // Spiral Design
      noFill();
      stroke(c2);
      strokeWeight(w * 0.05);
      beginShape();
      for (let a = 0; a < TWO_PI * 3; a += 0.1) {
        let r = map(a, 0, TWO_PI * 3, 0, w / 2);
        let sx = r * cos(a);
        let sy = r * sin(a);
        vertex(sx, sy);
      }
      endShape();
      break;
    default:
      // Default Shape: Dynamic Polygon
      fill(c1);
      let sides = 5 + int(abs(sin(frameCount * 0.01)) * 5);
      beginShape();
      for (let i = 0; i < sides; i++) {
        let angle = map(i, 0, sides, 0, TWO_PI);
        let radius = w / 2 + sin(frameCount * 0.02 + angle) * (w / 4);
        let sx = radius * cos(angle);
        let sy = radius * sin(angle);
        vertex(sx, sy);
      }
      endShape(CLOSE);
      break;
  }
  
  pop();
}
