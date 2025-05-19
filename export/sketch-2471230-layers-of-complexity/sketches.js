let maze;
let particles = [];
let numParticles = 200;
let angleOffset = 0;
let buildingMaze = true;
let buildStep = 0;
let buildSpeed = 100; // Adjust to control maze building speed

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  maze = new CircularMaze(10, 30); // Adjust rings and sectors for complexity
  maze.initMaze();
  initializeParticles();
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  rotate(angleOffset);
  angleOffset += 0.1; // Control rotation speed

  if (buildingMaze) {
    maze.buildMaze(buildStep);
    buildStep += buildSpeed;
    if (buildStep >= maze.totalCells) {
      buildingMaze = false;
      maze.prepareMaze();
    }
  } else {
    maze.display();
    updateParticles();
  }
}

function initializeParticles() {
  for (let i = 0; i < numParticles; i++) {
    let startCell = maze.cells[maze.rings - 1][floor(random(maze.sectors))];
    particles.push(new Particle(startCell));
  }
}

function updateParticles() {
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}

// Circular Maze Class
class CircularMaze {
  constructor(rings, sectors) {
    this.rings = rings;
    this.sectors = sectors;
    this.cells = [];
    this.stack = [];
    this.totalCells = rings * sectors;
    this.buildOrder = [];
    this.currentBuildIndex = 0;
  }

  initMaze() {
    // Initialize cells
    for (let r = 0; r < this.rings; r++) {
      this.cells[r] = [];
      for (let s = 0; s < this.sectors; s++) {
        this.cells[r][s] = new Cell(r, s, this.rings, this.sectors);
      }
    }

    // Randomize build order for maze generation
    let allCells = [];
    for (let r = 0; r < this.rings; r++) {
      for (let s = 0; s < this.sectors; s++) {
        allCells.push(this.cells[r][s]);
      }
    }
    this.buildOrder = shuffle(allCells);
  }

  buildMaze(steps) {
    for (let i = 0; i < steps && this.currentBuildIndex < this.buildOrder.length; i++) {
      let cell = this.buildOrder[this.currentBuildIndex];
      cell.visited = true;
      let neighbors = cell.getNeighbors(this.cells);

      if (neighbors.length > 0) {
        let neighbor = random(neighbors);
        cell.removeWalls(neighbor);
      }

      this.currentBuildIndex++;
    }

    // Display partially built maze
    for (let r = 0; r < this.rings; r++) {
      for (let s = 0; s < this.sectors; s++) {
        this.cells[r][s].displayPartial();
      }
    }
  }

  prepareMaze() {
    // After building, reset visited status
    for (let r = 0; r < this.rings; r++) {
      for (let s = 0; s < this.sectors; s++) {
        this.cells[r][s].visited = false;
      }
    }
  }

  display() {
    for (let r = 0; r < this.rings; r++) {
      for (let cell of this.cells[r]) {
        cell.display();
      }
    }
  }
}

// Cell Class
class Cell {
  constructor(r, s, rings, sectors) {
    this.r = r; // ring index
    this.s = s; // sector index
    this.rings = rings;
    this.sectors = sectors;
    this.visited = false;
    this.walls = [true, true, true, true]; // [inner, right, outer, left]
  }

  getNeighbors(cells) {
    let neighbors = [];

    // Inner neighbor
    if (this.r > 0) {
      let innerNeighbor = cells[this.r - 1][this.s];
      if (!innerNeighbor.visited) neighbors.push(innerNeighbor);
    }

    // Outer neighbor
    if (this.r < this.rings - 1) {
      let outerNeighbor = cells[this.r + 1][this.s];
      if (!outerNeighbor.visited) neighbors.push(outerNeighbor);
    }

    // Right neighbor
    let rightS = (this.s + 1) % this.sectors;
    let rightNeighbor = cells[this.r][rightS];
    if (!rightNeighbor.visited) neighbors.push(rightNeighbor);

    // Left neighbor
    let leftS = (this.s - 1 + this.sectors) % this.sectors;
    let leftNeighbor = cells[this.r][leftS];
    if (!leftNeighbor.visited) neighbors.push(leftNeighbor);

    return neighbors;
  }

  removeWalls(next) {
    let dr = next.r - this.r;
    let ds = next.s - this.s;

    if (dr === 1 || dr === -this.rings + 1) {
      // Next is outer neighbor
      this.walls[2] = false;
      next.walls[0] = false;
    } else if (dr === -1 || dr === this.rings - 1) {
      // Next is inner neighbor
      this.walls[0] = false;
      next.walls[2] = false;
    } else if (ds === 1 || ds === -this.sectors + 1) {
      // Next is right neighbor
      this.walls[1] = false;
      next.walls[3] = false;
    } else if (ds === -1 || ds === this.sectors - 1) {
      // Next is left neighbor
      this.walls[3] = false;
      next.walls[1] = false;
    }
  }

