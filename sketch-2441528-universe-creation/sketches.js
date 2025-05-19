let colors = [];
let maxLayers = 15;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noCursor();
  strokeWeight(1);
  angleMode(DEGREES);

  // Generate a vibrant color palette
  for (let i = 0; i < 360; i += 20) {
    colors.push(color(`hsb(${i}, 100%, 100%)`));
  }
}

function draw() {
  background(0);
  orbitControl(); // Enable mouse control for rotation
  rotateX(time * 0.2);
  rotateY(time * 0.1);

  for (let i = 0; i < maxLayers; i++) {
    push();
    rotateY(frameCount * 0.5 + i * 10);
    rotateX(frameCount * 0.3 + i * 15);
    stroke(colors[i % colors.length]);

    // Draw the complex 3D shape
    beginShape(POINTS);
    for (let theta = 0; theta < 360; theta += 5) {
      for (let phi = 0; phi < 180; phi += 5) {
        let r = 200 * sin((mouseX * 0.01 + i) * theta) * cos((mouseY * 0.01 + i) * phi);
        let x = r * sin(phi) * cos(theta);
        let y = r * sin(phi) * sin(theta);
        let z = r * cos(phi);
        vertex(x, y, z);
      }
    }
    endShape();
    pop();
  }
  time += 0.02;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
