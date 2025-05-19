let butterflies = [];
let butterflyImages = [];

function preload() {
  butterflyImages.push(loadImage('b1.gif'));
  butterflyImages.push(loadImage('b2.gif'));
	butterflyImages.push(loadImage('b3.gif'));
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  noCursor();
}

function draw() {
  background(135, 206, 235); // Sky blue background
  
  // Draw and update butterflies
  for (let butterfly of butterflies) {
    butterfly.update();
    butterfly.display();
  }
  
  // Draw a butterfly following the mouse
  imageMode(CENTER);
  let idx = frameCount % butterflyImages.length;
  push();
  translate(mouseX, mouseY);
  rotate(sin(frameCount * 0.1) * 0.2);
  image(butterflyImages[idx], 0, 0, 60, 60);
  pop();
}

function mousePressed() {
  // Add a new butterfly at mouse position
  butterflies.push(new Butterfly(mouseX, mouseY));
}

class Butterfly {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(1, 3));
    this.acceleration = createVector(0, 0);
    this.image = random(butterflyImages);
    this.size = random(80, 120);
    this.angle = 0;
    this.angleSpeed = random(-0.05, 0.05);
    this.flapSpeed = random(0.1, 0.4);
  }
  
  update() {
    // Apply acceleration towards random points
    let steer = p5.Vector.random2D();
    steer.mult(0.05);
    this.acceleration.add(steer);
    
    // Update velocity and position
    this.velocity.add(this.acceleration);
    this.velocity.limit(3);
    this.position.add(this.velocity);
    
    // Reset acceleration
    this.acceleration.mult(0);
    
    // Update angle for rotation
    this.angle += this.angleSpeed;
    
    // Wrap around the canvas edges
    if (this.position.x > width + this.size) this.position.x = -this.size;
    if (this.position.x < -this.size) this.position.x = width + this.size;
    if (this.position.y > height + this.size) this.position.y = -this.size;
    if (this.position.y < -this.size) this.position.y = height + this.size;
  }
  
  display() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle + sin(frameCount * this.flapSpeed) * 0.2);
    imageMode(CENTER);
    image(this.image, 0, 0, this.size, this.size);
    pop();
  }
}
