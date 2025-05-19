let world;
let balls = [];
let colors = ["#FF6347", "#1E90FF", "#32CD32", "#FFD700", "#FF69B4"];
let gravity = 1;
let wind = 0.01;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0); // make canvas cover the screen
  canvas.style('z-index', '-1'); // ensure canvas stays behind other elements
  world = new World();
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = random(-100, 0);
    let radius = random(20, 40);
    let color = random(colors);
    balls.push(new Ball(x, y, radius, color));
  }
}

function draw() {
  background(30);
  world.gravity.y = gravity;
  for (let ball of balls) {
    ball.move();
    ball.applyForce(wind, 0);
    ball.display();
  }
}

function mousePressed() {
  let found = false;
  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];
    if (dist(mouseX, mouseY, ball.sprite.x, ball.sprite.y) < ball.r) {
      balls.splice(i, 1); // remove ball if clicked
      found = true;
      break;
    }
  }

  if (!found) {
    let radius = random(20, 40);
    let color = random(colors);
    let newBall = new Ball(mouseX, mouseY, radius, color);
    balls.push(newBall); // create a new ball if no object is clicked
  }
}

class Ball {
  constructor(x, y, r, col) {
    this.sprite = new Sprite(x, y, r * 2, r * 2);
    this.sprite.bounciness = 0.8;
    this.r = r;
    this.col = col;
  }

  move() {
    if (this.sprite.x > width || this.sprite.x < 0) {
      wind *= -1;
    }
  }

  applyForce(fx, fy) {
    this.sprite.vel.x += fx;
    this.sprite.vel.y += fy;
  }

  display() {
    noStroke();
    fill(this.col);
    ellipse(this.sprite.x, this.sprite.y, this.r * 2);
  }
}