  display() {
    let angleStep = 360 / this.sectors;
    let innerRadius = (this.r * (width / 2) / this.rings);
    let outerRadius = ((this.r + 1) * (width / 2) / this.rings);
    let startAngle = this.s * angleStep;
    let endAngle = (this.s + 1) * angleStep;

    stroke(255);
    strokeWeight(2);

    // Draw walls
    if (this.walls[0]) {
      // Inner wall
      arc(0, 0, innerRadius * 2, innerRadius * 2, startAngle, endAngle);
    }
    if (this.walls[2]) {
      // Outer wall
      arc(0, 0, outerRadius * 2, outerRadius * 2, startAngle, endAngle);
    }
    if (this.walls[1]) {
      // Right wall
      line(
        innerRadius * cos(endAngle),
        innerRadius * sin(endAngle),
        outerRadius * cos(endAngle),
        outerRadius * sin(endAngle)
      );
    }
    if (this.walls[3]) {
      // Left wall
      line(
        innerRadius * cos(startAngle),
        innerRadius * sin(startAngle),
        outerRadius * cos(startAngle),
        outerRadius * sin(startAngle)
      );
    }
  }

  displayPartial() {
    // Display only the built parts of the maze during construction
    if (this.visited) {
      this.display();
    }
  }
}

// Particle Class
class Particle {
  constructor(cell) {
    this.currentCell = cell;
    this.path = [cell];
    this.step = 0;
    this.findPath();
  }

  findPath() {
    // Random walk to create a path within the maze
    let steps = 100;
    for (let i = 0; i < steps; i++) {
      let neighbors = this.getAvailableNeighbors(this.currentCell);
      if (neighbors.length > 0) {
        this.currentCell = random(neighbors);
        this.path.push(this.currentCell);
      } else {
        break;
      }
    }
  }

  getAvailableNeighbors(cell) {
    let neighbors = [];
    let cells = maze.cells;
    let r = cell.r;
    let s = cell.s;

    // Inner neighbor
    if (!cell.walls[0]) {
      neighbors.push(cells[r - 1][s]);
    }

    // Outer neighbor
    if (!cell.walls[2]) {
      neighbors.push(cells[r + 1][s]);
    }

    // Right neighbor
    let rightS = (s + 1) % maze.sectors;
    if (!cell.walls[1]) {
      neighbors.push(cells[r][rightS]);
    }

    // Left neighbor
    let leftS = (s - 1 + maze.sectors) % maze.sectors;
    if (!cell.walls[3]) {
      neighbors.push(cells[r][leftS]);
    }

    return neighbors;
  }

  update() {
    this.step += 0.5; // Control the speed
    if (this.step >= this.path.length) {
      this.step = 0;
    }
  }

  display() {
    let index = floor(this.step);
    let currentCell = this.path[index];

    let angleStep = 360 / maze.sectors;
    let innerRadius = (currentCell.r * (width / 2) / maze.rings);
    let outerRadius = ((currentCell.r + 1) * (width / 2) / maze.rings);
    let startAngle = currentCell.s * angleStep;
    let endAngle = (currentCell.s + 1) * angleStep;
    let angle = lerp(startAngle, endAngle, 0.5);
    let radius = lerp(innerRadius, outerRadius, 0.5);

    let x = radius * cos(angle);
    let y = radius * sin(angle);

    noStroke();
    fill(255, 0, 0); // Red color for visibility
    ellipse(x, y, 6);

    // Trail effect
    fill(255, 0, 0, 100);
    for (let i = 1; i < 5; i++) {
      let trailIndex = index - i;
      if (trailIndex >= 0) {
        let trailCell = this.path[trailIndex];
        let trailInnerRadius = (trailCell.r * (width / 2) / maze.rings);
        let trailOuterRadius = ((trailCell.r + 1) * (width / 2) / maze.rings);
        let trailStartAngle = trailCell.s * angleStep;
        let trailEndAngle = (trailCell.s + 1) * angleStep;
        let trailAngle = lerp(trailStartAngle, trailEndAngle, 0.5);
        let trailRadius = lerp(trailInnerRadius, trailOuterRadius, 0.5);

        let trailX = trailRadius * cos(trailAngle);
        let trailY = trailRadius * sin(trailAngle);
        ellipse(trailX, trailY, 6 - i);
      }
    }
  }
}
