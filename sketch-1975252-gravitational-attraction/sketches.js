let bodies = [];
let nBodies = 100;
let G; // Gravitational constant
let slider;

function setup() {
  createCanvas(600, 600);
  G = 1;
  slider = createSlider(0.1, 10, 1, 0.1);
  for (let i = 0; i < nBodies; i++) {
    bodies[i] = createVector(random(width), random(height));
  }
}

function draw() {
  background(51);
  G = slider.value();
  for (let i = 0; i < nBodies; i++) {
    let acceleration = createVector(0, 0);
    for (let j = 0; j < nBodies; j++) {
      if (i !== j) {
        let force = p5.Vector.sub(bodies[j], bodies[i]);
        let distance = force.mag();
        force.normalize();
        force.mult(G / (distance * distance));
        acceleration.add(force);
      }
    }
    bodies[i].add(acceleration);
    if (bodies[i].x > width) bodies[i].x = 0;
    if (bodies[i].x < 0) bodies[i].x = width;
    if (bodies[i].y > height) bodies[i].y = 0;
    if (bodies[i].y < 0) bodies[i].y = height;
    fill(255);
    circle(bodies[i].x, bodies[i].y, 10); // Here I replaced `point()` with `circle()` and provided a radius of 10
  }
}
