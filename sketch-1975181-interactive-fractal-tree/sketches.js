let angle;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB);
}

function draw() {
  background(0);
  angle = map(mouseX, 0, width, 0, PI); // Change angle based on mouse's x position
  let len = 150; // Length of the trunk
  stroke(255);
  translate(width / 2, height); // Start the tree from the bottom of the screen
  branch(len);
}

function branch(len) {
  let sw = map(len, 2, 150, 1, 10); // Change stroke weight based on branch length
  strokeWeight(sw);
  
  let h = map(len, 2, 150, 0, 255); // Change hue based on branch length
  stroke(h, 255, 255);
  
  line(0, 0, 0, -len); // Draw the branch
  translate(0, -len); // Move to the end of the branch
  
  len *= 0.67; // Each branch is 2/3rds the size of the previous one
  
  if (len > 2) { // If the length is greater than 2, branch again
    push(); // Save the current state of transformation (i.e., where we are now)
    rotate(angle); // Rotate by a certain angle
    branch(len); // Draw a new branch to the right
    pop(); // Go back to where we were before we rotated
    push(); // Save the current state of transformation
    rotate(-angle); // Rotate by a certain angle in the other direction
    branch(len); // Draw a new branch to the left
    pop(); // Go back to where we were before we rotated
  }
}
