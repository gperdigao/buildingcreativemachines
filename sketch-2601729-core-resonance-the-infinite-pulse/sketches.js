// Parâmetros globais
let particles = [];
let numParticles = 300;
let noiseScale = 0.005;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  // Cria as partículas em posições aleatórias
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  // Fundo semi-transparente para efeito de rastro
  background(0, 20);
  time += 0.005; // Incrementa o tempo para oscilação
  
  // Atualiza e desenha as partículas
  for (let p of particles) {
    p.update();
    p.show();
  }
  
  // Desenha um núcleo oscilante matemático no centro
  drawOscillatingCore();
  // Desenha uma espiral rotativa com vibração
  drawRotatingSpiral();
}

// Ajusta o canvas ao redimensionar a janela
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Classe Particle: gerencia posição, velocidade, aceleração e histórico para rastro
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.history = [];
  }
  
  update() {
    // Calcula a direção baseada em um campo de ruído (simula uma força variável)
    let angle = noise(this.pos.x * noiseScale, this.pos.y * noiseScale, time) * TWO_PI * 4;
    this.acc = p5.Vector.fromAngle(angle);
    this.acc.mult(0.5);
    
    // Atualiza velocidade e posição com limitação
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    
    // Armazena o histórico para traçar o rastro
    this.history.push(this.pos.copy());
    if (this.history.length > 50) {
      this.history.splice(0, 1);
    }
    
    // Efeito de tela infinita (wrap-around)
    if (this.pos.x > width)  this.pos.x = 0;
    if (this.pos.x < 0)      this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0)      this.pos.y = height;
  }
  
  show() {
    // Desenha o rastro da partícula
    noFill();
    stroke(255, 150);
    beginShape();
    for (let v of this.history) {
      vertex(v.x, v.y);
    }
    endShape();
    
    // Desenha a partícula em si
    noStroke();
    fill(255, 200);
    ellipse(this.pos.x, this.pos.y, 3, 3);
  }
}

// Desenha um núcleo oscilante no centro usando funções trigonométricas
function drawOscillatingCore() {
  push();
  translate(width / 2, height / 2);
  let numPoints = 200;
  let baseRadius = 100;
  stroke(255, 100);
  noFill();
  beginShape();
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i, 0, numPoints, 0, TWO_PI);
    // Combinação de senos e cossenos para gerar oscilações complexas
    let r = baseRadius + 50 * sin(5 * angle + time * 3) + 20 * cos(3 * angle - time * 2);
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}

// Desenha uma espiral rotativa com um toque de vibração
function drawRotatingSpiral() {
  push();
  translate(width / 2, height / 2);
  let spiralPoints = 300;
  let r0 = 10;
  stroke(200, 100);
  noFill();
  beginShape();
  for (let i = 0; i < spiralPoints; i++) {
    let t = map(i, 0, spiralPoints, 0, 10 * TWO_PI);
    // Calcula o raio com uma oscilação que varia com o tempo
    let r = r0 + (i * 0.5) + 20 * sin(0.5 * t + time);
    let x = r * cos(t + time * 0.5);
    let y = r * sin(t + time * 0.5);
    vertex(x, y);
  }
  endShape();
  pop();
}
