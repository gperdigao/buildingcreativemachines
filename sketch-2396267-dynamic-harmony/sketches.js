let grid = [];
let gridCols = 25;
let gridRows = 25;
let spacing;
let palette = [];
let lineThreshold = 100;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  spacing = width / gridCols;
  
  // Define a vibrant color palette
  palette = [
    color(10, 80, 100, 80),
    color(45, 80, 100, 80),
    color(80, 80, 100, 80),
    color(160, 80, 100, 80),
    color(220, 80, 100, 80),
    color(300, 80, 100, 80)
  ];
  
  // Initialize grid points
  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      let x = i * spacing + spacing / 2;
      let y = j * spacing + spacing / 2;
      grid.push(new GridPoint(x, y));
    }
  }
  background(0);
}

function draw() {
  background(0, 0, 0, 10); // Semi-transparent background for trailing effect
  for (let point of grid) {
    point.update();
    point.display();
  }
  
  // Draw connections
  strokeWeight(1);
  for (let i = 0; i < grid.length; i++) {
    for (let j = i + 1; j < grid.length; j++) {
      let d = dist(grid[i].currentX, grid[i].currentY, grid[j].currentX, grid[j].currentY);
      if (d < lineThreshold) {
        let alpha = map(d, 0, lineThreshold, 100, 0);
        stroke(200, 30, 100, alpha);
        line(grid[i].currentX, grid[i].currentY, grid[j].currentX, grid[j].currentY);
      }
    }
  }
}

class GridPoint {
  constructor(x, y) {
    this.originX = x;
    this.originY = y;
    this.currentX = x;
    this.currentY = y;
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(2000);
    this.noiseSpeed = 0.002;
    this.sizeBase = spacing * 0.3;
    this.sizeVariation = spacing * 0.2;
    this.hue = random(360);
  }
  
  update() {
    // Drift using Perlin noise
    let noiseX = noise(this.noiseOffsetX) - 0.5;
    let noiseY = noise(this.noiseOffsetY) - 0.5;
    this.currentX = this.originX + noiseX * spacing * 0.5;
    this.currentY = this.originY + noiseY * spacing * 0.5;
    
    // Update noise offsets
    this.noiseOffsetX += this.noiseSpeed;
    this.noiseOffsetY += this.noiseSpeed;
    
    // Update hue for smooth color transitions
    this.hue = (this.hue + 0.1) % 360;
  }
  
  display() {
    noStroke();
    // Calculate size using sine wave for pulsating effect
    let size = this.sizeBase + this.sizeVariation * sin(frameCount * 0.05 + this.originX * 0.1 + this.originY * 0.1);
    fill(this.hue, 80, 100, 80);
    ellipse(this.currentX, this.currentY, size, size);
  }
}
