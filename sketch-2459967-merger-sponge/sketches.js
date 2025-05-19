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

  // Uniforms for transformation matrices
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
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

  // Function to rotate a vector around an arbitrary axis
  mat3 rotate(vec3 axis, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat3(
      oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
      oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z - axis.x * s,
      oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c
    );
  }

  // Distance estimator for the Menger Sponge fractal
  float mengerSponge(vec3 p) {
    float scale = 3.0;
    float minDist = 1e20;

    for (int i = 0; i < 3; i++) {
      p = abs(p);
      // Swap components correctly
      if (p.x < p.y) {
        float temp = p.x;
        p.x = p.y;
        p.y = temp;
      }
      if (p.x < p.z) {
        float temp = p.x;
        p.x = p.z;
        p.z = temp;
      }
      if (p.y < p.z) {
        float temp = p.y;
        p.y = p.z;
        p.z = temp;
      }
      p = scale * p - vec3(scale - 1.0);
      float dist = length(p) / pow(scale, float(i));
      minDist = min(minDist, dist);
    }

    return minDist;
  }

  void main() {
    // Compute UV coordinates
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    // Camera setup
    vec3 ro = vec3(0.0, 0.0, -4.0); // Ray origin
    vec3 rd = normalize(vec3(uv, 1.5)); // Ray direction

    // Rotate the camera based on time and mouse position
    float angle = u_time * 0.5 + (u_mouse.x / u_resolution.x - 0.5) * 3.14;
    vec3 axis = normalize(vec3(0.5, 1.0, 0.0));
    mat3 rotation = rotate(axis, angle);
    ro = rotation * ro;
    rd = rotation * rd;

    // Ray marching
    float totalDistance = 0.0;
    bool hit = false;
    vec3 p;

    for (int i = 0; i < 48; i++) {
      p = ro + rd * totalDistance;
      float distance = mengerSponge(p);
      if (distance < 0.001) {
        hit = true;
        break;
      }
      totalDistance += distance * 0.5; // Step size
      if (totalDistance > 100.0) break;
    }

    if (hit) {
      // Calculate normal for lighting using finite differences
      float eps = 0.001;
      vec3 n = normalize(vec3(
        mengerSponge(p + vec3(eps, 0.0, 0.0)) - mengerSponge(p - vec3(eps, 0.0, 0.0)),
        mengerSponge(p + vec3(0.0, eps, 0.0)) - mengerSponge(p - vec3(0.0, eps, 0.0)),
        mengerSponge(p + vec3(0.0, 0.0, eps)) - mengerSponge(p - vec3(0.0, 0.0, eps))
      ));

      // Simple Phong shading
      vec3 lightPos = vec3(5.0, 5.0, -5.0);
      vec3 lightDir = normalize(lightPos - p);
      float diffuse = max(dot(n, lightDir), 0.0);
      vec3 reflectDir = reflect(-lightDir, n);
      vec3 viewDir = normalize(-rd);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);
      vec3 color = vec3(0.8, 0.7, 0.5) * diffuse + vec3(1.0) * spec;

      gl_FragColor = vec4(color, 1.0);
    } else {
      // Background color
      gl_FragColor = vec4(0.0, 0.1, 0.2, 1.0);
    }
  }
`;
