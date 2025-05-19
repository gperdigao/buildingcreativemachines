let a = -1.4;
let b = 1.6;
let c = 1.0;
let d = 0.7;

let x, y;
let points = [];

function setup() {
  createCanvas(800, 800);
  background(0);
  colorMode(HSB, 360, 100, 100, 100);
  x = random(-1, 1);
  y = random(-1, 1);
  
  // Generate points
  for (let i = 0; i < 1000000; i++) {
    let x1 = Math.sin(a * y) + c * Math.cos(a * x);
    let y1 = Math.sin(b * x) + d * Math.cos(b * y);
    x = x1;
    y = y1;
    points.push({ x: x, y: y });
  }
}

function draw() {
  background(0, 0, 0, 10); // Slight fade for trailing effect

  translate(width / 2, height / 2);
  scale(180); // Scale up the attractor for better visibility

  noStroke();
  
  for (let i = 0; i < points.length; i++) {
    let px = points[i].x;
    let py = points[i].y;
    let hue = map(i, 0, points.length, 0, 360);
    fill(hue, 80, 100, 50);
    ellipse(px, py, 0.005, 0.005);
  }

  noLoop(); // Stop draw() after rendering all points
}
