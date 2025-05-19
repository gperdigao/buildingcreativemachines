<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SnakeCoin: The Retro Crypto Game</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
   	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js"></script>
	<script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js@1.5.2/dist/web3.min.js"></script>
	<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

</head>
<body>

<div class="horizontal-menu">
    <ul>
        <li><a href="#game-section">Play</a></li>
        <li><a href="#characters-section">Satoshi</a></li>
        <li><a href="#fragments-section">Fragments</a></li>
        <li><a href="#tokenomics">Tokenomics</a></li>
        <li><a href="#rewards-section">Rewards</a></li>
        <li><a href="#future-evolution">Roadmap</a></li>
    </ul>
    <div class="social-media">
        <a href="https://t.me/ggdappchat" target="_blank">Telegram</a>
        <a href="https://twitter.com/gg_dapp" target="_blank">Twitter</a>
        <a href="https://ggdapp.medium.com/" target="_blank">Medium</a>
        <a href="https://ggdapp.com/wp-content/uploads/2023/01/discord.png" target="_blank">Discord</a>
    </div>
    <button class="metamask-button">MetaMask</button>

</div>


<div class="container">
<header>
    <h1 id="game-title">Crypto Chaser: '80s arcade, modern rewards</h1>
</header>


	<section>
    <h2>Unlock daily $ rewards and snag ultra-rare NFTs. Dive in now!</h2>
 </section>
	
<section>
    <h2>The Epic Odyssey in the Digital Cosmos</h2>
    <p>
        Imagine a universe, vast and infinite, where cryptos, the lifeblood of the digital age, lay fragmented and forgotten. But hope is not lost.
    </p>
    <p>
        Enter Satoshi, a visionary coder with an unyielding passion for crypto. Driven by the desire to restore harmony, he crafts "Crypto Chaser", a unique algorithm designed to navigate this realm, seeking out and stitching together the scattered crypto fragments.
    </p>
    <p>
        Embrace the role of Satoshi. Steer the "Crypto Chaser" with precision and purpose. Traverse the digital cosmos, outsmart its treacherous obstacles, and reclaim the lost crypto fragments. The fate of the digital world rests in your hands. Are you ready for the challenge?
    </p>
</section>

	<!-- Characters Section -->
<section class="characters-section" id="characters-section">
    <h2>Meet Satoshi</h2>

    <div class="character">
        <img id="satoshi-img" src="snake3.png" alt="Satoshi">
        <p>The visionary coder who crafted the "Crypto Chaser" algorithm. Satoshi embarks on a quest to stitch together the scattered crypto fragments.</p>
    </div>
</section>

<!-- Crypto Fragments Section -->
<section class="fragments-section" id="fragments-section">

    <h2>Crypto Fragments of the Digital Cosmos</h2>
    
    <div class="fragment">
        <img src="food6.png" alt="Basic Crypto Fragment">
        <h3>Token Fragment</h3>
        <p>The common token fragments found throughout the digital realm. Essential for Satoshi's collection. Worth <strong>1 point</strong>.</p>
    </div>
    
    <div class="fragment">
        <img src="key6.png" alt="Key Fragment">
        <h3>Key Fragment</h3>
        <p>Rare fragments representing the deeper secrets of the crypto world. They unlock hidden pathways in the digital cosmos. Worth <strong>2 points</strong>.</p>
    </div>
    
    <div class="fragment">
        <img src="block6.png" alt="Block Fragment">
        <h3>Block Fragment</h3>
        <p>The building blocks of the blockchain. Collecting these fortifies Satoshi's crypto collection against glitches. Worth <strong>3 points</strong>.</p>
    </div>
</section>

<p id="score-display">Your best score = <span id="all-time-score">0</span>       Your last score = <span id="current-score">0</span></p>


    <!-- Game Canvas Embed -->
    <section id="game-section">
        <!-- The p5.js canvas will be appended here by the setup function in mySketch.js -->
    </section>

	<!-- Tokenomics Section -->
