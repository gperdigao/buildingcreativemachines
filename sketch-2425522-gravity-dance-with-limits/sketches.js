let stars = [];
let gravityPoints = [];
let numGravityPoints = 5;
let angleOffset = 0;

function setup() {
  createCanvas(800, 800);
  
  // Initialize stars
  for (let i = 0; i < 500; i++) {
    let angle = random(TWO_PI);
    let radius = sqrt(random(pow(width / 2, 2))) * 0.4;
    stars.push({
      position: createVector(random(-width / 2, width / 2), random(-height / 2, height / 2)),
      velocity: createVector(0, 0),
      colorOffset: random(100, 255),
      size: random(2, 5),
      speed: random(0.005, 0.01)
    });
  }
  
  // Initialize gravity points
  for (let i = 0; i < numGravityPoints; i++) {
    gravityPoints.push(createVector(random(-width / 2, width / 2), random(-height / 2, height / 2)));
  }
  noFill();
}

function draw() {
  background(5, 5, 15, 60); // Dark background for cosmic effect
  translate(width / 2, height / 2);
  
  // Update gravity point positions
  for (let i = 0; i < gravityPoints.length; i++) {
    gravityPoints[i].x += sin(angleOffset + i) * 2;
    gravityPoints[i].y += cos(angleOffset + i) * 2;
  }
  
  // Draw and update each star with gravity and boundary checks
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    
    // Calculate total gravitational force from all gravity points
    let totalForce = createVector(0, 0);
    for (let j = 0; j < gravityPoints.length; j++) {
      let force = p5.Vector.sub(gravityPoints[j], star.position);
      let distance = constrain(force.mag(), 50, 200);
      force.setMag(1 / (distance * 0.1));
      totalForce.add(force);
    }
    
    // Update position and velocity of the star
    star.velocity.add(totalForce);
    star.position.add(star.velocity);
    star.velocity.limit(2);
    
    // Check boundaries and make stars bounce
    if (star.position.x > width / 2 || star.position.x < -width / 2) {
      star.velocity.x *= -1;
    }
    if (star.position.y > height / 2 || star.position.y < -height / 2) {
      star.velocity.y *= -1;
    }

    // Draw the star
    let colorValue = star.colorOffset + sin(frameCount * star.speed) * 50;
    stroke(colorValue, 180, 255 - colorValue, 200);
    strokeWeight(star.size);
    point(star.position.x, star.position.y);

    // Add faint trailing line to emphasize movement
    stroke(255, 100);
    strokeWeight(0.5);
    line(star.position.x, star.position.y, star.position.x - star.velocity.x * 2, star.position.y - star.velocity.y * 2);
  }

  angleOffset += 0.005;
}
