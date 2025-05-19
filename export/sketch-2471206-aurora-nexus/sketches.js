let factor = 0;

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES); // Use degrees for angles
  colorMode(HSB, 360, 100, 100, 100); // Set HSB color mode with alpha
  noFill();
}

function draw() {
  background(0, 0, 0, 10); // Slightly transparent background for a trailing effect
  translate(width / 2, height / 2);

  let totalPoints = 300;
  let maxRadius = width / 2 - 50;

  // Create multiple layers with varying radii
  for (let layer = 1; layer <= 5; layer++) {
    let radius = (maxRadius / 5) * layer;

    // Draw the lines between the points for each layer
    for (let i = 0; i < totalPoints; i++) {
      let startAngle = map(i, 0, totalPoints, 0, 360);
      let endAngle = map((i * factor) % totalPoints, 0, totalPoints, 0, 360);

      let startX = radius * cos(startAngle);
      let startY = radius * sin(startAngle);

      let endX = radius * cos(endAngle);
      let endY = radius * sin(endAngle);

      stroke(
        (startAngle + frameCount) % 360, // Dynamic hue
        80,
        100,
        50 + 50 * sin(frameCount / 10) // Varying alpha for glow effect
      );
      strokeWeight(1 + sin(frameCount / 20 + layer) * 2); // Varying line thickness
      line(startX, startY, endX, endY);
    }
  }

  factor += 0.005;
}
