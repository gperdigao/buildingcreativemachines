let sketches = [];
let inkColor;
let parchmentColor;

function setup() {
  createCanvas(800, 800);
  noLoop();
  
  // Set parchment background
  parchmentColor = color(245, 222, 179); // A light tan color resembling parchment
  background(parchmentColor);
  
  // Set ink color to a sepia tone
  inkColor = color(101, 67, 33); // A dark brown color resembling sepia ink
  
  // Generate random sketches
  for (let i = 0; i < 10; i++) {
    sketches.push(generateRandomSketch());
  }
}

function draw() {
  background(parchmentColor);
  
  // Draw the sketches
  for (let sketch of sketches) {
    drawSketch(sketch);
  }
}

function generateRandomSketch() {
  let sketchType = random(['spiral', 'mechanical', 'anatomical', 'landscape', 'geometry']);
  let posX = random(width * 0.1, width * 0.9);
  let posY = random(height * 0.1, height * 0.9);
  let sketchSize = random(100, 300);
  let rotation = random(-PI / 8, PI / 8); // Slight rotation to simulate hand-drawn feel
  
  return {
    type: sketchType,
    x: posX,
    y: posY,
    size: sketchSize,
    rotation: rotation
  };
}

function drawSketch(sketch) {
  push();
  translate(sketch.x, sketch.y);
  rotate(sketch.rotation);
  stroke(inkColor);
  strokeWeight(1);
  noFill();
  
  switch (sketch.type) {
    case 'spiral':
      drawSpiral(sketch.size);
      break;
    case 'mechanical':
      drawMechanical(sketch.size);
      break;
    case 'anatomical':
      drawAnatomical(sketch.size);
      break;
    case 'landscape':
      drawLandscape(sketch.size);
      break;
    case 'geometry':
      drawGeometricShape(sketch.size);
      break;
  }
  
  pop();
}

function drawSpiral(size) {
  beginShape();
  for (let a = 0; a < TWO_PI * 5; a += 0.1) {
    let r = size * 0.1 * a;
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  endShape();
}

function drawMechanical(size) {
  let numCogs = floor(random(3, 6));
  for (let i = 0; i < numCogs; i++) {
    let cogSize = size * random(0.2, 0.4);
    let angle = random(TWO_PI);
    let x = cos(angle) * size * 0.5;
    let y = sin(angle) * size * 0.5;
    drawCog(x, y, cogSize);
  }
}

function drawCog(x, y, size) {
  push();
  translate(x, y);
  let numTeeth = floor(random(8, 16));
  beginShape();
  for (let i = 0; i < TWO_PI; i += TWO_PI / numTeeth) {
    let outerX = cos(i) * size;
    let outerY = sin(i) * size;
    vertex(outerX, outerY);
    let innerX = cos(i + (TWO_PI / numTeeth) / 2) * size * 0.8;
    let innerY = sin(i + (TWO_PI / numTeeth) / 2) * size * 0.8;
    vertex(innerX, innerY);
  }
  endShape(CLOSE);
  
  // Draw center circle
  ellipse(0, 0, size * 0.5, size * 0.5);
  pop();
}

function drawAnatomical(size) {
  // Draw a simplified anatomical heart
  beginShape();
  curveVertex(-size * 0.2, -size * 0.3);
  curveVertex(-size * 0.2, -size * 0.3);
  curveVertex(-size * 0.5, -size * 0.1);
  curveVertex(-size * 0.3, size * 0.2);
  curveVertex(0, size * 0.5);
  curveVertex(size * 0.3, size * 0.2);
  curveVertex(size * 0.5, -size * 0.1);
  curveVertex(size * 0.2, -size * 0.3);
  curveVertex(size * 0.2, -size * 0.3);
  endShape();
  
  // Add arteries
  strokeWeight(0.5);
  line(-size * 0.1, -size * 0.3, -size * 0.15, -size * 0.5);
  line(size * 0.1, -size * 0.3, size * 0.15, -size * 0.5);
}

function drawLandscape(size) {
  // Draw simple rolling hills
  strokeWeight(1);
  for (let i = -size / 2; i < size / 2; i += size / 10) {
    let amplitude = random(size * 0.05, size * 0.1);
    beginShape();
    for (let x = -size / 2; x <= size / 2; x += 5) {
      let y = sin((x + i) * 0.05) * amplitude + i * 0.5;
      vertex(x, y);
    }
    endShape();
  }
  
  // Draw a simple tree
  strokeWeight(1);
  line(0, 0, 0, -size * 0.2);
  ellipse(0, -size * 0.3, size * 0.2, size * 0.3);
}

function drawGeometricShape(size) {
  // Draw a dodecahedron (12-sided polygon)
  let sides = 12;
  beginShape();
  for (let i = 0; i < TWO_PI; i += TWO_PI / sides) {
    let x = cos(i) * size * 0.5;
    let y = sin(i) * size * 0.5;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Add internal lines
  strokeWeight(0.5);
  for (let i = 0; i < TWO_PI; i += TWO_PI / sides) {
    let x1 = cos(i) * size * 0.5;
    let y1 = sin(i) * size * 0.5;
    for (let j = i + TWO_PI / sides; j < TWO_PI; j += TWO_PI / sides) {
      let x2 = cos(j) * size * 0.5;
      let y2 = sin(j) * size * 0.5;
      line(x1, y1, x2, y2);
    }
  }
}

function mousePressed() {
  let newSketch = generateRandomSketch();
  newSketch.x = mouseX;
  newSketch.y = mouseY;
  sketches.push(newSketch);
  redraw();
}

function keyPressed() {
  if (key === 'C' || key === 'c') {
    sketches = [];
    redraw();
  }
}
