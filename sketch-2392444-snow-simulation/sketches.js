let Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Events = Matter.Events;

let engine;
let world;
let particles = [];
let obstacles = [];
let ground;
let timer = 0;
let resetTime = 20000; // 20 seconds in milliseconds

function setup() {
  createCanvas(600, 800);
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 1;

  // Create ground
  ground = Bodies.rectangle(width / 2, height + 50, width, 100, {
    isStatic: true,
    render: { visible: false }
  });
  World.add(world, ground);

  // Create obstacles
  createObstacles();

  // Run the engine
  Engine.run(engine);
}

function draw() {
  background(30, 144, 255);

  // Add water particles
  if (frameCount % 2 === 0) {
    let particle = Bodies.circle(random(0, width), -50, 5, {
      restitution: 0.1,
      friction: 0.1,
      density: 0.001,
      render: { fillStyle: 'aqua' }
    });
    particles.push(particle);
    World.add(world, particle);
  }

  // Draw particles
  fill(173, 216, 230);
  noStroke();
  for (let i = 0; i < particles.length; i++) {
    let pos = particles[i].position;
    ellipse(pos.x, pos.y, 10);
  }

  // Draw obstacles
  fill(139, 69, 19);
  for (let i = 0; i < obstacles.length; i++) {
    drawVertices(obstacles[i].vertices);
  }

  // Draw ground
  fill(0, 100, 0);
  drawVertices(ground.vertices);

  // Timer to reset simulation
  timer += deltaTime;
  if (timer > resetTime) {
    resetSimulation();
    timer = 0;
  }
}

function createObstacles() {
  // Clear existing obstacles
  for (let i = 0; i < obstacles.length; i++) {
    World.remove(world, obstacles[i]);
  }
  obstacles = [];

  // Create new obstacles with random sizes and positions
  for (let i = 0; i < 12; i++) {
    let w = random(50, 150);
    let h = random(20, 50);
    let x = random(50, width - 50);
    let y = random(height / 4, (3 * height) / 4);
    let angle = random(-PI / 4, PI / 4);
    let obstacle = Bodies.rectangle(x, y, w, h, {
      isStatic: true,
      angle: angle,
      render: { fillStyle: 'brown' }
    });
    obstacles.push(obstacle);
    World.add(world, obstacle);
  }
}

function drawVertices(vertices) {
  beginShape();
  for (let i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}

function resetSimulation() {
  // Remove all particles
  for (let i = 0; i < particles.length; i++) {
    World.remove(world, particles[i]);
  }
  particles = [];

  // Remove and recreate obstacles
  createObstacles();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
