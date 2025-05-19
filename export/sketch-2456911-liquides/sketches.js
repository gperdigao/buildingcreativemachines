let fluid;

function setup() {
  createCanvas(800, 800);
  pixelDensity(1); // Ensure consistent pixel density
  fluid = new Fluid(0.2, 0, 0.0001); // dt, diffusion, viscosity
}

function draw() {
  background(0);

  // Add fluid at mouse position when pressed
  if (mouseIsPressed) {
    let x = floor(mouseX / fluid.scale);
    let y = floor(mouseY / fluid.scale);
    fluid.addDensity(x, y, 100);
    let amountX = (mouseX - pmouseX) * 0.1;
    let amountY = (mouseY - pmouseY) * 0.1;
    fluid.addVelocity(x, y, amountX, amountY);
  }

  fluid.step();
  fluid.renderD();
}

class Fluid {
  constructor(dt, diffusion, viscosity) {
    this.N = 100; // Reduced grid size for performance
    this.dt = dt;
    this.diff = diffusion;
    this.visc = viscosity;

    this.size = this.N + 2; // Including boundary
    this.s = new Array(this.size * this.size).fill(0);
    this.density = new Array(this.size * this.size).fill(0);

    this.Vx = new Array(this.size * this.size).fill(0);
    this.Vy = new Array(this.size * this.size).fill(0);

    this.Vx0 = new Array(this.size * this.size).fill(0);
    this.Vy0 = new Array(this.size * this.size).fill(0);

    this.scale = width / this.N;
  }

  addDensity(x, y, amount) {
    let index = IX(x, y);
    if (index >= 0 && index < this.density.length) {
      this.density[index] += amount;
    }
  }

  addVelocity(x, y, amountX, amountY) {
    let index = IX(x, y);
    if (index >= 0 && index < this.Vx.length) {
      this.Vx[index] += amountX;
      this.Vy[index] += amountY;
    }
  }

  step() {
    let N = this.N;
    let visc = this.visc;
    let diff = this.diff;
    let dt = this.dt;
    let Vx = this.Vx;
    let Vy = this.Vy;
    let Vx0 = this.Vx0;
    let Vy0 = this.Vy0;
    let s = this.s;
    let density = this.density;

    diffuse(1, Vx0, Vx, visc, dt, N);
    diffuse(2, Vy0, Vy, visc, dt, N);

    project(Vx0, Vy0, Vx, Vy, N);

    advect(1, Vx, Vx0, Vx0, Vy0, dt, N);
    advect(2, Vy, Vy0, Vx0, Vy0, dt, N);

    project(Vx, Vy, Vx0, Vy0, N);

    diffuse(0, s, density, diff, dt, N);
    advect(0, density, s, Vx, Vy, dt, N);
  }

  renderD() {
    loadPixels();
    for (let i = 1; i <= this.N; i++) {
      for (let j = 1; j <= this.N; j++) {
        let x = (i - 1) * this.scale;
        let y = (j - 1) * this.scale;
        let d = this.density[IX(i, j)];
        if (d > 0) {
          let screenX = floor(x);
          let screenY = floor(y);
          if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
            let pixelIndex = 4 * (screenX + screenY * width);
            // Example color mapping (adjust as needed)
            pixels[pixelIndex] = 180; // Red
            pixels[pixelIndex + 1] = 255; // Green
            pixels[pixelIndex + 2] = constrain(d, 0, 255); // Blue
            pixels[pixelIndex + 3] = 255; // Alpha
          }
        }
      }
    }
    updatePixels();
  }
}

// Helper Functions

function IX(x, y) {
  return x + (y * (100 + 2)); // Adjusted for boundary
}

function diffuse(b, x, x0, diff, dt, N) {
  let a = dt * diff * N * N;
  lin_solve(b, x, x0, a, 1 + 4 * a, N);
}

function lin_solve(b, x, x0, a, c, N) {
  for (let k = 0; k < 10; k++) { // Reduced iterations for performance
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        x[IX(i, j)] =
          (x0[IX(i, j)] +
            a *
              (x[IX(i + 1, j)] +
                x[IX(i - 1, j)] +
                x[IX(i, j + 1)] +
                x[IX(i, j - 1)])) /
          c;
      }
    }
    set_bnd(b, x, N);
  }
}

function advect(b, d, d0, velocX, velocY, dt, N) {
  let dt0 = dt * N;
  for (let j = 1; j <= N; j++) {
    for (let i = 1; i <= N; i++) {
      let x = i - dt0 * velocX[IX(i, j)];
      let y = j - dt0 * velocY[IX(i, j)];
      if (x < 0.5) x = 0.5;
      if (x > N + 0.5) x = N + 0.5;
      let i0 = floor(x);
      let i1 = i0 + 1;
      if (y < 0.5) y = 0.5;
      if (y > N + 0.5) y = N + 0.5;
      let j0 = floor(y);
      let j1 = j0 + 1;
      let s1 = x - i0;
      let s0 = 1 - s1;
      let t1 = y - j0;
      let t0 = 1 - t1;
      d[IX(i, j)] =
        s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j1)]) +
        s1 * (t0 * d0[IX(i1, j0)] + t1 * d0[IX(i1, j1)]);
    }
  }
  set_bnd(b, d, N);
}

function project(velocX, velocY, p, div, N) {
  for (let j = 1; j <= N; j++) {
    for (let i = 1; i <= N; i++) {
      div[IX(i, j)] =
        (-0.5 *
          (velocX[IX(i + 1, j)] -
            velocX[IX(i - 1, j)] +
            velocY[IX(i, j + 1)] -
            velocY[IX(i, j - 1)])) /
        N;
      p[IX(i, j)] = 0;
    }
  }
  set_bnd(0, div, N);
  set_bnd(0, p, N);
  lin_solve(0, p, div, 1, 4, N);
  for (let j = 1; j <= N; j++) {
    for (let i = 1; i <= N; i++) {
      velocX[IX(i, j)] -= 0.5 * (p[IX(i + 1, j)] - p[IX(i - 1, j)]) * N;
      velocY[IX(i, j)] -= 0.5 * (p[IX(i, j + 1)] - p[IX(i, j - 1)]) * N;
    }
  }
  set_bnd(1, velocX, N);
  set_bnd(2, velocY, N);
}

function set_bnd(b, x, N) {
  for (let i = 1; i <= N; i++) {
    x[IX(i, 0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
    x[IX(i, N + 1)] = b === 2 ? -x[IX(i, N)] : x[IX(i, N)];
  }
  for (let j = 1; j <= N; j++) {
    x[IX(0, j)] = b === 1 ? -x[IX(1, j)] : x[IX(1, j)];
    x[IX(N + 1, j)] = b === 1 ? -x[IX(N, j)] : x[IX(N, j)];
  }
  // Corners
  x[IX(0, 0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
  x[IX(0, N + 1)] = 0.5 * (x[IX(1, N + 1)] + x[IX(0, N)]);
  x[IX(N + 1, 0)] = 0.5 * (x[IX(N, 0)] + x[IX(N + 1, 1)]);
  x[IX(N + 1, N + 1)] = 0.5 * (x[IX(N, N + 1)] + x[IX(N + 1, N)]);
}
