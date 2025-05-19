let factor = 0;
let particles = [];
let numParticles = 500;
let maze;
let mazeCols, mazeRows;
let cellSize = 20;
let solving = false;
let mazeInitialized = false;

function setup() {
  createCanvas(1200, 800);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 100);
  noFill();

  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  // Initialize maze
  mazeCols = floor(width / cellSize);
  mazeRows = floor(height / cellSize);
  maze = new Maze(mazeCols, mazeRows, cellSize);
}

function draw() {
  background(0, 0, 0, 20);
  translate(width / 2, height / 2);

  // Dynamic particle formation
  updateParticles();

  // Draw the circular pattern with dynamic lines
  drawCircularPattern();

  // Maze generation and solving
  if (!mazeInitialized) {
    maze.generate();
  } else if (!solving) {
    maze.solve();
    solving = true;
  } else {
    maze.displaySolution();
  }

  factor += 0.005;
}

// Function to draw the circular pattern
function drawCircularPattern() {
  let totalPoints = 200;
  let maxRadius = min(width, height) / 2 - 50;

  for (let layer = 1; layer <= 3; layer++) {
    let radius = (maxRadius / 3) * layer;

    for (let i = 0; i < totalPoints; i++) {
      let startAngle = map(i, 0, totalPoints, 0, 360);
      let endAngle = map((i * factor) % totalPoints, 0, totalPoints, 0, 360);

      let startX = radius * cos(startAngle);
      let startY = radius * sin(startAngle);

      let endX = radius * cos(endAngle);
      let endY = radius * sin(endAngle);

      stroke(
        (startAngle + frameCount) % 360,
        80,
        100,
        50 + 50 * sin(frameCount / 10)
      );
      strokeWeight(1 + sin(frameCount / 20 + layer) * 2);
      line(startX, startY, endX, endY);
    }
  }
}

// Function to update and display particles
function updateParticles() {
  for (let p of particles) {
    p.update();
    p.display();
  }
}

// Particle class for dynamic particle formation
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.maxSpeed = 5;
    this.maxForce = 0.1;
    this.size = random(2, 4);
    this.color = color(random(360), 80, 100, 80);
    this.target = createVector(random(width), random(height));
  }

  update() {
    // Move towards the target
    let desired = p5.Vector.sub(this.target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);

    this.acc.add(steer);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Change target occasionally
    if (d < 5) {
      this.target = createVector(random(width), random(height));
    }
  }

  display() {
    push();
    stroke(this.color);
    strokeWeight(this.size);
    point(this.pos.x - width / 2, this.pos.y - height / 2);
    pop();
  }
}

