let particles = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 100; i++) {
        particles[i] = new Particle(random(width), random(height));
    }
}

function draw() {
    background(0);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].display();
    }
}

class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-1, 1), random(-1, 1));
    }

    update() {
        this.pos.add(this.vel);
    }

    display() {
        fill(255);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 10, 10);
    }
}
