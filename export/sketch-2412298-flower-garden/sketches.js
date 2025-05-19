// "Reproduction" 🖨 #WCCChallenge
// 4th November 2024 by Gonçalo Perdigão

let flowers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  background(230, 230, 250); // Lavender background
}

function draw() {
  background(230, 230, 250, 20); // Semi-transparent background for fade effect
  
  for (let i = flowers.length - 1; i >= 0; i--) {
    flowers[i].grow();
    flowers[i].display();
    
    if (flowers[i].isFinished()) {
      flowers.splice(i, 1); // Remove finished flowers
    }
  }
}

function mousePressed() {
  // Plant a new flower at mouse position
  flowers.push(new Flower(mouseX, mouseY));
}

class Flower {
  constructor(x, y) {
    this.position = createVector(x, height); // Start from the bottom of the canvas
    this.targetY = y;
    this.stemLength = 0;
    this.maxStemLength = this.position.y - this.targetY;
    this.stemGrowthRate = random(2, 5);
    this.bloomed = false;
    this.petals = [];
    this.numPetals = int(random(5, 12));
    this.petalGrowth = 0;
    this.maxPetalGrowth = random(20, 50);
    this.petalColor = color(random(360), 200, 255, 200);
    colorMode(HSB, 360, 255, 255, 255);
  }
  
  grow() {
    if (!this.bloomed) {
      this.stemLength += this.stemGrowthRate;
      if (this.stemLength >= this.maxStemLength) {
        this.bloomed = true;
      }
    } else {
      if (this.petalGrowth < this.maxPetalGrowth) {
        this.petalGrowth += 1;
      }
    }
  }
  
  display() {
    push();
    translate(this.position.x, this.position.y);
    stroke(34, 139, 34); // Stem color
    strokeWeight(2);
    line(0, 0, 0, -this.stemLength);
    
    if (this.bloomed) {
      translate(0, -this.stemLength);
      noStroke();
      fill(this.petalColor);
      for (let i = 0; i < this.numPetals; i++) {
        let angle = map(i, 0, this.numPetals, 0, TWO_PI);
        push();
        rotate(angle + frameCount * 0.01); // Slight rotation animation
        ellipse(0, this.petalGrowth / 2, this.petalGrowth, this.petalGrowth * 2);
        pop();
      }
      fill(255, 204, 0); // Center of the flower
      ellipse(0, 0, this.maxPetalGrowth / 2);
    }
    pop();
  }
  
  isFinished() {
    // Keep flowers on the screen indefinitely
    return false;
  }
}
