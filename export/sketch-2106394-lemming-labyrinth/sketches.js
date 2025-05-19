<!DOCTYPE html>
<html>
<head>
    <title>Lemming Labyrinth Game</title>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.17.1/matter.min.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <div id="game-container">
        <div id="game-header">
            <h1>Lemming Labyrinth</h1>
            <p>Guide the balls to the goal. Use limited blocks wisely, across increasingly challenging levels.</p>
					<p>A game by Gonçalo Perdigão from Algorithm G Studios</p>
        </div>
        <div id="game-indicators">
            <div id="currentLevel" class="indicator"></div>
            <div id="goal" class="indicator"></div>
            <div id="remainingBalls" class="indicator"></div>
            <div id="ballsScored" class="indicator"></div>
            <div id="blocksAvailable" class="indicator"></div>
        </div>
        <div id="game-canvas">
            <script src="mySketch.js"></script>
        </div>
    </div>
</body>
</html>
