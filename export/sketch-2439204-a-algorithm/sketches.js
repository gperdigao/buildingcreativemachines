let cols = 50;
let rows = 50;
let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let start;
let end;
let w, h;
let path = [];
let current;

function heuristic(a, b) {
  // Using Euclidean distance as heuristic
  return dist(a.i, a.j, b.i, b.j);
}

function removeFromArray(arr, elt) {
  for (let i = arr.length -1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function setup() {
  createCanvas(600, 600);
  w = width / cols;
  h = height / rows;

  // Create grid
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  // Initialize Spots
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  // Add neighbors
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  // Start and end
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  openSet.push(start);
}

function draw() {
  background(30);

  if (openSet.length > 0) {
    // Keep going
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    current = openSet[lowestIndex];

    if (current === end) {
      // Path found
      noLoop();
      console.log('Path Found!');
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    let neighbors = current.neighbors;
    for (let neighbor of neighbors) {
      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        let tempG = current.g + heuristic(neighbor, current);

        let newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }

  } else {
    // No solution
    console.log('No Solution');
    noLoop();
    return;
  }

  // Draw grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(50));
    }
  }

  // Closed set
  for (let spot of closedSet) {
    spot.show(color(255, 0, 0, 100));
  }

  // Open set
  for (let spot of openSet) {
    spot.show(color(0, 255, 0, 100));
  }

  // Path
  path = [];
  let temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  // Draw path with gradient
  noFill();
  strokeWeight(w / 2);
  for (let i = 0; i < path.length - 1; i++) {
    let start = path[i];
    let end = path[i + 1];
    let inter = map(i, 0, path.length, 0, 1);
    let col = lerpColor(color(0, 0, 255), color(255, 255, 0), inter);
    stroke(col);
    line(
      start.i * w + w / 2,
      start.j * h + h / 2,
      end.i * w + w / 2,
      end.j * h + h / 2
    );
  }
}

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.3) {
    this.wall = true;
  }

  this.show = function(col) {
    if (this.wall) {
      fill(0);
      noStroke();
      ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
    } else {
      fill(col);
      noStroke();
      rect(this.i * w, this.j * h, w, h);
    }
  };

  this.addNeighbors = function(grid) {
    let i = this.i;
    let j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    // Diagonals (optional)
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  };
}
