let points = [];
let draggingPoint = null;

function setup() {
  createCanvas(600, 600);
  background(255);

  // Initialize control points for a basic Bezier curve
  points.push(createVector(100, height - 100)); // Start point
  points.push(createVector(200, 100)); // Control point 1
  points.push(createVector(400, 500)); // Control point 2
  points.push(createVector(width - 100, 100)); // End point
}

function draw() {
  background(255);
  stroke(0);
  strokeWeight(1);
  noFill();

  // Draw Bezier curve based on control points
  beginShape();
  vertex(points[0].x, points[0].y);
  bezierVertex(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
  endShape();

  // Draw lines connecting control points for clarity
  stroke(200);
  line(points[0].x, points[0].y, points[1].x, points[1].y);
  line(points[2].x, points[2].y, points[3].x, points[3].y);

  // Draw control points
  fill(0);
  noStroke();
  for (let i = 0; i < points.length; i++) {
    ellipse(points[i].x, points[i].y, 10, 10);
  }
}

function mousePressed() {
  // Check if mouse is close to any point to enable dragging
  for (let pt of points) {
    if (dist(mouseX, mouseY, pt.x, pt.y) < 10) {
      draggingPoint = pt;
      break;
    }
  }
}

function mouseDragged() {
  // Move the selected point with the mouse
  if (draggingPoint) {
    draggingPoint.x = mouseX;
    draggingPoint.y = mouseY;
  }
}

function mouseReleased() {
  draggingPoint = null;
}
