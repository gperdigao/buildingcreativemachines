let grid;
let startNode;
let endNode;
let queue = [];
let path = [];
let w, h;
let cols = 40;
let rows = 40;

function setup() {
  createCanvas(400, 400);
  w = width / cols;
  h = height / rows;
  frameRate(10); // Slow down frame rate to 10 frames per second
  grid = new Array(cols);
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  // Create nodes
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Node(i, j);
    }
  }

  // Set start and end nodes
  startNode = grid[0][0];
  endNode = grid[cols - 1][rows - 1];
  startNode.isWall = false;
  endNode.isWall = false;

  queue.push(startNode);
  startNode.visited = true;
}

function draw() {
  background(255);

  // BFS
  if (queue.length > 0) {
    let currentNode = queue.shift();

    if (currentNode === endNode) {
      console.log("Path found!");
      noLoop();
    }

    let neighbors = currentNode.getNeighbors(grid);
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (!neighbor.visited && !neighbor.isWall) {
        queue.push(neighbor);
        neighbor.visited = true;
        neighbor.parent = currentNode;
      }
    }
  } else {
    console.log("No path found!");
    noLoop();
    return;
  }

  // Draw grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j].visited) {
        grid[i][j].show(color(100, 220, 100)); // visited nodes in light green
      } else {
        grid[i][j].show(color(255));
      }
    }
  }

  // Draw path
  path = [];
  let temp = queue[0];
  while (temp.parent) {
    path.push(temp);
    temp = temp.parent;
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255)); // current path in blue
  }
}

class Node {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.isWall = random(1) < 0.3;
    this.visited = false;
    this.parent = undefined;
  }

  show(col) {
    fill(this.isWall ? color(0) : col);
    noStroke();
    rect(this.i * w, this.j * h, w - 1, h - 1);
  }

  getNeighbors(grid) {
    let neighbors = [];
    let i = this.i;
    let j = this.j;
    if (i < cols - 1) neighbors.push(grid[i + 1][j]);
    if (i > 0) neighbors.push(grid[i - 1][j]);
    if (j < rows - 1) neighbors.push(grid[i][j + 1]);
    if (j > 0) neighbors.push(grid[i][j - 1]);
    return neighbors;
  }
}
