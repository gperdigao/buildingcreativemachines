// Epic Minimal Filters

let filters = ['BLUR', 'THRESHOLD', 'INVERT', 'GRAY', 'POSTERIZE'];
let currentFilter = 0;
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(2);
  frameRate(60);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  // wave count based on mouseX position
  let waves = map(mouseX, 0, width, 1, 10);
  let radiusBase = min(width, height) * 0.3;

  stroke(255, 200);
  beginShape();
  for (let angle = 0; angle < TWO_PI; angle += 0.02) {
    let r = radiusBase + 50 * sin(waves * angle + t);
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);

  t += 0.02;

  // apply selected filter
  switch (filters[currentFilter]) {
    case 'BLUR': filter(BLUR, 3); break;
    case 'THRESHOLD': filter(THRESHOLD, 0.5); break;
    case 'INVERT': filter(INVERT); break;
    case 'GRAY': filter(GRAY); break;
    case 'POSTERIZE': filter(POSTERIZE, 4); break;
  }

  // instruction overlay
  noStroke(); fill(255, 180);
  textSize(14);
  textAlign(LEFT, TOP);
  text(`Click to change filter (${filters[currentFilter]})\nMouse to adjust frequency`, 10, 10);
}

function mousePressed() {
  currentFilter = (currentFilter + 1) % filters.length;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
