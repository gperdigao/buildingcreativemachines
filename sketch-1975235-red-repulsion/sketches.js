let particles = [];

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.size = 10;
    this.aggregations = 0;
  }

update() {
  particles.forEach(particle => {
    if (particle !== this) {
      let force = p5.Vector.sub(this.pos, particle.pos);
      let distanceSq = force.magSq();
      force.normalize();
      force.mult(500 * this.size / distanceSq); // Attraction force proportional to size
      if (distanceSq < (this.size + particle.size) ** 2) { // If particles are too close
        force.mult(-1); // Apply repulsion
      }
      this.vel.add(force);
    }
  });

  this.vel.limit(2);
  this.pos.add(this.vel);

  // Contain within boundaries
  if (this.pos.x < this.size / 2) {
    this.pos.x = this.size / 2;
    this.vel.x *= -1;
  } else if (this.pos.x > width - this.size / 2) {
    this.pos.x = width - this.size / 2;
    this.vel.x *= -1;
  }
  if (this.pos.y < this.size / 2) {
    this.pos.y = this.size / 2;
    this.vel.y *= -1;
  } else if (this.pos.y > height - this.size / 2) {
    this.pos.y = height - this.size / 2;
    this.vel.y *= -1;
  }
}


  show() {
    noStroke();
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

checkAggregation() {
  particles.forEach(particle => {
    if (particle !== this) {
      let distance = p5.Vector.dist(this.pos, particle.pos);
      if (distance < (this.size / 2 + particle.size / 2)) {
        this.aggregations++;
        this.size += 2; // Increase size with each aggregation
        if (this.aggregations >= 10) {
          this.explode();
        }
      }
    }
  });
}

  explode() {
    // Remove this particle from the array
    particles = particles.filter(particle => particle !== this);
  }
}

function setup() {
  createCanvas(800, 800);
  stroke(255);
  noFill();
  rect(0, 0, width, height);
}

function draw() {
  background(0);
  
  if (random() < 0.3) { // Occasionally add new particles
    let x = random(width);
    let y = random(height);
    particles.push(new Particle(x, y));
  }

  particles.forEach(particle => {
    particle.update();
    particle.show();
    particle.checkAggregation();
  });
  
  noFill();
  stroke(255);
  rect(0, 0, width, height); // Draw the white boundary
}
