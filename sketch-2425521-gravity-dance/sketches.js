let stars = [];
let gravityPoints = [];
let numGravityPoints = 5;
let angleOffset = 0;

function setup() {
  createCanvas(800, 800);
  
  // Inicializa as estrelas
  for (let i = 0; i < 500; i++) {
    let angle = random(TWO_PI);
    let radius = sqrt(random(pow(width / 2, 2))) * 0.4;
    stars.push({
      position: createVector(random(-width / 2, width / 2), random(-height / 2, height / 2)),
      velocity: createVector(0, 0),
      colorOffset: random(100, 255),
      size: random(2, 5),
      speed: random(0.005, 0.01)
    });
  }
  
  // Inicializa os pontos de gravidade
  for (let i = 0; i < numGravityPoints; i++) {
    gravityPoints.push(createVector(random(-width / 2, width / 2), random(-height / 2, height / 2)));
  }
  noFill();
}

function draw() {
  background(5, 5, 15, 60); // Fundo escuro para efeito cósmico
  translate(width / 2, height / 2);
  
  // Atualiza a posição dos pontos de gravidade com um leve movimento
  for (let i = 0; i < gravityPoints.length; i++) {
    gravityPoints[i].x += sin(angleOffset + i) * 2;
    gravityPoints[i].y += cos(angleOffset + i) * 2;
  }
  
  // Desenha cada estrela e aplica forças gravitacionais
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    
    // Calcula a força gravitacional total exercida por todos os pontos de gravidade
    let totalForce = createVector(0, 0);
    for (let j = 0; j < gravityPoints.length; j++) {
      let force = p5.Vector.sub(gravityPoints[j], star.position);
      let distance = constrain(force.mag(), 50, 200); // Limita a influência gravitacional
      force.setMag(1 / (distance * 0.1));
      totalForce.add(force);
    }
    
    // Atualiza a posição e velocidade da estrela
    star.velocity.add(totalForce);
    star.position.add(star.velocity);
    star.velocity.limit(2); // Limita a velocidade para manter o efeito coeso

    // Desenha a estrela
    let colorValue = star.colorOffset + sin(frameCount * star.speed) * 50;
    stroke(colorValue, 180, 255 - colorValue, 200);
    strokeWeight(star.size);
    point(star.position.x, star.position.y);

    // Linhas finas para realçar o movimento de cada estrela
    stroke(255, 100);
    strokeWeight(0.5);
    line(star.position.x, star.position.y, star.position.x - star.velocity.x * 2, star.position.y - star.velocity.y * 2);
  }

  angleOffset += 0.005;
}
