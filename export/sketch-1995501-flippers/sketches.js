let ball;
let leftFlipper, rightFlipper;
let gravity;

function setup() {
  createCanvas(400, 600);
  
  // Comment out gravity for now
  // gravity = createVector(0, 0.2);

  // Create the ball at the center of the canvas
  ball = createSprite(width / 2, height / 2, 20, 20);
  
  // Comment out the velocity for now to see if the ball stays
  // let angle = radians(random(-45, -135));
  // ball.velocity.x = 2 * cos(angle);
  // ball.velocity.y = 2 * sin(angle);
  
  ball.shapeColor = color(255, 0, 0);

  // Create the flippers
  leftFlipper = createSprite(150, height - 50, 100, 10);
  leftFlipper.rotation = 15;
  rightFlipper = createSprite(250, height - 50, 100, 10);
  rightFlipper.rotation = -15;
}



function draw() {
  background(220);

  // Apply gravity to the ball
  //ball.velocity.add(gravity);

  // Bounce the ball off the edges
  if (ball.position.x < 0 || ball.position.x > width) {
    ball.velocity.x *= -1;
  }
  if (ball.position.y < 0) {
    ball.velocity.y *= -1;
  }

  // Flip the flippers
  if (keyIsDown(LEFT_ARROW)) {
    leftFlipper.rotation -= 5;
  } else {
    leftFlipper.rotation = 15;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    rightFlipper.rotation += 5;
  } else {
    rightFlipper.rotation = -15;
  }

// Collide the ball with the flippers
if (ball.overlap(leftFlipper) || ball.overlap(rightFlipper)) {
    ball.velocity.y *= -1;
}

  // Draw the ball
ellipse(ball.position.x, ball.position.y, 20, 20);

// Draw the flippers
push();
translate(leftFlipper.position.x, leftFlipper.position.y);
rotate(radians(leftFlipper.rotation));
rect(-50, -5, 100, 10);
pop();

push();
translate(rightFlipper.position.x, rightFlipper.position.y);
rotate(radians(rightFlipper.rotation));
rect(-50, -5, 100, 10);
pop();

}

