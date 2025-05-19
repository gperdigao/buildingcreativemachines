let values = [];
let i = 0;
let j = 0;
let sortingAlgorithm = "bubble"; // Alterna entre "bubble" e "merge"
let mergeSteps = [];
let angleOffset = 0;

function setup() {
  createCanvas(600, 600);
  for (let k = 0; k < 100; k++) {
    values.push(random(height / 2));
  }
  mergeSteps = mergeSort([...values]);
  noStroke();
}

function draw() {
  background(10, 10, 30, 50); // Fundo mais escuro e translúcido
  translate(width / 2, height / 2);
  if (sortingAlgorithm === "bubble") {
    bubbleSortStep();
  } else if (sortingAlgorithm === "merge") {
    mergeSortStep();
  }
  drawSpiralBars();
  angleOffset += 0.02;
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

function drawSpiralBars() {
  for (let k = 0; k < values.length; k++) {
    let angle = angleOffset + k * 0.1;
    let radius = map(values[k], 0, height / 2, 50, width / 2);
    let barHeight = map(values[k], 0, height / 2, 5, 20);
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    let colorValue = map(k, 0, values.length, 0, 255);
    fill(colorValue, 200, 255 - colorValue, 180);
    push();
    translate(x, y);
    rotate(angle);
    rect(0, 0, barHeight, 8); // Desenha barras mais espessas
    pop();
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
