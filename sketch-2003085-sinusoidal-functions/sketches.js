let angle = 0;
let speed = 0.05;
let circleRadius = 100;
let waveLength = 200;

function setup() {
  createCanvas(600, 400);
  createP("Adjust Speed:");
  let speedSlider = createSlider(0, 0.2, 0.05, 0.01);
  speedSlider.input(() => {
    speed = speedSlider.value();
  });
}

function draw() {
  background(220);

  // Draw the circle for unit circle representation
  translate(width / 4, height / 2);
  stroke(50);
  noFill();
  ellipse(0, 0, circleRadius * 2);

  // Calculate x, y for the rotating line
  let x = circleRadius * cos(angle);
  let y = circleRadius * sin(angle);

  // Draw rotating line
  strokeWeight(2);
  line(0, 0, x, y);

  // Draw horizontal cosine line
  stroke(255, 0, 0); // Red for cosine
  line(x, 0, x, y);

  // Draw vertical sine line
  stroke(0, 0, 255); // Blue for sine
  line(0, y, x, y);

  // Draw sine wave
  stroke(0, 0, 255); // Blue for sine
  for (let i = 0; i < waveLength; i++) {
    let sinVal = sin(angle + (speed * i));
    point(circleRadius + 50 + i, sinVal * circleRadius);
  }

  // Draw cosine wave
  stroke(255, 0, 0); // Red for cosine
  for (let i = 0; i < waveLength; i++) {
    let cosVal = cos(angle + (speed * i));
    point(circleRadius + 50 + i, cosVal * circleRadius);
  }

  angle += speed;
}
