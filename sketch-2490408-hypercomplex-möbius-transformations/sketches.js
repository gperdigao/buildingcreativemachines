let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(1);
}

function draw() {
  background(10, 20);
  translate(width / 2, height / 2);
  
  let points = 400; // Number of points for the transformation
  let scaleFactor = min(width, height) * 0.35;
  
  stroke(255, 200);
  beginShape();
  for (let i = 0; i < points; i++) {
    let theta = map(i, 0, points, 0, TWO_PI);
    let z = createVector(cos(theta), sin(theta));

    // Apply hypercomplex Möbius transformation
    let transformed = mobiusTransform(z, t);
    let x = transformed.x * scaleFactor;
    let y = transformed.y * scaleFactor;

    vertex(x, y);
  }
  endShape(CLOSE);

  t += 0.01;
}

// Möbius transformation function: hypercomplex dynamic flow
function mobiusTransform(z, t) {
  let a = createVector(sin(t) * 0.5, cos(t) * 0.5); // Varying 'a' parameter
  let b = createVector(cos(t) * 0.5, -sin(t) * 0.5); 
  let c = createVector(sin(t * 0.5) * 0.3, cos(t * 0.5) * 0.3); 
  let d = createVector(cos(t * 0.5) * 0.3, -sin(t * 0.5) * 0.3);
  
  // Möbius transformation: (a*z + b) / (c*z + d)
  let numerator = complexAdd(complexMult(a, z), b);
  let denominator = complexAdd(complexMult(c, z), d);
  return complexDiv(numerator, denominator);
}

// Complex multiplication
function complexMult(c1, c2) {
  return createVector(c1.x * c2.x - c1.y * c2.y, c1.x * c2.y + c1.y * c2.x);
}

// Complex addition
function complexAdd(c1, c2) {
  return createVector(c1.x + c2.x, c1.y + c2.y);
}

// Complex division
function complexDiv(c1, c2) {
  let denom = c2.x * c2.x + c2.y * c2.y;
  return createVector(
    (c1.x * c2.x + c1.y * c2.y) / denom,
    (c1.y * c2.x - c1.x * c2.y) / denom
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
