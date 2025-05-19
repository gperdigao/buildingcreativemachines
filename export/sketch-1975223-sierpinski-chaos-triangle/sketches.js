let points = [];
let current;

function setup() {
  createCanvas(800, 800);
  background(0);
  colorMode(HSB);
  current = createVector(random(width), random(height));
}

function draw() {
  if (points.length > 0) {
    for (let i = 0; i < 100; i++) {
      let next = random(points);
      stroke(next.color);
      strokeWeight(2);
      current.x = lerp(current.x, next.x, 0.5);
      current.y = lerp(current.y, next.y, 0.5);
      point(current.x, current.y);
    }
  }
}

function mousePressed() {
  let point = createVector(mouseX, mouseY);
  point.color = color(random(360), 255, 255);
  points.push(point);
}
