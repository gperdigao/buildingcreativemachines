let shapes = [];
let colors = [];

function setup() {
  createCanvas(800, 800);
  background(255);
  noLoop();
  noStroke();
  
  // Define a palette of bold colors typical in Miró's work
  colors = [
    color(0, 0, 0),        // Black
    color(255, 0, 0),      // Red
    color(0, 0, 255),      // Blue
    color(255, 255, 0),    // Yellow
    color(0, 255, 0),      // Green
    color(255, 255, 255)   // White
  ];
  
  // Generate random shapes
  for (let i = 0; i < 50; i++) {
    shapes.push(generateRandomShape());
  }
}

function draw() {
  background(255);

  // Draw the shapes
  for (let shape of shapes) {
    drawShape(shape);
  }
}

function generateRandomShape() {
  let shapeType = random(['circle', 'line', 'rectangle', 'star', 'abstract']);
  let posX = random(width);
  let posY = random(height);
  let shapeSize = random(20, 150);
  let rotation = random(TWO_PI);
  let col = random(colors);
  
  return {
    type: shapeType,
    x: posX,
    y: posY,
    size: shapeSize,
    rotation: rotation,
    color: col
  };
}

function drawShape(shape) {
  push();
  translate(shape.x, shape.y);
  rotate(shape.rotation);
  fill(shape.color);
  stroke(0);
  strokeWeight(2);

  switch (shape.type) {
    case 'circle':
      ellipse(0, 0, shape.size, shape.size);
      break;
    case 'rectangle':
      rectMode(CENTER);
      rect(0, 0, shape.size, shape.size);
      break;
    case 'line':
      strokeWeight(4);
      line(-shape.size / 2, 0, shape.size / 2, 0);
      break;
    case 'star':
      drawStar(0, 0, shape.size / 2, shape.size, 5);
      break;
    case 'abstract':
      drawAbstractShape(shape.size);
      break;
  }

  pop();
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function drawAbstractShape(shapeSize) {
  beginShape();
  vertex(-shapeSize / 2, -shapeSize / 2);
  bezierVertex(-shapeSize / 4, -shapeSize, shapeSize / 4, -shapeSize, shapeSize / 2, -shapeSize / 2);
  bezierVertex(shapeSize, -shapeSize / 4, shapeSize, shapeSize / 4, shapeSize / 2, shapeSize / 2);
  bezierVertex(shapeSize / 4, shapeSize, -shapeSize / 4, shapeSize, -shapeSize / 2, shapeSize / 2);
  bezierVertex(-shapeSize, shapeSize / 4, -shapeSize, -shapeSize / 4, -shapeSize / 2, -shapeSize / 2);
  endShape(CLOSE);
}

function mousePressed() {
  let newShape = generateRandomShape();
  newShape.x = mouseX;
  newShape.y = mouseY;
  shapes.push(newShape);
  redraw();
}

function keyPressed() {
  if (key === 'C' || key === 'c') {
    shapes = [];
    redraw();
  }
}
