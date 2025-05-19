let values = [];
let i = 0;
let j = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  values = new Array(floor(width / 10));
  for (let i = 0; i < values.length; i++) {
    values[i] = random(height);
  }
}

function draw() {
  background(0);
  
  // Bubble Sort
  if (i < values.length) {
    for (let j = 0; j < values.length - i - 1; j++) {
      let a = values[j];
      let b = values[j + 1];
      if (a > b) {
        swap(values, j, j + 1);
      }
    }
  } else {
    console.log("Finished");
    noLoop();
  }
  i++;

  // Draw the values
  for (let i = 0; i < values.length; i++) {
    stroke(0);
    fill(255);
    rect(i * 10, height - values[i], 10, values[i]);
  }
}

function swap(arr, a, b) {
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}
