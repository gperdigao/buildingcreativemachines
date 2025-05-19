let angle = 0;
let radius;
let waveOffset = 150;
let sineWave = [];
let cosineWave = [];
let speedSlider;

function setup() {
  createCanvas(800, 400);
  radius = 100;
  
  // Create a slider for adjusting speed of animation
  speedSlider = createSlider(0.01, 0.1, 0.03, 0.01);
  speedSlider.position(20, 20);
  speedSlider.style('width', '100px');
}

function draw() {
  background(0);
  
  let speed = speedSlider.value(); // Get the speed from the slider

  // Draw the unit circle
  translate(150, height / 2);
  stroke(255);
  strokeWeight(1);
  noFill();
  ellipse(0, 0, radius * 2, radius * 2); // Circle outline

  // Calculate current sine and cosine values based on a "north" starting point (rotate by HALF_PI)
  let x = radius * cos(angle - HALF_PI);
  let y = radius * sin(angle - HALF_PI);

  // Draw the point on the circle
  fill(255, 0, 0);
  ellipse(x, y, 10, 10);

  // Draw horizontal and vertical lines from the circle point to the axes
  stroke(255, 100);
  line(x, y, x, 0); // Vertical to x-axis (cosine)
  line(x, y, 0, y); // Horizontal to y-axis (sine)

  // Draw axes labels
  noStroke();
  fill(255);
  textSize(16);
  text("Cosine", x / 2 - 20, 20); // Label cosine on x-axis
  text("Sine", -40, y / 2 + 5);  // Label sine on y-axis

  // Plot the Sine Wave
  stroke(0, 255, 0);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < sineWave.length; i++) {
    vertex(i + 300, sineWave[i]);
  }
  endShape();

  // Plot the Cosine Wave
  stroke(0, 0, 255);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < cosineWave.length; i++) {
    vertex(i + 300, cosineWave[i] + waveOffset);
  }
  endShape();

  // Add current sine and cosine values to the waves
  sineWave.push(y);
  cosineWave.push(x);

  // Remove old points from the waves to keep them smooth and scrolling
  if (sineWave.length > width - 300) {
    sineWave.splice(0, 1);
    cosineWave.splice(0, 1);
  }

  // Show the text for the angle in terms of Pi
  noStroke();
  fill(255);
  textSize(20);
  let piFraction = (angle / PI).toFixed(2);
  text(`Angle: ${piFraction}π`, -50, -radius - 20);
  text(`Sine: ${sin(angle - HALF_PI).toFixed(2)}`, -50, -radius - 50);
  text(`Cosine: ${cos(angle - HALF_PI).toFixed(2)}`, -50, -radius - 80);

  // Animate the angle smoothly with the speed from slider
  angle += speed;

  // Reset the angle after a full revolution (0 to 2π)
  if (angle > TWO_PI) {
    angle = 0;
  }

  // Display the speed from the slider
  fill(255);
  textSize(16);
  text(`Speed: ${speed.toFixed(2)}`, 20, 60);
}
