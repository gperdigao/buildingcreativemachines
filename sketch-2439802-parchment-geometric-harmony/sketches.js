// "Epic Geometric Harmony"

let angleX = 0;
let angleY = 0;
let angleZ = 0;
let zoom = 1;
let rotationSpeedX = 0.01;
let rotationSpeedY = 0.008;
let rotationSpeedZ = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(245, 245, 220); // Parchment-like background
  stroke(0);
  noFill();
  smooth();
}

function draw() {
  background(245, 245, 220);
  
  // Apply zoom based on mouse wheel
  scale(zoom);
  
  // Apply rotations
  rotateX(angleX);
  rotateY(angleY);
  rotateZ(angleZ);
  
  // Increment angles for continuous rotation
  angleX += rotationSpeedX;
  angleY += rotationSpeedY;
  angleZ += rotationSpeedZ;
  
  // Draw multiple layers of geometric patterns
  drawMetatronCube(150);
  drawFlowerOfLife(150);
  drawInnerPatterns(150);
}

// Function to draw Metatron's Cube
function drawMetatronCube(radius) {
  push();
  strokeWeight(1);
  
  // Draw the outer circle
  ellipse(0, 0, radius * 2, radius * 2);
  
  // Generate 6 points for the hexagon
  let points = [];
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i - HALF_PI;
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    points.push(createVector(x, y));
    // Draw lines from center to each vertex
    line(0, 0, x, y);
  }
  
  // Draw lines connecting the hexagon vertices to form the cube
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let distance = p5.Vector.dist(points[i], points[j]);
      if (abs(distance - radius) < 1) { // Connect only adjacent vertices
        line(points[i].x, points[i].y, points[j].x, points[j].y);
      }
    }
  }
  
  pop();
}

// Function to draw Flower of Life pattern
function drawFlowerOfLife(radius) {
  push();
  strokeWeight(0.5);
  
  // Draw multiple overlapping circles
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    ellipse(x, y, radius * 1.732, radius * 1.732); // 1.732 ≈ sqrt(3)
  }
  
  pop();
}

// Function to draw additional inner patterns for complexity
function drawInnerPatterns(radius) {
  push();
  strokeWeight(0.3);
  
  // Draw smaller concentric circles
  for (let r = radius * 0.2; r < radius; r += radius * 0.2) {
    ellipse(0, 0, r * 2, r * 2);
  }
  
  // Draw diagonals
  line(-radius, -radius, radius, radius);
  line(-radius, radius, radius, -radius);
  
  pop();
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Handle mouse wheel for zooming
function mouseWheel(event) {
  zoom += event.delta * -0.001;
  zoom = constrain(zoom, 0.5, 3);
}

// Handle mouse drag for rotation control
function mouseDragged() {
  let deltaX = movedX;
  let deltaY = movedY;
  angleY += deltaX * 0.005;
  angleX += deltaY * 0.005;
}
