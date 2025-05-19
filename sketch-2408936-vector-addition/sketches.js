let origin;
let vector1, vector2;
let result;

function setup() {
  createCanvas(800, 600);
  origin = createVector(width / 4, height / 2); // Set the origin
  
  // Initial positions for vector heads
  vector1 = createVector(200, 150);
  vector2 = createVector(150, -100);
  
  // Smooth drawing and thin lines for elegance
  strokeWeight(1.5);
  textFont('Georgia');
}

function draw() {
  background(20); // Elegant dark background
  
  // Draw grid
  drawGrid();
  
  // Calculate result vector (vector1 + vector2)
  result = p5.Vector.add(vector1, vector2);
  
  // Draw vectors from the origin
  drawVector(vector1, origin, color(0, 255, 0), "Vector 1"); // Green
  drawVector(vector2, origin, color(0, 0, 255), "Vector 2"); // Blue
  drawVector(result, origin, color(255, 0, 0), "Resultant"); // Red
  
  // Instructions and labels
  noStroke();
  fill(255);
  textSize(16);
  text("Drag the vector heads to adjust them", 20, 20);
  text("Green: Vector 1, Blue: Vector 2, Red: Resultant", 20, 50);
  
  // Magnitudes and angles display
  text(`|Vector 1|: ${vector1.mag().toFixed(2)}`, 20, height - 70);
  text(`|Vector 2|: ${vector2.mag().toFixed(2)}`, 20, height - 50);
  text(`|Resultant|: ${result.mag().toFixed(2)}`, 20, height - 30);
}

function drawGrid() {
  stroke(100, 100, 100, 50);
  for (let x = 0; x < width; x += 20) {
    line(x, 0, x, height); // Vertical lines
  }
  for (let y = 0; y < height; y += 20) {
    line(0, y, width, y); // Horizontal lines
  }
}

function drawVector(v, base, col, label) {
  stroke(col);
  fill(col);
  
  let arrowSize = 10;
  
  // Draw the vector line
  line(base.x, base.y, base.x + v.x, base.y + v.y);
  
  // Draw the arrowhead
  let angle = atan2(v.y, v.x);
  push();
  translate(base.x + v.x, base.y + v.y);
  rotate(angle);
  triangle(0, 0, -arrowSize, arrowSize / 2, -arrowSize, -arrowSize / 2);
  pop();
  
  // Label the vector with magnitude and angle
  noStroke();
  textSize(14);
  text(`${label} (${v.mag().toFixed(2)}, ${degrees(angle).toFixed(1)}°)`, base.x + v.x + 10, base.y + v.y - 10);
}

function mouseDragged() {
  // Check if mouse is near vector1 head
  if (dist(mouseX, mouseY, origin.x + vector1.x, origin.y + vector1.y) < 20) {
    vector1.set(mouseX - origin.x, mouseY - origin.y);
  }
  
  // Check if mouse is near vector2 head
  if (dist(mouseX, mouseY, origin.x + vector2.x, origin.y + vector2.y) < 20) {
    vector2.set(mouseX - origin.x, mouseY - origin.y);
  }
}
