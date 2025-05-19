<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Logotype Particle Animation</title>
<style>
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #fff;
    height: 100%;
    width: 100%;
    font-family: sans-serif;
  }
  canvas {
    display: block;
  }
</style>
</head>
<body>

<canvas id="myCanvas"></canvas>

<script>

// Global variables
let canvas, ctx;
let w, h;
let offscreenCanvas, offscreenCtx;
let particles = [];
let particleCount = 0;
let imgSize = 200;
let mousePos = {x: null, y: null};
let mouseRadius = 100; // radius of interaction
let isTouching = false;

window.addEventListener('load', init);
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  isTouching = true;
  clearTimeout(mouseTimeout);
  mouseTimeout = setTimeout(()=>{ isTouching=false; }, 200);
});

window.addEventListener('touchmove', (e) => {
  let touch = e.touches[0];
  mousePos.x = touch.clientX;
  mousePos.y = touch.clientY;
  isTouching = true;
  clearTimeout(mouseTimeout);
  mouseTimeout = setTimeout(()=>{ isTouching=false; }, 200);
});

window.addEventListener('touchstart', (e) => {
  let touch = e.touches[0];
  mousePos.x = touch.clientX;
  mousePos.y = touch.clientY;
  isTouching = true;
});
window.addEventListener('touchend', () => {
  isTouching = false;
});

let mouseTimeout = null;

function init() {
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  createOffscreenImage();
  createParticles();
  animate();
}

function resizeCanvas() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
}

// Draw the "G" on an offscreen canvas to retrieve pixel data
function createOffscreenImage() {
  offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = imgSize;
  offscreenCanvas.height = imgSize;
  offscreenCtx = offscreenCanvas.getContext('2d');

  offscreenCtx.fillStyle = "#fff";
  offscreenCtx.fillRect(0, 0, imgSize, imgSize);

  // Draw border
  offscreenCtx.lineWidth = 10;
  offscreenCtx.strokeStyle = "#000";
  offscreenCtx.strokeRect(5, 5, imgSize-10, imgSize-10);

  // Draw the letter G
  offscreenCtx.fillStyle = "#000";
  offscreenCtx.font = (imgSize * 0.6) + "px sans-serif";
  offscreenCtx.textAlign = "center";
  offscreenCtx.textBaseline = "middle";
  offscreenCtx.fillText("G", imgSize/2, imgSize/2 + imgSize*0.05);

  let imgData = offscreenCtx.getImageData(0,0,imgSize,imgSize);
  let data = imgData.data;

  // To store pixel coordinates of black pixels
  let points = [];
  for (let y = 0; y < imgSize; y++) {
    for (let x = 0; x < imgSize; x++) {
      let idx = (y * imgSize + x)*4;
      let r = data[idx];
      let g = data[idx+1];
      let b = data[idx+2];
      // if pixel is black
      if(r<50 && g<50 && b<50) {
        points.push({x:x, y:y});
      }
    }
  }

  // We'll store these points globally for particle creation
  pixelPoints = points;
}

let pixelPoints = [];

function createParticles() {
  // Scale the "G" image to fit nicely on screen
  // We'll keep it in a square that fits the smaller dimension of the screen
  let minDim = Math.min(w,h);
  let scale = minDim*0.5/imgSize; // the "G" will occupy half of the smaller dimension

  let centerX = w/2;
  let centerY = h/2;

  pixelPoints.forEach(p => {
    let px = centerX + (p.x - imgSize/2)*scale;
    let py = centerY + (p.y - imgSize/2)*scale;
    particles.push(new Particle(px, py));
  });

  particleCount = particles.length;
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,w,h);

  // Update and draw all particles
  for (let p of particles) {
    p.behaviors();
    p.update();
    p.show(ctx);
  }
}

// Particle class
class Particle {
  constructor(x,y) {
    this.target = {x:x, y:y};
    this.pos = {x: Math.random()*w, y: Math.random()*h};
    let angle = Math.random()*Math.PI*2;
    let speed = Math.random()*3+2;
    this.vel = {x: Math.cos(angle)*speed, y: Math.sin(angle)*speed};
    this.acc = {x:0, y:0};
    this.maxspeed = 10;
    this.maxforce = 1;
  }

