let trees = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(51);
}

function draw() {
  background(51, 25); // Semi-transparent background for trail effect

  for (let tree of trees) {
    tree.grow();
    tree.display();
  }
}

function mousePressed() {
  trees.push(new Tree(mouseX, mouseY));
}

class Tree {
  constructor(x, y) {
    this.branches = [];
    this.maxLevels = int(random(5, 8));
    this.initialLength = random(50, 100);
    this.origin = createVector(x, y);
    this.angleOffset = random(-PI / 6, PI / 6);
    this.generation = 0;
    this.grown = false;

    // Start growing from the bottom up
    let a = createVector(0, -1);
    a.setMag(this.initialLength);
    let root = new Branch(this.origin, p5.Vector.add(this.origin, a), this.generation, this.maxLevels);
    this.branches.push(root);
  }

  grow() {
    if (!this.grown) {
      let branchesToAdd = [];
      for (let branch of this.branches) {
        if (!branch.finished && branch.generation < this.maxLevels) {
          branchesToAdd.push(branch.branchA());
          branchesToAdd.push(branch.branchB());
          branch.finished = true;
        }
      }
      this.branches = this.branches.concat(branchesToAdd);

      // Check if tree has finished growing
      if (branchesToAdd.length === 0) {
        this.grown = true;
      }
    }
  }

  display() {
    for (let branch of this.branches) {
      branch.display();
    }
  }
}

class Branch {
  constructor(start, end, generation, maxLevels) {
    this.start = start;
    this.end = end;
    this.finished = false;
    this.generation = generation;
    this.maxLevels = maxLevels;
  }

  branchA() {
    let dir = p5.Vector.sub(this.end, this.start);
    dir.rotate(random(-PI / 6, -PI / 4));
    dir.mult(0.67);
    let newEnd = p5.Vector.add(this.end, dir);
    return new Branch(this.end, newEnd, this.generation + 1, this.maxLevels);
  }

  branchB() {
    let dir = p5.Vector.sub(this.end, this.start);
    dir.rotate(random(PI / 4, PI / 6));
    dir.mult(0.67);
    let newEnd = p5.Vector.add(this.end, dir);
    return new Branch(this.end, newEnd, this.generation + 1, this.maxLevels);
  }

  display() {
    stroke(139, 69, 19); // Brown color for branches
    strokeWeight(map(this.maxLevels - this.generation, 0, this.maxLevels, 1, 10));
    line(this.start.x, this.start.y, this.end.x, this.end.y);

    // Leaves at the end branches
    if (this.generation === this.maxLevels) {
      fill(34, 139, 34, 150); // Green leaves
      noStroke();
      ellipse(this.end.x, this.end.y, 10, 10);
    }
  }
}
