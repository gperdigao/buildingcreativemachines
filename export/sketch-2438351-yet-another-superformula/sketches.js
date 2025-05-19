let m = 0;
let n1 = 1;
let n2 = 1;
let n3 = 1;
let a = 1;
let b = 1;
let sliderM, sliderN1, sliderN2, sliderN3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(245, 245, 220); // Parchment-like background
  angleMode(DEGREES);
  
  // Create sliders for interaction
  sliderM = createSlider(0, 20, 0, 0.1);
  sliderM.position(20, 20);
  sliderM.style('width', '200px');
  
  sliderN1 = createSlider(0.1, 10, 1, 0.1);
  sliderN1.position(20, 50);
  sliderN1.style('width', '200px');
  
  sliderN2 = createSlider(0.1, 10, 1, 0.1);
  sliderN2.position(20, 80);
  sliderN2.style('width', '200px');
  
  sliderN3 = createSlider(0.1, 10, 1, 0.1);
  sliderN3.position(20, 110);
  sliderN3.style('width', '200px');
  
  stroke(0);
  noFill();
}

function draw() {
  background(245, 245, 220, 10); // Fade effect for trailing
  translate(width / 2, height / 2);
  
  m = sliderM.value();
  n1 = sliderN1.value();
  n2 = sliderN2.value();
  n3 = sliderN3.value();
  
  let radius = min(width, height) * 0.4;
  let totalPoints = 360;
  
  strokeWeight(1);
  beginShape();
  for (let angle = 0; angle < 360; angle += 360 / totalPoints) {
    let r = superformula(angle);
    let x = radius * r * cos(angle);
    let y = radius * r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Display parameter values
  resetMatrix();
  fill(0);
  noStroke();
  textSize(16);
  text('m: ' + nf(m, 1, 1), 240, 35);
  text('n1: ' + nf(n1, 1, 1), 240, 65);
  text('n2: ' + nf(n2, 1, 1), 240, 95);
  text('n3: ' + nf(n3, 1, 1), 240, 125);
}

function superformula(theta) {
  let part1 = (1 / a) * cos(m * theta / 4);
  part1 = abs(part1);
  part1 = pow(part1, n2);
  
  let part2 = (1 / b) * sin(m * theta / 4);
  part2 = abs(part2);
  part2 = pow(part2, n3);
  
  let r = pow(part1 + part2, -1 / n1);
  return r;
}
