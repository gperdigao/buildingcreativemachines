let gridSize = 10;
let spacing;
let points = [];

let a_real, a_imag, b_real, b_imag, c_real, c_imag, d_real, d_imag;

function setup() {
  createCanvas(400, 400);
  spacing = width / gridSize;

  // Create sliders
  a_real = createSlider(-2, 2, 1, 0.1);
  a_imag = createSlider(-2, 2, 0, 0.1);
  b_real = createSlider(-2, 2, 0, 0.1);
  b_imag = createSlider(-2, 2, 0, 0.1);
  c_real = createSlider(-2, 2, 0, 0.1);
  c_imag = createSlider(-2, 2, 0, 0.1);
  d_real = createSlider(-2, 2, 1, 0.1);
  d_imag = createSlider(-2, 2, 0, 0.1);

  // Arrange sliders
  let yOff = height + 20;
  let gap = 20;
  arrangeSlider(a_real, "a_real", 0, yOff);
  arrangeSlider(a_imag, "a_imag", 1, yOff);
  arrangeSlider(b_real, "b_real", 2, yOff);
  arrangeSlider(b_imag, "b_imag", 3, yOff);
  arrangeSlider(c_real, "c_real", 4, yOff);
  arrangeSlider(c_imag, "c_imag", 5, yOff);
  arrangeSlider(d_real, "d_real", 6, yOff);
  arrangeSlider(d_imag, "d_imag", 7, yOff);
}

function draw() {
  background(220);

  stroke(0);
  strokeWeight(2);

  // Draw original points grid
  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      point(x, y);
      let z = complex(x / width * 4 - 2, y / height * 4 - 2); // Convert pixel coordinates to complex plane
      let w = mobiusTransform(z);
      let px = map(w.re, -2, 2, 0, width);
      let py = map(w.im, -2, 2, 0, height);
      stroke(lerpColor(color(255, 0, 0), color(0, 0, 255), (x+y) / (width+height)));
      point(px, py);
    }
  }
}

function complex(re, im) {
  return { re: re, im: im };
}

function complexMult(a, b) {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re
  };
}

function complexAdd(a, b) {
  return {
    re: a.re + b.re,
    im: a.im + b.im
  };
}

function complexDiv(a, b) {
  let denom = b.re * b.re + b.im * b.im;
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom
  };
}

function mobiusTransform(z) {
  let a = complex(a_real.value(), a_imag.value());
  let b = complex(b_real.value(), b_imag.value());
  let c = complex(c_real.value(), c_imag.value());
  let d = complex(d_real.value(), d_imag.value());

  let numerator = complexAdd(complexMult(a, z), b);
  let denominator = complexAdd(complexMult(c, z), d);

  return complexDiv(numerator, denominator);
}

function arrangeSlider(slider, label, index, startY) {
  let gap = 25;
  slider.position(10, startY + index * gap);
  createDiv(label).position(slider.x * 2 + slider.width, slider.y);
}

