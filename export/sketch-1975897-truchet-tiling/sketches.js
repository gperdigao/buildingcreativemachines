let tileSize = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  noLoop();
}

function draw() {
  for(let x = 0; x < width; x += tileSize) {
    for(let y = 0; y < height; y += tileSize) {
      push();
      translate(x, y);
      let choice = random(1);
      if(choice < 0.5) {
        arc(0, 0, tileSize, tileSize, 0, HALF_PI);
        arc(tileSize, tileSize, tileSize, tileSize, PI, PI + HALF_PI);
      } else {
        arc(0, tileSize, tileSize, tileSize, HALF_PI, PI);
        arc(tileSize, 0, tileSize, tileSize, PI + HALF_PI, 0);
      }
      pop();
    }
  }
}
