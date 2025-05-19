let points = [];
let hull = [];
let counter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  let buffer = 20;
  for (let i = 0; i < 100; i++) {
    points.push(createVector(random(buffer, width - buffer), random(buffer, height - buffer)));
  }
  points.sort((a, b) => a.x - b.x);
  hull.push(points[0]);
  hull.push(points[1]);
  points.splice(0, 2);
  
  frameRate(2); // Setting the frame rate to 2 frames per second
}

function grahamScan() {
  if (counter < points.length) {
    let index = -1;
    for (let i = 0; i < hull.length; i++) {
      let p = hull[i];
      let q = hull[(i + 1) % hull.length];
      let r = points[counter];
      let val = (q.x - p.x) * (r.y - q.y) - (q.y - p.y) * (r.x - q.x);
      if (val > 0) {
        index = i;
      }
    }
    if (index != -1) {
      hull.splice(index + 1, 0, points[counter]);
    }
    counter++;
  }
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(8);
  for (let p of points) {
    point(p.x, p.y);
  }
  grahamScan();
  stroke(0, 255, 0);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let v of hull) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
}
