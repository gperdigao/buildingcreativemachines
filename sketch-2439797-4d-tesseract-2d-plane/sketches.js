// "Epic Rotating Tesseract Projection" (Corrected and Enhanced)

let angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(245, 245, 220); // Parchment-like background
  stroke(0);
  noFill();
}

function draw() {
  background(245, 245, 220);
  translate(width / 2, height / 2);

  let cubeSize = min(width, height) * 0.3; // Increased size for better visibility
  let points = [];

  // Define the 16 vertices of a tesseract in 4D space
  for (let i = 0; i < 16; i++) {
    let x = (i & 1) ? cubeSize : -cubeSize;
    let y = (i & 2) ? cubeSize : -cubeSize;
    let z = (i & 4) ? cubeSize : -cubeSize;
    let w = (i & 8) ? cubeSize : -cubeSize;
    points.push([x, y, z, w]);
  }

  let rotatedPoints = points.map(p => rotate4D(p, angle));
  let projectedPoints = rotatedPoints.map(p => project4Dto2D(p));

  // Draw edges between connected vertices
  strokeWeight(1);
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      if (isConnected(i, j)) {
        let a = projectedPoints[i];
        let b = projectedPoints[j];
        line(a.x, a.y, b.x, b.y);
      }
    }
  }

  angle += 0.01; // Rotation speed
}

function rotate4D(p, angle) {
  let [x, y, z, w] = p;

  // Rotation in the XW plane
  let sinA = sin(angle * 0.5);
  let cosA = cos(angle * 0.5);
  let x1 = x * cosA - w * sinA;
  let w1 = x * sinA + w * cosA;

  // Rotation in the YZ plane
  let sinB = sin(angle * 0.3);
  let cosB = cos(angle * 0.3);
  let y1 = y * cosB - z * sinB;
  let z1 = y * sinB + z * cosB;

  return [x1, y1, z1, w1];
}

function project4Dto2D(p) {
  let [x, y, z, w] = p;

  // Perspective projection from 4D to 3D
  let distance4D = 600; // Distance from the viewer in 4D space
  let wFactor = distance4D / (distance4D - w);
  let x3D = x * wFactor;
  let y3D = y * wFactor;
  let z3D = z * wFactor;

  // Perspective projection from 3D to 2D
  let distance3D = 600; // Distance from the viewer in 3D space
  let zFactor = distance3D / (distance3D - z3D);
  let x2D = x3D * zFactor;
  let y2D = y3D * zFactor;

  return createVector(x2D, y2D);
}

function isConnected(i, j) {
  let b = i ^ j;
  // Two vertices are connected if their indices differ by exactly one bit
  return (b & (b - 1)) === 0;
}

// Optional: Make the canvas responsive
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
