let factor = 0;

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES); // Change the angle mode to DEGREES
  colorMode(HSB);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  stroke(255);
  
  let totalPoints = 200;
  let radius = width / 2 - 50;
  
  // Draw the points on the circle
  for (let i = 0; i < totalPoints; i++) {
    let angle = map(i, 0, totalPoints, 0, 360);
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    point(x, y);
  }
  
  // Draw the lines between the points
  for (let i = 0; i < totalPoints; i++) {
    let startAngle = map(i, 0, totalPoints, 0, 360);
    let endAngle = map((i * factor) % totalPoints, 0, totalPoints, 0, 360);
    
    let startX = radius * cos(startAngle);
    let startY = radius * sin(startAngle);
    
    let endX = radius * cos(endAngle);
    let endY = radius * sin(endAngle);
    
    stroke(i, 255, 255);
    line(startX, startY, endX, endY);
  }
  
  factor += 0.005;
}
