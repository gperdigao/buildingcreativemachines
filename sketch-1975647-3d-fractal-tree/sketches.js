let angle;
let slider;

function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = createSlider(0, TWO_PI, PI / 4, 0.01);
  colorMode(HSB);
}

function draw() {
  background(51);
  angle = map(mouseX, 0, width, 0, TWO_PI);
  let len = 150;
  let weight = 15;
  
  translate(width / 2, height);
  stroke(255);
  
  branch(len, weight);
}

function branch(len, weight) {
  strokeWeight(weight);
  let colorHue = map(len, 0, 200, 0, 255);
  stroke(colorHue, 255, 255);
  
  line(0, 0, 0, -len);
  translate(0, -len);
  
  if(len > 4) {
    push();
    rotate(angle);
    branch(len * 0.67, weight * 0.67);
    pop();
    
    push();
    rotate(-angle);
    branch(len * 0.67, weight * 0.67);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
