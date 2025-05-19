<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Counters</title>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400&display=swap" rel="stylesheet">
    <style>
        html, body {
            font-family: 'Lato', sans-serif;
            font-size: 3vw;  /* Use viewport width for responsive font size */
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: white;
            margin: 0;
            overflow: hidden;
            height: 100%;
        }

        .counter-container {
            display: flex;
            flex-direction: column;
            gap: 1.5vw; /* Adjusted for responsive spacing */
            padding: 2vw;
        }

        .counter {
            text-align: center;
        }

        .counter-label {
            display: block;
            text-transform: none;
            margin-bottom: 0.5vw;
        }

        .bold-num {
            font-weight: bold;
        }

        /* Responsive adjustments for smaller screens */
        @media (max-width: 600px) {
            html, body {
                font-size: 5vw; /* Increase font size for smaller screens */
            }

            .counter-container {
                gap: 1vw;
                padding: 1vw;
            }
        }
    </style>
</head>
<body>

<div class="counter-container">
    <div style="text-align: center;">Our portfolio boasts an aggregated:</div>
    <div class="counter">
        <span class="counter-label"><span class="bold-num" id="projectsCounter">0</span> startups</span>
    </div>
    <div class="counter">
        <span class="counter-label"><span class="bold-num" id="investmentCounter">0</span>-digit investment</span>
    </div>
    <div class="counter">
        <span class="counter-label"><span class="bold-num" id="turnoverCounter">0</span>-digit turnover</span>
    </div>
    <div class="counter">
        <span class="counter-label"><span class="bold-num" id="valuationCounter">0</span>-digit valuation</span>
    </div>
    <div class="counter">
        <span class="counter-label">+<span class="bold-num" id="inventorsCounter">0</span> full-time talented inventors, entrepreneurs and builders from all over the world</span>
    </div>
</div>

<script>
    function createCounter(startValue, endValue, duration, elementId) {
        const increment = endValue / (duration / 100);  // Slowed down the counters

        function updateCounter() {
            startValue += increment;
            if (startValue <= endValue) {
                document.getElementById(elementId).textContent = Math.round(startValue);
                setTimeout(updateCounter, 100); // Slowed down the counters
            } else {
                document.getElementById(elementId).textContent = endValue;
            }
        }

        updateCounter();
    }

    window.onload = function() {
        createCounter(0, 6, 5000, 'projectsCounter');  // Increased duration to slow down the counters
        createCounter(0, 7, 5000, 'investmentCounter');
        createCounter(0, 7, 5000, 'turnoverCounter');
        createCounter(0, 8, 5000, 'valuationCounter');
        createCounter(0, 30, 5000, 'inventorsCounter');
    };
</script>

</body>
</html>
