let balls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(1); // Make the simulation run slower
}

function draw() {
  background(200);

  // Add new balls every second
  if (frameCount % 1 == 0) { // Since we reduced the frame rate to 1, we need to adjust this too
    for (let i = 0; i < 3; i++) {
      balls.push(new Ball(random(width), random(height), color(255, 0, 0), 10));
      balls.push(new Ball(random(width), random(height), color(0, 255, 0), 10));
    }
  }

  // Update and display balls
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];

    for (let j = i+1; j < balls.length; j++) {
      let other = balls[j];

      let force = p5.Vector.sub(other.pos, ball.pos);
      let distance = force.mag();
      let radiiSum = ball.radius + other.radius;

      if (distance < radiiSum) {
        // Balls are touching, merge them
        if (ball.col == other.col) {
          // Same color balls attract each other
          ball.merge(other);
          balls.splice(j, 1); // Remove the other ball
          j--;
        } else {
          // Different color balls repel each other
          force.mult(-1);
        }
      }
      
      force.setMag(0.01 * ball.radius); // Set force magnitude proportional to size of the ball
      ball.applyForce(force);
    }

    ball.update();
    ball.display();
    ball.boundaries();
    
    if (ball.merges >= 10) {
      // Ball has merged 10 times, remove it
      balls.splice(i, 1);
      i--;
    }
  }
}

class Ball {
  constructor(x, y, col, radius) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.col = col;
    this.radius = radius;
    this.merges = 0;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0); // Reset acceleration
  }

  display() {
    fill(this.col);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
  }
  
  merge(other) {
    this.merges++;
    this.radius += other.radius * 0.5;
    if(this.merges < 10) {
      balls.push(new Ball(this.pos.x, this.pos.y, this.col, this.radius));
    }
  }
  
  boundaries() {
    if (this.pos.x > width - this.radius) {
      this.pos.x = width - this.radius;
      this.vel.x *= -1;
    } else if (this.pos.x < this.radius) {
      this.pos.x = this.radius;
      this.vel.x *= -1;
    }
    if (this.pos.y > height - this.radius) {
      this.pos.y = height - this.radius;
      this.vel.y *= -1;
    } else if (this.pos.y < this.radius) {
      this.pos.y = this.radius;
      this.vel.y *= -1;
    }
  }
}
