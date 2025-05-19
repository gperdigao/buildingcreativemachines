let drips = [];
let splatterFunctions = [];

function setup() {
  createCanvas(800, 800);
  background(255);
  colorMode(HSB, 360, 100, 100, 100);
  splatterFunctions = [drawSplatter, drawSpray, drawBlob, drawDrip, drawStroke];
}

function draw() {
  // Generate random splatters over time
  if (frameCount % 10 == 0) {
    let x = random(width);
    let y = random(height);
    let size = random(20, 100);
    let splatterFunction = random(splatterFunctions);
    splatterFunction(x, y, size);
  }

  // Animate drips
  for (let i = drips.length - 1; i >= 0; i--) {
    let drip = drips[i];
    stroke(drip.hue, drip.saturation, drip.brightness, drip.alpha);
    strokeWeight(drip.weight);
    line(drip.x, drip.currentY - 1, drip.xEnd, drip.currentY);
    drip.currentY += 2;
    if (drip.currentY >= drip.yEnd) {
      drips.splice(i, 1);
    }
  }
}

function drawSplatter(x, y, size) {
  let points = floor(random(50, 150));
  for (let i = 0; i < points; i++) {
    let angle = random(TWO_PI);
    let radius = random(size * 0.2, size);
    let xOffset = cos(angle) * radius;
    let yOffset = sin(angle) * radius;
    let hue = random(360);
    let saturation = random(50, 100);
    let brightness = random(50, 100);
    let alpha = random(50, 100);
    noStroke();
    fill(hue, saturation, brightness, alpha);
    let ellipseSize = random(2, 10);
    ellipse(x + xOffset, y + yOffset, ellipseSize, ellipseSize);
  }
}

function drawSpray(x, y, size) {
  let points = floor(random(100, 300));
  for (let i = 0; i < points; i++) {
    let angle = random(TWO_PI);
    let radius = abs(randomGaussian(0, size / 2));
    let xOffset = cos(angle) * radius;
    let yOffset = sin(angle) * radius;
    let hue = random(360);
    let saturation = random(50, 100);
    let brightness = random(50, 100);
    let alpha = random(20, 80);
    noStroke();
    fill(hue, saturation, brightness, alpha);
    let ellipseSize = random(1, 5);
    ellipse(x + xOffset, y + yOffset, ellipseSize, ellipseSize);
  }
}

function drawBlob(x, y, size) {
  let hue = random(360);
  let saturation = random(50, 100);
  let brightness = random(50, 100);
  let alpha = random(80, 100);
  noStroke();
  fill(hue, saturation, brightness, alpha);
  ellipse(x, y, size * random(0.8, 1.2), size * random(0.8, 1.2));
}

function drawDrip(x, y) {
  let dripLength = random(20, 100);
  let hue = random(360);
  let saturation = random(50, 100);
  let brightness = random(50, 100);
  let alpha = random(80, 100);
  let weight = random(2, 5);
  let xEnd = x + random(-10, 10);
  drips.push({
    x: x,
    y: y,
    xEnd: xEnd,
    yEnd: y + dripLength,
    currentY: y,
    hue: hue,
    saturation: saturation,
    brightness: brightness,
    alpha: alpha,
    weight: weight
  });
}

function drawStroke(x, y, size) {
  let hue = random(360);
  let saturation = random(50, 100);
  let brightness = random(50, 100);
  let alpha = random(80, 100);
  stroke(hue, saturation, brightness, alpha);
  strokeWeight(size * random(0.1, 0.3));
  noFill();
  let angle = random(TWO_PI);
  let length = size * random(0.5, 1.5);
  let xEnd = x + cos(angle) * length;
  let yEnd = y + sin(angle) * length;
  line(x, y, xEnd, yEnd);
}

function mousePressed() {
  let size = random(20, 100);
  let splatterFunction = random(splatterFunctions);
  splatterFunction(mouseX, mouseY, size);
}

function mouseDragged() {
  let size = random(20, 100);
  let splatterFunction = random(splatterFunctions);
  splatterFunction(mouseX, mouseY, size);
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    background(255);
  }
}
