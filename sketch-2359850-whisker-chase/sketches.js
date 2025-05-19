// Whisker Chase Game

let cat;
let mice = [];
let score = 0;
let level = 1;
const MAX_MICE = 7;
let energy = 100;
const MAX_ENERGY = 100;
const ENERGY_DEPLETION_RATE = 0.1; // Energy decreases over time
const ENERGY_INCREASE = 20; // Energy gained per catch
let lives = 7;
let gameOver = false;

// Scaling factors based on screen size
let isMobile = false;
let scaleFactor = 1;
let catSize;
let mouseSize;
let hudScale;
let hudTextSize;
let gameOverTextSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  determineDevice();
  cat = new Cat();
  
  // Initialize mice
  for (let i = 0; i < MAX_MICE; i++) {
    mice.push(new Mouse());
  }
}

function draw() {
  background(200, 220, 255); // Light blue background
  
  if (!gameOver) {
    // Display score, level, energy, and lives
    displayHUD();
  
    // Update and display cat
    cat.update();
    cat.display();
  
    // Update and display mice
    for (let i = 0; i < mice.length; i++) {
      let mouseObj = mice[i];
      mouseObj.update();
      mouseObj.display();
      
      // Check for collision
      if (cat.collidesWith(mouseObj)) {
        score++;
        energy = min(energy + ENERGY_INCREASE, MAX_ENERGY); // Regain energy
        mice[i] = new Mouse(); // Replace caught mouse
    
        // Increase difficulty every 5 points
        if (score % 5 === 0) {
          level++;
          increaseDifficulty();
        }
      }
    }
  
    // Deplete energy over time
    energy -= ENERGY_DEPLETION_RATE;
    energy = max(energy, 0);
  
    // Check energy and lives
    if (energy <= 0) {
      lives--;
      if (lives > 0) {
        energy = MAX_ENERGY; // Reset energy
        // Optionally, add a brief pause or reset positions
      } else {
        gameOver = true;
      }
    }
  } else {
    // Display Game Over Screen
    displayGameOver();
  }
}

function determineDevice() {
  // Simple mobile detection based on window width
  if (windowWidth < 600) {
    isMobile = true;
    scaleFactor = 0.6;
  } else {
    isMobile = false;
    scaleFactor = 1;
  }
  
  // Set sizes based on device
  catSize = 80 * scaleFactor;
  mouseSize = 40 * scaleFactor;
  hudScale = scaleFactor;
  hudTextSize = isMobile ? 16 : 24;
  gameOverTextSize = isMobile ? 32 : 48;
}

function displayHUD() {
  push();
  scale(hudScale);
  fill(0);
  textSize(hudTextSize);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 20, 20);
  text(`Level: ${level}`, 20, 50);
  text(`Lives: ${lives}`, 20, 80);
  
  // Draw Energy Bar
  fill(255);
  stroke(0);
  rect(20, 120, 200, 25);
  fill(0, 255, 0);
  noStroke();
  let energyWidth = map(energy, 0, MAX_ENERGY, 0, 200);
  rect(20, 120, energyWidth, 25);
  fill(0);
  textSize(hudTextSize * 0.8);
  text(`Energy: ${floor(energy)}`, 230, 122);
  pop();
}

function displayGameOver() {
  push();
  fill(50, 50, 50, 200); // Semi-transparent overlay
  noStroke();
  rect(0, 0, width, height);
  
  fill(255);
  textSize(gameOverTextSize);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2 - 50);
  
  textSize(isMobile ? 24 : 32);
  text(`Final Score: ${score}`, width / 2, height / 2);
  
  textSize(isMobile ? 18 : 24);
  text("Refresh the page to play again!", width / 2, height / 2 + 50);
  pop();
}

