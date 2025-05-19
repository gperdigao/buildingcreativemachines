let globeTexture;

function preload() {
  // Load the Earth texture image
  globeTexture = loadImage('earth_texture.jpg'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function drawStars(numStars) {
  push();
  noStroke();
  fill(255);
  for (let i = 0; i < numStars; i++) {
    let x = random(-width, width);
    let y = random(-height, height);
    let z = random(-width, width);
    push();
    translate(x, y, z);
    sphere(1);
    pop();
  }
  pop();
}

function draw() {
  background(0);

  // Draw stars
  push();
  translate(0, 0, 0);
  drawStars(0);
  pop();

  // Set up lighting
ambientLight(30);
pointLight(255, 255, 255, 0, -height / 2, 200);

  // Rotate the globe over time
  rotateY(millis() / 4000);

  // Apply the texture and draw the sphere
  texture(globeTexture);
  sphere(min(width, height) / 3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


