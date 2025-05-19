// Infinite Pastel Bubbles
// A calming, pastel puzzle game where you guide falling bubbles into a basket by placing limited "cloud platforms."

// --- Matter.js Setup ---
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events;

let engine, world;

// Game Variables
let currentLevel = 1;
let gameLost = false;
let gameWon = false;
let score = 0;

let availableBubbles;  // Bubbles left to drop
let bubblesToSave;     // How many must be saved this level
let cloudsAvailable;   // How many cloud platforms can be placed

let bubbles = [];
let clouds = [];
let basketBody;
let startPoint;

let topWall, bottomWall, leftWall, rightWall;

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;
  
  textFont('sans-serif');
  
  initializeLevel(currentLevel);
  createWalls();
  createBasket();
  
  // Collision events
  Events.on(engine, 'collisionStart', handleCollisions);
  
  noStroke();
}

function draw() {
  // Pastel gradient background: top (light pink) to bottom (light blue)
  setGradientBackground(color(255, 220, 240), color(200, 230, 255));

  Engine.update(engine);

  // Check conditions
  if (!gameWon && !gameLost) {
    if (availableBubbles === 0 && areBubblesStill() && score < bubblesToSave) {
      gameLost = true;
    }
    if (score >= bubblesToSave) {
      gameWon = true;
    }
  }

  if (gameWon) {
    displayMessage(`Level ${currentLevel} Complete!\nClick or press any key to continue`);
    return;
  }
  if (gameLost) {
    displayMessage(`Game Over at Level ${currentLevel}\nClick or press any key to restart`);
    return;
  }

  displayHUD();

  // Spawn bubbles gradually
  if (frameCount % 30 === 0 && availableBubbles > 0 && !gameWon && !gameLost) {
    spawnBubble();
  }

  renderBubbles();
  renderClouds();
  
  // Show start point as a subtle pastel marker (like a pastel circle)
  fill(255, 200, 210, 150);
  ellipse(startPoint.x, startPoint.y, 30, 30);

  renderBasket();
}

// --- Level Management ---
function initializeLevel(level) {
  // Each level: more bubbles required, fewer resources
  bubblesToSave = level;
  availableBubbles = max(200 - (level-1)*10, 50);
  cloudsAvailable = max(100 - (level-1)*5, 10);
  
  score = 0;
  bubbles = [];
  clouds = [];
  
  gameWon = false;
  gameLost = false;
}

function nextLevel() {
  currentLevel++;
  initializeLevel(currentLevel);
  World.clear(world, false);
  createWalls();
  createBasket();
  loop();
}

function restartGame() {
  currentLevel = 1;
  initializeLevel(currentLevel);
  World.clear(world, false);
  createWalls();
  createBasket();
  loop();
}

// --- Walls & Basket ---
function createWalls() {
  topWall = Bodies.rectangle(width/2, -10, width, 20, { isStatic: true });
  bottomWall = Bodies.rectangle(width/2, height+10, width, 20, { isStatic: true, label: 'bottom' });
  leftWall = Bodies.rectangle(-10, height/2, 20, height, { isStatic: true });
  rightWall = Bodies.rectangle(width+10, height/2, 20, height, { isStatic: true });
  World.add(world, [topWall, bottomWall, leftWall, rightWall]);
}

function createBasket() {
  let basketRadius = 50; 
  let basketPosX = random(60, width-60);
  
  // A soft funnel shape (basket)
  let funnelHeight = 100;
  let funnelVertices = [
    { x: -basketRadius, y: 0 },
    { x: -basketRadius/2, y: -funnelHeight },
    { x: basketRadius/2, y: -funnelHeight },
    { x: basketRadius, y: 0 }
  ];

  basketBody = Bodies.fromVertices(basketPosX, height-10, funnelVertices, {
    isStatic: true,
    label: 'basket'
  }, true);

  World.add(world, basketBody);

  startPoint = { x: generateNonAlignedX(basketPosX), y: 150 };
}

function generateNonAlignedX(basketX, minDistance = 100) {
  let newX;
  do {
    newX = random(60, width - 60);
  } while (abs(newX - basketX) < minDistance);
  return newX;
}

// --- Bubbles ---
function spawnBubble() {
  let bubble = Bodies.circle(startPoint.x, startPoint.y, 7.5, {
    friction: 0.001,
    restitution: 0.5,
    label: 'bubble'
  });
  World.add(world, bubble);
  bubbles.push(bubble);
  availableBubbles--;
}

