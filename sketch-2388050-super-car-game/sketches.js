let car;
let roadLines = [];
let otherCars = [];

let speed = 5;
let score = 0;

function setup() {
  createCanvas(400, 600);
  car = new Car();
  for (let i = 0; i < height; i += 40) {
    roadLines.push(new RoadLine(i));
  }
}

function draw() {
  background(50, 150, 50);

  fill(50);
  rect(100, 0, 200, height);

  for (let line of roadLines) {
    line.update();
    line.show();
  }

  if (frameCount % 60 === 0) {
    otherCars.push(new OtherCar());
  }

  for (let i = otherCars.length - 1; i >= 0; i--) {
    otherCars[i].update();
    otherCars[i].show();

    if (otherCars[i].hits(car)) {
      noLoop();
      textSize(32);
      fill(255, 0, 0);
      textAlign(CENTER);
      text('Game Over', width / 2, height / 2);
      return;
    }

    if (otherCars[i].offScreen()) {
      otherCars.splice(i, 1);
      score++;
      speed += 0.2;
    }
  }

  car.show();

  if (keyIsDown(LEFT_ARROW)) {
    car.move(-5);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    car.move(5);
  }

  fill(255);
  textSize(16);
  textAlign(LEFT);
  text('Score: ' + score, 10, 20);
}

class Car {
  constructor() {
    this.x = width / 2;
    this.y = height - 70;
    this.width = 40;
    this.height = 70;
  }

  move(dir) {
    this.x += dir;
    this.x = constrain(this.x, 110, 250);
  }

  show() {
    fill(255, 0, 0);
    noStroke();
    rect(this.x, this.y, this.width, this.height, 10);
  }
}

class RoadLine {
  constructor(y) {
    this.x = width / 2;
    this.y = y;
    this.width = 10;
    this.height = 20;
  }

  update() {
    this.y += speed;
    if (this.y > height) {
      this.y = -this.height;
    }
  }

  show() {
    fill(255);
    noStroke();
    rect(this.x - this.width / 2, this.y, this.width, this.height);
  }
}

class OtherCar {
  constructor() {
    let laneWidth = 200 / 3;
    this.x = 100 + laneWidth * floor(random(0, 3)) + laneWidth / 2 - 20;
    this.y = -80;
    this.width = 40;
    this.height = 70;
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.y += speed;
  }

  offScreen() {
    return this.y > height;
  }

  hits(car) {
    return (
      car.x < this.x + this.width &&
      car.x + car.width > this.x &&
      car.y < this.y + this.height &&
      car.y + car.height > this.y
    );
  }

  show() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }
}