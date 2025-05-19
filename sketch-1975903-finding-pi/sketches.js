let points = [];
let circleRadius;
let totalPoints = 0;
let circlePoints = 0;

function setup() {
  createCanvas(400, 400);
  circleRadius = width / 2;
  background(0);
  stroke(255);
  noFill();
  ellipse(width / 2, height / 2, circleRadius * 2, circleRadius * 2);
  rectMode(CENTER);
  rect(width / 2, height / 2, circleRadius * 2, circleRadius * 2);
}

function draw() {
  let pointVector = createVector(random(width), random(height));
  points.push(pointVector);
  totalPoints++;

  stroke(0, 255, 0);
  if (dist(pointVector.x, pointVector.y, width / 2, height / 2) < circleRadius) {
    circlePoints++;
    stroke(255, 0, 0);
  }

  point(pointVector.x, pointVector.y);  // Corrected here

  let piApprox = 4 * (circlePoints / totalPoints);
  noStroke();
  fill(0);
  rect(50, 15, 100, 20);
  fill(255);
  text(`Pi: ${piApprox.toFixed(6)}`, 10, 20);
}
