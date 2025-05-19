let sunPos;
let earthAngle = 0;
let moonAngle = 0;
let earthOrbitRadiusX;
let earthOrbitRadiusY;
let moonOrbitRadius;
let sunSize;
let earthSize;
let moonSize;
let stars = [];
let textSizeValue;

function setup() {
  createCanvas(windowWidth, windowHeight);
  sunPos = createVector(width / 2, height / 2);

  // Set Earth's orbit as an ellipse
  earthOrbitRadiusX = min(width, height) * 0.35; // Major axis
  earthOrbitRadiusY = earthOrbitRadiusX * 0.9;  // Minor axis

  moonOrbitRadius = earthOrbitRadiusX * 0.1;

  sunSize = min(width, height) * 0.1;
  earthSize = sunSize * 0.2;
  moonSize = earthSize * 0.5;

  textSizeValue = min(width, height) * 0.02;

  // Generate stars for the background
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3)
    });
  }
}

function draw() {
  background(0);

  // Draw stars
  noStroke();
  fill(255);
  for (let star of stars) {
    ellipse(star.x, star.y, star.size);
  }

  // Update angles for Earth's and Moon's orbits
  let time = millis() / 1000;
  earthAngle = time * 0.5;
  moonAngle = time * 5;

  // Calculate Earth's elliptical position
  let earthX = sunPos.x + earthOrbitRadiusX * cos(earthAngle);
  let earthY = sunPos.y + earthOrbitRadiusY * sin(earthAngle);
  let moonX = earthX + moonOrbitRadius * cos(moonAngle);
  let moonY = earthY + moonOrbitRadius * sin(moonAngle);

  // Draw Earth's elliptical orbit with dashed lines
  noFill();
  stroke(255, 255, 0, 100);
  strokeWeight(1);
  drawingContext.setLineDash([5, 15]);
  ellipse(sunPos.x, sunPos.y, earthOrbitRadiusX * 2, earthOrbitRadiusY * 2);
  stroke(0, 0, 255, 100);
  ellipse(earthX, earthY, moonOrbitRadius * 2);
  drawingContext.setLineDash([]);

  // Draw the Sun with a radial gradient
  let ctx = drawingContext;
  let gradient = ctx.createRadialGradient(
    sunPos.x, sunPos.y, 0,
    sunPos.x, sunPos.y, sunSize / 2
  );
  gradient.addColorStop(0, 'yellow');
  gradient.addColorStop(0.5, 'orange');
  gradient.addColorStop(1, 'red');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(sunPos.x, sunPos.y, sunSize / 2, 0, TWO_PI);
  ctx.fill();
  ctx.fillStyle = null;

  // Draw Earth and Moon
  fill(0, 102, 204);
  noStroke();
  ellipse(earthX, earthY, earthSize);
  fill(200);
  ellipse(moonX, moonY, moonSize);

  // Add labels
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(textSizeValue);
  text('Sun', sunPos.x, sunPos.y - sunSize / 2 - textSizeValue);
  text('Earth', earthX, earthY - earthSize / 2 - textSizeValue);
  text('Moon', moonX, moonY - moonSize / 2 - textSizeValue);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sunPos.set(width / 2, height / 2);

  // Recalculate scales on window resize
  earthOrbitRadiusX = min(width, height) * 0.35; // Major axis
  earthOrbitRadiusY = earthOrbitRadiusX * 0.9;   // Minor axis
  moonOrbitRadius = earthOrbitRadiusX * 0.1;

  sunSize = min(width, height) * 0.1;
  earthSize = sunSize * 0.2;
  moonSize = earthSize * 0.5;

  textSizeValue = min(width, height) * 0.02;

  // Regenerate stars for the new window size
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3)
    });
  }
}
