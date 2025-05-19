let spaceship;
let asteroids = [];
let score = 0;
let gameIsOver = false;
let asteroidFrequency = 60;

function setup() {
  createCanvas(500, 700);  // Increased canvas size for better visibility
  spaceship = new Spaceship();
  frameRate(60);
}

function draw() {
  background(0);
  stroke(255);
  noFill();
  rect(0, 0, width, height);  // Draw a square around the canvas

  fill(255);
  textSize(35);
  textAlign(CENTER);
  text("Asteroid Dodger", width / 2, 40);  // Fancy name at the top

  if (!gameIsOver) {
    fill(255);
    textSize(20);
    textAlign(LEFT);
    text("Score: " + score, 10, 60);  // Score displayed below the title

    spaceship.show();
    spaceship.move();
    
    // Add new asteroids periodically
    if (frameCount % asteroidFrequency === 0) {
      asteroids.push(new Asteroid());
      score += 1;
      // Increase speed of all asteroids every level
      for (let asteroid of asteroids) {
        asteroid.speed += 0.2;
      }
      // Increase the frequency of new asteroids to make it harder
      if (asteroidFrequency > 20) {
        asteroidFrequency -= 2;
      }
    }

    // Update asteroids and check collisions
    for (let i = asteroids.length - 1; i >= 0; i--) {
      asteroids[i].show();
      asteroids[i].update();

      if (asteroids[i].hits(spaceship)) {
        gameIsOver = true;
      }
      
      if (asteroids[i].offscreen()) {
        asteroids.splice(i, 1);
      }
    }
  } else {
    fill(255, 0, 0);
    textSize(30);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 2);
    textSize(20);
    text("Press 'R' to Restart", width / 2, height / 2 + 40);
  }
}

function keyPressed() {
  if (key === 'R' || key === 'r') {
    gameIsOver = false;
    score = 0;
    asteroids = [];
    spaceship = new Spaceship();
    asteroidFrequency = 60;  // Reset asteroid frequency
  }
}

class Spaceship {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.width = 40;
    this.height = 60;
    this.speed = 5;
  }

  show() {
    fill(0, 255, 0);
    noStroke();
    triangle(this.x, this.y - this.height / 2, this.x - this.width / 2, this.y + this.height / 2, this.x + this.width / 2, this.y + this.height / 2);
  }

  move() {
    if (keyIsDown(LEFT_ARROW) && this.x > this.width / 2) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) && this.x < width - this.width / 2) {
      this.x += this.speed;
    }
  }
}

class Asteroid {
  constructor() {
    this.x = random(20, width - 20);
    this.y = -20;
    this.size = random(20, 50);
    this.speed = random(2, 5);
  }

  show() {
    fill(255, 165, 0);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  update() {
    this.y += this.speed;
  }

  offscreen() {
    return this.y > height + this.size;
  }

  hits(spaceship) {
    let d = dist(this.x, this.y, spaceship.x, spaceship.y);
    return d < this.size / 2 + spaceship.width / 2;
  }
}