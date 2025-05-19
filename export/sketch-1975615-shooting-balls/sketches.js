let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

let engine;
let world;
let projectiles = [];
let obstacles = [];
let score = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Engine.create();
  world = engine.world;
}

function draw() {
  background(0);
  Engine.update(engine);

  // Create a new obstacle every 60 frames
  if (frameCount % 60 === 0) {
    let o = new Obstacle(random(width), 0, random(10, 50));
    obstacles.push(o);
  }

  // Display all projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].show();
    if (projectiles[i].isOffScreen()) {
      projectiles[i].removeFromWorld();
      projectiles.splice(i, 1);
    }
  }

  // Display all obstacles and check for collisions
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].show();
    if (obstacles[i].isOffScreen()) {
      obstacles[i].removeFromWorld();
      obstacles.splice(i, 1);
    } else {
      for (let j = projectiles.length - 1; j >= 0; j--) {
        if (obstacles[i].body.circleRadius + projectiles[j].body.circleRadius >
            dist(obstacles[i].body.position.x, obstacles[i].body.position.y,
                 projectiles[j].body.position.x, projectiles[j].body.position.y)) {
          obstacles[i].removeFromWorld();
          obstacles.splice(i, 1);
          projectiles[j].removeFromWorld();
          projectiles.splice(j, 1);
          score++;
          break;
        }
      }
    }
  }

  // Display the score
  fill(255);
  textSize(32);
  text("Score: " + score, 10, 50);
}

function touchStarted() {
  let p = new Projectile(width / 2, height, 10, mouseX, mouseY);
  projectiles.push(p);
  return false;
}

function Projectile(x, y, r, targetX, targetY) {
  let options = {
    restitution: 0.5
  };
  this.body = Bodies.circle(x, y, r, options);
  this.r = r;
  World.add(world, this.body);

  let angle = atan2(targetY - y, targetX - x);
  Matter.Body.setVelocity(this.body, {x: 20 * cos(angle), y: 20 * sin(angle)}); // Increased velocity

  this.show = function() {
    let pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    fill(0, 255, 0);
    ellipse(0, 0, this.r * 2);
    pop();
  };

  this.isOffScreen = function() {
    let pos = this.body.position;
    return (pos.y < 0);
  };

  this.removeFromWorld = function() {
    World.remove(world, this.body);
  };
}

function Obstacle(x, y, r) {
  let options = {
    restitution: 0.5
  };
  this.body = Bodies.circle(x, y, r, options);
  this.r = r;
  World.add(world, this.body);

  this.show = function() {
    let pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    fill(255, 0, 0);
    ellipse(0, 0, this.r * 2);
    pop();
  };

  this.isOffScreen = function() {
    let pos = this.body.position;
    return (pos.y > height);
  };

  this.removeFromWorld = function() {
    World.remove(world, this.body);
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
