let crystalPos;
let shieldAngle = 0;
let comets = [];
let gameOver = false;
let lastSpawnTime = 0;

let lives = 10;
let livesGiven = 0; // how many extra lives have been granted so far
let startTime;
let finalScore = 0;
let lastShieldHitTime = -1000; // Time when the arc last deflected a comet

function setup() {
  createCanvas(windowWidth, windowHeight);
  crystalPos = createVector(width/2, height/2);
  angleMode(RADIANS);
  noStroke();
  textFont('sans-serif');
  startTime = millis();
}

function draw() {
  if (!gameOver) {
    updateGame();
    renderGame();
  } else {
    renderGameOver();
  }
}

function updateGame() {
  let elapsed = (millis() - startTime) / 1000;

  let extraLives = floor(elapsed / 10);
  // If we've reached a new 10-second milestone (extraLives is greater than livesGiven),
  // then give one life now, and update livesGiven.
  if (extraLives > livesGiven) {
    lives++;
    livesGiven = extraLives;
  }
	
  // Increase difficulty over time
  let difficultyFactor = millis() * 0.0001;
  let spawnInterval = max(800 - difficultyFactor * 50, 100);

  if (millis() - lastSpawnTime > spawnInterval) {
    spawnComet(difficultyFactor);
    lastSpawnTime = millis();
  }

  // Update comets
  for (let c of comets) {
    if (!c.deflected && !c.hitCrystal) {
      // Homing only if not deflected or hit
      let desired = p5.Vector.sub(crystalPos, c.pos);
      desired.setMag(2 + difficultyFactor * 0.5);
      c.vel = p5.Vector.lerp(c.vel, desired, 0.05);
    }
    c.pos.add(c.vel);
  }

  // Check collisions with the shield boundary (white circle radius 50)
  // The arc is just a segment of this circle
  for (let c of comets) {
    let distToCrystal = p5.Vector.dist(c.pos, crystalPos);
    if (distToCrystal <= 50) {
      // At this boundary, check arc
      let angleToComet = atan2(c.pos.y - crystalPos.y, c.pos.x - crystalPos.x);
      let rawDiff = angleToComet - shieldAngle;
      let angleDiff = atan2(sin(rawDiff), cos(rawDiff));
      
      let shieldArc = 0.26; // about ±15 degrees
      if (abs(angleDiff) < shieldArc) {
        // Inside arc: deflect
        c.deflected = true;
        let outDir = p5.Vector.sub(c.pos, crystalPos).normalize().mult(c.vel.mag() * 1.5);
        c.vel = outDir;
        // Arc turns red for 1 second
        lastShieldHitTime = millis();
      } else {
        // Outside arc: lose a life
        lives--;
        c.destroy = true; // remove this comet
        if (lives <= 0) {
          gameOver = true;
          finalScore = floor((millis() - startTime)/1000);
        }
      }
    }
  }

  // Remove destroyed and out-of-bounds comets
  comets = comets.filter(c => {
    if (c.destroy) return false;
    if (c.pos.x < -200 || c.pos.x > width + 200 || c.pos.y < -200 || c.pos.y > height + 200) return false;
    return true;
  });

  // Check deflected comet vs comet collisions (optional feature)
  for (let i = 0; i < comets.length; i++) {
    for (let j = i+1; j < comets.length; j++) {
      let c1 = comets[i];
      let c2 = comets[j];
      let d = p5.Vector.dist(c1.pos, c2.pos);
      if (d < 10 && (c1.deflected || c2.deflected)) {
        c1.destroy = true;
        c2.destroy = true;
      }
    }
  }

  // Remove comets destroyed in collisions
  comets = comets.filter(c => !c.destroy);
}

function renderGame() {
  // Background gradient
  setGradientBackground(color(10,0,30), color(0,0,0));
  
  // Draw crystal (inner decoration)
  let pulse = 5*sin(millis()*0.002)+45;
  fill(180, 100, 255);
  ellipse(crystalPos.x, crystalPos.y, pulse, pulse);

  // Draw shield circle (white) and arc
  push();
  translate(crystalPos.x, crystalPos.y);
  rotate(shieldAngle);
  // White circle
  stroke(255);
  strokeWeight(4);
  noFill();
  ellipse(0,0,100,100); // radius 50

  // Arc color: red if recently hit, else yellow
  let shieldHitDuration = 1000; // ms
  let arcColor = (millis() - lastShieldHitTime < shieldHitDuration) ? color(255,0,0) : color(255,255,0);
  stroke(arcColor);
  strokeWeight(15);
  arc(0,0,100,100,-0.26,0.26); 
  pop();
  
  // Draw comets
  noStroke();
  for (let c of comets) {
    if (c.deflected) {
      fill(100, 255, 150); 
    } else {
      fill(255, 200, 100);
    }
    ellipse(c.pos.x, c.pos.y, 8,8);
  }

  // HUD
  fill(255);
  textSize(24);
  textAlign(LEFT,TOP);
  let elapsed = floor((millis()-startTime)/1000);
  text("Lives: " + lives, 10,10);
  text("Time Survived: " + elapsed + "s", 10,40);
}

function renderGameOver() {
  setGradientBackground(color(30,0,10), color(0,0,0));
  
  fill(255);
  textSize(32);
  textAlign(CENTER,CENTER);
  text("Game Over\nTime Survived: " + finalScore + "s\nClick or Press any key to Restart", width/2, height/2);
}

function spawnComet(difficultyFactor) {
  let angle = random(TWO_PI);
  let distFromCenter = max(width,height)*0.6;
  let startPos = p5.Vector.fromAngle(angle).mult(distFromCenter).add(crystalPos);

  let speed = 2 + difficultyFactor*0.5; 
  let vel = p5.Vector.sub(crystalPos, startPos).setMag(speed);
  
  let c = {
    pos: startPos,
    vel: vel,
    deflected: false,
    destroy: false
  };
  comets.push(c);
}

// Control shield with mouse movement
function mouseMoved() {
  let dx = mouseX - width/2;
  let dy = mouseY - height/2;
  shieldAngle = atan2(dy,dx);
}

// On touch devices
function touchMoved() {
  if (touches.length > 0) {
    let dx = touches[0].x - width/2;
    let dy = touches[0].y - height/2;
    shieldAngle = atan2(dy,dx);
  }
  return false;
}

function mousePressed() {
  if (gameOver) {
    restartGame();
  }
}

function keyPressed() {
  if (gameOver) {
    restartGame();
  }
}

function restartGame() {
  gameOver = false;
  comets = [];
  lives = 10;
  startTime = millis();
  lastSpawnTime = 0;
  finalScore = 0;
  lastShieldHitTime = -1000;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  crystalPos.set(width/2, height/2);
}

function setGradientBackground(c1, c2) {
  noFill();
  for (let y=0; y<height; y++) {
    let inter = y/(height-1);
    let c = lerpColor(c1,c2,inter);
    stroke(c);
    line(0,y,width,y);
  }
}
