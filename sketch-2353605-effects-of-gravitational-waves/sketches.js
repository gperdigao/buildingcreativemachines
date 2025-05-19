let masses = [];
let clickCount = 0;

function setup() {
  createCanvas(800, 600);
  background(0);
}

function draw() {
  background(0, 20); // Fade effect to visualize waves over time
  noStroke();
  
  // Update and display all masses
  for (let mass of masses) {
    mass.update();
    mass.display();
  }
}

function mousePressed() {
  clickCount++;
  let massValue = clickCount * 10; // Mass increases with each click
  masses.push(new Mass(mouseX, mouseY, massValue));
}

// Mass class representing an object affecting the gravitational field
class Mass {
  constructor(x, y, mass) {
    this.position = createVector(x, y);
    this.mass = mass;
    this.time = 0;
  }
  
  update() {
    this.time += 0.05; // Increment time to animate waves
  }
  
  display() {
    // Simulate gravitational waves as expanding circles
    let maxRadius = this.mass * 5;
    for (let r = 0; r < maxRadius; r += 5) {
      let alpha = map(r, 0, maxRadius, 255, 0);
      stroke(100, 150, 255, alpha);
      noFill();
      ellipse(this.position.x, this.position.y, r * 2 + this.time * 10, r * 2 + this.time * 10);
    }
  }
}
