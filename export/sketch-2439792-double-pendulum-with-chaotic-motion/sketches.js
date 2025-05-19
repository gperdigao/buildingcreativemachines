let r1 = 150;
let r2 = 150;
let m1 = 10;
let m2 = 10;
let a1, a2;
let a1_v = 0;
let a2_v = 0;
let g = 1;
let px2 = -1;
let py2 = -1;
let dragging = false;

function setup() {
  createCanvas(800, 600);
  a1 = Math.PI / 2;
  a2 = Math.PI / 2;
  background(255);
}

function draw() {
  background(255, 5); // light fade to create motion blur effect

  if (!dragging) {
    // Calculate accelerations
    let num1 = -g * (2 * m1 + m2) * sin(a1);
    let num2 = -m2 * g * sin(a1 - 2 * a2);
    let num3 = -2 * sin(a1 - a2) * m2;
    let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2);
    let den = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a1_a = (num1 + num2 + num3 * num4) / den;

    num1 = 2 * sin(a1 - a2);
    num2 = (a1_v * a1_v * r1 * (m1 + m2));
    num3 = g * (m1 + m2) * cos(a1);
    num4 = a2_v * a2_v * r2 * m2 * cos(a1 - a2);
    den = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a2_a = (num1 * (num2 + num3 + num4)) / den;

    // Update velocities and angles
    a1_v += a1_a;
    a2_v += a2_a;
    a1 += a1_v;
    a2 += a2_v;

    // Damping
    a1_v *= 0.99;
    a2_v *= 0.99;
  }

  // Calculate positions
  let x1 = r1 * sin(a1) + width / 2;
  let y1 = r1 * cos(a1) + height / 2;
  let x2 = x1 + r2 * sin(a2);
  let y2 = y1 + r2 * cos(a2);

  // Draw arms
  stroke(0);
  strokeWeight(1);
  line(width / 2, height / 2, x1, y1);
  line(x1, y1, x2, y2);

  // Draw bobs
  fill(0);
  ellipse(x1, y1, m1, m1);
  ellipse(x2, y2, m2, m2);

  // Draw the path of the second bob
  stroke(0, 150);
  strokeWeight(0.5);
  if (px2 != -1 && py2 != -1) {
    line(px2, py2, x2, y2);
  }

  px2 = x2;
  py2 = y2;
}

function mousePressed() {
  let d1 = dist(mouseX, mouseY, width / 2 + r1 * sin(a1), height / 2 + r1 * cos(a1));
  let d2 = dist(mouseX, mouseY, width / 2 + r1 * sin(a1) + r2 * sin(a2), height / 2 + r1 * cos(a1) + r2 * cos(a2));
  if (d1 < m1 || d2 < m2) {
    dragging = true;
    a1_v = 0;
    a2_v = 0;
  }
}

function mouseDragged() {
  if (dragging) {
    a1 = atan2(mouseY - height / 2, mouseX - width / 2);
    a2 = atan2(mouseY - (height / 2 + r1 * cos(a1)), mouseX - (width / 2 + r1 * sin(a1))) - a1;
  }
}

function mouseReleased() {
  dragging = false;
}