// Maze classes and functions
class Maze {
  constructor(cols, rows, w) {
    this.cols = cols;
    this.rows = rows;
    this.w = w;
    this.grid = [];
    this.stack = [];
    this.current;
    this.completed = false;
    this.path = [];
    this.solving = false;
    this.solvingCompleted = false;
    this.dfsStack = [];

    // Initialize grid cells
    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        let cell = new Cell(i, j, this.w);
        this.grid.push(cell);
      }
    }

    // Start with a random cell
    this.current = this.grid[0];
    this.current.visited = true;
  }

  generate() {
    // Maze generation using recursive backtracking
    let next = this.current.checkNeighbors(this.grid, this.cols, this.rows);
    if (next) {
      next.visited = true;

      this.stack.push(this.current);

      removeWalls(this.current, next);

      this.current = next;
    } else if (this.stack.length > 0) {
      this.current = this.stack.pop();
    } else {
      // Maze generation completed
      mazeInitialized = true;
    }

    // Display maze
    for (let cell of this.grid) {
      cell.show();
    }
  }

  solve() {
    // Initialize DFS solving
    let startCell = this.grid[0];
    let endCell = this.grid[this.grid.length - 1];
    this.dfsStack.push(startCell);
    startCell.visited = true;
    this.solving = true;

    // Reset visited status
    for (let cell of this.grid) {
      cell.visited = false;
    }
  }

  displaySolution() {
    // Maze solving using iterative DFS
    if (this.solving && this.dfsStack.length > 0) {
      let currentCell = this.dfsStack.pop();

      if (currentCell === this.grid[this.grid.length - 1]) {
        // Path found
        this.solvingCompleted = true;
        this.solving = false;
        this.constructPath(currentCell);
      }

      let neighbors = currentCell.getUnblockedNeighbors(this.grid, this.cols, this.rows);

      for (let neighbor of neighbors) {
        if (!neighbor.visited) {
          neighbor.visited = true;
          neighbor.previous = currentCell;
          this.dfsStack.push(neighbor);
        }
      }
    }

    // Animate traversal
    if (this.solvingCompleted && this.path.length > 0) {
      this.animateTraversal();
    }

    // Display maze
    for (let cell of this.grid) {
      cell.show();
    }
  }

  constructPath(endCell) {
    this.path = [];
    let temp = endCell;
    this.path.push(temp);
    while (temp.previous) {
      this.path.push(temp.previous);
      temp = temp.previous;
    }
    this.path.reverse();
    this.orbPosition = 0;
    this.solvingCompleted = true;
  }

  animateTraversal() {
    if (this.orbPosition < this.path.length - 1) {
      this.orbPosition += 0.5;
      let indexPos = floor(this.orbPosition);
      let t = this.orbPosition - indexPos;

      if (indexPos >= this.path.length - 1) {
        this.orbPosition = this.path.length - 1;
        return;
      }

      let currentCell = this.path[indexPos];
      let nextCell = this.path[indexPos + 1];

      if (!nextCell) return;

      let x = lerp(
        currentCell.i * this.w + this.w / 2,
        nextCell.i * this.w + this.w / 2,
        t
      );
      let y = lerp(
        currentCell.j * this.w + this.w / 2,
        nextCell.j * this.w + this.w / 2,
        t
      );

      // Draw the orb with a glowing effect
      push();
      translate(-width / 2, -height / 2);
      noStroke();
      let glowColor = color((frameCount * 2) % 360, 80, 100, 80);
      fill(glowColor);
      ellipse(x, y, this.w * 0.6, this.w * 0.6);
      pop();

      // Add particles at the orb position
      particles.push(new Particle(x + width / 2, y + height / 2));
    } else if (this.solvingCompleted) {
      // Reset the maze after traversal completes
      setup();
    }
  }
}

class Cell {
  constructor(i, j, w) {
    this.i = i;
    this.j = j;
    this.w = w;
    this.walls = [true, true, true, true]; // Top, Right, Bottom, Left
    this.visited = false;
    this.previous = undefined;
  }

  checkNeighbors(grid, cols, rows) {
    let neighbors = [];

    let top = grid[index(this.i, this.j - 1, cols, rows)];
    let right = grid[index(this.i + 1, this.j, cols, rows)];
    let bottom = grid[index(this.i, this.j + 1, cols, rows)];
    let left = grid[index(this.i - 1, this.j, cols, rows)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }

  getUnblockedNeighbors(grid, cols, rows) {
    let neighbors = [];
    let i = this.i;
    let j = this.j;

    if (!this.walls[0]) {
      let top = grid[index(i, j - 1, cols, rows)];
      if (top) neighbors.push(top);
    }
    if (!this.walls[1]) {
      let right = grid[index(i + 1, j, cols, rows)];
      if (right) neighbors.push(right);
    }
    if (!this.walls[2]) {
      let bottom = grid[index(i, j + 1, cols, rows)];
      if (bottom) neighbors.push(bottom);
    }
    if (!this.walls[3]) {
      let left = grid[index(i - 1, j, cols, rows)];
      if (left) neighbors.push(left);
    }

    return neighbors;
  }

  show() {
    let x = this.i * this.w - width / 2;
    let y = this.j * this.w - height / 2;

    push();
    stroke(255);
    strokeWeight(2);

    // Draw walls
    if (this.walls[0]) line(x, y, x + this.w, y); // Top
    if (this.walls[1]) line(x + this.w, y, x + this.w, y + this.w); // Right
    if (this.walls[2]) line(x + this.w, y + this.w, x, y + this.w); // Bottom
    if (this.walls[3]) line(x, y + this.w, x, y); // Left
    pop();
  }
}

// Remove walls between two cells
function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

// Convert 2D grid coordinates to 1D index
function index(i, j, cols, rows) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}
