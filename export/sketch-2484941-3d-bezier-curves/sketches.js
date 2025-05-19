
let particles;
let baseAngles, smoothAngles;
let rayDirFromMouse, normalOfPlane, originOfPlane, mousePos3D;
let intersectPoint, laTrans;
let dragging;
let pickedIndex, pCount;
let closestDist, psiVal;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(60);
  noCursor();
  strokeCap(PROJECT);
  smooth();
  colorMode(HSB, 255);
  
  psiVal = (7.0/12.0)*PI;
  pCount = 7;
  
  intersectPoint = createVector();
  baseAngles = createVector(0, 0, 0);
  smoothAngles = createVector(0, 0, 0);
  dragging = false;
  
  laTrans = createVector(width/2.0, height*0.8, -1500);
  
  // Initialize particles (control points)
  particles = [
    new Particle(700, -500),
    new Particle(500, -600),
    new Particle(250, 300),
    new Particle(150, -350),
    new Particle(-200, -100),
    new Particle(-700, -400),
    new Particle(-550, -650)
  ];
}

function draw() {
  background((frameCount * 0.5) % 255, 200, 40);
  
  // Custom camera
  camera(width/2.0, height/2.8, (height/2.0) / tan(PI/6.0), 
         width/2.0, height/2.0, 0, 
         300, 1, 0);
         
  mousePos3D = createVector(mouseX, mouseY, 0);
  rayDirFromMouse = createVector(mouseX - width/2.0, mouseY - height/2.0, -height/(2.0*tan(PI/6.0)));

  // Compute normal of plane by applying the same transformation logic
  push();
  rotateZ(PI/2);
  normalOfPlane = localToGlobalNoTranslate(createVector(0,0,100));
  pop();

  // Lights
  lights();
  directionalLight(255, 255, 255, -0.2, -0.4, -1);
  spotLight(255, 100, 255, width/2.0, height, 800, -0.5, -0.5, -1, PI/3, 6000);

  // Compute origin of plane after transformations
  originOfPlane = localToGlobal(createVector(0,0,0));

  // Draw volumetric rotating bezier structures
  push();
  translate(laTrans.x, laTrans.y, laTrans.z);
  applyRotation();
  for (let i = 1; i < 100; i++) {
    push();
    rotateX(TWO_PI / 100 * i);
    drawBezierChains();
    pop();
  }
  pop();

  // Draw draggable particles
  for (let i = 0; i < pCount; i++) {
    particles[i].show();
  }

  // If dragging a particle, update its global position toward intersection
  if (mouseIsPressed && mouseButton === LEFT) {
    if (!dragging) {
      intersectPoint = rayPlaneIntersection(mousePos3D, rayDirFromMouse, originOfPlane, normalOfPlane);
      pickedIndex = pCount;
      closestDist = 999999;
      for (let i = 0; i < pCount; i++) {
        let d = p5.Vector.dist(intersectPoint, particles[i].globalPos);
        if (d < closestDist) {
          closestDist = d;
          pickedIndex = i;
        }
      }
      if (pickedIndex < pCount && closestDist < 80) {
        dragging = true;
      }
    }
    if (dragging) {
      intersectPoint = rayPlaneIntersection(mousePos3D, rayDirFromMouse, originOfPlane, normalOfPlane);
      particles[pickedIndex].globalPos = mixVectors(0.95, particles[pickedIndex].globalPos, 0.05, intersectPoint);
      particles[pickedIndex].updateLocal();
      particles[pickedIndex].show();
    }
  }
}

// Draw two connected bezier chains
function drawBezierChains() {
  noFill();
  let timeHue = (frameCount * 0.5) % 255;
  stroke((timeHue + 60) % 255, 150, 255);
  bezierChain(particles[0].localPos, particles[1].localPos, particles[2].localPos, particles[3].localPos);

  stroke((timeHue + 120) % 255, 180, 255);
  bezierChain(particles[3].localPos, particles[4].localPos, particles[5].localPos, particles[6].localPos);
}

