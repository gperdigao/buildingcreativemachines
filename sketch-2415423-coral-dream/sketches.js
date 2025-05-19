let cols = 100;
let rows = 100;
let noiseScale = 0.1;
let zOff = 0;

function setup() {
  createCanvas(800, 800);
  noFill();
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
}

function draw() {
  background(0, 0, 10, 10); // Adding subtle fade effect

  let colorStart = color(220, 60, 90, 100); // Purple hue
  let colorMid = color(330, 80, 90, 100);   // Pink hue
  let colorEnd = color(40, 80, 90, 100);    // Orange hue

  for (let y = 0; y < rows; y++) {
    beginShape();
    for (let x = 0; x < cols; x++) {
      let xOff = map(x, 0, cols, 0, width);
      let yOff = map(y, 0, rows, 0, height);

      // Perlin noise to create undulating form
      let noiseVal = noise(x * noiseScale, y * noiseScale, zOff);
      let size = map(noiseVal, 0, 1, 0, 50); // Adjust size for more texture

      // Position based on noise
      let posX = xOff + size * sin(noiseVal * TWO_PI);
      let posY = yOff + size * cos(noiseVal * TWO_PI);

      // Smooth color gradient mapping
      let lerpAmt = map(y, 0, rows, 0, 1);
      let lerpedColor;
      if (lerpAmt < 0.5) {
        lerpedColor = lerpColor(colorStart, colorMid, lerpAmt * 2);
      } else {
        lerpedColor = lerpColor(colorMid, colorEnd, (lerpAmt - 0.5) * 2);
      }

      stroke(lerpedColor);
      strokeWeight(0.5);
      curveVertex(posX, posY);
    }
    endShape();
  }

  zOff += 0.01; // Animate noise for smooth wave effect
}
