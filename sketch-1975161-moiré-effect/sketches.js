let angle = 0;  // Rotation angle
let spacing = 10;  // Space between lines

function setup() {
  createCanvas(800, 800);
  background(0);
  stroke(255);  // Set line color to white
}

function draw() {
  background(0);
  
  // Draw first set of lines
  for (let x = 0; x < width; x += spacing) {
    line(x, 0, x, height);
  }
  
  push();  // Save current transformation matrix
  translate(width / 2, height / 2);  // Move origin to center of canvas
  rotate(angle);  // Rotate by angle
  
  // Draw second set of lines
  for (let x = -width / 2; x < width / 2; x += spacing) {
    line(x, -height / 2, x, height / 2);
  }
  
  pop();  // Restore transformation matrix
  
  angle += 0.01;  // Increment angle
}

function mousePressed() {
  // When mouse is pressed, reset angle to 0 and change line spacing
  angle = 0;
  spacing = random(5, 20);
}
