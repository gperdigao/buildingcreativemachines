let slider;

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  slider = createSlider(-2, 2, 0, 0.01);
}

function draw() {
  let ca = slider.value();
  let cb = slider.value();
  loadPixels();

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = map(x, 0, width, -2, 2);
      let b = map(y, 0, height, -2, 2);

      let n = 0;
      while (n < 100) {
        let aa = a * a - b * b;
        let bb = 2 * a * b;
        a = aa + ca;
        b = bb + cb;
        if (abs(a + b) > 16) {
          break;
        }
        n++;
      }

      let bright = map(n, 0, 100, 0, 1);
      bright = map(sqrt(bright), 0, 1, 0, 255);

      if (n === 100) {
        bright = 255;
      }

      let pix = (x + y * width) * 4;
      pixels[pix + 0] = bright;
      pixels[pix + 1] = bright;
      pixels[pix + 2] = bright;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
}
