// "Generative Landscapes" ⛰️ #WCCChallenge by Gonçalo Perdigão from "Building Creative Machines"

let NUM_LAYERS = 7;          // Number of mountain layers
let LAYER_HEIGHT_FACTOR = 0.22;  // Vertical space each layer occupies
let NOISE_SCALE = 0.0015;    // Controls horizontal noise detail
let NOISE_DETAIL = 0.001;    // Controls vertical noise detail
let colorPalettes = [];      // Array holding possible color palettes
let currentPalette = [];     // Currently chosen color palette
let seed;                    // Random seed to regenerate

let timeOffset = 0;          // Global time offset for animation
let speed = 0.08;          // Base speed for the animation
let colorShiftSpeed = 0.02; // Speed for color shifts

let baseHue = 0;             // Base hue for color transformations
let hueVariation = 60;       // Range of hue offset for each layer

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  initializeColorPalettes();
  regenerateLandscape();
}

function draw() {
  background(0, 0, 0);
  
  // Slowly shift the base hue to create a dynamic color environment
  baseHue += colorShiftSpeed * deltaTime;
  
  // Sky gradient (from dawn to dusk-like)
  drawSkyGradient();

  // Draw mountains from back (lightest) to front (darkest)
  for (let i = 0; i < NUM_LAYERS; i++) {
    let layerIndex = NUM_LAYERS - 1 - i; // draw from back to front
    drawMountainLayer(layerIndex);
  }
  
  timeOffset += speed * deltaTime;
}

// Draw a simple sky gradient behind the mountains
function drawSkyGradient() {
  let c1 = color(
    (baseHue + 200) % 360, 40, 30
  );
  let c2 = color(
    (baseHue + 280) % 360, 80, 70
  );
  
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// Draw a single mountain layer using Perlin noise
function drawMountainLayer(layerIndex) {
  noStroke();
  
  // The further back the layer is, the lighter in color
  let paletteColor = currentPalette[layerIndex % currentPalette.length];
  
  // Additional dynamic hue shift based on baseHue
  let h = (hue(paletteColor) + baseHue) % 360;
  let s = saturation(paletteColor);
  let b = brightness(paletteColor);
  
  fill(h, s, b);
  
  beginShape();
  
  // Start from the bottom-left corner
  vertex(0, height);
  
  let layerOffset = map(layerIndex, 0, NUM_LAYERS - 1, 0, 1);
  let verticalPos = height * (1 - LAYER_HEIGHT_FACTOR * layerOffset);
  
  // Modify the vertical position with the mouse’s Y and random noise
  let mouseFactorY = map(mouseY, 0, height, -80, 80);
  
  for (let x = 0; x <= width; x += 2) {
    let noiseVal = noise(
      (x * NOISE_SCALE) + (layerIndex * 100),
      (timeOffset + layerIndex * 100) * NOISE_DETAIL
    );
    
    let yOff = map(noiseVal, 0, 1, -180, 180);
    let finalY = verticalPos + yOff + mouseFactorY * (layerIndex / NUM_LAYERS);
    vertex(x, finalY);
  }
  
  // Connect to the bottom-right corner
  vertex(width, height);
  endShape(CLOSE);
}

// Initialize some color palettes (HSB) for variety
function initializeColorPalettes() {
  colorPalettes = [
    // Earthy Tones
    [
      color(20, 80, 60),
      color(40, 80, 70),
      color(60, 80, 80),
      color(80, 80, 70),
      color(100, 80, 60),
      color(120, 80, 50)
    ],
    // Vibrant Sunset
    [
      color(5, 90, 90),
      color(25, 90, 90),
      color(45, 90, 80),
      color(65, 90, 70),
      color(85, 90, 60),
      color(105, 70, 50)
    ],
    // Cool Mountains
    [
      color(180, 40, 90),
      color(200, 40, 80),
      color(220, 40, 70),
      color(240, 40, 60),
      color(260, 40, 50),
      color(280, 40, 40)
    ],
    // Pastel Dream
    [
      color(300, 30, 95),
      color(330, 30, 85),
      color(0, 30, 75),
      color(30, 30, 65),
      color(60, 30, 55),
      color(90, 30, 45)
    ]
  ];
}

// Resets the random seed, picks a color palette randomly, etc.
function regenerateLandscape() {
  seed = floor(random(100000));
  randomSeed(seed);
  noiseSeed(seed);
  
  // Pick a random color palette
  currentPalette = random(colorPalettes);

  // Slight random shuffle of the palette (for variation)
  if (random() < 0.5) {
    currentPalette.reverse();
  }
}

// If the user clicks/taps or presses space, regenerate
function mousePressed() {
  regenerateLandscape();
}

function keyPressed() {
  if (key === ' ' || key === 'Space') {
    regenerateLandscape();
  }
}

// Make it responsive
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
