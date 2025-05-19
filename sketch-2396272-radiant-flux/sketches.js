let layers = [];
let numLayers = 5;
let angleOffset = 0;
let colorPalette = [];

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  noFill();
  
  // Define a vibrant color palette
  colorPalette = [
    color('#FF3CAC'),
    color('#784BA0'),
    color('#2B86C5'),
    color('#56ab2f'),
    color('#f2994a'),
    color('#eb3349'),
    color('#34e89e')
  ];
  
  // Initialize layers with varying properties
  for (let i = 0; i < numLayers; i++) {
    layers.push(new Layer(
      map(i, 0, numLayers, 50, width / 2),
      map(i, 0, numLayers, 3, 1),
      random(3, 6),
      random(colorPalette)
    ));
  }
  
  background(10);
}

function draw() {
  background(10, 20); // Semi-transparent background for motion trails
  
  translate(width / 2, height / 2);
  
  for (let layer of layers) {
    layer.update();
    layer.display();
  }
  
  // Interactive rotation based on mouse position
  let rotationSpeed = map(mouseX, 0, width, -5, 5);
  rotate(rotationSpeed);
}

class Layer {
  constructor(radius, speed, detail, clr) {
    this.radius = radius;
    this.speed = speed;
    this.detail = detail; // Number of points in the polygon
    this.angle = random(360);
    this.clr = clr;
    this.noiseOffset = random(1000);
    this.noiseIncrement = 0.005;
  }
  
  update() {
    this.angle += this.speed;
    // Slight perturbation using noise for organic movement
    this.noiseOffset += this.noiseIncrement;
    this.currentRadius = this.radius + noise(this.noiseOffset) * 20;
  }
  
  display() {
    stroke(this.clr);
    strokeWeight(2);
    beginShape();
    for (let a = 0; a < 360; a += 360 / this.detail) {
      let x = this.currentRadius * cos(a + this.angle);
      let y = this.currentRadius * sin(a + this.angle);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('RadiantFlux', 'png');
  }
}
