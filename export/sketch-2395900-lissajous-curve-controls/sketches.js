let time = 0;
let wave = [];
let sliders = {};
let params = {
  freqX: 3,
  freqY: 2,
  phase: 0,
  amplitudeX: 75,
  amplitudeY: 75,
  speed: 0.02
};

function setup() {
  // Create the canvas
  createCanvas(800, 500); // Increased height to accommodate sliders
  
  // Create sliders with labels and position them below the canvas
  createSliderWithLabel('Frequency X', 1, 10, params.freqX, 1, 'freqX', 10);
  createSliderWithLabel('Frequency Y', 1, 10, params.freqY, 1, 'freqY', 60);
  createSliderWithLabel('Phase Shift', 0, TWO_PI, params.phase, 0.01, 'phase', 110);
  createSliderWithLabel('Amplitude X', 50, 150, params.amplitudeX, 1, 'amplitudeX', 160);
  createSliderWithLabel('Amplitude Y', 50, 150, params.amplitudeY, 1, 'amplitudeY', 210);
  createSliderWithLabel('Speed', 0.01, 0.1, params.speed, 0.005, 'speed', 260);
  
  // Set the initial background
  background(0);
}

function draw() {
  background(0, 50); // Semi-transparent background for trail effect
  translate(150, height / 2 - 50); // Adjusted translation for increased canvas height

  // Update parameters from sliders
  params.freqX = sliders.freqX.value();
  params.freqY = sliders.freqY.value();
  params.phase = sliders.phase.value();
  params.amplitudeX = sliders.amplitudeX.value();
  params.amplitudeY = sliders.amplitudeY.value();
  params.speed = sliders.speed.value();

  // Draw X oscillation
  let xPrev = 0;
  let xRadius = params.amplitudeX;
  stroke(255, 100);
  noFill();
  ellipse(xPrev, 0, xRadius * 2);
  let x = xRadius * cos(params.freqX * time);
  stroke(255);
  line(xPrev, 0, x, 0);
  fill(255);
  ellipse(x, 0, 8);

  // Draw Y oscillation
  let yPrev = 0;
  let yRadius = params.amplitudeY;
  stroke(255, 100);
  noFill();
  ellipse(x, 0, yRadius * 2);
  let y = yRadius * sin(params.freqY * time + params.phase);
  stroke(255);
  line(x, yPrev, x, y);
  fill(255);
  ellipse(x, y, 8);

  // Draw the resulting wave
  wave.unshift(y);

  translate(200, 0);
  stroke(255);
  line(x, y, 0, wave[0]);

  // Draw the Lissajous curve
  beginShape();
  noFill();
  stroke(0, 255, 0);
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();

  time += params.speed;

  // Limit the wave array length
  if (wave.length > width - 200) {
    wave.pop();
  }
}

// Function to create a slider with its label and position it
function createSliderWithLabel(labelText, min, max, initial, step, key, yPosition) {
  // Create a label
  let label = createP(labelText);
  label.style('color', '#fff');
  label.position(10, height - 240 + yPosition); // Adjusted position based on yPosition
  
  // Create a slider
  sliders[key] = createSlider(min, max, initial, step);
  sliders[key].style('width', '150px');
  sliders[key].position(100, height - 230 + yPosition); // Position slider next to label
}
