let t = 0;

function setup() {
  createCanvas(800, 800);
  background(0);
  colorMode(HSB, 255); // Change the color mode to HSB and set the maximum hue value to 255
}

function draw() {
  background(0, 0.01); // Semi-transparent background (creates trails)
  translate(width / 2, height / 2); // Move the origin to the center of the canvas

  let a = mouseX / 50; // Use the mouse position to control the frequency of the oscillation along the x axis
  let b = mouseY / 50; // Use the mouse position to control the frequency of the oscillation along the y axis
  let x = 300 * sin(a * t); // Increase the scaling factor to make the curve larger
  let y = 300 * sin(b * t); // Increase the scaling factor to make the curve larger
  
  stroke(frameCount % 255, 255, 255); // Use frameCount to shift the hue over time, creating a rainbow effect
  strokeWeight(6);
  point(x, y);

  t += 0.01; // Increase time
}
