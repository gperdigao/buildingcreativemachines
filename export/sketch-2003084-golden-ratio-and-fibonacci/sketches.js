let fibs = [1, 1];
let maxFibs = 10;

function setup() {
  createCanvas(400, 400);
  background(220);
  noLoop();
  noFill();
}

function draw() {
  background(220);

  // Calculate Fibonacci sequence
  while (fibs.length < maxFibs) {
    let nextFib = fibs[fibs.length - 1] + fibs[fibs.length - 2];
    fibs.push(nextFib);
  }

  let x = 0;
  let y = height;
  let w = fibs[fibs.length - 1];
  let h = fibs[fibs.length - 1];

  for (let i = fibs.length - 1; i >= 0; i--) {
    let prevX = x;
    let prevY = y;

    stroke(50);
    strokeWeight(2);
    rect(x, y - h, w, h);

    fill(255, 100, 150, 150);
    beginShape();
    for (let angle = 0; angle < TWO_PI; angle += 0.01) {
      let xOffset = cos(angle) * fibs[i];
      let yOffset = sin(angle) * fibs[i];
      vertex(prevX + xOffset, prevY - yOffset);
    }
    endShape();

    switch (i % 4) {
      case 0:
        y -= h;
        break;
      case 1:
        x += w;
        break;
      case 2:
        x -= fibs[i];
        w = fibs[i];
        break;
      case 3:
        y += fibs[i];
        h = fibs[i];
        x += fibs[i - 1];
        w = fibs[i];
        break;
    }
  }
}

function mousePressed() {
  if (maxFibs < 15) {
    maxFibs++;
    fibs = [1, 1];
  } else {
    maxFibs = 2;
  }
  redraw();
}
