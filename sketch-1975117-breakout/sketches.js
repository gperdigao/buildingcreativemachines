let paddle;
let ball;
let bricks = [];
let score = 0;
let gameOver = false;

let paddleImg;
let ballImg;
let brickImg;

function preload() {
  paddleImg = loadImage('paddle.png'); // replace with your paddle image path
  ballImg = loadImage('ball.png'); // replace with your ball image path
  brickImg = loadImage('brick.png'); // replace with your brick image path
}

function setup() {
  createCanvas(800, 800);
  paddle = new Paddle();
  ball = new Ball();
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      bricks.push(new Brick(i * 80 + 80, j * 30 + 50));
    }
  }
}

function draw() {
  background(0);
  // Draw a red square around the canvas
  stroke(255, 0, 0); 
  noFill();
  rect(0, 0, width, height);
  
  paddle.show();
  paddle.move();
  ball.show();
  ball.move();
  for (let i = bricks.length - 1; i >= 0; i--) {
    bricks[i].show();
    if (ball.hits(bricks[i])) {
      score += 10;
      if (score == bricks.length * 10) {
        score = 1000;
        bricks = bricks.concat(new Array(50).fill().map((_, i) => new Brick((i % 10) * 80 + 80, Math.floor(i / 10) * 30 + 50)));
      }
      ball.direction.y *= -1;
      bricks.splice(i, 1);
    }
  }
  fill(255);
  textSize(24);
  text("Score: " + score, 10, 30);
  if (ball.y > height) {
    gameOver = true;
    fill(255, 0, 0);
    textSize(24);
    text("GAME OVER", width / 2, height / 2);
    noLoop();
  }
if (gameOver && keyIsPressed && key === ' ') {
  gameOver = false;
  score = 0;
  bricks = new Array(50).fill().map((_, i) => new Brick((i % 10) * 80 + 80, Math.floor(i / 10) * 30 + 50));
  ball = new Ball();
  loop();
}
}

function Paddle() {
  this.width = 200; // Increased the width of the paddle
  this.height = 20;
  this.x = (width - this.width) / 2;
  this.speed = 5;
  this.show = function() {
    image(paddleImg, this.x, height - this.height, this.width, this.height);
  }
  this.move = function() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    this.x = constrain(this.x, 0, width - this.width);
  }
}

function Ball() {
  this.x = width / 2;
  this.y = height / 2;
  this.size = 20;
  this.direction = createVector(1, 1);
  this.speed = 3;
  this.show = function() {
    image(ballImg, this.x, this.y, this.size, this.size);
  }
  this.move = function() {
    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;
    if (this.x < 0 || this.x > width) this.direction.x *= -1;
    if (this.y < 0 || this.y > height - paddle.height && this.x > paddle.x && this.x < paddle.x + paddle.width) this.direction.y *= -1;
  }
  this.hits = function(brick) {
    let d = dist(this.x, this.y, brick.x, brick.y);
    return (d < this.size / 2 + brick.width / 2 && d < this.size / 2 + brick.height / 2);
  }
}

function keyPressed() {
  if (gameOver && key === ' ') {
    gameOver = false;
    score = 0;
    bricks = new Array(50).fill().map((_, i) => new Brick((i % 10) * 80 + 80, Math.floor(i / 10) * 30 + 50));
    ball = new Ball();
    loop();
  }
}

function Brick(x, y) {
  this.x = x;
  this.y = y;
  this.width = 60;
  this.height = 20;
  this.show = function() {
    image(brickImg, this.x, this.y, this.width, this.height);
  }
}