function renderBubbles() {
  // Soft pastel bubbles (semi-transparent)
  for (let bubble of bubbles) {
    fill(255, 180, 200, 150);
    noStroke();
    let bubbleSize = isMobileDevice() ? width * 0.03 : 15;
    ellipse(bubble.position.x, bubble.position.y, bubbleSize, bubbleSize);
  }
}

function areBubblesStill() {
  for (let b of bubbles) {
    let v = b.velocity;
    if (abs(v.x)>0.5 || abs(v.y)>0.5) {
      return false;
    }
  }
  return true;
}

// --- Clouds (Platforms) ---
function placeCloud() {
  if (cloudsAvailable > 0 && !gameWon && !gameLost) {
    // Cloud platform: soft pastel bar
    let cloud = Bodies.rectangle(mouseX, mouseY, 60, 10, {
      isStatic: true,
      label: 'cloud'
    });
    World.add(world, cloud);
    clouds.push(cloud);
    cloudsAvailable--;
  }
}

function renderClouds() {
  // Soft pastel cloud platforms (light gray-white)
  fill(255,255,255,180);
  noStroke();
  for (let c of clouds) {
    push();
    translate(c.position.x, c.position.y);
    rotate(c.angle);
    rectMode(CENTER);
    rect(0,0,60,10);
    pop();
  }
}

// --- Basket ---
function renderBasket() {
  // A subtle woven basket color: a light brown/pastel tone
  fill(225,200,160);
  noStroke();
  beginShape();
  for (let v of basketBody.vertices) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
}

// --- Collisions ---
function handleCollisions(event) {
  let pairs = event.pairs;
  for (let i=0; i<pairs.length; i++) {
    let bodyA = pairs[i].bodyA;
    let bodyB = pairs[i].bodyB;

    // If bubble hits bottom (missed basket)
    if ((bodyA === bottomWall && bodyB.label === 'bubble') ||
        (bodyB === bottomWall && bodyA.label === 'bubble')) {
      let bubbleBody = bodyA.label === 'bubble' ? bodyA : bodyB;
      removeBubble(bubbleBody);
    }

    // If bubble enters basket
    if ((bodyA.label === 'basket' && bodyB.label === 'bubble') ||
        (bodyB.label === 'basket' && bodyA.label === 'bubble')) {
      score++;
      let bubbleBody = bodyA.label === 'bubble' ? bodyA : bodyB;
      removeBubble(bubbleBody);
    }
  }
}

function removeBubble(bubbleBody) {
  World.remove(world, bubbleBody);
  for (let i=0; i<bubbles.length; i++) {
    if (bubbles[i] === bubbleBody) {
      bubbles.splice(i,1);
      break;
    }
  }
}

// --- UI and Messages ---
function displayHUD() {
  // Light semi-transparent overlay
  fill(255,255,255,150);
  rect(0,0,width,50);

  fill(50);
  textSize(isMobileDevice()?14:16);
  textAlign(LEFT, CENTER);
  let hudText = `Level: ${currentLevel}   Goal: ${bubblesToSave}   Saved: ${score}   Bubbles Left: ${max(0, availableBubbles)}   Clouds: ${cloudsAvailable}`;
  text(hudText, 10, 25);
}

function displayMessage(msg) {
  fill(50);
  textAlign(CENTER,CENTER);
  textSize(24);
  text(msg, width/2, height/2);
}

// --- Input Handling ---
function mousePressed() {
  if (gameWon) {
    nextLevel();
  } else if (gameLost) {
    restartGame();
  } else {
    placeCloud();
  }
}

function touchStarted() {
  if (gameWon) {
    nextLevel();
  } else if (gameLost) {
    restartGame();
  } else {
    placeCloud();
  }
  return false;
}

function keyPressed() {
  if (gameWon) {
    nextLevel();
  } else if (gameLost) {
    restartGame();
  }
}

// --- Utilities ---
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Rebuild walls
  World.remove(world, [topWall,bottomWall,leftWall,rightWall]);
  createWalls();
  
  // Constrain startPoint within screen
  startPoint.x = constrain(startPoint.x,60,width-60);
}

// Draw a vertical gradient
function setGradientBackground(c1, c2) {
  noFill();
  for (let y=0; y<height; y++) {
    let inter = y/(height-1);
    let c = lerpColor(c1,c2,inter);
    stroke(c);
    line(0,y,width,y);
  }
}
