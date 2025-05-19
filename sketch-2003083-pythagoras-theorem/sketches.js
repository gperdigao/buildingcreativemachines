let a = 150;
let b = 100;
let c;

function setup() {
  createCanvas(400, 400);
  c = sqrt(a*a + b*b);
}

function draw() {
  background(220);

  let movablePointX = constrain(mouseX, 0, width);
  let movablePointY = constrain(mouseY, 0, height);
  
  a = movablePointX;
  b = height - movablePointY;
  c = sqrt(a*a + b*b);

  fill(100, 100, 255, 150);
  rect(0, height, a, -b); // Draw the rectangle representing 'a' and 'b'

  stroke(255, 0, 0);
  line(0, height, movablePointX, movablePointY); // Hypotenuse

  fill(0);
  text(`a: ${round(a)}`, a / 2 - 20, height - 10);
  text(`b: ${round(b)}`, a + 10, height - (b / 2));
  text(`c: ${round(c)}`, a / 2 - 30, height - (b / 2));

  text('Drag the red point to change the values of a and b', 10, 10);
  ellipse(movablePointX, movablePointY, 8); // Movable point
}

function mouseDragged() {
  redraw();
}
