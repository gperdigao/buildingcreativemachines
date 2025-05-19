let t = 0;

let slider1, slider2, slider3, slider4;

function setup() {
  createCanvas(800, 800);
  slider1 = createSlider(1, 10, 5, 0.1);
  slider2 = createSlider(1, 10, 5, 0.1);
  slider3 = createSlider(0, TWO_PI, PI / 2, 0.01);
  slider4 = createSlider(0, TWO_PI, PI / 2, 0.01);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  stroke(255);
  noFill();

  beginShape();
  for (let t = 0; t < 1000; t += 0.01) {
    let x = sin(t * slider1.value() + slider3.value()) * 200;
    let y = sin(t * slider2.value() + slider4.value()) * 200;
    vertex(x, y);
  }
  endShape();
}
