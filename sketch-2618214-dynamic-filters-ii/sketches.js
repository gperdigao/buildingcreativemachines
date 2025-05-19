// Epic Colour Ripple – interactive & vibrant
let t = 0;
let paletteIndex = 0;

let palettes = [
  ['#ff5f6d', '#ffc371', '#47cacc'],
  ['#6a11cb', '#2575fc', '#ff6a00'],
  ['#e1eec3', '#f05053', '#ed4264'],
  ['#00c3ff', '#ffff1c', '#ff7e5f'],
  ['#4ca1af', '#c4e0e5', '#fbc2eb']
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noFill();
  strokeWeight(2);
}

function draw() {
  background(0, 0, 10);

  translate(width / 2, height / 2);
  let waves = map(mouseX, 0, width, 2, 20);
  let points = 200;
  let baseR = min(width, height) * 0.25;
  let palette = palettes[paletteIndex];

  beginShape();
  for (let i = 0; i < TWO_PI; i += TWO_PI / points) {
    let offset = sin(i * waves + t) * 40;
    let r = baseR + offset;
    let x = r * cos(i);
    let y = r * sin(i);

    let cIndex = floor(map(i, 0, TWO_PI, 0, palette.length));
    stroke(palette[cIndex % palette.length]);
    vertex(x, y);
  }
  endShape(CLOSE);

  t += 0.02;

  // Overlay UI
  noStroke();
  fill(255, 200);
  textSize(14);
  textAlign(LEFT, TOP);
  text(`Click to change colour palette\nCurrent: ${paletteIndex + 1}/${palettes.length}`, 10 - width / 2, 10 - height / 2);
}

function mousePressed() {
  paletteIndex = (paletteIndex + 1) % palettes.length;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
