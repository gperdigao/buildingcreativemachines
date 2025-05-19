let cols, rows;
let w = 20; // Cell size
let grid = [];
let walls = [];
let visited = [];
let current;
let mazeCompleted = false;
let path = [];
let orbPosition = 0;
let particles = [];
let solving = false;
let solvingCompleted = false;
let dfsStack = [];
let dfsStepsPerFrame = 20; // Number of DFS steps per frame for faster solving

function setup() {
  createCanvas(1200, 400);
  cols = floor(width / w);
  rows = floor(height / w);
  frameRate(60); // Increase frame rate for smoother and faster animations

  initializeMaze();
}

function draw() {
  background(30);

  // Draw all cells
  for (let cell of grid) {
    cell.show();
  }

  // Maze generation using Prim's algorithm
  if (!mazeCompleted) {
    let wallsToProcess = 10; // Number of walls to process per frame for faster generation

    for (let n = 0; n < wallsToProcess; n++) {
      if (walls.length > 0) {
        let randomWall = random(walls);
        let { cellA, cellB } = randomWall;

        if (cellB && !cellB.visited) {
          // Remove wall between cellA and cellB
          cellA.removeWalls(cellB);
          cellB.visited = true;
          visited.push(cellB);
          addWalls(cellB);
        }

        // Remove the wall from the list
        walls.splice(walls.indexOf(randomWall), 1);
      } else if (!mazeCompleted) {
        // Maze generation completed
        mazeCompleted = true;

        // Reset visited status for maze solving
        for (let cell of grid) {
          cell.visited = false;
        }

        // Initialize DFS solving
        let startCell = grid[0];
        let endCell = grid[grid.length - 1];
        dfsStack.push(startCell);
        startCell.visited = true;
        solving = true;
      }
    }
  }

  // Maze solving using Iterative DFS
  if (solving && dfsStack.length > 0) {
    for (let n = 0; n < dfsStepsPerFrame; n++) {
      if (dfsStack.length === 0) break;

      let currentCell = dfsStack.pop();

      if (currentCell === grid[grid.length - 1]) {
        // Path found
        solvingCompleted = true;
        solving = false;
        constructPath(currentCell);
        break;
      }

      let neighbors = currentCell.getUnblockedNeighbors();

      for (let neighbor of neighbors) {
        if (!neighbor.visited) {
          neighbor.visited = true;
          neighbor.previous = currentCell;
          dfsStack.push(neighbor);
        }
      }
    }
  }

  // Draw the traversal animation
  if (solvingCompleted && path.length > 0) {
    animateTraversal();
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }
}

// Initialize or reset the maze
function initializeMaze() {
  // Clear all arrays and variables
  grid = [];
  walls = [];
  visited = [];
  dfsStack = [];
  path = [];
  particles = [];
  mazeCompleted = false;
  solving = false;
  solvingCompleted = false;
  orbPosition = 0;

  // Initialize grid cells
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  // Start with a random cell
  current = grid[floor(random(0, grid.length))];
  visited.push(current);
  current.visited = true;
  addWalls(current);
}

// Add walls of a cell to the wall list
function addWalls(cell) {
  let neighbors = cell.getNeighbors();
  for (let neighbor of neighbors) {
    if (!neighbor.visited) {
      walls.push({ cellA: cell, cellB: neighbor });
    }
  }
}

// Convert 2D grid coordinates to 1D index
function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

// Construct the path from end to start and reverse it
function constructPath(endCell) {
  path = [];
  let temp = endCell;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }
  path.reverse(); // Ensure path starts from the beginning

  // Start traversal animation
  orbPosition = 0;
  solvingCompleted = true;
}

