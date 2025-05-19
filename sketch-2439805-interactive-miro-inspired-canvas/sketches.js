let colors = ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#F4A261', '#E76F51'];
let clicks = 0;

function setup() {
  createCanvas(800, 800);
  background(255);
  noLoop();
  initialShapes();
}

function initialShapes() {
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    drawMiroShape(x, y, random(60, 150));
  }
}

function drawMiroShape(x, y, size) {
  // Draw a base ellipse with a bold stroke
  fill(random(colors));
  stroke(0);
  strokeWeight(3);
  ellipse(x, y, size, size * 0.7);

  // Add a smaller inner circle
  fill(random(colors));
  ellipse(x, y, size * 0.3);

  // Draw a random line extending from the shape
  let angle = random(TWO_PI);
  let length = random(50, 120);
  let x2 = x + cos(angle) * length;
  let y2 = y + sin(angle) * length;
  strokeWeight(2);
  line(x, y, x2, y2);

  // Add small dots and irregular lines for added texture
  noStroke();
  fill(random(colors));
  for (let j = 0; j < random(5, 10); j++) {
    ellipse(x + random(-size, size), y + random(-size, size), random(5, 10));
  }
}

function mousePressed() {
  clicks++;
  if (clicks < 8) {
    drawMiroShape(mouseX, mouseY, random(80, 160));
  } else {
    // Draw smaller, finer details in later clicks
    drawFineDetail(mouseX, mouseY);
  }
}

function drawFineDetail(x, y) {
  fill(random(colors));
  noStroke();
  for (let i = 0; i < random(3, 6); i++) {
    ellipse(x + random(-20, 20), y + random(-20, 20), random(5, 15));
  }

  stroke(0);
  strokeWeight(1);
  for (let i = 0; i < random(2, 4); i++) {
    let angle = random(TWO_PI);
    let length = random(20, 50);
    let x2 = x + cos(angle) * length;
    let y2 = y + sin(angle) * length;
    line(x, y, x2, y2);
  }
}
