let spaceship;
let asteroids = [];
let bullets = [];
let spaceshipImg;
let asteroidImg;
let gameOver = false; 
let score = 0; 
let gameStarted = false;


function preload() {
  // Use the path to your images here
  spaceshipImg = loadImage('spaceship2.png');
  asteroidImg = loadImage('asteroid2.png');
  bulletImg = loadImage('bullet.png');
	bgImg = loadImage('background.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetGame(); // Call resetGame in setup to initialize game state
}

function resetGame() {
  spaceship = new Spaceship();
  asteroids = []; // Clear the asteroids array
  for(let i=0; i<10; i++){
    asteroids.push(new Asteroid());
  }
}

function draw() {
  
  if (!gameStarted) {
    background(0);
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text("Welcome to The Space Sprint!", width / 2, height / 2 - 200);
    textSize(24);
    text("by Gonçalo Perdigão", width / 2, height / 2 - 160);
		textSize(16);
    text("In a close galaxy, brave pilot Alex and his spaceship, Stellar Dash,", width / 2, height / 2 - 90);
    text("decided to navigate the notorious Asteroid Belt of Orion. Weaving and", width / 2, height / 2 - 60);
    text("blasting through the field, they became a legendary duo. Each asteroid", width / 2, height / 2 - 30);
    text("destroyed was a score, a testament to their courage.", width / 2, height / 2);

  } else {
	
    image(bgImg, 0, 0, width, height); // Draw the background image first
  
    spaceship.render();
    spaceship.turn();
    spaceship.update();
  
    fill(255);
    textSize(32);
    text("Score: " + score, 100, 50); 
	
    for(let i=0; i<asteroids.length; i++){
      if(spaceship.hits(asteroids[i])){
          console.log('game over');
          noLoop();
          gameOver = true;  // Set gameOver to true when the game ends
      }
      asteroids[i].render();
      asteroids[i].update();
      asteroids[i].edges();
    }
	
    for(let i=bullets.length-1; i>=0; i--){
      bullets[i].render();
      bullets[i].update();
      if(bullets[i].offscreen()){
        bullets.splice(i, 1);
      } else {
        for(let j=asteroids.length-1; j>=0; j--){
          if(bullets[i].hits(asteroids[j])){
            if(asteroids[j].r > 10){
              let newAsteroids = asteroids[j].breakup();
              asteroids = asteroids.concat(newAsteroids);
              score += 10;
            }
            asteroids.splice(j, 1);
            bullets.splice(i, 1);
            break;
          }
        }
      }
    }
  }
}


function keyReleased() {
  spaceship.setRotation(0);
  spaceship.boosting(false);
}

function mousePressed() {
   if (!gameStarted) {
    gameStarted = true;
  } else {
    if (gameOver) {  // If the game is over, restart the game when the mouse is clicked
      gameOver = false;
      resetGame();  // Reset the game state
      loop();  // Restart the draw loop
    } else {
      bullets.push(new Bullet(spaceship.pos, spaceship.heading));
    }
  }
}


function keyPressed() {
  if (keyCode === 32) {  // 32 is the keyCode for the spacebar
    bullets.push(new Bullet(spaceship.pos, spaceship.heading));
  }
}

class Spaceship {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.r = 40;
    this.heading = 0;
    this.rotation = 0;
    this.vel = createVector(0, 0);
    this.isBoosting = false;
  }

  boosting(b) {
    this.isBoosting = b;
  }

  update() {
    if (mouseIsPressed) {
      this.boost();
    }
    this.pos.add(this.vel);
    this.vel.mult(0.99);
  }

  boost() {
    let force = p5.Vector.fromAngle(this.heading);
    force.mult(0.1);
    this.vel.add(force);
  }

  hits(asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    return d < this.r + asteroid.r;
  }

render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);  // Add this line to rotate the spaceship. PI/2 is added to align the spaceship image correctly
    imageMode(CENTER);
    image(spaceshipImg, 0, 0, this.r * 2, this.r * 2);
    pop();
}
	
  turn() {
    this.heading = p5.Vector.sub(createVector(mouseX, mouseY), this.pos).heading();
  }
	
  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}

class Asteroid {
  constructor(pos, r) {
    if (pos) {
      this.pos = pos.copy();
    } else {
      this.pos = createVector(random(width), random(height))
    }
    if (r) {
      this.r = r * 0.5;
    } else {
      this.r = random(15, 50);
    }
    this.vel = p5.Vector.random2D();
    this.total = floor(random(5, 15));
    this.offset = [];
    for (let i = 0; i < this.total; i++) {
      this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
    }
  }

	  breakup() {
    let newA = [];
    newA[0] = new Asteroid(this.pos, this.r);
    newA[1] = new Asteroid(this.pos, this.r);
    return newA;
  }
	
  render() {
    push();
    translate(this.pos.x, this.pos.y);
    imageMode(CENTER);
    image(asteroidImg, 0, 0, this.r * 2, this.r * 2);
    pop();
  }

  update() {
    this.pos.add(this.vel);
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}

class Bullet {
  constructor(pos, heading) {
    this.pos = pos.copy();
    this.vel = p5.Vector.fromAngle(heading);
    this.vel.mult(5);
    this.r = 5;  // Define radius for the bullet
  }

  update() {
    this.pos.add(this.vel);
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.heading);
    imageMode(CENTER);
    image(bulletImg, 0, 0, this.r * 2, this.r * 2);
    pop();
  }

  hits(asteroid) {
    let d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
    return d < this.r + asteroid.r;  // Use bullet's radius for collision detection
  }

  offscreen() {
    if (this.pos.x > width || this.pos.x < 0) {
      return true;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      return true;
    }
    return false;
  }
}