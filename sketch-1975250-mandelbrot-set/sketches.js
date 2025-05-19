function setup() {
  createCanvas(400, 400);
  pixelDensity(1);
}

function draw() {
  let maxIter = 100;
  
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = map(x, 0, width, -2, 2);
      let b = map(y, 0, height, -2, 2);
      let ca = a;
      let cb = b;

      let n = 0;
      while (n < maxIter) {
        let aa = a * a - b * b;
        let bb = 2 * a * b;
        a = aa + ca;
        b = bb + cb;
        if (abs(a * a + b * b) > 16) {
          break;
        }
        n++;
      }

      let bright = map(sqrt(n), 0, sqrt(maxIter), 0, 1);
      let pix = (x + y * width) * 4;
      pixels[pix + 0] = bright * 255;
      pixels[pix + 1] = bright * 70; // This value is adjusted to get a pink-ish color
      pixels[pix + 2] = bright * 150; // This value is adjusted to get a pink-ish color
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
}
