let DETAIL = 20;           // Number of lat/lon divisions for the sphere
let RADIUS = 200;          // Base radius of the sphere
let NOISE_SCALE = 0.8;     // Scales the noise offset
let NOISE_SPEED = 0.0015;  // Speed for noise evolution
let ROTATION_SPEED = 0.002; // Speed of overall sphere rotation

let stars = [];
let NUM_STARS = 50;       // Number of star points in the background

// Orbital bodies
let orbiters = [];
let NUM_ORBITERS = 12;     // Number of small orbiting spheres
let orbiterRadius = 12;    // Radius for each small orbiter
let orbiterDistance = 350; // Distance of orbit from center
let orbiterSpeed = 0.01;   // Orbital rotation speed

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);

  // Initialize star positions
  for (let i = 0; i < NUM_STARS; i++) {
    let angle = random(TWO_PI);
    let dist = random(200, 2000); // random distance for a star
    let x = cos(angle) * dist;
    let y = sin(angle) * dist;
    let z = random(-1500, 1500);
    stars.push({ x, y, z });
  }
  
  // Initialize orbital bodies
  for (let i = 0; i < NUM_ORBITERS; i++) {
    orbiters.push({
      angle: random(TWO_PI),
      speed: orbiterSpeed * random(0.5, 1.5), // give some variation in orbital speed
      colorOffset: random(360),
    });
  }
}

function draw() {
  background(0);
  // Mild camera rotation for a slow cosmic swirl
  rotateY(frameCount * 0.0005);
  rotateX(frameCount * 0.0002);

  // Draw the swirling starfield behind everything
  push();
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    push();
    // Slightly rotate each star around Y-axis to give swirling effect
    let rx = s.x * cos(frameCount * 0.0002) - s.z * sin(frameCount * 0.0002);
    let rz = s.z * cos(frameCount * 0.0002) + s.x * sin(frameCount * 0.0002);
    translate(rx, s.y, rz);
    strokeWeight(0.5);
    stroke(200, 80, 100);
    point(0, 0, 0);
    pop();
  }
  pop();

  // Some lighting for the main shape
  ambientLight(60);
  directionalLight(255, 255, 255, 0.2, 0.2, -1);

  // Rotate the "living fractal sphere"
  push();
  rotateY(frameCount * ROTATION_SPEED);
  // Optionally, rotate around X or Z for a more dynamic effect
  rotateX(frameCount * ROTATION_SPEED * 0.5);
  drawFractalSphere(RADIUS, DETAIL);
  pop();

  // Draw orbiters around the fractal sphere
  push();
  for (let i = 0; i < orbiters.length; i++) {
    let o = orbiters[i];
    o.angle += o.speed; // update the angle of rotation
    let ox = orbiterDistance * cos(o.angle);
    let oz = orbiterDistance * sin(o.angle);
    // color shift
    let hueVal = (frameCount * 0.1 + o.colorOffset) % 360;

    push();
    translate(ox, 0, oz);
    fill(hueVal, 80, 100);
    sphere(orbiterRadius * (0.8 + 0.4 * sin(frameCount * 0.02 + i)));
    pop();
  }
  pop();
}

function drawFractalSphere(baseRadius, detail) {
  let time = frameCount * NOISE_SPEED; // controls noise evolution

  // We'll iterate over spherical coordinates: lat and lon
  for (let lat = 0; lat < detail; lat++) {
    let theta1 = map(lat, 0, detail, 0, PI);
    let theta2 = map(lat + 1, 0, detail, 0, PI);

    beginShape(TRIANGLE_STRIP);
    for (let lon = 0; lon <= detail; lon++) {
      let phi = map(lon, 0, detail, 0, TWO_PI);

      // Vertex A (lat)
      let xA = sin(theta1) * cos(phi);
      let yA = cos(theta1);
      let zA = sin(theta1) * sin(phi);
      
      // Displace radius by Perlin noise
      let rA = baseRadius + 40 * noise(
        xA * NOISE_SCALE + 100, 
        yA * NOISE_SCALE + 200, 
        zA * NOISE_SCALE + 300 + time
      );
      xA *= rA; 
      yA *= rA; 
      zA *= rA; 

      // Vertex B (lat+1)
      let xB = sin(theta2) * cos(phi);
      let yB = cos(theta2);
      let zB = sin(theta2) * sin(phi);

      let rB = baseRadius + 40 * noise(
        xB * NOISE_SCALE + 100, 
        yB * NOISE_SCALE + 200, 
        zB * NOISE_SCALE + 300 + time
      );
      xB *= rB; 
      yB *= rB; 
      zB *= rB; 

      // Color is based on the 3D noise displacement, giving swirl patterns
      let hueVal = map(rA, baseRadius, baseRadius + 40, 180, 360);
      fill(hueVal % 360, 80, 100, 100);

      vertex(xA, yA, zA);
      vertex(xB, yB, zB);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
