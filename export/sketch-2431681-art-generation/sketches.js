<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Generative Tree Gallery Piece</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #FFFFFF;
            margin: 0;
            padding: 0;
            overflow-x: hidden; /* Prevents horizontal scrolling */
        }
        
        #promptContainer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            min-height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.95);
            z-index: 1000;
            padding: 20px;
        }
        
        #promptContainer h1 {
            margin-bottom: 10px;
            font-size: 24px;
        }
        #promptContainer h2 {
            margin-bottom: 10px;
            font-size: 20px;
        }
        #promptContainer p {
            max-width: 600px;
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.5;
        }
        #promptContainer input {
            padding: 10px;
            font-size: 16px;
            border: 2px solid #000;
            border-radius: 5px;
            width: 250px;
            margin-bottom: 20px;
        }
        .styledButton {
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            background-color: #000;
            color: #fff;
            cursor: pointer;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
            transition: background-color 0.3s;
            margin-top: 20px;
            margin-bottom: 50px;
        }
        .styledButton:hover {
            background-color: #333;
        }
        canvas {
            display: block;
            margin: 50px auto;
            border: 13px solid black;
            box-sizing: content-box;
            box-shadow: -26px 26px 26px rgba(0, 0, 0, 0.5);
            max-width: 100%;
            height: auto;
            width: 90%;
        }
        
        /* Responsive adjustments for mobile devices */
        @media (max-width: 600px) {
            canvas {
                border: 5px solid black;
                box-shadow: -10px 10px 10px rgba(0, 0, 0, 0.5);
                margin: 20px auto;
            }
        }
    </style>
