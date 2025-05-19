// Main p5.js sketch
let shaderProgram;
let cameraAngleX = 0;
let cameraAngleY = 0;
let zoom = 5.0;
let lastMouseX, lastMouseY;
let rotating = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Define the shader
  shaderProgram = createShader(vertShader, fragShader);
}

function draw() {
  background(0);

  // Use the custom shader
  shader(shaderProgram);

  // Pass uniforms to the shader
  shaderProgram.setUniform('u_time', millis() / 1000.0);
  shaderProgram.setUniform('u_resolution', [width, height]);
  shaderProgram.setUniform('u_mouse', [mouseX, mouseY]);
  shaderProgram.setUniform('u_cameraAngleX', cameraAngleX);
  shaderProgram.setUniform('u_cameraAngleY', cameraAngleY);
  shaderProgram.setUniform('u_zoom', zoom);

  // Render a plane that covers the entire screen
  plane(width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
  if (mouseIsPressed) {
    let dx = mouseX - (lastMouseX || mouseX);
    let dy = mouseY - (lastMouseY || mouseY);
    cameraAngleX += dx * 0.01;
    cameraAngleY += dy * 0.01;
  }
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseWheel(event) {
  zoom += event.delta * 0.01;
  zoom = max(0.5, min(zoom, 20.0));
}

// Vertex Shader
const vertShader = `
  precision mediump float;

  // Vertex attributes
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;

  // Varying to pass texture coordinates to the fragment shader
  varying vec2 vTexCoord;

  // Uniforms for transformation matrices
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    // Pass the texture coordinates to the fragment shader
    vTexCoord = aTexCoord;

    // Apply the model-view and projection transformations
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
  }
`;

// Fragment Shader
const fragShader = `
  precision highp float;

  // Uniforms
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_cameraAngleX;
  uniform float u_cameraAngleY;
  uniform float u_zoom;

  // Varying from the vertex shader
  varying vec2 vTexCoord;

  // Functions to rotate a vector around axes
  mat3 rotateX(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
      1.0, 0.0, 0.0,
      0.0, c, -s,
      0.0, s, c
    );
  }

  mat3 rotateY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
    );
  }

  // Distance Estimator (DE) for a Mandelbulb fractal
  float mandelbulb(vec3 p, float power) {
    vec3 z = p;
    float dr = 1.0;
    float r = 0.0;

    // Reduced iterations for performance
    for (int i = 0; i < 64; i++) {
      r = length(z);
      if (r > 2.0) break;

      // Convert to spherical coordinates
      float theta = acos(z.z / r);
      float phi = atan(z.y, z.x);

      // Scale and rotate the point
      dr =  pow(r, power - 1.0) * power * dr + 1.0;
      float zr = pow(r, power);
      theta = theta * power;
      phi = phi * power;

      // Convert back to cartesian coordinates
      z = zr * vec3(
        sin(theta) * cos(phi),
        sin(phi) * sin(theta),
        cos(theta)
      );
      z += p;
    }
    return 0.5 * log(r) * r / dr;
  }

  vec3 calcNormal(vec3 p, float power) {
    float eps = 0.0005;
    float d = mandelbulb(p, power);
    vec3 n = vec3(
      mandelbulb(vec3(p.x+eps, p.y, p.z), power) - d,
      mandelbulb(vec3(p.x, p.y+eps, p.z), power) - d,
      mandelbulb(vec3(p.x, p.y, p.z+eps), power) - d
    );
    return normalize(n);
  }

  void main() {
    vec2 uv = vTexCoord * 2.0 - 1.0;

    // Adjust for aspect ratio
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    // Mouse-driven fractal power (range around 8 but varies)
    float power = 8.0 + (u_mouse.y/u_resolution.y - 0.5)*4.0;

    // Camera setup
    vec3 ro = vec3(0.0, 0.0, -u_zoom);
    vec3 rd = normalize(vec3(uv, 1.5));

    // Time-based and mouse-based camera rotation
    mat3 rotY = rotateY(u_time * 0.1 + u_cameraAngleX);
    mat3 rotX = rotateX(u_cameraAngleY);
    mat3 rotation = rotX * rotY;

    ro = rotation * ro;
    rd = rotation * rd;

    // Ray marching
    float totalDistance = 0.0;
    bool hit = false;
    vec3 p;

    for (int i = 0; i < 100; i++) {
      p = ro + rd * totalDistance;
      float distance = mandelbulb(p, power);
      if (distance < 0.001) {
        hit = true;
        break;
      }
      totalDistance += distance;
      if (totalDistance > 100.0) break;
    }

    if (hit) {
      // Calculate normal for lighting
      vec3 n = calcNormal(p, power);

      // Light direction
      vec3 lightDir = normalize(vec3(0.5, 1.0, -0.5));

      // Lambertian shading
      float diff = max(dot(n, lightDir), 0.0);

      // Additional color variation over time and normal
      float hue = mod(u_time*0.1 + n.x + n.y + n.z, 1.0);
      float saturation = 0.7;
      float brightness = diff * 0.9 + 0.1;

      // Convert HSB to RGB
      vec3 k = vec3(1.0, 2.0/3.0, 1.0/3.0);
      vec3 p2 = abs(fract(vec3(hue, hue, hue) + k) * 6.0 - 3.0);
      vec3 baseColor = clamp(p2 - 1.0, 0.0, 1.0);
      vec3 color = baseColor * brightness * saturation;

      gl_FragColor = vec4(color, 1.0);
    } else {
      // Background gradient
      float t = uv.y * 0.5 + 0.5;
      vec3 bg = mix(vec3(0.0, 0.05, 0.15), vec3(0.0,0.0,0.0), t);
      gl_FragColor = vec4(bg, 1.0);
    }
  }
`;
