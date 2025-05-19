let values = [];
let stars = [];
let i = 0;
let j = 0;
let sortingAlgorithm = "bubble"; // Alterna entre "bubble" e "merge"
let mergeSteps = [];

function setup() {
  createCanvas(600, 600);
  for (let k = 0; k < 150; k++) {
    values.push(random(height / 2));
    stars.push(createVector(random(-width / 2, width / 2), random(-height / 2, height / 2)));
  }
  mergeSteps = mergeSort([...values]);
  noFill();
}

function draw() {
  background(5, 5, 15); // Fundo escuro como o espaço
  translate(width / 2, height / 2);
  
  if (sortingAlgorithm === "bubble") {
    bubbleSortStep();
  } else if (sortingAlgorithm === "merge") {
    mergeSortStep();
  }
  
  drawGalaxy();
}

function bubbleSortStep() {
  if (i < values.length) {
    if (j < values.length - i - 1) {
      if (values[j] > values[j + 1]) {
        [values[j], values[j + 1]] = [values[j + 1], values[j]];
      }
      j++;
    } else {
      j = 0;
      i++;
    }
  } else {
    sortingAlgorithm = "merge";
  }
}

function mergeSortStep() {
  if (mergeSteps.length > 0) {
    values = mergeSteps.shift();
  } else {
    sortingAlgorithm = "done";
  }
}

function drawGalaxy() {
  for (let k = 0; k < values.length; k++) {
    let angle = map(k, 0, values.length, 0, TWO_PI);
    let radius = map(values[k], 0, height / 2, 50, width / 2);
    let target = p5.Vector.fromAngle(angle).mult(radius);

    // Move stars smoothly toward their sorted positions
    stars[k].lerp(target, 0.05);

    // Draw stars as bright points
    let colorValue = map(values[k], 0, height / 2, 100, 255);
    stroke(colorValue, colorValue * 0.8, 255, 200);
    strokeWeight(3);
    point(stars[k].x, stars[k].y);

    // Trailing effect for movement
    strokeWeight(1);
    line(0, 0, stars[k].x, stars[k].y);
  }
}

function mergeSort(arr) {
  if (arr.length <= 1) return [arr];
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  return mergeSteps.concat(merge(left[0], right[0]));
}

function merge(left, right) {
  let result = [];
  let steps = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
    steps.push([...result, ...left, ...right]);
  }
  return steps.concat([result.concat(left).concat(right)]);
}
