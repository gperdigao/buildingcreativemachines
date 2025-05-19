let engine;
let world;
let circles = [];
let oscs = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Matter.Engine.create();
  world = engine.world;
}

function draw() {
  background(0);
  Matter.Engine.update(engine);
  for (let i = 0; i < circles.length; i++) {
    circles[i].show();
    if (circles[i].isOffScreen()) {
      circles[i].removeFromWorld();
      circles.splice(i, 1);
      oscs[i].stop();
      oscs.splice(i, 1);
      i--;
    }
  }
}

function touchStarted() {
  let r = random(10, 50);
  let c = new Circle(mouseX, mouseY, r);
  circles.push(c);
  let osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(map(mouseY, 0, height, 400, 1000));
  osc.amp(0.5);
  osc.start();
  oscs.push(osc);
  return false;
}

function Circle(x, y, r) {
  let options = {
    friction: 0,
    restitution: 0.95
  };
  this.body = Matter.Bodies.circle(x, y, r, options);
  this.r = r;
  this.x = x;
  this.y = y;
  this.color = [random(0, 255), random(0, 255), random(0, 255)];
  
  Matter.World.add(world, this.body);

  this.isOffScreen = function() {
    let pos = this.body.position;
    return (pos.y > height + 100);
  };

  this.removeFromWorld = function() {
    Matter.World.remove(world, this.body);
  };

  this.show = function() {
    let pos = this.body.position;
    push();
    translate(pos.x, pos.y);
    fill(this.color);
    ellipse(0, 0, this.r * 2);
    pop();
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
