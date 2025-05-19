// Interactive Triangle with Dynamic Angles
// Click and drag the vertices to reshape the triangle

let vertexA, vertexB, vertexC;
let draggingVertex = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize the vertices of the triangle
  vertexA = createVector(width / 2 - 100, height / 2 - 100);
  vertexB = createVector(width / 2 + 100, height / 2 - 100);
  vertexC = createVector(width / 2, height / 2 + 100);
}

function draw() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(1);

  // Draw the triangle
  triangle(vertexA.x, vertexA.y, vertexB.x, vertexB.y, vertexC.x, vertexC.y);

  // Draw vertices as circles
  fill(255);
  stroke(0);
  ellipse(vertexA.x, vertexA.y, 10);
  ellipse(vertexB.x, vertexB.y, 10);
  ellipse(vertexC.x, vertexC.y, 10);

  // Calculate side lengths
  let sideA = dist(vertexB.x, vertexB.y, vertexC.x, vertexC.y); // opposite to vertexA
  let sideB = dist(vertexA.x, vertexA.y, vertexC.x, vertexC.y); // opposite to vertexB
  let sideC = dist(vertexA.x, vertexA.y, vertexB.x, vertexB.y); // opposite to vertexC

  // Calculate angles using Law of Cosines
  let angleA = degrees(acos((sq(sideB) + sq(sideC) - sq(sideA)) / (2 * sideB * sideC)));
  let angleB = degrees(acos((sq(sideA) + sq(sideC) - sq(sideB)) / (2 * sideA * sideC)));
  let angleC = 180 - angleA - angleB; // Ensure sum to 180°

  angleA = angleA.toFixed(1);
  angleB = angleB.toFixed(1);
  angleC = angleC.toFixed(1);

  // Display angles
  displayAngle(vertexA, angleA);
  displayAngle(vertexB, angleB);
  displayAngle(vertexC, angleC);

  // Calculate perimeter
  let perimeter = sideA + sideB + sideC;

  // Calculate area using Heron's formula
  let s = perimeter / 2;
  let area = sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));

  // Display perimeter and area
  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("Perimeter: " + perimeter.toFixed(2), 10, 10);
  text("Area: " + area.toFixed(2), 10, 30);
}

function displayAngle(vertex, angle) {
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  text(angle + "°", vertex.x, vertex.y - 20);
}

function mousePressed() {
  // Check if the mouse is over any vertex
  if (dist(mouseX, mouseY, vertexA.x, vertexA.y) < 10) {
    draggingVertex = vertexA;
  } else if (dist(mouseX, mouseY, vertexB.x, vertexB.y) < 10) {
    draggingVertex = vertexB;
  } else if (dist(mouseX, mouseY, vertexC.x, vertexC.y) < 10) {
    draggingVertex = vertexC;
  }
}

function mouseDragged() {
  // Update the position of the dragged vertex
  if (draggingVertex) {
    draggingVertex.x = mouseX;
    draggingVertex.y = mouseY;
  }
}

function mouseReleased() {
  // Stop dragging when the mouse is released
  draggingVertex = null;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function touchStarted() {
  mousePressed();
}

function touchMoved() {
  mouseDragged();
  return false; // Prevent default behavior
}

function touchEnded() {
  mouseReleased();
}