<section class="tokenomics" id="tokenomics">

    <h2>Tokenomics</h2>
    <h3>Supply and Price</h3>
	  <ul>
        <li>Supply: 50M tokens  //  Token Price: $0.01 </li>
        <li><em>(values estimated at IDO)</em></li>
    </ul>

    <h3>Distribution</h3>
    <ul>
        <li>LP Locked = 40%  //  Rewards = 40%  //  Marketing = 10%  //  Team = 10%</li>
    </ul>

    <h3>Tax 5/5</h3>
    <ul>
        <li>Ultra-rare NFT purchases: 1%  //  Liquidity pool: 1%  //  Burning: 1%  //  Marketing: 1%  //  Team treasury: 1%</li>
        <li><em>(5% on both buy & sell)</em></li>
    </ul>
</section>
	
	<section class="rewards-section" id="rewards-section">

    <h2><strong>Rewards System</strong></h2>
    
    <div class="intro">
        <h3>🔥 Begin Your Journey!</h3>
        <p><strong>Start Strong</strong>: In our initial phase, every point you earn equals 1 token.</p>
        <p><strong>Daily Wins</strong>: Play and earn daily, but remember, there's a cap on the tokens you can redeem each day to keep things fair for everyone. The initial cap is 500 tokens. </p>
    </div>
    
    <div class="community-growth">
        <h3>🌟 As Our Community Grows...</h3>
        <p><strong>Adapting for All</strong>: As more players join the Crypto Chaser family, we'll adjust the point-to-token ratio. This means the conversion might change from 1:1 to 2:1 or even more.</p>
        <p><strong>More Players, More Fun</strong>: With each milestone we hit in player numbers, there might be small tweaks in the redemption limits. It's all about balancing the game for everyone.</p>
    </div>

    <div class="special-events">
        <h3>🎉 Special Events & More!</h3>
        <p><strong>Double Reward Days</strong>: Keep an eye out for bonus events where you can earn more tokens!</p>
        <p><strong>Loyal Player? Get More</strong>: The longer and more actively you play, the better your rewards.</p>
    </div>

    <div class="fair-play">
        <h3>🛡️ Fair Play, Always!</h3>
        <p><strong>Transparent Changes</strong>: If there are any changes in the rewards, we'll tell you upfront. Your trust is our priority.</p>
        <p><strong>We Listen</strong>: Have feedback or ideas? We're all ears. Help us make Crypto Chaser even better!</p>
    </div>

    <p class="closing-statement">Join the game, chase the cryptos, and let's make some memories!</p>
</section>

	
	
<section>
<section id="future-evolution">

    <h2>Roadmap</h2>
    <ol>
        <h3>🎮 Engaging Levels:</h3> 
			      <p>Dive deeper into the digital realm with increasingly intricate grids, optimized for both desktop and mobile gameplay. Watch as the Crypto Chaser zips faster and faces more cunning digital bugs as you advance.</p>
	
        <h3>🎁 Ultra-rare NFTs:</h3> 
							<p>Satoshi's quest in the digital world is sprinkled with unique surprises. Discover ultra-rare NFTs, reminiscent of coveted treasures like Apes and CryptoPunks, financed by the game's transaction proceeds. These gems will sporadically emerge in the game arena, waiting for a lucky player to claim them at no cost. However, to ensure both commitment and fairness, only those with a minimum of 10,000 tokens in their wallets stand a chance to seize these prized possessions. The rarest treasures await the most dedicated players!<p>
        
        <h3>💰 Real Token Redemption:</h3> 
							<p>Prove your prowess, and once we transition out of our beta phase, the game will merge with the blockchain. Players will have the thrilling opportunity to earn genuine Ethereum and Polygon tokens, heralding a true play-to-earn experience. An exhilarating gaming adventure with tangible rewards!<p>
    </ol>
</section>


	
    <!-- Footer Text -->
    <footer>
        ❤️ By Algorithm G Studios, 2023 with GG dApp - the origin of $GGTK ❤️
    </footer>
</div>

<!-- Include your game script -->
<script src="mySketch.js"></script>

</body>
</html>
