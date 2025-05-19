let sliders = {};
let params = {
  sigma: 10,
  rho: 28,
  beta: 8 / 3
};

let x = 0.1;
let y = 0;
let z = 0;

let dt = 0.01;

function setup() {
  // Create the canvas
  createCanvas(800, 600);
  
  // Create sliders with labels and position them below the canvas
  createSliderWithLabel('Sigma (σ)', 0, 50, params.sigma, 0.1, 'sigma', 10);
  createSliderWithLabel('Rho (ρ)', 0, 50, params.rho, 0.1, 'rho', 60);
  createSliderWithLabel('Beta (β)', 0, 10, params.beta, 0.1, 'beta', 110);
  
  // Set background to black
  background(0);
}

function draw() {
  // Update parameters from sliders
  params.sigma = sliders['sigma'].value();
  params.rho = sliders['rho'].value();
  params.beta = sliders['beta'].value();
  
  // Calculate the next point in the Lorenz system
  let dx = params.sigma * (y - x) * dt;
  let dy = (x * (params.rho - z) - y) * dt;
  let dz = (x * y - params.beta * z) * dt;
  
  x += dx;
  y += dy;
  z += dz;
  
  // Map x and y to screen coordinates
  let scaleFactor = 10;
  let screenX = map(x, -30, 30, 0, width);
  let screenY = map(y, -30, 30, height, 0);
  
  // Draw the point
  stroke(0, 255, 255);
  strokeWeight(2);
  point(screenX, screenY);
  
  // Optional: Implement trail effect by using semi-transparent background
  // Uncomment the following line to enable trails
  // background(0, 20);
}

function createSliderWithLabel(labelText, min, max, initial, step, key, yPosition) {
  // Create a label
  let label = createP(labelText);
  label.style('color', '#FFFFFF'); // White color for readability
  label.position(50, height - 150 + yPosition); // Adjust positions based on yPosition
  label.style('font-size', '14px');
  
  // Create a slider
  sliders[key] = createSlider(min, max, initial, step);
  sliders[key].style('width', '200px');
  sliders[key].position(250, height - 135 + yPosition); // Position sliders next to labels
}
