<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Daily Dashboard</title>
<style>
  body, html {
    margin: 0; padding: 0;
    font-family: 'Helvetica Neue', sans-serif;
    overflow: hidden;
  }
  #overlayUI {
    position: absolute; 
    top: 0; left: 0; right: 0; 
    padding: 20px;
    color: #ffffff; 
    text-shadow: 0 0 5px rgba(0,0,0,0.5);
    display: flex; 
    flex-wrap: wrap; 
    justify-content: space-between; 
    align-items: flex-start;
    pointer-events: none;
  }
  
  .panel {
    background: rgba(0,0,0,0.3);
    border-radius: 10px;
    padding: 15px;
    margin: 10px 0;
    pointer-events: auto;
  }
  
  #timePanel {
    flex: 1 1 200px;
    max-width: 300px;
  }
  
  #weatherPanel {
    flex: 1 1 300px;
    max-width: 350px;
    margin-left: 20px;
  }
  
  #todosPanel {
    flex: 1 1 300px; 
    max-width: 300px;
    margin-left: 20px;
  }
  
  h1, h2, h3, h4 {
    margin: 0; padding: 0;
  }
  
  #timeText {
    font-size: 3em;
    margin-bottom: 10px;
  }
  
  #dateText {
    font-size: 1.2em;
  }

  #weatherInfo {
    margin-top: 10px;
    font-size: 1.1em;
  }
  
  #refreshWeather {
    background: #ffffff22; 
    border: none; 
    padding: 5px 10px; 
    border-radius: 5px; 
    color: #fff; 
    cursor: pointer; 
    margin-top: 10px;
  }
  
  #todoInput {
    width: 80%;
    padding: 5px;
    border-radius: 5px;
    border: none;
  }
  
  #addTodo {
    background: #ffffff22;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    color: #fff; 
    cursor: pointer;
    margin-left: 5px;
  }
  
  #todoList {
    margin-top: 10px;
    list-style: none;
    padding-left: 0;
  }
  
  #todoList li {
    background: #00000033;
    margin-bottom: 5px;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex; 
    justify-content: space-between;
    align-items: center;
  }
  
  .deleteTodo {
    background: none;
    border: none;
    color: #ffdddd;
    cursor: pointer;
    font-weight: bold;
    font-size: 1.1em;
  }
</style>
</head>
<body>
<div id="overlayUI">
  <div id="timePanel" class="panel">
    <div id="timeText">Loading...</div>
    <div id="dateText"></div>
  </div>
  <div id="weatherPanel" class="panel">
    <h3>Weather</h3>
    <div>
      City: <input type="text" id="cityInput" value="New York" style="padding:3px; border-radius:3px; border:none;"/>
      <button id="refreshWeather">Refresh</button>
    </div>
    <div id="weatherInfo">Loading weather...</div>
  </div>
  <div id="todosPanel" class="panel">
    <h3>To-Do List</h3>
    <div style="margin-bottom:10px;">
      <input type="text" id="todoInput" placeholder="Add a task...">
      <button id="addTodo">+</button>
    </div>
    <ul id="todoList"></ul>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
<script>
/** 
 * Daily Dashboard with Animated Background, Weather, Time, and To-Do
 * Replace 'YOUR_OPENWEATHERMAP_API_KEY' with a valid OpenWeatherMap API key.
 */

let particles = [];
let hueOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize particles
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(2, 5)
    });
  }
  
  // Setup event listeners for weather and todo
  document.getElementById('refreshWeather').addEventListener('click', fetchWeather);
  document.getElementById('addTodo').addEventListener('click', addTodo);
  
  // Load stored todos
  loadTodos();
  
  // Initial fetch of weather and start clock
  fetchWeather();
  setInterval(updateTime, 1000);
  updateTime();
}

function draw() {
  // Animated gradient background
  let c1 = color((hueOffset + frameCount * 0.2) % 360, 70, 50);
  let c2 = color((hueOffset + frameCount * 0.2 + 60) % 360, 70, 30);
  setGradient(c1, c2);
  
  // Draw subtle particles
  fill(255, 255, 255, 150);
  for (let p of particles) {
    ellipse(p.x, p.y, p.size, p.size);
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Gradient function
function setGradient(c1, c2) {
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let col = lerpColor(c1, c2, inter);
    stroke(col);
    line(0, y, width, y);
  }
}

// Update time UI
function updateTime() {
  let now = new Date();
  let hours = nf(now.getHours(),2);
  let mins = nf(now.getMinutes(),2);
  let secs = nf(now.getSeconds(),2);
  document.getElementById('timeText').textContent = `${hours}:${mins}:${secs}`;
  
  let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let day = dayNames[now.getDay()];
  let date = now.getDate();
  let month = monthNames[now.getMonth()];
  let year = now.getFullYear();
  
  document.getElementById('dateText').textContent = `${day}, ${month} ${date}, ${year}`;
}

// Fetch weather data
async function fetchWeather() {
  let city = document.getElementById('cityInput').value.trim();
  if (!city) city = "New York";
  
  const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  
  document.getElementById('weatherInfo').textContent = "Loading weather...";
  
  try {
    let res = await fetch(url);
    if(!res.ok) throw new Error("City not found");
    let data = await res.json();
    
    let temp = data.main.temp.toFixed(1);
    let desc = data.weather[0].description;
    let icon = data.weather[0].icon;
    let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    
    document.getElementById('weatherInfo').innerHTML = `
      <div style="display:flex; align-items:center;">
        <img src="${iconUrl}" style="width:50px; height:50px; margin-right:10px;">
        <div>
          <div style="font-size:1.2em; font-weight:bold;">${temp}°C</div>
          <div style="text-transform:capitalize;">${desc}</div>
        </div>
      </div>
    `;
  } catch (err) {
    document.getElementById('weatherInfo').textContent = "Error loading weather. Check city or API key.";
  }
}

// To-Do list functionality
let todos = [];

function loadTodos() {
  let stored = localStorage.getItem('dailyDashboardTodos');
  if (stored) {
    todos = JSON.parse(stored);
  } else {
    todos = [];
  }
  renderTodos();
}

function saveTodos() {
  localStorage.setItem('dailyDashboardTodos', JSON.stringify(todos));
}

function renderTodos() {
  let list = document.getElementById('todoList');
  list.innerHTML = '';
  for (let i = 0; i < todos.length; i++) {
    let li = document.createElement('li');
    li.textContent = todos[i];
    let btn = document.createElement('button');
    btn.textContent = '×';
    btn.className = 'deleteTodo';
    btn.addEventListener('click', () => {
      todos.splice(i, 1);
      saveTodos();
      renderTodos();
    });
    li.appendChild(btn);
    list.appendChild(li);
  }
}

function addTodo() {
  let input = document.getElementById('todoInput');
  let val = input.value.trim();
  if (val.length > 0) {
    todos.push(val);
    input.value = '';
    saveTodos();
    renderTodos();
  }
}
</script>
</body>
</html>
