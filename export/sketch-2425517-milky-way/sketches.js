let stars = [];
let angleOffset = 0;

function setup() {
  createCanvas(800, 800);
  for (let i = 0; i < 1000; i++) {
    let angle = random(TWO_PI);
    let radius = sqrt(random(pow(width / 2, 2))) * 0.5;
    stars.push({
      position: createVector(radius * cos(angle), radius * sin(angle)),
      colorOffset: random(100, 255),
      speed: random(0.001, 0.003),
      orbitRadius: radius,
      angle: angle
    });
  }
  noFill();
}

function draw() {
  background(5, 5, 15, 50); // Fundo escuro e translúcido
  translate(width / 2, height / 2);
  rotate(angleOffset * 0.02);

  // Desenha cada estrela com sua própria trajetória de órbita e "pulsações"
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    
    // Incrementa o ângulo para criar o movimento orbital
    star.angle += star.speed;
    
    // Atualiza a posição da estrela para girar em uma órbita espiral
    star.position.x = star.orbitRadius * cos(star.angle);
    star.position.y = star.orbitRadius * sin(star.angle);
    
    // Variações de cor e tamanho para simular brilho estelar
    let colorValue = (sin(star.angle * 5) * 50) + star.colorOffset;
    let starSize = map(sin(frameCount * star.speed), -1, 1, 2, 5);
    
    // Desenha estrela
    stroke(colorValue, 180, 255, 200);
    strokeWeight(starSize);
    point(star.position.x, star.position.y);
    
    // Efeito de cauda leve e translúcido para o movimento
    strokeWeight(1);
    stroke(255, 100);
    line(0, 0, star.position.x * 0.95, star.position.y * 0.95);
  }

  angleOffset += 0.002;
}
