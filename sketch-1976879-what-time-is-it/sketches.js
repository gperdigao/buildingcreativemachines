let angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES); // Change the mode to DEGREES
}

function draw() {
  background(0);
  translate(width / 2, height / 2); // Move the origin to the center
  rotate(-90); // Rotate 90 degrees counter-clockwise
  
  let hr = hour();
  let mn = minute();
  let sc = second();
  
  strokeWeight(8);
  noFill();
  
  // Draw the second hand
  stroke(255, 100, 150); // Red
  let secondAngle = map(sc, 0, 60, 0, 360);
  arc(0, 0, 300, 300, 0, secondAngle);
  
  // Draw the minute hand
  stroke(150, 100, 255); // Blue
  let minuteAngle = map(mn, 0, 60, 0, 360);
  arc(0, 0, 280, 280, 0, minuteAngle);
  
  // Draw the hour hand
  stroke(150, 255, 100); // Green
  let hourAngle = map(hr % 12, 0, 12, 0, 360);
  arc(0, 0, 260, 260, 0, hourAngle);
  
  push();
  rotate(secondAngle);
  stroke(255, 100, 150); // Red
  line(0, 0, 100, 0);
  pop();
  
  push();
  rotate(minuteAngle);
  stroke(150, 100, 255); // Blue
  line(0, 0, 75, 0);
  pop();
  
  push();
  rotate(hourAngle);
  stroke(150, 255, 100); // Green
  line(0, 0, 50, 0);
  pop();
  
  stroke(255);
  point(0, 0);
}
