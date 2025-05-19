// Variables and constants
let particle;
let maze;
let goal;
let cols, rows;
let cellSize = 40;
let grid = [];
let stack = [];
let level = 1;
let score = 100;
let trail = [];
let gameOver = false;

function setup() {
  createCanvas(600, 600);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  resetGame();
}

function draw() {
  background(240);
  
  maze.display();
  particle.update();
  particle.displayTrail();
  particle.display();

  // Draw goal
  fill(120, 200, 120);
  noStroke();
  ellipse(goal.x, goal.y, 20, 20);

  checkWin();
  displayScore();

  // Decrease score by 1 point per second
  if (frameCount % 60 == 0 && score > 0 && !gameOver) {
    score--;
  }

  // Check if time runs out (Game Over)
  if (score === 0 && !gameOver) {
    gameOver = true;
    fill(200, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 2 - 30);
    textSize(24);
    text("You reached Level " + level + " with " + score + " points.", width / 2, height / 2);
    text("Press Enter to restart", width / 2, height / 2 + 30);
    noLoop();
  }
}

function checkWin() {
  let d = dist(particle.pos.x, particle.pos.y, goal.x, goal.y);
  if (d < 10 && !gameOver) {
    fill(0, 150, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("You Win!", width / 2, height / 2 - 20);
    textSize(24);
    text("Press Enter for next level", width / 2, height / 2 + 10);
    noLoop();
  }
}

function resetGame() {
  grid = [];
  stack = [];
  maze = new Maze();
  maze.generateMaze();
  particle = new Particle(cellSize / 2, cellSize / 2);  // Start in top-left corner
  goal = createVector(width - cellSize / 2, height - cellSize / 2);  // End in bottom-right corner
  trail = [];
  loop();  // Restart the game loop
}

function displayScore() {
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 10, 10);
  text("Level: " + level, 10, 30);
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (gameOver) {
      level = 1;
      score = 100;
      gameOver = false;
    } else {
      level++;
      // Add bonus points for completing the level
      score += 100;
    }
    resetGame();
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
  }

  update() {
    this.acc.set(0, 0);

    if (touches.length > 0) {
      // Mobile touch input
      let touchPos = createVector(touches[0].x, touches[0].y);
      let dir = p5.Vector.sub(touchPos, this.pos);
      dir.setMag(0.2);
      this.acc = dir;
    } else {
      // Keyboard input
      if (keyIsDown(LEFT_ARROW)) {
        this.acc.x = -0.2;
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.acc.x = 0.2;
      }
      if (keyIsDown(UP_ARROW)) {
        this.acc.y = -0.2;
      }
      if (keyIsDown(DOWN_ARROW)) {
        this.acc.y = 0.2;
      }
    }

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    let nextPos = p5.Vector.add(this.pos, this.vel);

    // Check for collisions before moving
    if (!this.checkCollision(nextPos)) {
      this.pos = nextPos;
    } else {
      this.vel.mult(0);  // Stop movement if collision detected
    }

    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);

    this.leaveTrail();
  }

  display() {
    fill(30, 150, 255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 12, 12);
  }

  leaveTrail() {
    trail.push(this.pos.copy());
    if (trail.length > 100) {
      trail.splice(0, 1);  // Limit the trail length
    }
  }

  displayTrail() {
    noFill();
    stroke(30, 150, 255, 100);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < trail.length; i++) {
      vertex(trail[i].x, trail[i].y);
    }
    endShape();
  }

  checkCollision(nextPos) {
    // Check collision with walls
    for (let wall of maze.walls) {
      if (circleLineCollision(nextPos.x, nextPos.y, 6, wall.x1, wall.y1, wall.x2, wall.y2)) {
        return true; // Collision detected
      }
    }
    return false;
  }
}

class Maze {
  constructor() {
    this.walls = [];
  }

  generateMaze() {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let cell = new Cell(x, y);
        grid.push(cell);
      }
    }

    let current = grid[0];  // Start at the top-left corner
    current.visited = true;

    while (true) {
      let next = current.checkNeighbors();
      if (next) {
        next.visited = true;
        stack.push(current);
        removeWalls(current, next);
        current = next;
      } else if (stack.length > 0) {
        current = stack.pop();
      } else {
        break;
      }
    }

    // Create walls for the maze as linear lines
    for (let cell of grid) {
      let x = cell.x * cellSize;
      let y = cell.y * cellSize;
      if (cell.walls[0]) this.walls.push(new Wall(x, y, x + cellSize, y));  // Top
      if (cell.walls[1]) this.walls.push(new Wall(x + cellSize, y, x + cellSize, y + cellSize));  // Right
      if (cell.walls[2]) this.walls.push(new Wall(x, y + cellSize, x + cellSize, y + cellSize));  // Bottom
      if (cell.walls[3]) this.walls.push(new Wall(x, y, x, y + cellSize));  // Left
    }
  }

  display() {
    stroke(0);
    strokeWeight(2);
    for (let wall of this.walls) {
      line(wall.x1, wall.y1, wall.x2, wall.y2);
    }
  }
}

class Wall {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = [true, true, true, true];  // Top, right, bottom, left walls
    this.visited = false;
  }

  checkNeighbors() {
    let neighbors = [];

    let top = grid[index(this.x, this.y - 1)];
    let right = grid[index(this.x + 1, this.y)];
    let bottom = grid[index(this.x, this.y + 1)];
    let left = grid[index(this.x - 1, this.y)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      let r = floor(random(neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }
}

function index(x, y) {
  if (x < 0 || y < 0 || x >= cols || y >= rows) {
    return -1;
  }
  return x + y * cols;
}

function removeWalls(a, b) {
  let x = a.x - b.x;
  if (x === 1) {
    a.walls[3] = false;  // Remove left wall of a
    b.walls[1] = false;  // Remove right wall of b
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  let y = a.y - b.y;
  if (y === 1) {
    a.walls[0] = false;  // Remove top wall of a
    b.walls[2] = false;  // Remove bottom wall of b
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

// Function to detect collision between a circle and a line segment
function circleLineCollision(cx, cy, radius, x1, y1, x2, y2) {
  // Vector from x1,y1 to x2,y2
  let ac = createVector(cx - x1, cy - y1);
  let ab = createVector(x2 - x1, y2 - y1);
  let abLength = ab.mag();
  ab.normalize();

  // Project ac onto ab, computing the distance from a to the closest point
  let projection = p5.Vector.dot(ac, ab);
  let closest;

  if (projection < 0) {
    closest = createVector(x1, y1);
  } else if (projection > abLength) {
    closest = createVector(x2, y2);
  } else {
    closest = p5.Vector.add(createVector(x1, y1), ab.mult(projection));
  }

  // Compute the distance between circle center and closest point
  let distToCircle = dist(cx, cy, closest.x, closest.y);
  return distToCircle < radius;
}

// Prevent default touch behavior on mobile
function touchStarted() {
  return false;
}

function touchMoved() {
  return false;
}

function touchEnded() {
  return false;
}
