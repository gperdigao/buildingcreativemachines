let particles = [];

class Particle {
  constructor(x, y, color) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.color = color;
    this.aggregations = 0;
    this.sizes = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    this.size = this.sizes[this.aggregations];
  }

  update() {
    particles.forEach(particle => {
      if (particle !== this) {
        let force = p5.Vector.sub(this.pos, particle.pos);
        let distanceSq = force.magSq();
        force.normalize();

        if (this.color === 'red' && particle.color === 'red') {
          force.mult(500 * this.size / distanceSq); // Attraction force proportional to size
        } else {
          force.mult(-500 * this.size / distanceSq); // Repulsion force proportional to size
        }
        this.vel.add(force);
      }
    });

    this.vel.limit(2);
    this.pos.add(this.vel);

    // Reflect off boundaries
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
    }
  }

  show() {
    noStroke();
    if (this.color === 'red') fill(255, 0, 0);
    else fill(0, 255, 0);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  checkAggregation() {
    particles.forEach(particle => {
      if (particle !== this && particle.color === 'red' && this.color === 'red') {
        let distance = p5.Vector.dist(this.pos, particle.pos);
        if (distance < this.size / 2) {
          this.aggregations++;
          if (this.aggregations < this.sizes.length) {
            this.size = this.sizes[this.aggregations]; // Update size based on number of aggregations
          }
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
}

function draw() {
  background(0);
  
  if (random() < 0.03) { // Occasionally add new particles
    let x = random(width);
    let y = random(height);
    let color = random() < 0.5 ? 'red' : 'green';
    particles.push(new Particle(x, y, color));
  }

  particles.forEach(particle => {
    particle.update();
    particle.show();
    particle.checkAggregation();
  });
}
