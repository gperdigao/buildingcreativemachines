(function() {
    // Create and style the canvas
    var canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    canvas.style.display = 'block';
    canvas.style.margin = '50px auto';
    canvas.style.border = '13px solid black';
    canvas.style.padding = '26px';
    canvas.style.boxShadow = '-26px 26px 26px rgba(0, 0, 0, 0.5)';
    document.body.style.backgroundColor = '#FFFFFF';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');

    // Variables for the tree generation
    var branches = [];
    var maxBranches = 1000;
    var angleVariation = 70;
    var lengthVariation = 0.7;
    var baseLength = 80;
    var colors = ['#FF7F50', '#FFD700', '#ADFF2F', '#00FA9A', '#00CED1', '#1E90FF', '#9932CC'];

    // Initial branch starting from the bottom center
    branches.push({
        x: canvas.width / 2,
        y: canvas.height - 50,
        angle: -90,
        length: baseLength,
        depth: 0,
        maxDepth: 12
    });

    // Function to draw the tree recursively
    function draw() {
        var newBranches = [];

        branches.forEach(function(branch) {
            ctx.beginPath();
            ctx.moveTo(branch.x, branch.y);

            var endX = branch.x + branch.length * Math.cos(branch.angle * Math.PI / 180);
            var endY = branch.y + branch.length * Math.sin(branch.angle * Math.PI / 180);

            ctx.lineTo(endX, endY);

            ctx.strokeStyle = colors[branch.depth % colors.length];
            ctx.lineWidth = (branch.maxDepth - branch.depth + 1) * 1.2;
            ctx.stroke();

            // Generate new branches if depth allows
            if (branch.depth < branch.maxDepth) {
                var branchesNum = 2 + Math.round(Math.random() * 2); // Randomly 2 to 4 branches
                for (var i = 0; i < branchesNum; i++) {
                    var newAngle = branch.angle + Math.random() * angleVariation - angleVariation / 2;
                    var newLength = branch.length * (lengthVariation + Math.random() * (1 - lengthVariation));

                    newBranches.push({
                        x: endX,
                        y: endY,
                        angle: newAngle,
                        length: newLength,
                        depth: branch.depth + 1,
                        maxDepth: branch.maxDepth
                    });
                }
            } else {
                // Draw leaves at the end branches
                ctx.beginPath();
                ctx.arc(endX, endY, 5 + Math.random() * 5, 0, Math.PI * 2);
                ctx.fillStyle = colors[(branch.depth + 1) % colors.length];
                ctx.fill();
            }
        });

        branches = newBranches;

        // Continue drawing if there are new branches
        if (branches.length > 0 && branches.length < maxBranches) {
            requestAnimationFrame(draw);
        }
    }

    // Draw a gradient background
    var gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height, 0,
        canvas.width / 2, canvas.height, canvas.height
    );
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#333333');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Start the tree drawing
    draw();

})();