// Animate the orb traversing the path
function animateTraversal() {
  if (orbPosition < path.length - 1) {
    orbPosition += 0.4; // Increased speed for faster traversal
    let indexPos = floor(orbPosition);
    let t = orbPosition - indexPos;

    // Ensure that indexPos and indexPos +1 are within bounds
    if (indexPos >= path.length - 1) {
      orbPosition = path.length - 1;
      return;
    }

    let currentCell = path[indexPos];
    let nextCell = path[indexPos + 1];

    if (!nextCell) return; // Prevent accessing undefined

    let x = lerp(
      currentCell.i * w + w / 2,
      nextCell.i * w + w / 2,
      t
    );
    let y = lerp(
      currentCell.j * w + w / 2,
      nextCell.j * w + w / 2,
      t
    );

    // Draw the orb with a glowing effect
    noStroke();
    let glowColor = color(255, 0, 255);
    glowColor.setAlpha(200);
    fill(glowColor);
    ellipse(x, y, w * 0.6, w * 0.6);

    // Add particles
    particles.push(new Particle(x, y));

  } else if (solvingCompleted) {
    // Reset the maze immediately after traversal completes
    initializeMaze();
  }
}

// Particle class for trailing effects
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(1, 3));
    this.acc = createVector(0, 0);
    this.lifespan = 255;
  }

  finished() {
    return this.lifespan < 0;
  }

  update() {
    this.vel.mult(0.95);
    this.pos.add(this.vel);
    this.lifespan -= 5;
  }

  show() {
    noStroke();
    fill(255, 0, 255, this.lifespan);
    ellipse(this.pos.x, this.pos.y, 4);
  }
}

// Cell class representing each cell in the maze
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true]; // Top, Right, Bottom, Left
    this.visited = false;
    this.previous = undefined;
  }

  // Get all neighboring cells
  getNeighbors() {
    let neighbors = [];
    let top = grid[index(this.i, this.j - 1)];
    let right = grid[index(this.i + 1, this.j)];
    let bottom = grid[index(this.i, this.j + 1)];
    let left = grid[index(this.i - 1, this.j)];

    if (top) neighbors.push(top);
    if (right) neighbors.push(right);
    if (bottom) neighbors.push(bottom);
    if (left) neighbors.push(left);

    return neighbors;
  }

  // Get neighbors that are accessible (no wall between)
  getUnblockedNeighbors() {
    let neighbors = [];
    let i = this.i;
    let j = this.j;

    if (!this.walls[0]) {
      let top = grid[index(i, j - 1)];
      if (top) neighbors.push(top);
    }
    if (!this.walls[1]) {
      let right = grid[index(i + 1, j)];
      if (right) neighbors.push(right);
    }
    if (!this.walls[2]) {
      let bottom = grid[index(i, j + 1)];
      if (bottom) neighbors.push(bottom);
    }
    if (!this.walls[3]) {
      let left = grid[index(i - 1, j)];
      if (left) neighbors.push(left);
    }

    return neighbors;
  }

  // Remove walls between this cell and another
  removeWalls(other) {
    let x = this.i - other.i;
    if (x === 1) {
      this.walls[3] = false;
      other.walls[1] = false;
    } else if (x === -1) {
      this.walls[1] = false;
      other.walls[3] = false;
    }
    let y = this.j - other.j;
    if (y === 1) {
      this.walls[0] = false;
      other.walls[2] = false;
    } else if (y === -1) {
      this.walls[2] = false;
      other.walls[0] = false;
    }
  }

  // Display the cell
  show() {
    let x = this.i * w;
    let y = this.j * w;

    stroke(255);
    strokeWeight(2);

    if (this.visited) {
      noStroke();
      fill(50, 50, 50, 100);
      rect(x, y, w, w);
    }

    // Draw walls
    stroke(255);
    if (this.walls[0]) line(x, y, x + w, y); // Top
    if (this.walls[1]) line(x + w, y, x + w, y + w); // Right
    if (this.walls[2]) line(x + w, y + w, x, y + w); // Bottom
    if (this.walls[3]) line(x, y + w, x, y); // Left
  }
}
