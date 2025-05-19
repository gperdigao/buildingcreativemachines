let sliders = {};
let params = {
  R: 150,    // Radius of the fixed circle
  r: 75,     // Radius of the rolling circle
  d: 100,    // Distance from the center of the rolling circle to the tracing point
};

let theta = 0;      // Angle parameter
let rotationSpeed = 0.02; // Speed of rotation

let wave = [];      // Array to store wave points

function setup() {
  // Create the canvas
  createCanvas(800, 600); // Increased height to accommodate sliders
  
  // Create sliders with labels and position them below the canvas
  createSliderWithLabel('R (Fixed Circle Radius)', 50, 300, params.R, 1, 'R', 10);
  createSliderWithLabel('r (Rolling Circle Radius)', 10, 150, params.r, 1, 'r', 60);
  createSliderWithLabel('d (Tracing Point Distance)', 10, 200, params.d, 1, 'd', 110);
  
  // Set the initial background
  background(0);
}

function draw() {
  background(0, 20); // Semi-transparent background for trail effect
  
  // Update parameters from sliders
  params.R = sliders['R'].value();
  params.r = sliders['r'].value();
  params.d = sliders['d'].value();
  
  // Translate to the center of the canvas
  translate(width / 2, height / 2 - 50);
  
  // Calculate current position using Hypotrochoid equations
  let x = (params.R - params.r) * cos(theta) + params.d * cos(((params.R - params.r) / params.r) * theta);
  let y = (params.R - params.r) * sin(theta) - params.d * sin(((params.R - params.r) / params.r) * theta);
  
  // Draw the fixed circle
  noFill();
  stroke(255, 100);
  strokeWeight(1);
  ellipse(0, 0, params.R * 2);
  
  // Calculate the position of the rolling circle
  let rollingX = (params.R - params.r) * cos(theta);
  let rollingY = (params.R - params.r) * sin(theta);
  
  // Draw the rolling circle
  stroke(255, 100);
  ellipse(rollingX, rollingY, params.r * 2);
  
  // Draw the line from the center of the rolling circle to the tracing point
  stroke(255);
  line(rollingX, rollingY, x, y);
  
  // Draw the tracing point
  fill(255);
  noStroke();
  ellipse(x, y, 5);
  
  // Store the y-coordinate for the wave
  wave.unshift(y);
  
  // Translate to draw the wave on the side
  push();
  translate(params.R + 50, 0);
  
  // Draw the wave line
  stroke(0, 255, 255);
  line(0, 0, 0, wave[0]);
  
  // Draw the wave
  beginShape();
  noFill();
  stroke(0, 255, 255);
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();
  pop();
  
  // Increment theta
  theta += rotationSpeed;
  
  // Limit the wave array length
  if (wave.length > width - (params.R * 2)) {
    wave.pop();
  }
}

// Function to create a slider with its label and position it
function createSliderWithLabel(labelText, min, max, initial, step, key, yPosition) {
  // Create a label
  let label = createP(labelText);
  label.style('color', '#BBBBBB');
  label.position(50, height - 200 + yPosition); // Position labels below the canvas
  label.style('font-size', '14px');
  
  // Create a slider
  sliders[key] = createSlider(min, max, initial, step);
  sliders[key].style('width', '200px');
  sliders[key].position(250, height - 185 + yPosition); // Position sliders next to labels
}
