// "Metatron's Cube Sketch" 

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(245, 245, 220); // Parchment-like background
  stroke(0);
  noFill();
}

function draw() {
  background(245, 245, 220);
  translate(width / 2, height / 2);

  let radius = min(width, height) * 0.2;
  let points = [];

  // Generate 13 points (center + vertices of two overlapping hexagons)
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i - PI / 2;
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    points.push(createVector(x, y));
  }
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i - PI / 2 + PI / 6;
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    points.push(createVector(x, y));
  }
  points.push(createVector(0, 0)); // Center point

  // Draw circles at each point
  strokeWeight(1);
  for (let p of points) {
    ellipse(p.x, p.y, radius * 2);
  }

  // Draw lines connecting all points
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      line(points[i].x, points[i].y, points[j].x, points[j].y);
    }
  }
}
