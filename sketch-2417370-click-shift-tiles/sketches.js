const Engine = Matter.Engine,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Runner = Matter.Runner;

// Variables
let engine;
let world;
let runner;

let tileSize = 80;
let gridCols, gridRows;
let tiles = [];
let walls = [];
let balls = [];
let palette = ['#FF6347', '#4682B4', '#9ACD32', '#FFD700'];
let ballGenerationInterval;

// Setup function
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize Matter.js engine and world
  engine = Engine.create();
  world = engine.world;
  engine.gravity.y = 1; // Adjust gravity as needed
  
  // Initialize Runner
  runner = Runner.create();
  Runner.run(runner, engine);
  
  // Calculate grid size
  gridCols = floor(width / tileSize);
  gridRows = floor(height / tileSize);
  
  // Create boundary walls
  let boundaryOptions = { isStatic: true, restitution: 0.5 };
  World.add(world, [
    Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions), // Top
    Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions), // Bottom
    Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions), // Left
    Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions) // Right
  ]);
  
  // Generate tiles and walls
  for (let i = 0; i < gridCols; i++) {
    tiles[i] = [];
    for (let j = 0; j < gridRows; j++) {
      let x = i * tileSize + tileSize / 2;
      let y = j * tileSize + tileSize / 2;
      let type = random(['A', 'B', 'C']);
      let rotation = floor(random(4)) * HALF_PI;
      tiles[i][j] = { type, rotation, x, y, walls: [] };
      createTileWalls(i, j);
    }
  }
  
  // Start ball generation at 10 per second
  ballGenerationInterval = setInterval(generateBall, 100); // 100ms interval
}

// Draw function
function draw() {
  background(240);
  
  // Draw tiles
  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      let tile = tiles[i][j];
      push();
      translate(tile.x, tile.y);
      rotate(tile.rotation);
      drawTile(tile.type, tileSize);
      pop();
    }
  }
  
  // Draw balls
  noStroke();
  for (let i = balls.length -1; i >=0; i--) {
    let ball = balls[i];
    fill(ball.color);
    ellipse(ball.body.position.x, ball.body.position.y, ball.radius * 2);
    
    // Remove balls that reach the bottom
    if (ball.body.position.y > height + 20) {
      World.remove(world, ball.body);
      balls.splice(i, 1);
    }
  }
}

// Function to draw a single tile
function drawTile(type, size) {
  stroke(0);
  strokeWeight(2);
  noFill();
  
  switch(type) {
    case 'A':
      // Cross lines
      line(-size/2, -size/2, size/2, size/2);
      line(-size/2, size/2, size/2, -size/2);
      break;
    case 'B':
      // Vertical and horizontal lines
      line(0, -size/2, 0, size/2);
      line(-size/2, 0, size/2, 0);
      break;
    case 'C':
      // Diagonal corner lines
      line(-size/2, 0, 0, size/2);
      line(0, -size/2, size/2, 0);
      break;
  }
}

// Function to create walls for a specific tile
function createTileWalls(i, j) {
  let tile = tiles[i][j];
  let size = tileSize;
  let x = tile.x;
  let y = tile.y;
  let rotation = tile.rotation;
  let wallThickness = 10; // Increased thickness to prevent crossing
  
  // Define walls based on tile type
  let wallDefs = [];
  switch(tile.type) {
    case 'A':
      // Two diagonal walls
      wallDefs.push({ x1: -size/2, y1: -size/2, x2: size/2, y2: size/2 });
      wallDefs.push({ x1: -size/2, y1: size/2, x2: size/2, y2: -size/2 });
      break;
    case 'B':
      // Horizontal and vertical walls
      wallDefs.push({ x1: -size/2, y1: 0, x2: size/2, y2: 0 });
      wallDefs.push({ x1: 0, y1: -size/2, x2: 0, y2: size/2 });
      break;
    case 'C':
      // Two walls forming a corner
      wallDefs.push({ x1: -size/2, y1: 0, x2: 0, y2: size/2 });
      wallDefs.push({ x1: 0, y1: -size/2, x2: size/2, y2: 0 });
      break;
  }
  
  // Create Matter.js walls
  for (let def of wallDefs) {
    let length = dist(def.x1, def.y1, def.x2, def.y2);
    let angle = atan2(def.y2 - def.y1, def.x2 - def.x1);
    
    // Calculate wall position considering rotation
    let wallX = x + (def.x1 + def.x2)/2 * cos(rotation) - (def.y1 + def.y2)/2 * sin(rotation);
    let wallY = y + (def.x1 + def.x2)/2 * sin(rotation) + (def.y1 + def.y2)/2 * cos(rotation);
    
    let wall = Bodies.rectangle(wallX, wallY, length, wallThickness, {
      isStatic: true,
      angle: rotation + angle,
      restitution: 0.5,
      friction: 0.1
    });
    World.add(world, wall);
    tile.walls.push(wall);
    walls.push(wall);
  }
}

// Function to generate a new ball
function generateBall() {
  let x = random(tileSize/2, width - tileSize/2);
  let y = -10;
  let radius = 5;
  let ball = Bodies.circle(x, y, radius, {
    restitution: 0.1,
    friction: 0.01,
    frictionAir: 0.001
  });
  ball.color = random(palette);
  World.add(world, ball);
  balls.push({ body: ball, radius: radius, color: ball.color });
}

// Function to handle mouse clicks
function mousePressed() {
  let i = floor(mouseX / tileSize);
  let j = floor(mouseY / tileSize);
  
  if (i >= 0 && i < gridCols && j >= 0 && j < gridRows) {
    let tile = tiles[i][j];
    
    // Remove existing walls for this tile
    for (let wall of tile.walls) {
      World.remove(world, wall);
      let wallIndex = walls.indexOf(wall);
      if (wallIndex > -1) {
        walls.splice(wallIndex, 1);
      }
    }
    tile.walls = [];
    
    // Change tile type randomly
    tile.type = random(['A', 'B', 'C']);
    
    // Rotate tile
    tile.rotation = floor(random(4)) * HALF_PI;
    
    // Create new walls based on new type and rotation
    createTileWalls(i, j);
  }
}

// Function to handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
