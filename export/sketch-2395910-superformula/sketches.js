let sliders = {};
let params = {
  m: 6,
  a: 1,
  b: 1,
  n1: 1,
  n2: 7,
  n3: 1.5
};

let angle = 0;

function setup() {
  // Create the canvas
  createCanvas(800, 600); // Increased height to accommodate sliders
  
  // Create sliders with labels and position them below the canvas
  createSliderWithLabel('m (Symmetry)', 0, 12, params.m, 1, 'm', 10);
  createSliderWithLabel('a (Scale X)', 0.1, 2, params.a, 0.1, 'a', 60);
  createSliderWithLabel('b (Scale Y)', 0.1, 2, params.b, 0.1, 'b', 110);
  createSliderWithLabel('n1 (Shape)', 0.1, 10, params.n1, 0.1, 'n1', 160);
  createSliderWithLabel('n2 (Shape)', 0.1, 10, params.n2, 0.1, 'n2', 210);
  createSliderWithLabel('n3 (Shape)', 0.1, 10, params.n3, 0.1, 'n3', 260);
  
  // Set the initial background
  background(0);
}

function draw() {
  background(0, 20); // Semi-transparent background for trail effect
  
  // Translate to the center of the canvas
  translate(width / 2, height / 2 - 50);
  
  // Apply rotation for dynamic effect
  rotate(angle);
  
  // Update parameters from sliders
  params.m = sliders['m'].value();
  params.a = sliders['a'].value();
  params.b = sliders['b'].value();
  params.n1 = sliders['n1'].value();
  params.n2 = sliders['n2'].value();
  params.n3 = sliders['n3'].value();
  
  // Draw the Superformula shape
  noFill();
  stroke(0, 255, 255);
  strokeWeight(2);
  beginShape();
  for (let theta = 0; theta < TWO_PI; theta += 0.01) {
    let r = superformula(theta, params);
    let x = r * cos(theta);
    let y = r * sin(theta);
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Increment the rotation angle
  angle += 0.005;
}

// Function to compute the Superformula
function superformula(theta, params) {
  let part1 = abs((1 / params.a) * cos(params.m * theta / 4));
  part1 = pow(part1, params.n2);
  
  let part2 = abs((1 / params.b) * sin(params.m * theta / 4));
  part2 = pow(part2, params.n3);
  
  let r = pow(part1 + part2, -1 / params.n1);
  return r;
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
  sliders[key].position(200, height - 185 + yPosition); // Position sliders next to labels
}
