// Main p5.js sketch
let shaderProgram;

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

  // Render a plane that covers the entire screen
  plane(width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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

  // Varying from the vertex shader
  varying vec2 vTexCoord;

  // Function to rotate a vector around the Y-axis
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
  float mandelbulb(vec3 p) {
    vec3 z = p;
    float dr = 1.0;
    float r = 0.0;

    for (int i = 0; i < 8; i++) {
      r = length(z);
      if (r > 2.0) break;

      // Convert to spherical coordinates
      float theta = acos(z.z / r);
      float phi = atan(z.y, z.x);
      float power = 8.0;

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

  void main() {
    // vTexCoord ranges from 0.0 to 1.0
    // Adjust to range from -1.0 to 1.0
    vec2 uv = vTexCoord * 2.0 - 1.0;

    // Adjust for aspect ratio
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    // Camera setup
    vec3 ro = vec3(0.0, 0.0, -5.0); // Ray origin
    vec3 rd = normalize(vec3(uv, 1.5)); // Ray direction

    // Rotate the camera based on time and mouse position
    float angle = u_time * 0.2 + (u_mouse.x / u_resolution.x - 0.5) * 3.14;
    mat3 rotation = rotateY(angle);
    ro = rotation * ro;
    rd = rotation * rd;

    // Ray marching
    float totalDistance = 0.0;
    bool hit = false;
    vec3 p;

    for (int i = 0; i < 128; i++) {
      p = ro + rd * totalDistance;
      float distance = mandelbulb(p);
      if (distance < 0.001) {
        hit = true;
        break;
      }
      totalDistance += distance;
      if (totalDistance > 100.0) break;
    }

    if (hit) {
      // Calculate normal for lighting using finite differences
      float eps = 0.001;
      vec3 n = normalize(vec3(
        mandelbulb(p + vec3(eps, 0.0, 0.0)) - mandelbulb(p - vec3(eps, 0.0, 0.0)),
        mandelbulb(p + vec3(0.0, eps, 0.0)) - mandelbulb(p - vec3(0.0, eps, 0.0)),
        mandelbulb(p + vec3(0.0, 0.0, eps)) - mandelbulb(p - vec3(0.0, 0.0, eps))
      ));

      // Simple Lambertian shading
      float diffuse = max(dot(n, vec3(0.0, 0.0, -1.0)), 0.0);
      vec3 color = vec3(0.2, 0.5, 0.9) * diffuse;

      gl_FragColor = vec4(color, 1.0);
    } else {
      // Background color
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
  }
`;

