class SegmentAgent {
  constructor(x, y, r, initialDir = null) {
    this.loc = createVector(x, y);
    this.radius = r;
    this.direction = initialDir ? initialDir : this.randomDirection();
  }

  randomDirection() {
    let v = createVector(globalBaseSpeed, 0);
    v.rotate(random(TWO_PI));
    return v;
  }

  step() {
    // Move forward and add slight directional jitter
    this.loc.add(this.direction);
    this.direction.rotate(random(angleJitter[0], angleJitter[1]));
  }

  boundaryCheck() {
    // Keep agent within a circular domain
    if (!this.isInsideDomain(centerX, centerY, domainRadius)) {
      // If outside, reset to a random spawn point
      let dir = p5.Vector.random2D().mult(domainRadius * spawnRange);
      let pos = createVector(centerX, centerY).add(dir);
      this.loc.set(pos.x, pos.y);
      this.direction = p5.Vector.random2D().mult(globalBaseSpeed);
    }
  }

  isInsideDomain(cx, cy, rad) {
    return dist(cx, cy, this.loc.x, this.loc.y) <= rad + this.radius;
  }

  overlapDist(other) {
    let d = this.loc.dist(other.loc);
    let sumR = this.radius + other.radius;
    return sumR - d;
  }

  interactWith(other) {
    let penetration = this.overlapDist(other);
    if (abs(penetration) < minRad * touchThreshold) {
      // Slight rotation if just touching
      this.direction.rotate(radians(0.1));
    } else if (penetration > 0) {
      // Repel if overlapping
      let repel = this.loc.copy().sub(other.loc).setMag(globalBaseSpeed);
      this.direction = repel;
    }
  }

  displaySelf() {
    push();
    stroke(agentLineColor);
    strokeWeight(agentLineWidth);
    let p = this.loc.copy();
    let q = p.copy().add(this.direction.copy().setMag(this.radius * 2));
    line(p.x, p.y, q.x, q.y);
    pop();
  }
}

// Global variables and configuration
let agentCount = 300;
let globalBaseSpeed = 0.5;
let touchThreshold = 0.1;
let connectThreshold = 3;
let spawnRange = 0.8;
let colorScalePow = 0.5;
let angleJitter = [0, 0.05];

let displayMode = "network";
let areaRatio = 20;

let centerX, centerY, domainRadius;
let agents = [];
let minRad, maxRad;

// Rendering parameters
let backgroundColor = 0;
let agentLineColor;
let agentLineWidth = 1;
let connectionLineColor;
let lastSurprise = 0; 
let surpriseInterval = 5000; // milliseconds
let hueShift = 0;
let frameStart;

function randomAgent() {
  let direction = p5.Vector.random2D().mult(globalBaseSpeed);
  let posOffset = direction.copy().setMag(random(domainRadius * spawnRange));
  let spawnPos = createVector(centerX, centerY).add(posOffset);
  let r = random(minRad, maxRad);
  return new SegmentAgent(spawnPos.x, spawnPos.y, r, direction);
}

function initializeCanvas() {
  createCanvas(windowWidth, windowHeight);
  frameStart = millis();
  resetScene();
}

function resetScene() {
  domainRadius = min(width, height) / 2;
  let domainArea = PI * domainRadius ** 2;

  agentCount = floor(random(100, 400));
  areaRatio = random(2, 30);
  let avgArea = domainArea / agentCount;
  let minCircleArea = (2 * avgArea) / (areaRatio + 1);
  minRad = sqrt(minCircleArea) / PI;
  maxRad = sqrt(minCircleArea * areaRatio) / PI;

  centerX = width / 2;
  centerY = height / 2;

  agents = [];
  for (let i = 0; i < agentCount; i++) {
    agents.push(randomAgent());
  }

  backgroundColor = 0;
  agentLineColor = color(255);
  connectionLineColor = color(255, 20);
  background(backgroundColor);
}

function keyPressed() {
  // Toggle mode
  displayMode = (displayMode === "elements") ? "network" : "elements";
  background(backgroundColor);
}

function mouseClicked() {
  resetScene();
}

function renderFrame() {
  if (millis() - lastSurprise > surpriseInterval) {
    applySurprise();
    lastSurprise = millis();
  }

  noStroke();
  fill(0, 20);
  rect(0, 0, width, height);

  updateSimulation();
  if (displayMode === "elements") {
    displayAllAgents();
  } else {
    displayNetwork();
  }
}

function updateSimulation() {
  for (let ag of agents) {
    ag.step();
    ag.boundaryCheck();
  }

  // Interactions
  let count = agents.length;
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      agents[i].interactWith(agents[j]);
      agents[j].interactWith(agents[i]);
    }
  }
}

function displayAllAgents() {
  // Just draw each agent as lines
  for (let ag of agents) {
    ag.displaySelf();
  }
}

function displayNetwork() {
  push();
  strokeWeight(1);
  let cMin = (2 * minRad) ** colorScalePow;
  let cMax = (2 * maxRad) ** colorScalePow;

  for (let i = 0; i < agentCount; i++) {
    let a = agents[i];
    for (let j = i + 1; j < agentCount; j++) {
      let b = agents[j];
      if (abs(a.overlapDist(b)) < minRad * connectThreshold) {
        let val = ((a.radius + b.radius) ** colorScalePow);
        let colVal = map(val, cMin, cMax, 0, 255);
        stroke(colVal, colVal * 0.5 + 20);
        line(a.loc.x, a.loc.y, b.loc.x, b.loc.y);
      }
    }
  }
  pop();

  // Also display the agents on top
  displayAllAgents();
}

function applySurprise() {
  hueShift = random(360);
  
  let newHue = hueShift;
  agentLineColor = color(newHue, 100, 100);
  connectionLineColor = color(newHue, 50, 100, 50);

  agentLineWidth = random(0.5, 2);

  // Slightly nudge all agents in a random direction for a surprising swirl
  let swirlAngle = random(-PI/4, PI/4);
  for (let ag of agents) {
    ag.direction.rotate(swirlAngle * 0.1); // subtle change for smoothness
  }

  // Possibly adjust speed for a new dynamic
  globalBaseSpeed = random(0.3, 0.7);
}

// Setup and draw aliases
window.setup = initializeCanvas;
window.draw = renderFrame;
