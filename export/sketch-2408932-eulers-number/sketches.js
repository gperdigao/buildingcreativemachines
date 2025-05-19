let t = 0;
let aSlider, rSlider;
let points = [];

function setup() {
  createCanvas(800, 400);
  
  // Use a thin, elegant font for labels and text
  textFont('Georgia');
  
  // Sliders for initial value and growth rate
  aSlider = createSlider(1, 10, 1, 0.1); // Initial value slider
  aSlider.position(20, 50);
  aSlider.style('width', '150px');
  
  rSlider = createSlider(0, 2, 0.5, 0.01); // Growth rate slider
  rSlider.position(20, 110);
  rSlider.style('width', '150px');
  
  // Setup for smooth lines
  strokeWeight(1.5);
}

function draw() {
  background(20); // Dark background for elegant contrast
  
  // Get values from sliders
  let a = aSlider.value();  // Initial value
  let r = rSlider.value();  // Growth rate
  
  // Draw axes with thin lines
  stroke(200, 150); // Light gray for elegant axis lines
  line(50, height - 50, width - 50, height - 50); // X axis
  line(50, 50, 50, height - 50);                  // Y axis
  
  // Labels for axes
  noStroke();
  fill(255);
  textSize(14);
  text("Time (t)", width - 100, height - 30);  // X-axis label
  text("Growth (y)", 10, 40);                  // Y-axis label
  
  // Slider labels
  fill(255, 200); // Softer white for labels
  textSize(14);
  text("Initial Value (a):", 20, 40);
  text("Growth Rate (r):", 20, 100);
  
  // Clear previous points for stable animation
  points = [];
  
  // Draw the exponential curve
  stroke(0, 255, 0, 200); // Elegant green curve
  noFill();
  beginShape();
  
  for (let i = 0; i < t; i++) {
    let x = map(i, 0, 200, 50, width - 50); // Mapping time to X axis
    let y = a * exp(r * i / 100);           // Exponential growth formula
    let yPos = map(y, 0, 200, height - 50, 50); // Mapping value to Y axis
    
    points.push(createVector(x, yPos));     // Save point for smooth drawing
    vertex(x, yPos);
  }
  endShape();
  
  // Show the current point on the curve with a small circle
  let currentX = map(t, 0, 200, 50, width - 50);
  let currentY = a * exp(r * t / 100);
  let yPos = map(currentY, 0, 200, height - 50, 50);
  
  fill(255, 0, 0);
  ellipse(currentX, yPos, 8, 8); // Current point on the curve
  
  // Display formula and current values with elegant text
  fill(255);
  textSize(16);
  text(`y = ${a.toFixed(2)} * e^(${r.toFixed(2)} * t)`, 20, 170); // Formula text
  
  // Animate time progression
  t += 1;
  
  // Reset time after exceeding width for continuous animation
  if (t > 200) {
    t = 0;
  }
}
