let cols, rows;
let w = 20; // Cell size
let grid = [];
let walls = [];
let visited = [];
let current;
let mazeCompleted = false;

function setup() {
  createCanvas(800, 800);
  cols = floor(width / w);
  rows = floor(height / w);

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

function draw() {
  background(30);

  // Draw all cells
  for (let cell of grid) {
    cell.show();
  }

  // Maze generation using Prim's algorithm
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
    console.log("Maze Completed!");
  }

  // Epic visual effects
  if (mazeCompleted) {
    noLoop();
    // Add your epic visual effects here
    // For example, animate a ball traversing the maze
    traverseMaze();
  }
}

function addWalls(cell) {
  let neighbors = cell.getNeighbors();
  for (let neighbor of neighbors) {
    if (!neighbor.visited) {
      walls.push({ cellA: cell, cellB: neighbor });
    }
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function traverseMaze() {
  // Implement a traversal animation or effect here
  // This function can be expanded to create an epic visualization
}

class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true]; // Top, Right, Bottom, Left
    this.visited = false;
  }

  getNeighbors() {
    let neighbors = [];
    let top = grid[index(this.i, this.j - 1)];
    let right = grid[index(this.i + 1, this.j)];
    let bottom = grid[index(this.i, this.j + 1)];
    let left = grid[index(this.i - 1, this.j)];

    if (top && !visited.includes(top)) neighbors.push(top);
    if (right && !visited.includes(right)) neighbors.push(right);
    if (bottom && !visited.includes(bottom)) neighbors.push(bottom);
    if (left && !visited.includes(left)) neighbors.push(left);

    return neighbors;
  }

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

  show() {
    let x = this.i * w;
    let y = this.j * w;

    stroke(255);
    strokeWeight(2);

    // Epic glow effect
    if (this.visited) {
      noStroke();
      fill(50, 50, 50, 100);
      rect(x, y, w, w);
    }

    // Draw walls
    if (this.walls[0]) line(x, y, x + w, y); // Top
    if (this.walls[1]) line(x + w, y, x + w, y + w); // Right
    if (this.walls[2]) line(x + w, y + w, x, y + w); // Bottom
    if (this.walls[3]) line(x, y + w, x, y); // Left
  }
}