  behaviors() {
    let arriveForce = this.arrive(this.target);
    let wanderForce = this.wander();

    // If mouse or touch is around, apply a repel force
    let repelForce = {x:0, y:0};
    if (isTouching && mousePos.x !== null && mousePos.y !== null) {
      repelForce = this.repel(mousePos);
    }

    arriveForce.x *= 1;
    arriveForce.y *= 1;
    wanderForce.x *= 0.4;
    wanderForce.y *= 0.4;
    repelForce.x *= 2; // stronger force to push away from the pointer
    repelForce.y *= 2;

    this.applyForce(arriveForce);
    this.applyForce(wanderForce);
    this.applyForce(repelForce);
  }

  applyForce(f) {
    this.acc.x += f.x;
    this.acc.y += f.y;
  }

  update() {
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    let magVel = Math.sqrt(this.vel.x*this.vel.x + this.vel.y*this.vel.y);
    if (magVel > this.maxspeed) {
      this.vel.x = (this.vel.x/magVel)*this.maxspeed;
      this.vel.y = (this.vel.y/magVel)*this.maxspeed;
    }
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  show(ctx) {
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 2, 0, Math.PI*2);
    ctx.fill();
  }

  arrive(target) {
    let desired = {x: target.x - this.pos.x, y: target.y - this.pos.y};
    let d = Math.sqrt(desired.x*desired.x + desired.y*desired.y);
    let speed = this.maxspeed;
    if (d<50) {
      speed = (d/50)*this.maxspeed;
    }
    let magDes = Math.sqrt(desired.x*desired.x + desired.y*desired.y);
    if (magDes > 0) {
      desired.x = (desired.x/magDes)*speed;
      desired.y = (desired.y/magDes)*speed;
    }
    let steer = {x: desired.x - this.vel.x, y: desired.y - this.vel.y};
    let magSteer = Math.sqrt(steer.x*steer.x + steer.y*steer.y);
    if (magSteer > this.maxforce) {
      steer.x = (steer.x/magSteer)*this.maxforce;
      steer.y = (steer.y/magSteer)*this.maxforce;
    }
    return steer;
  }

  wander() {
    // simple random jitter force
    let wanderTheta = Math.random()*Math.PI*2;
    let wanderRadius = 25;
    // Use velocity direction to define wander center
    let vmag = Math.sqrt(this.vel.x*this.vel.x + this.vel.y*this.vel.y);
    let wanderCenter = {x:0,y:0};
    if (vmag>0) {
      wanderCenter.x = (this.vel.x/vmag)*50;
      wanderCenter.y = (this.vel.y/vmag)*50;
    }
    let wx = wanderCenter.x + wanderRadius*Math.cos(wanderTheta);
    let wy = wanderCenter.y + wanderRadius*Math.sin(wanderTheta);
    let magW = Math.sqrt(wx*wx+wy*wy);
    if (magW>this.maxforce*0.5) {
      wx = (wx/magW)*this.maxforce*0.5;
      wy = (wy/magW)*this.maxforce*0.5;
    }
    return {x:wx, y:wy};
  }

  repel(mouse) {
    let desired = {x: this.pos.x - mouse.x, y: this.pos.y - mouse.y};
    let d = Math.sqrt(desired.x*desired.x + desired.y*desired.y);
    if (d < mouseRadius) {
      // repulsion force
      let strength = (mouseRadius - d)/mouseRadius;
      let magD = Math.sqrt(desired.x*desired.x + desired.y*desired.y);
      if (magD > 0) {
        desired.x = (desired.x/magD)*this.maxspeed*strength;
        desired.y = (desired.y/magD)*this.maxspeed*strength;
      }
      let steer = {x: desired.x - this.vel.x, y: desired.y - this.vel.y};
      let magSteer = Math.sqrt(steer.x*steer.x + steer.y*steer.y);
      if (magSteer > this.maxforce) {
        steer.x = (steer.x/magSteer)*this.maxforce;
        steer.y = (steer.y/magSteer)*this.maxforce;
      }
      return steer;
    }
    return {x:0,y:0};
  }
}

</script>

</body>
</html>
