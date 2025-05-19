let car;
let track;
let trackRadius = 200;
let trackCenterX = 300;
let trackCenterY = 300;
let lapCount = 0;
let startTime;
let lapTimes = [];
let totalLaps = 3;
let raceFinished = false;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
  car = new Car();
  track = new Track();
  startTime = millis();
}

function draw() {
  background(0, 153, 0); // Retro-style green background
  
  track.display();
  car.update();
  car.display();
  displayLapInfo();

  // Check if the race is finished
  if (lapCount >= totalLaps) {
    raceFinished = true;
    noLoop(); // Stop the draw loop when race is finished
    displayRaceFinished();
  }
}

function displayLapInfo() {
  fill(255);
  textSize(16);
  textAlign(LEFT);
  let currentTime = millis();
  let lapTime = nf((currentTime - startTime) / 1000, 1, 2);
  text(`Lap: ${lapCount + 1}/${totalLaps}`, 10, 20);
  text(`Current Lap Time: ${lapTime} sec`, 10, 40);
  if (lapTimes.length > 0) {
    for (let i = 0; i < lapTimes.length; i++) {
      text(`Lap ${i + 1}: ${lapTimes[i]} sec`, 10, 60 + i * 20);
    }
  }
}

function displayRaceFinished() {
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER);
  text("Race Finished!", width / 2, height / 2);
}

class Track {
  display() {
    fill(100, 100, 100);
    noStroke();
    ellipse(trackCenterX, trackCenterY, trackRadius * 2); // Draw the track
    fill(0, 153, 0);
    ellipse(trackCenterX, trackCenterY, (trackRadius - 50) * 2); // Draw inner grass area
    
    // Draw start/finish line crossing the track
    stroke(255);
    strokeWeight(2);
    line(trackCenterX, trackCenterY - trackRadius, trackCenterX, trackCenterY + trackRadius); // Vertical line crossing the circuit
  }
}

class Car {
  constructor() {
    this.width = 30;
    this.height = 15;
    this.x = trackCenterX; // Start at the center of the track
    this.y = trackCenterY - trackRadius / 2; // Place the car inside the circuit
    this.angle = 0;
    this.speed = 0;
    this.maxSpeed = 8; // Increase max speed to make the car faster
    this.lastLapCrossed = false;
  }

  update() {
    if (raceFinished) {
      return;
    }

    if (keyIsDown(UP_ARROW)) {
      this.speed += 0.2; // Increase acceleration to make the car faster
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.speed -= 0.2;
    }
    if (keyIsDown(LEFT_ARROW)) {
      this.angle -= 3;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.angle += 3;
    }

    this.speed = constrain(this.speed, -this.maxSpeed / 2, this.maxSpeed);
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);

    // Keep car on the track
    let distance = dist(this.x, this.y, trackCenterX, trackCenterY);
    if (this.isOffTrack(distance)) {
      this.speed = 0.5; // Stop the car if it goes out of the track
    }

    // Check if the car crossed the start/finish line
    let crossingLine = this.isCrossingStartFinishLine();
    if (crossingLine && !this.lastLapCrossed) {
      lapCount++;
      let currentTime = millis();
      let lapTime = nf((currentTime - startTime) / 1000, 1, 2);
      lapTimes.push(lapTime);
      startTime = currentTime;
    }
    this.lastLapCrossed = crossingLine;
  }

  isOffTrack(distance) {
    return distance > trackRadius - this.width / 2 || distance < trackRadius - 50 + this.width / 2;
  }

  isCrossingStartFinishLine() {
    let dx = this.x - trackCenterX;
    return abs(dx) < 5 && this.y > trackCenterY - trackRadius && this.y < trackCenterY + trackRadius;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(255, 0, 0);
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);
    pop();
  }
}