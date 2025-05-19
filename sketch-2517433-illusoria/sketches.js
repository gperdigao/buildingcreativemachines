/**
Illusoria - by Gonçalo Perdigão from Building Creative Machines
"Illusion" ✨ #WCCChallenge
 */

let angleOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(255);

  // Calculate quadrant sizes
  let w = width / 2;
  let h = height / 2;

  // Top-left: Rotating Snakes
  push();
  translate(0, 0);
  drawRotatingSnakes(w, h);
  pop();

  // Top-right: Hermann Grid
  push();
  translate(w, 0);
  drawHermannGrid(w, h);
  pop();

  // Bottom-left: Ponzo Illusion
  push();
  translate(0, h);
  drawPonzo(w, h);
  pop();

  // Bottom-right: Ebbinghaus Illusion
  push();
  translate(w, h);
  drawEbbinghaus(w, h);
  pop();

  // Update angle offset for Rotating Snakes
  angleOffset += 0.01;
}

//------------------ ROTATING SNAKES ILLUSION ------------------//
function drawRotatingSnakes(w, h) {
  // This illusion is inspired by the rotating snakes concept:
  // Color arcs arranged in rings can trick the eye into seeing movement.
  // We'll create multiple rings with arcs that are slightly rotated each frame.
  
  // Center the drawing in this quadrant
  push();
  translate(w / 2, h / 2);

  let maxRings = 4;      // Number of concentric rings
  let ringSpacing = min(w, h) / 10;
  let arcCount = 12;     // Number of arcs per ring

  for (let r = 1; r <= maxRings; r++) {
    let radius = r * ringSpacing;
    for (let i = 0; i < arcCount; i++) {
      let arcAngle = TWO_PI / arcCount;
      let startA = i * arcAngle + angleOffset * r;
      
      // Alternate fill colors to enhance the illusion
      fill(
        map(i % 3, 0, 2, 50, 200), 
        map(r, 1, maxRings, 50, 180), 
        map(i, 0, arcCount, 180, 50)
      );

      arc(0, 0, radius, radius, startA, startA + arcAngle / 2);
    }
  }
  pop();
}

//------------------ HERMANN GRID ILLUSION ------------------//
function drawHermannGrid(w, h) {
  // The Hermann Grid illusion makes grey spots appear, for human eye, at the intersections of a high-contrast grid.
  
  // Define how many cells across and down
  let cols = 6;
  let rows = 6;
  let cellW = w / cols;
  let cellH = h / rows;

  fill(0);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Draw black squares; the white lines between them trigger the illusion
      rect(x * cellW, y * cellH, cellW * 0.9, cellH * 0.9);
    }
  }
}

//------------------ PONZO ILLUSION ------------------//
function drawPonzo(w, h) {
  // The Ponzo illusion uses converging lines to make two same-length bars appear different in size.

  // Draw converging lines
  stroke(0);
  strokeWeight(2);
  let margin = w * 0.15;
  line(margin, h * 0.1, w - margin, h * 0.9);
  line(w - margin, h * 0.1, margin, h * 0.9);

  // Bars that are actually the same width
  let barW = w * 0.4;
  let barH = h * 0.05;
  noStroke();
  fill(120);

  // Upper bar
  rectMode(CENTER);
  rect(w / 2, h * 0.3, barW, barH);

  // Lower bar
  rect(w / 2, h * 0.7, barW, barH);
}

//------------------ EBBINGHAUS ILLUSION ------------------//
function drawEbbinghaus(w, h) {
  // The Ebbinghaus illusion makes two identical circles appear to be different in size based on surrounding circles. This one is an absolute classic
  
  // Center positions for the two main circles
  let leftX = w * 0.3;
  let rightX = w * 0.7;
  let centerY = h * 0.5;
  let mainSize = min(w, h) * 0.08;

  // Left circle's large outer circles
  fill(150, 100, 200);
  let bigRingCount = 6;
  let bigRadius = mainSize * 2;
  for (let i = 0; i < bigRingCount; i++) {
    let angle = TWO_PI * i / bigRingCount;
    let x = leftX + cos(angle) * bigRadius;
    let y = centerY + sin(angle) * bigRadius;
    ellipse(x, y, mainSize * 1.4);
  }

  // Right circle's small outer circles
  fill(100, 200, 150);
  let smallRingCount = 8;
  let smallRadius = mainSize * 1.2;
  for (let i = 0; i < smallRingCount; i++) {
    let angle = TWO_PI * i / smallRingCount;
    let x = rightX + cos(angle) * smallRadius;
    let y = centerY + sin(angle) * smallRadius;
    ellipse(x, y, mainSize * 0.6);
  }

  // Main circles (identical in size)
  fill(255, 0, 0);
  ellipse(leftX, centerY, mainSize);
  ellipse(rightX, centerY, mainSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
