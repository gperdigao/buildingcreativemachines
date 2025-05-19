let balls = [];

function setup() {
  createCanvas(800, 800);
}

function draw() {
  background(0);
  for (let i = 0; i < balls.length; i++) {
    balls[i].move();
    balls[i].display();
    balls[i].checkCollision();
  }
}

function mousePressed() {
  let r = random(10, 50);
  let b = new Ball(mouseX, mouseY, r);
  balls.push(b);
}

function Ball(x, y, r) {
  this.pos = createVector(x, y);
  this.r = r;
  this.vel = createVector(random(-2, 2), random(-2, 2));
  this.color = color(random(255), random(255), random(255));

  this.move = function() {
    this.pos.add(this.vel);

    // Bounce off the walls
    if (this.pos.x > width - this.r || this.pos.x < this.r) {
      this.vel.x *= -1;
    }
    if (this.pos.y > height - this.r || this.pos.y < this.r) {
      this.vel.y *= -1;
    }
  }

  this.display = function() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  this.checkCollision = function() {
    for (let other of balls) {
      if (other !== this) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < this.r + other.r) {
          let collision = p5.Vector.sub(this.pos, other.pos);
          collision.normalize();
          collision.mult(2);
          this.vel.add(collision);
        }
      }
    }
  }
}
