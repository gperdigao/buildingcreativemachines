let ball;
let goalie;
let goal;
let kick;
let ballSpeed = 10;
let ballShot = false;
let goals = 0;
let totalShots = 0;
let angle = 0;
let goalState = false;
let blockState = false;

function setup() {
  createCanvas(400, 400);
  ball = createVector(width / 2, height - 50);
  goalie = createVector(width / 2, 80);
  goal = [80, 320]; // Made the goal larger
  kick = 0;
}

function draw() {
  background(34, 139, 34); // Green field like grass
  drawGoal();
  moveGoalie();
  drawGoalie();
  drawBall();
  if (ballShot) {
    moveBall();
  } else {
    drawShotPreview(); // Only draw the preview line when ball is not shot
  }
  drawOverlay();
}

function drawGoal() {
  // Goal
  stroke(255);
  noFill();
  rect(goal[0], 50, goal[1] - goal[0], 10);
}

function moveGoalie() {
  // Smarter Goalie Movement
  if (!goalState && !blockState) { // Prevent goalie movement during goal/block state
    let targetX = ballShot ? ball.x : width / 2;
    let speed = 2;
    if (goalie.x < targetX) {
      goalie.x += speed;
    } else if (goalie.x > targetX) {
      goalie.x -= speed;
    }
    goalie.x = constrain(goalie.x, goal[0] + 10, goal[1] - 10);
  }
}

function drawGoalie() {
  // Draw Goalie
  fill(0, 0, 255); // Blue color for goalkeeper
  ellipse(goalie.x, goalie.y, 30, 30);
}

function drawBall() {
  // Draw Ball (white only)
  push();
  translate(ball.x, ball.y);
  fill(255);
  stroke(0);
  strokeWeight(2);
  ellipse(0, 0, 20, 20);
  pop();
}

function moveBall() {
  // Ball movement
  ball.y -= ballSpeed;
  ball.x += kick;

  // Check if ball hits the goal, misses, or hits the goalie
  if (ball.y <= 80) {
    totalShots++;
    if (dist(ball.x, ball.y, goalie.x, goalie.y) < 20) {
      console.log('Blocked!');
      blockState = true;
      setTimeout(resetBall, 1000); // Wait 1 second before resetting
    } else if (ball.x >= goal[0] && ball.x <= goal[1]) {
      console.log('Goal!');
      goals++;
      goalState = true;
      ball.y = 60; // Keep the ball inside the goal for 1 second
      setTimeout(resetBall, 1000); // Wait 1 second before resetting
    } else {
      console.log('Missed!');
      setTimeout(resetBall, 1000); // Wait 1 second before resetting
    }
    ballShot = false;
  }
}

function drawOverlay() {
  // Scoreboard
  textAlign(CENTER);
  fill(255);
  text('Press SPACE to shoot (control direction with mouse)', width / 2, height - 10);
  text('Goals: ' + goals + ' / Shots: ' + totalShots, width / 2, height - 30);
}

function drawShotPreview() {
  // Draw shot direction preview
  stroke(255, 100);
  line(ball.x, ball.y, ball.x + angle * 20, ball.y - 40);
}

function mouseMoved() {
  // Set angle based on mouse position
  angle = map(mouseX, 0, width, -2, 2);
}

function keyPressed() {
  if (key == ' ') {
    kick = angle;
    ballShot = true;
  }
}

function resetBall() {
  goalState = false;
  blockState = false;
  ball.set(width / 2, height - 50);
}