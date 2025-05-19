let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events;

let engine;
let world;

let raindrops = [];
let ripples = [];
let pondObject;

function setup() {
  createCanvas(600, 800);

  // Initialize Matter.js engine and world
  engine = Engine.create();
  world = engine.world;
  world.gravity.y = 1; // Gravity

  // Create pond object
  pondObject = new Pond();

  // Collision event for raindrops and pond
  Events.on(engine, 'collisionStart', function(event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      let bodyA = pairs[i].bodyA;
      let bodyB = pairs[i].bodyB;

      if ((bodyA === pondObject.body && bodyB.label === 'raindrop') ||
          (bodyB === pondObject.body && bodyA.label === 'raindrop')) {

        let raindropBody = (bodyA === pondObject.body) ? bodyB : bodyA;
        let raindrop = raindrops.find(r => r.body === raindropBody);

        if (raindrop) {
          // Create ripple effect
          ripples.push(new Ripple(raindrop.body.position.x, pondObject.position.y - pondObject.height / 2));

          // Increase pond height
          pondObject.rise(0.1);

          // Remove raindrop
          raindrop.removeFromWorld();
          raindrops.splice(raindrops.indexOf(raindrop), 1);
        }
      }
    }
  });
}

function draw() {
  background(200, 200, 255); // Light blue sky

  Engine.update(engine);

  // Generate new raindrops
  if (frameCount % 1 === 0) {
    raindrops.push(new Raindrop(random(width), -10, 3));
  }

  // Display pond
  pondObject.show();

  // Display ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.expand();
    ripple.show();
    if (ripple.isFinished()) {
      ripples.splice(i, 1);
    }
  }

  // Display and update raindrops
  for (let i = raindrops.length - 1; i >= 0; i--) {
    let raindrop = raindrops[i];
    raindrop.show();
    if (raindrop.isOffScreen()) {
      raindrop.removeFromWorld();
      raindrops.splice(i, 1);
    }
  }
}

// Raindrop class
class Raindrop {
  constructor(x, y, r) {
    this.body = Bodies.circle(x, y, r, {
      restitution: 0.1,
      friction: 0.001
    });
    this.body.label = 'raindrop';
    this.r = r;
    World.add(world, this.body);
  }

  isOffScreen() {
    return this.body.position.y > height + 50;
  }

  show() {
    fill(0, 0, 255);
    noStroke();
    let pos = this.body.position;
    ellipse(pos.x, pos.y, this.r * 2);
  }

  removeFromWorld() {
    World.remove(world, this.body);
  }
}

// Ripple class
class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.lifespan = 255;
  }

  expand() {
    this.radius += 2;
    this.lifespan -= 4;
  }

  isFinished() {
    return this.lifespan < 0;
  }

  show() {
    stroke(0, 0, 255, this.lifespan);
    noFill();
    ellipse(this.x, this.y, this.radius * 2);
  }
}

// Pond class
class Pond {
  constructor() {
    this.height = 20;
    this.position = createVector(width / 2, height - this.height / 2);

    // Create pond body
    let pondOptions = {
      isStatic: true,
      isSensor: true
    };
    this.body = Bodies.rectangle(this.position.x, this.position.y, width, this.height, pondOptions);
    World.add(world, this.body);
  }

  rise(amount) {
    this.height += amount;
    this.position.y -= amount / 2;

    // Update pond body
    Body.setPosition(this.body, { x: this.position.x, y: this.position.y });
    Body.setVertices(this.body, [
      { x: 0, y: this.position.y - this.height / 2 },
      { x: width, y: this.position.y - this.height / 2 },
      { x: width, y: this.position.y + this.height / 2 },
      { x: 0, y: this.position.y + this.height / 2 }
    ]);
  }

  show() {
    fill(0, 0, 200);
    noStroke();
    rectMode(CENTER);
    rect(this.position.x, this.position.y, width, this.height);
  }
}