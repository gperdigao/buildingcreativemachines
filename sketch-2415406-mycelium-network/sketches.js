let nodes = [];
let maxNodes = 200; // Maximum number of nodes in the network

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < maxNodes; i++) {
    nodes.push(new Node(random(width), random(height)));
  }
}

function draw() {
  background(255);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].update();
    nodes[i].display();
  }

  // Draw connections between nodes based on distance
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let distance = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      if (distance < 100) {
        stroke(0, map(distance, 0, 100, 255, 50));
        strokeWeight(map(distance, 0, 100, 1.5, 0.5));
        line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
      }
    }
  }
}

// Node class for each dot in the network
class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(3, 5);
    this.xSpeed = random(-0.5, 0.5);
    this.ySpeed = random(-0.5, 0.5);
  }

  update() {
    // Update position with slight movement
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Bounce from edges
    if (this.x < 0 || this.x > width) this.xSpeed *= -1;
    if (this.y < 0 || this.y > height) this.ySpeed *= -1;
  }

  display() {
    noStroke();
    fill(0);
    ellipse(this.x, this.y, this.size);
  }
}