function bezierChain(a, b, c, d) {
  bezier(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, d.x, d.y, d.z);
}

// On mouse drag, update rotation angles
function mouseDragged() {
  if (mouseButton === LEFT) {
    baseAngles.x += (mouseY - pmouseY)*0.007;
    baseAngles.y -= (mouseX - pmouseX)*0.007;
    smoothAngles = mixVectors(0.94, smoothAngles, 0.06, baseAngles);
    for (let i = 0; i < pCount; i++) {
      particles[i].updateGlobal();
    }
  }
}

function mouseReleased() {
  dragging = false;
}

// Applies the main rotation as defined in original code
function applyRotation() {
  rotateX(-smoothAngles.x + 0.2*PI);
  rotateY(-smoothAngles.y);
  rotateZ(smoothAngles.z + PI);
}

// The opposite rotation
function applyRotationInverse() {
  rotateZ(-smoothAngles.z - PI);
  rotateY(smoothAngles.y);
  rotateX(smoothAngles.x - 0.2*PI);
}

// Rename the vector blending function to avoid name conflicts with p5.js blend()
function mixVectors(a1, v1, a2, v2) {
  let x = v1.x * a1 + v2.x * a2;
  let y = v1.y * a1 + v2.y * a2;
  let z = v1.z * a1 + v2.z * a2;
  return createVector(x, y, z);
}

// Intersection of ray and plane
function rayPlaneIntersection(pd, ved, pp, ven) {
  let difpos = p5.Vector.sub(pd, pp);
  let lambda = (difpos.dot(ven)) / (ved.dot(ven));
  let vv = mixVectors(-1, difpos, lambda, ved);
  return p5.Vector.sub(originOfPlane, vv);
}

// Transform a local vector to global coords (including rotation and translation)
function localToGlobal(v) {
  let rotated = applyCustomRotation(v, -smoothAngles.x+0.2*PI, -smoothAngles.y, smoothAngles.z+PI);
  rotated.add(laTrans);
  return rotated;
}

// Transform a global vector to local coords (inverse rotation and translation)
function globalToLocal(v) {
  let translated = createVector(v.x - laTrans.x, v.y - laTrans.y, v.z - laTrans.z);
  translated = applyCustomRotation(translated, -(smoothAngles.x-0.2*PI), smoothAngles.y, -(smoothAngles.z+PI));
  return translated;
}

// Transform a local vector to global coords without translation
function localToGlobalNoTranslate(v) {
  let rotated = applyCustomRotation(v, -smoothAngles.x+0.2*PI, -smoothAngles.y, smoothAngles.z+PI);
  return rotated; 
}

// Apply custom rotations in order (X, Y, Z)
function applyCustomRotation(v, ax, ay, az) {
  // RotateX
  let cosa = cos(ax), sina = sin(ax);
  let vyx = v.y * cosa - v.z * sina;
  let vzx = v.y * sina + v.z * cosa;
  let vxx = v.x;
  let vyy = vyx;
  let vzz = vzx;

  // RotateY
  let cosb = cos(ay), sinb = sin(ay);
  let vzb = vzz * cosb - vxx * sinb;
  let vxb = vzz * sinb + vxx * cosb;
  vxx = vxb; vzz = vzb;

  // RotateZ
  let cosc = cos(az), sinc = sin(az);
  let vxc = vxx * cosc - vyy * sinc;
  let vyc = vxx * sinc + vyy * cosc;
  
  return createVector(vxc, vyc, vzz);
}

// Particle class represents control points
class Particle {
  constructor(x, y) {
    this.localPos = createVector(x, y, 0);
    this.updateGlobal();
  }
  
  updateGlobal() {
    this.globalPos = localToGlobal(this.localPos);
  }
  
  updateLocal() {
    this.localPos = globalToLocal(this.globalPos);
  }
  
  show() {
    push();
    translate(this.globalPos.x, this.globalPos.y, this.globalPos.z);
    applyRotation();
    fill((frameCount*2)%255, 255, 255);
    noStroke();
    sphere(25);
    pop();
  }
}
