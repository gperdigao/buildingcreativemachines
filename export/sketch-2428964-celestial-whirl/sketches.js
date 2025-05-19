(async function() {
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js');
  const THREE = await import('https://unpkg.com/three@0.152.0/build/three.module.js');
  new p5(p => {
    let scene, camera, renderer, galaxy;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight).hide();
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 4000);
      camera.position.z = 1000;
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
      createGalaxy();
      document.addEventListener('mousemove', onDocumentMouseMove, false);
      window.addEventListener('resize', onWindowResize, false);
    };
    p.draw = function() {
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      galaxy.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    function createGalaxy() {
      const particleCount = 50000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const color = new THREE.Color();
      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2000;
        const angle = Math.random() * Math.PI * 2;
        const spiralAngle = radius / 1000 * Math.PI * 4;
        const x = Math.cos(angle + spiralAngle) * radius;
        const y = (Math.random() - 0.5) * 200;
        const z = Math.sin(angle + spiralAngle) * radius;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        const vx = (x / 2000) + 0.5;
        const vy = (y / 2000) + 0.5;
        const vz = (z / 2000) + 0.5;
        color.setRGB(vx * 1.5, vy * 1.5, vz * 1.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        sizes[i] = 5;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      const material = new THREE.PointsMaterial({
        size: 5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      galaxy = new THREE.Points(geometry, material);
      scene.add(galaxy);
    }
    function onDocumentMouseMove(event) {
      mouseX = (event.clientX - windowHalfX) * 2;
      mouseY = (event.clientY - windowHalfY) * 2;
    }
    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
  });
})();
