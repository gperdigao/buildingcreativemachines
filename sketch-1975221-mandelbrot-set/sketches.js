let zoom = 1;
let panX = 0;
let panY = 0;

function setup() {
  createCanvas(800, 800);
  pixelDensity(1);
}

function draw() {
  loadPixels();
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = map(x, 0, width, -2.5 * zoom + panX, 2.5 * zoom + panX);
      let b = map(y, 0, height, -2.5 * zoom + panY, 2.5 * zoom + panY);
      
      let ca = a;
      let cb = b;
      
      let n = 0;
      let maxIter = 100;
      
      while (n < maxIter) {
        let aa = a * a - b * b;
        let bb = 2 * a * b;
        a = aa + ca;
        b = bb + cb;
        if (abs(a + b) > 16) {
          break;
        }
        n++;
      }
      
      let hue = sqrt(map(n, 0, maxIter, 0, 1)) * 360; // Map the number of iterations to a hue value
      
      let pix = (x + y * width) * 4;
      if (n === maxIter) {
        pixels[pix + 0] = 0;
        pixels[pix + 1] = 0;
        pixels[pix + 2] = 0;
      } else {
        let c = color(hue, 100, 100); // Convert the hue to an RGB color
        pixels[pix + 0] = red(c);
        pixels[pix + 1] = green(c);
        pixels[pix + 2] = blue(c);
      }
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
}

function mouseDragged() {
  panX += (pmouseX - mouseX) / (width / 4) * zoom;
  panY += (pmouseY - mouseY) / (height / 4) * zoom;
  redraw();
}

function mouseWheel(event) {
  zoom *= pow(1.001, event.delta);
  redraw();
}