</head>
<body>
    <div id="promptContainer">
        <h1>Welcome to Building Creative Machines<br>Be part of our Art Generation Experience</h1>
        <p>Experience the magic of art reimagined. This generator crafts a bespoke masterpiece, uniquely imprinted with your name, date, and the precise moment of creation. Each artwork stands as a one-of-a-kind reflection of your presence, further enriched by the shared spirit and growing legacy of our creative community—evolving with every new piece ever made.</p>
        <p>After submitting your name and email, you may download your unique art piece and share it with the world. We will use your email only to subscribe you to the Building Creative Machines Substack and offer you new experiences like this and much more.</p>
        <h2>What is your name?</h2>
        <input type="text" id="nameInput" placeholder="Enter your name">
        <h2>What is your email?</h2>
        <input type="email" id="emailInput" placeholder="Enter your email">
        <button id="submitButton" class="styledButton">Submit</button>
    </div>
    <script>
        (function() {
            // Linear Congruential Generator (LCG) for pseudo-random number generation
            function LCG(seed) {
                return function() {
                    seed = (seed * 1664525 + 1013904223) % 4294967296;
                    return seed / 4294967296;
                }
            }

            // Simple hash function to generate a numerical seed from a string
            function hashString(str) {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                    hash = hash & hash;
                }
                return Math.abs(hash);
            }

            // Function to detect if the device is a mobile smartphone
            function isMobile() {
                return /Mobi|Android/i.test(navigator.userAgent);
            }

            document.addEventListener('DOMContentLoaded', function() {
                const nameInput = document.getElementById('nameInput');
                const emailInput = document.getElementById('emailInput');
                const promptContainer = document.getElementById('promptContainer');
                const submitButton = document.getElementById('submitButton');

                const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/q5grl5uop89pe'; // Replace with your SheetDB API URL

                function sendDataToSheetDB(name, email) {
                    const data = {
                        data: [
                            {
                                Name: name,
                                Email: email
                            }
                        ]
                    };

                    fetch(SHEETDB_API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(function(response) {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(function(data) {
                        console.log('Data sent to SheetDB:', data);
                    })
                    .catch(function(error) {
                        console.error('Error sending data to SheetDB:', error);
                    });
                }

                submitButton.addEventListener('click', function() {
                    const userName = nameInput.value.trim();
                    const userEmail = emailInput.value.trim();
                    if (userName !== '' && userEmail !== '') {
                        sendDataToSheetDB(userName, userEmail);
                        if (isMobile()) {
                            generateAndDownloadImage(userName);
                        } else {
                            startTreeGeneration(userName);
                        }
                    } else {
                        alert('Please enter your name and email.');
                    }
                });

                nameInput.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' || event.keyCode === 13) {
                        emailInput.focus();
                    }
                });

                emailInput.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter' || event.keyCode === 13) {
                        const userName = nameInput.value.trim();
                        const userEmail = emailInput.value.trim();
                        if (userName !== '' && userEmail !== '') {
                            sendDataToSheetDB(userName, userEmail);
                            if (isMobile()) {
                                generateAndDownloadImage(userName);
                            } else {
                                startTreeGeneration(userName);
                            }
                        } else {
                            alert('Please enter your name and email.');
                        }
                    }
                });

                function startTreeGeneration(userName) {
                    promptContainer.style.display = 'none';

                    const canvas = document.createElement('canvas');
                    const maxCanvasWidth = 800;
                    const cssCanvasWidth = Math.min(window.innerWidth * 0.9, maxCanvasWidth);
                    const cssCanvasHeight = cssCanvasWidth * 0.75; // Maintain aspect ratio

                    // Get device pixel ratio
                    const devicePixelRatio = window.devicePixelRatio || 1;

                    // Set the canvas width and height according to the device pixel ratio
                    canvas.width = cssCanvasWidth * devicePixelRatio;
                    canvas.height = cssCanvasHeight * devicePixelRatio;

                    // Set the canvas CSS width and height
                    canvas.style.width = cssCanvasWidth + 'px';
                    canvas.style.height = cssCanvasHeight + 'px';

                    const ctx = canvas.getContext('2d');

                    // Scale the context to the device pixel ratio
                    ctx.scale(devicePixelRatio, devicePixelRatio);

                    // Append the canvas to the document
                    document.body.appendChild(canvas);

                    // Create and append the download button
                    const downloadButton = document.createElement('button');
                    downloadButton.textContent = 'Download';
                    downloadButton.id = 'downloadButton';
                    downloadButton.className = 'styledButton';
                    document.body.appendChild(downloadButton);

                    downloadButton.addEventListener('click', function() {
                        const link = document.createElement('a');
                        link.download = userName.replace(/\s+/g, '_') + '_Generative_Tree.png';
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    });

                    // Generate and draw the tree
                    generateTree(canvas, ctx, cssCanvasWidth, cssCanvasHeight, userName, function() {
                        // Drawing complete, nothing else to do
                    });
                }

                function generateAndDownloadImage(userName) {
                    promptContainer.style.display = 'none';

                    const canvas = document.createElement('canvas');
                    const maxCanvasWidth = 800;
                    const canvasWidth = maxCanvasWidth;
                    const canvasHeight = canvasWidth * 0.75; // Maintain aspect ratio

                    // Get device pixel ratio
                    const devicePixelRatio = window.devicePixelRatio || 1;

                    // Set the canvas width and height according to the device pixel ratio
                    canvas.width = canvasWidth * devicePixelRatio;
                    canvas.height = canvasHeight * devicePixelRatio;

                    const ctx = canvas.getContext('2d');

                    // Scale the context to the device pixel ratio
                    ctx.scale(devicePixelRatio, devicePixelRatio);

                    // Generate and draw the tree
                    generateTree(canvas, ctx, canvasWidth, canvasHeight, userName, function() {
                        // Drawing complete, initiate download
                        const link = document.createElement('a');
                        link.download = userName.replace(/\s+/g, '_') + '_Generative_Tree.png';
                        link.href = canvas.toDataURL('image/png');
                        link.click();
                    });
                }

                // Shared function to generate and draw the tree
                function generateTree(canvas, ctx, canvasWidth, canvasHeight, userName, callback) {
                    const inputNumber = 1001;
                    const currentDate = new Date();
                    const seedInput = hashString(userName) + currentDate.getTime() + inputNumber;
                    const prng = LCG(seedInput);

                    const maxBranches = 1000;
                    const angleVariation = 70;
                    const lengthVariation = 0.7;
                    const baseLength = 80;
                    const colors = ['#FF7F50', '#FFD700', '#ADFF2F', '#00FA9A', '#00CED1', '#1E90FF', '#9932CC'];

                    let branches = [{
                        x: canvasWidth / 2,
                        y: canvasHeight - 50 - 26,
                        angle: -90,
                        length: baseLength,
                        depth: 0,
                        maxDepth: 12
                    }];

                    function initBackground() {
                        const gradient = ctx.createRadialGradient(
                            canvasWidth / 2, canvasHeight, 0,
                            canvasWidth / 2, canvasHeight, canvasHeight
                        );
                        gradient.addColorStop(0, '#000000');
                        gradient.addColorStop(1, '#333333');
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                    }

                    initBackground();

                    function drawStamp() {
                        const stampTextLine1 = 'A unique creation for ' + userName + ' by Building Creative Machines, marked ' + currentDate.toLocaleString();
                        const stampTextLine2 = 'Craft your masterpiece at www.buildingcreativemachines.com';
                        ctx.font = '12px Arial'; // Keep font size consistent
                        ctx.fillStyle = 'white';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.fillText(stampTextLine1, canvasWidth / 2, canvasHeight - 10 - 26);
                        ctx.fillText(stampTextLine2, canvasWidth / 2, canvasHeight - 30 - 26);
                    }

                    function draw() {
                        let newBranches = [];

                        branches.forEach(function(branch) {
                            ctx.beginPath();
                            ctx.moveTo(branch.x, branch.y);

                            const endX = branch.x + branch.length * Math.cos(branch.angle * Math.PI / 180);
                            const endY = branch.y + branch.length * Math.sin(branch.angle * Math.PI / 180);

                            ctx.lineTo(endX, endY);

                            ctx.strokeStyle = colors[branch.depth % colors.length];
                            ctx.lineWidth = (branch.maxDepth - branch.depth + 1) * 1.2; // Keep line width consistent
                            ctx.stroke();

                            if (branch.depth < branch.maxDepth) {
                                const branchesNum = 2 + Math.round(prng() * 2);
                                for (let i = 0; i < branchesNum; i++) {
                                    const newAngle = branch.angle + prng() * angleVariation - angleVariation / 2;
                                    const newLength = branch.length * (lengthVariation + prng() * (1 - lengthVariation));

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
                                ctx.beginPath();
                                const radius = 5 + prng() * 5; // Keep radius consistent
                                ctx.arc(endX, endY, radius, 0, Math.PI * 2);
                                ctx.fillStyle = colors[(branch.depth + 1) % colors.length];
                                ctx.fill();
                            }
                        });

                        branches = newBranches;

                        if (branches.length > 0 && branches.length < maxBranches) {
                            // Continue drawing with animation frame
                            requestAnimationFrame(draw);
                        } else {
                            drawStamp();
                            callback(); // Drawing is complete
                        }
                    }

                    draw();
                }
            });
        })();
    </script>
</body>
</html>
