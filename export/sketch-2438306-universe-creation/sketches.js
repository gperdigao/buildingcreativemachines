let galaxies = [];
let isDragging = false;
let dragStart;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0, 25); // Semi-transparent background for trail effect
  
  // Display and update all galaxies
  for (let galaxy of galaxies) {
    galaxy.update();
    galaxy.display();
  }
  
  // If dragging, draw a line to show the drag
  if (isDragging) {
    stroke(255);
    strokeWeight(1);
    line(dragStart.x, dragStart.y, mouseX, mouseY);
  }
}

function mousePressed() {
  isDragging = true;
  dragStart = createVector(mouseX, mouseY);
}

function mouseReleased() {
  isDragging = false;
  let dragEnd = createVector(mouseX, mouseY);
  let dragVector = p5.Vector.sub(dragEnd, dragStart);
  
  // Determine galaxy properties based on drag
  let size = constrain(dragVector.mag(), 50, 300);
  let rotationSpeed = map(dragVector.mag(), 0, 500, 0.01, 0.05);
  if (dragVector.mag() === 0) {
    rotationSpeed = 0.02; // Default rotation speed
  }
  
  // Create a new galaxy
  galaxies.push(new Galaxy(dragStart.x, dragStart.y, size, rotationSpeed, dragVector.heading()));
}

class Galaxy {
  constructor(x, y, size, rotationSpeed, angle) {
    this.position = createVector(x, y);
    this.size = size;
    this.rotationSpeed = rotationSpeed;
    this.angleOffset = angle;
    this.stars = [];
    this.numStars = int(map(size, 50, 300, 100, 500));
    this.rotation = 0;
    this.color = color(random(360), 255, 255);
    colorMode(HSB, 360, 255, 255, 255);
    
    // Generate stars in a spiral pattern
    for (let i = 0; i < this.numStars; i++) {
      let angle = i * 0.1;
      let radius = (i / this.numStars) * this.size;
      let x = radius * cos(angle);
      let y = radius * sin(angle);
      this.stars.push(createVector(x, y));
    }
  }
  
  update() {
    this.rotation += this.rotationSpeed;
  }
  
  display() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotation + this.angleOffset);
    noStroke();
    fill(this.color);
    for (let star of this.stars) {
      ellipse(star.x, star.y, 2, 2);
    }
    pop();
  }
}
