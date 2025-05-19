// A Surreal Infinite Fractal Corridor in p5.js
// Raymarching a fractal structure with infinite repetition and dynamic coloring
// No user interaction, no external input.

let shaderProgram;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  shaderProgram = createShader(vertShader, fragShader);
}

function draw() {
  background(0);
  shader(shaderProgram);

  shaderProgram.setUniform('u_time', millis()/1000.0);
  shaderProgram.setUniform('u_resolution', [width, height]);

  // Render a plane covering the entire viewport
  plane(width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Vertex Shader
const vertShader = `
  precision mediump float;

  attribute vec3 aPosition;
  attribute vec2 aTexCoord;

  varying vec2 vTexCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    vTexCoord = aTexCoord;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition,1.0);
  }
`;

// Fragment Shader
const fragShader = `
  precision highp float;

  varying vec2 vTexCoord;

  uniform float u_time;
  uniform vec2 u_resolution;

  // --- Utility Functions ---

  // Convert HSB to RGB
  vec3 hsb2rgb(vec3 c){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0);
    // softening
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  // Background color function
  vec3 backgroundColor(vec3 rd) {
    float v = 0.5*(rd.y+1.0);
    return mix(vec3(0.02,0.01,0.05), vec3(0.15,0.1,0.2), v);
  }

  // Shading function
  vec3 shade(vec3 p, vec3 n, vec3 ro, vec3 rd) {
    float time = u_time;
    
    // Light direction
    vec3 lightDir = normalize(vec3(sin(time*0.5), 0.4, cos(time*0.5)));
    float diff = max(dot(n, lightDir),0.0);

    // Animate color over position and time
    float hue = fract(0.1*p.x + 0.1*p.z + time*0.05);
    float sat = 0.9;
    float val = diff*0.8 + 0.2;
    vec3 col = hsb2rgb(vec3(hue, sat, val));

    // Rim lighting for detail
    float rim = pow(1.0 - dot(n, -rd), 2.0);
    col += 0.2 * rim;

    return col;
  }

  // SDF for scene
  float sdBox(vec3 p, vec3 b) {
    vec3 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,max(d.y,d.z)),0.0);
  }

  vec3 repeatXZ(vec3 p, float repeatScale) {
    p.x = mod(p.x, repeatScale)-0.5*repeatScale;
    p.z = mod(p.z, repeatScale)-0.5*repeatScale;
    return p;
  }

  float mapScene(vec3 p) {
    float dist = 1e9;
    float scale = 5.0;

    // fractal-like repetition
    for (int i=0; i<3; i++) {
      vec3 pr = repeatXZ(p, scale);
      float d1 = sdBox(pr, vec3(0.2,0.8,0.2));
      float d2 = sdBox(pr + vec3(1.0, 0.0, 0.0), vec3(0.1,0.5,0.1));
      float d3 = sdBox(pr + vec3(-1.0, 0.0, 0.0), vec3(0.1,0.5,0.1));
      float d4 = sdBox(pr + vec3(0.0, 0.0, 1.0), vec3(0.1,0.5,0.1));
      float d5 = sdBox(pr + vec3(0.0, 0.0, -1.0), vec3(0.1,0.5,0.1));
      float cellDist = min(d1, min(min(d2,d3),min(d4,d5)));
      dist = min(dist, cellDist);
      scale *= 0.5;
    }

    // floor and ceiling
    float floorDist = p.y + 0.7;
    float ceilingDist = -(p.y - 0.7);
    dist = min(dist, min(floorDist, ceilingDist));
    return dist;
  }

  vec3 getNormal(vec3 p) {
    float eps = 0.001;
    float d = mapScene(p);
    vec3 n = vec3(
      mapScene(vec3(p.x+eps,p.y,p.z))-d,
      mapScene(vec3(p.x,p.y+eps,p.z))-d,
      mapScene(vec3(p.x,p.y,p.z+eps))-d
    );
    return normalize(n);
  }

  vec3 raymarch(vec3 ro, vec3 rd) {
    float t = 0.0;
    for (int i=0; i<100; i++) {
      vec3 pos = ro + rd*t;
      float d = mapScene(pos);
      if (d < 0.001) {
        vec3 n = getNormal(pos);
        return shade(pos,n,ro,rd);
      }
      t += d;
      if (t>100.0) break;
    }
    return backgroundColor(rd);
  }

  void main(){
    vec2 uv = vTexCoord * 2.0 - 1.0;
    float aspect = u_resolution.x/u_resolution.y;
    uv.x *= aspect;

    float time = u_time;
    vec3 ro = vec3(0.0, 0.0, time*2.0);
    vec3 target = vec3(0.0,0.0, ro.z+1.0);
    vec3 ww = normalize(target - ro);
    vec3 uu = normalize(cross(vec3(0,1,0),ww));
    vec3 vv = cross(ww,uu);

    vec3 rd = normalize(uv.x*uu + uv.y*vv + ww);

    vec3 color = raymarch(ro, rd);

    gl_FragColor = vec4(color,1.0);
  }
`;
