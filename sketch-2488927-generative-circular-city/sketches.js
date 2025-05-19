let citySketch = function(p) {
  // --- Global Variables ---
  let buildings = [];
  let baseRegionSize;
  const maxBuildings = 200; // Maximum number of buildings to maintain performance
  const clickThreshold = 50; // Distance threshold in world units for selecting a building

  // --- Setup Function ---
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.noSmooth();
    p.strokeWeight(1);
    p.stroke(0);
    p.fill(200);

    // Define the base region where buildings can be placed
    baseRegionSize = p.min(p.width, p.height) * 0.8;

    // Initialize with a few buildings for initial interest
    for (let i = 0; i < 10; i++) {
      buildings.push(generateBuilding());
    }
  };

  // --- Draw Function ---
  p.draw = function() {
    p.background(220);
    p.orbitControl();

    // Set up an orthographic camera for a clean, architectural perspective
    p.ortho(-p.width / 2, p.width / 2, -p.height / 2, p.height / 2, 0, 5000);

    // Slightly tilt the scene for better visualization
    p.rotateX(p.PI / 3);
    p.rotateZ(p.frameCount * 0.001);

    // Draw a subtle ground plane as a reference
    p.push();
    p.stroke(0);
    p.noFill();
    p.translate(0, 0, -1);
    p.rectMode(p.CENTER);
    p.rect(0, 0, baseRegionSize, baseRegionSize);
    p.pop();

    // Render all buildings
    for (let b of buildings) {
      drawBuilding(b);
    }
  };

  // --- Mouse Pressed Function ---
  p.mousePressed = function() {
    // Map mouse position to world coordinates
    let worldPos = screenToWorld(p.mouseX, p.mouseY);
    let worldX = worldPos.x;
    let worldY = worldPos.y;

    let nearestIndex = -1;
    let nearestDist = Infinity;

    // Iterate through all buildings to find the nearest one to the mapped world position
    for (let i = 0; i < buildings.length; i++) {
      let b = buildings[i];
      let d = p.dist(worldX, worldY, b.x, b.y);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIndex = i;
      }
    }

    // If the nearest building is within the threshold, reconstruct it
    if (nearestDist < clickThreshold && nearestIndex >= 0) {
      buildings[nearestIndex] = generateBuilding(buildings[nearestIndex].x, buildings[nearestIndex].y);
    } else {
      // Otherwise, add a new building if under the maximum limit
      if (buildings.length < maxBuildings) {
        buildings.push(generateBuilding());
      } else {
        // If maximum buildings reached, randomly reconstruct an existing one
        let idx = p.floor(p.random(buildings.length));
        buildings[idx] = generateBuilding(buildings[idx].x, buildings[idx].y);
      }
    }
  };

  // --- Helper Function: Convert Screen to World Coordinates ---
  function screenToWorld(mx, my) {
    // Calculate aspect ratio
    let aspect = p.width / p.height;

    // Orthographic projection parameters
    let left = -p.width / 2;
    let right = p.width / 2;
    let top = -p.height / 2;
    let bottom = p.height / 2;

    // Map mouseX and mouseY to world coordinates
    let worldX = p.map(mx, 0, p.width, left, right);
    let worldY = p.map(my, 0, p.height, top, bottom);

    // Adjust for the scene's rotation (rotateX and rotateZ)
    // Since the scene is rotated, we need to apply the inverse rotation to the world coordinates
    let rotZ = p.frameCount * 0.001;
    let rotX = p.PI / 3;

    // Create a vector for the mouse position in world space
    let v = p.createVector(worldX, worldY, 0);

    // Apply inverse rotations
    v.rotate(-rotZ);
    // For rotateX, we'll project the y and z
    let sinX = p.sin(rotX);
    let cosX = p.cos(rotX);
    let y = v.y * cosX - v.z * sinX;
    let z = v.y * sinX + v.z * cosX;
    v.y = y;
    v.z = z;

    return { x: v.x, y: v.y };
  }

  // --- Generate Building Function ---
  function generateBuilding(x = null, y = null) {
    if (x === null || y === null) {
      x = p.random(-baseRegionSize / 2, baseRegionSize / 2);
      y = p.random(-baseRegionSize / 2, baseRegionSize / 2);
    }

    // Create a random polygon footprint
    let sides = p.floor(p.random(12, 24));
    let radius = p.random(20, 80);
    let angleOffset = p.random(p.TWO_PI);

    let footprint = [];
    for (let i = 0; i < sides; i++) {
      let ang = angleOffset + p.TWO_PI * i / sides;
      let vx = x + p.cos(ang) * radius;
      let vy = y + p.sin(ang) * radius;
      footprint.push({ x: vx, y: vy });
    }

    let height = p.random(30, 200);

    return {
      x: x,
      y: y,
      footprint: footprint,
      height: height
    };
  }

  // --- Draw Building Function ---
  function drawBuilding(b) {
    p.push();
    // Position the building so that its base sits on the ground
    p.translate(0, 0, b.height / 2);

    // Draw the top face of the building
    p.beginShape();
    for (let pnt of b.footprint) {
      p.vertex(pnt.x, pnt.y, b.height / 2);
    }
    p.endShape(p.CLOSE);

    // Draw the bottom face of the building
    p.beginShape();
    for (let pnt of b.footprint) {
      p.vertex(pnt.x, pnt.y, -b.height / 2);
    }
    p.endShape(p.CLOSE);

    // Draw the side walls of the building
    for (let i = 0; i < b.footprint.length; i++) {
      let p1 = b.footprint[i];
      let p2 = b.footprint[(i + 1) % b.footprint.length];
      p.beginShape();
      p.vertex(p1.x, p1.y, -b.height / 2);
      p.vertex(p1.x, p1.y, b.height / 2);
      p.vertex(p2.x, p2.y, b.height / 2);
      p.vertex(p2.x, p2.y, -b.height / 2);
      p.endShape(p.CLOSE);
    }

    p.pop();
  }

  // --- Window Resized Function ---
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    baseRegionSize = p.min(p.width, p.height) * 0.8;
  };
};

// Create a new p5 instance with the citySketch
new p5(citySketch);