// Increase game difficulty by enhancing mouse speed and behavior
function increaseDifficulty() {
  // Increase speed of existing and future mice
  mice.forEach(mouse => {
    mouse.speed += 0.5;
  });
  // Enable fleeing behavior
  mice.forEach(mouse => {
    mouse.flee = true;
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  determineDevice();
  // Optionally, adjust cat and mice positions to stay within new window size
}

// Cat Class
class Cat {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.size = catSize;
    this.speed = 5 * scaleFactor;
  
    // Animation parameters
    this.legAngle = 0;
    this.legDirection = 1;
    this.tailAngle = 0;
    this.tailDirection = 1;
  }

  update() {
    // Move cat towards mouse position with smoothing
    let targetX = mouseX;
    let targetY = mouseY;

    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let angle = atan2(dy, dx);

    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;

    // Keep the cat within the canvas
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
    this.y = constrain(this.y, this.size / 2, height - this.size / 2);

    // Animate legs
    this.legAngle += 0.1 * this.legDirection;
    if (abs(this.legAngle) > PI / 6) {
      this.legDirection *= -1;
    }

    // Animate tail
    this.tailAngle += 0.05 * this.tailDirection;
    if (abs(this.tailAngle) > PI / 4) {
      this.tailDirection *= -1;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
  
    // Body
    fill(150, 100, 50); // Brown color
    ellipse(0, 0, this.size, this.size * 0.6);
  
    // Head
    ellipse(40 * scaleFactor, -20 * scaleFactor, this.size * 0.5, this.size * 0.5);
  
    // Ears
    triangle(30 * scaleFactor, -35 * scaleFactor, 35 * scaleFactor, -45 * scaleFactor, 40 * scaleFactor, -35 * scaleFactor);
    triangle(50 * scaleFactor, -35 * scaleFactor, 55 * scaleFactor, -45 * scaleFactor, 60 * scaleFactor, -35 * scaleFactor);
  
    // Eyes
    fill(255);
    ellipse(35 * scaleFactor, -25 * scaleFactor, 10 * scaleFactor, 10 * scaleFactor);
    ellipse(45 * scaleFactor, -25 * scaleFactor, 10 * scaleFactor, 10 * scaleFactor);
    fill(0);
    ellipse(35 * scaleFactor, -25 * scaleFactor, 5 * scaleFactor, 5 * scaleFactor);
    ellipse(45 * scaleFactor, -25 * scaleFactor, 5 * scaleFactor, 5 * scaleFactor);
  
    // Mouth
    noFill();
    stroke(0);
    arc(40 * scaleFactor, -15 * scaleFactor, 10 * scaleFactor, 10 * scaleFactor, 0, PI);
  
    // Legs
    stroke(100, 50, 20);
    strokeWeight(4 * scaleFactor);
    // Front left leg
    push();
    rotate(this.legAngle);
    line(-20 * scaleFactor, 30 * scaleFactor, -20 * scaleFactor, 50 * scaleFactor);
    pop();
    // Front right leg
    push();
    rotate(-this.legAngle);
    line(20 * scaleFactor, 30 * scaleFactor, 20 * scaleFactor, 50 * scaleFactor);
    pop();
    // Back left leg
    push();
    rotate(-this.legAngle);
    line(-20 * scaleFactor, 30 * scaleFactor, -20 * scaleFactor, 50 * scaleFactor);
    pop();
    // Back right leg
    push();
    rotate(this.legAngle);
    line(20 * scaleFactor, 30 * scaleFactor, 20 * scaleFactor, 50 * scaleFactor);
    pop();
  
    // Tail
    noFill();
    stroke(150, 100, 50);
    strokeWeight(4 * scaleFactor);
    push();
    rotate(this.tailAngle);
    line(-40 * scaleFactor, 0, -60 * scaleFactor, 10 * scaleFactor);
    pop();
  
    pop();
  }

  collidesWith(mouseObj) {
    let distance = dist(this.x, this.y, mouseObj.x, mouseObj.y);
    return distance < (this.size / 2 + mouseObj.size / 2);
  }
}

// Mouse Class
class Mouse {
  constructor() {
    this.size = mouseSize;
    this.x = random(this.size, width - this.size);
    this.y = random(this.size, height - this.size);
    this.speed = random(2, 4 + level * 0.5) * scaleFactor;
    this.direction = p5.Vector.random2D();
    this.flee = false; // Determines if the mouse flees from the cat

    // Animation parameters
    this.legAngle = 0;
    this.legDirection = 1;
  }

  update() {
    if (this.flee) {
      // Calculate vector away from the cat
      let fleeVector = createVector(this.x - cat.x, this.y - cat.y);
      if (fleeVector.mag() === 0) {
        fleeVector = p5.Vector.random2D();
      }
      fleeVector.normalize();
      fleeVector.mult(this.speed);
      this.x += fleeVector.x;
      this.y += fleeVector.y;
    } else {
      // Move mouse in current direction
      this.x += this.direction.x * this.speed;
      this.y += this.direction.y * this.speed;
    }

    // Ensure the mouse stays within the canvas boundaries
    this.x = constrain(this.x, this.size / 2, width - this.size / 2);
    this.y = constrain(this.y, this.size / 2, height - this.size / 2);

    // Bounce off walls by reflecting direction
    let bounced = false;

    if (this.x <= this.size / 2 || this.x >= width - this.size / 2) {
      this.direction.x *= -1;
      bounced = true;
    }
    if (this.y <= this.size / 2 || this.y >= height - this.size / 2) {
      this.direction.y *= -1;
      bounced = true;
    }

    if (bounced) {
      // Slightly alter direction to prevent getting stuck in corners
      this.direction.rotate(random(-PI / 6, PI / 6));
      this.direction.normalize();
    }

    // Ensure mice are always moving and not stuck
    if (this.direction.mag() === 0) {
      this.direction = p5.Vector.random2D();
    }

    // Animate legs
    this.legAngle += 0.2 * this.legDirection;
    if (abs(this.legAngle) > PI / 6) {
      this.legDirection *= -1;
    }
  }

  display() {
    push();
    translate(this.x, this.y);
  
    // Body
    fill(100);
    ellipse(0, 0, this.size, this.size * 0.5);
  
    // Head
    ellipse(-15 * scaleFactor, -10 * scaleFactor, this.size * 0.3, this.size * 0.3);
  
    // Ears
    ellipse(-20 * scaleFactor, -15 * scaleFactor, this.size * 0.1, this.size * 0.1);
    ellipse(-10 * scaleFactor, -15 * scaleFactor, this.size * 0.1, this.size * 0.1);
  
    // Eyes
    fill(255);
    ellipse(-16 * scaleFactor, -12 * scaleFactor, 5 * scaleFactor, 5 * scaleFactor);
    fill(0);
    ellipse(-16 * scaleFactor, -12 * scaleFactor, 2 * scaleFactor, 2 * scaleFactor);
  
    // Nose
    fill(255, 0, 0);
    ellipse(-18 * scaleFactor, -10 * scaleFactor, 3 * scaleFactor, 3 * scaleFactor);
  
    // Tail
    noFill();
    stroke(100);
    strokeWeight(2 * scaleFactor);
    line(20 * scaleFactor, 0, 30 * scaleFactor, 10 * scaleFactor);
  
    // Legs
    stroke(100);
    strokeWeight(2 * scaleFactor);
    // Front left leg
    push();
    rotate(this.legAngle);
    line(-10 * scaleFactor, 20 * scaleFactor, -10 * scaleFactor, 30 * scaleFactor);
    pop();
    // Front right leg
    push();
    rotate(-this.legAngle);
    line(10 * scaleFactor, 20 * scaleFactor, 10 * scaleFactor, 30 * scaleFactor);
    pop();
  
    pop();
  }
}
