const sketch = (p) => {
    let particles = [];
    const gridSize = 60;
    let spatialGrid = {};
    let canvas;

    class Particle {
        constructor() {
            this.pos = p.createVector(p.width/2 + p.random(-50,50), p.height/2 + p.random(-50,50));
            this.prevPos = this.pos.copy();
            this.vel = p.createVector(p.random(-1,1), p.random(-1,1));
            this.acc = p.createVector();
            this.radius = p.random(2,4);
            this.hue = p.random(100, 300);
        }

        updatePosition() {
            const temp = this.pos.copy();
            this.vel = this.pos.copy().sub(this.prevPos);
            this.pos.add(this.vel.add(this.acc));
            this.prevPos = temp;
            this.acc.mult(0);
        }

        applyForce(f) {
            this.acc.add(f);
        }
    }

    p.setup = () => {
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style('display', 'block');
        p.colorMode(p.HSB, 360);
        p.noStroke();
        
        const density = p.windowWidth < 600 ? 2 : 3;
        const particleCount = Math.floor(p.width * p.height / (gridSize * gridSize * density));
        
        for(let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    p.draw = () => {
        p.background(0, 0.1);
        buildSpatialGrid();
        
        particles.forEach(particle => {
            applyForces(particle);
            particle.updatePosition();
            handleBoundaries(particle);
            drawParticle(particle);
        });
    };

    function buildSpatialGrid() {
        spatialGrid = {};
        particles.forEach(particle => {
            const x = Math.floor(particle.pos.x / gridSize);
            const y = Math.floor(particle.pos.y / gridSize);
            const key = `${x},${y}`;
            
            if(!spatialGrid[key]) spatialGrid[key] = [];
            spatialGrid[key].push(particle);
        });
    }

    function applyForces(particle) {
        const mouse = p.createVector(p.mouseX, p.mouseY);
        const toMouse = p5.Vector.sub(mouse, particle.pos);
        const mouseDist = toMouse.mag();
        
        // Magnetic repulsion from mouse
        if(mouseDist < 150) {
            const force = toMouse.mult(-0.2 / mouseDist);
            particle.applyForce(force);
        }

        // Central gravitational pull
        const center = p.createVector(p.width/2, p.height/2);
        const toCenter = p5.Vector.sub(center, particle.pos);
        particle.applyForce(toCenter.mult(0.0001));

        // Particle interactions
        const x = Math.floor(particle.pos.x / gridSize);
        const y = Math.floor(particle.pos.y / gridSize);
        
        for(let xi = x-1; xi <= x+1; xi++) {
            for(let yi = y-1; yi <= y+1; yi++) {
                const neighbors = spatialGrid[`${xi},${yi}`] || [];
                neighbors.forEach(other => {
                    if(particle !== other) {
                        const dir = p5.Vector.sub(particle.pos, other.pos);
                        const dist = dir.mag();
                        if(dist < gridSize) {
                            const force = dir.normalize().mult(0.2 * (1 - dist/gridSize));
                            particle.applyForce(force);
                        }
                    }
                });
            }
        }
    }

    function handleBoundaries(particle) {
        if(particle.pos.x < 0 || particle.pos.x > p.width) {
            particle.pos.x = p.constrain(particle.pos.x, 0, p.width);
            particle.prevPos.x = particle.pos.x - particle.vel.x * 0.5;
        }
        if(particle.pos.y < 0 || particle.pos.y > p.height) {
            particle.pos.y = p.constrain(particle.pos.y, 0, p.height);
            particle.prevPos.y = particle.pos.y - particle.vel.y * 0.5;
        }
    }

    function drawParticle(particle) {
        const speed = particle.vel.mag();
        const alpha = p.map(speed, 0, 2, 50, 200);
        const size = p.map(speed, 0, 3, particle.radius, particle.radius*3);
        
        p.fill(particle.hue, 300, 300, alpha/360);
        p.ellipse(particle.pos.x, particle.pos.y, size);
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};

new p5(sketch, document.body);