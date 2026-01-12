/*jshint esversion: 6 */
const tiles = document.querySelectorAll('.tile'); // the 4 colour buttons
const startBtn = document.getElementById('start');
const restartBtn = document.getElementById('restart');
const levelEl = document.getElementById('level');
const highEl = document.getElementById('highscore');
const statusEl = document.getElementById('status');

const HIGH_KEY = 'memory_game_highscore';

const COLORS = ['red', 'green', 'blue', 'yellow'];

let sequence = [];     // example: ['red', 'blue', 'green']
let userIndex = 0;     // where the player is in the sequence right now
let level = 0;         // current level (how long the sequence is)
let highScore = 0;     // best level you ever reached
let running = false;   // is a game currently in progress?
let inPlayback = false;// true while the game is showing the pattern (player must wait)


// Helper function to set up click listener for a tile
function setupTileClickListener(tile) {
  tile.addEventListener('click', function () {
    handleTileClick(tile);
  });
}

loadHighScore();
updateLevel(0);
setStatus('Press Start to Play');

// Add click listeners to each tile
for (let i = 0; i < tiles.length; i++) {
  const tile = tiles[i];
  setupTileClickListener(tile);
}

// Add listeners to buttons
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);


function startGame() {
  if (running) {
    // Do nothing if already playing
    return;
  }

  running = true;
  sequence = [];
  userIndex = 0;
  level = 0;
  updateLevel(level);
  setStatus('Watch the pattern...');
  nextRound();
}

function restartGame() {
  // Reset button
  running = false;
  inPlayback = false;
  sequence = [];
  userIndex = 0;
  level = 0;
  updateLevel(level);
  setStatus('Game reset. Press Start to Play');
}

function nextRound() {
  const nextColor = getRandomColor();
  sequence.push(nextColor);

  level = sequence.length;
  updateLevel(level);

  if (level > highScore) {
    highScore = level;
    saveHighScore(highScore);
    showHighScore(highScore);
  }

  playSequence();
}

function playSequence() {
  inPlayback = true;     
  userIndex = 0;         
  setStatus('Watch the pattern...');

  let i = 0;

  setTimeout(function showNext() {
    if (!running) {
    
      return;
    }

    if (i >= sequence.length) {
   
      inPlayback = false;
      setStatus('Your turn! Repeat the pattern.');
      return;
    }

    const color = sequence[i];
    const tile = getTileByColor(color);

    flashTile(tile); 
    i++;

    setTimeout(showNext, 600); // 600ms gap between flashes
  }, 500); // 500ms pause before starting
}


function handleTileClick(tile) {
  // Ignore clicks if the game isn't running or it's in playback mode
  if (!running || inPlayback) {
    return;
  }

  const color = getColorFromTile(tile);

  flashTile(tile);


  const correctColor = sequence[userIndex];

  if (color === correctColor) {
    userIndex++;

    if (userIndex === sequence.length) {
    
      setStatus('Nice! Get ready for the next level...');
    
      setTimeout(function () {
        nextRound();
      }, 800);
    } else {
   
      setStatus('Good so far... (' + userIndex + '/' + sequence.length + ')');
    }
  } else {

    setStatus('Oops! That was wrong. Watch the pattern and try again.');
    inPlayback = true;
    setTimeout(function () {
      playSequence();
    }, 1000);
  }
}




function flashTile(tile) {
  tile.classList.add('active');
  setTimeout(function () {
    tile.classList.remove('active');
  }, 300); // lit for 300ms
}

function getColorFromTile(tile) {
  for (let i = 0; i < COLORS.length; i++) {
    const c = COLORS[i];
    if (tile.classList.contains(c)) {
      return c;
    }
  }
  return null;
}

function getTileByColor(color) {
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].classList.contains(color)) {
      return tiles[i];
    }
  }
  return null;
}

function getRandomColor() {
  const index = Math.floor(Math.random() * COLORS.length);
  return COLORS[index];
}

function updateLevel(value) {
  levelEl.textContent = value;
}

function setStatus(message) {
  statusEl.textContent = message;
}

// Load and save high score in localStorage
function loadHighScore() {
  const saved = parseInt(localStorage.getItem(HIGH_KEY), 10);

  if (isNaN(saved)) {
    highScore = 0;
  } else {
    highScore = saved;
  }

  showHighScore(highScore);
}

function saveHighScore(value) {
  localStorage.setItem(HIGH_KEY, String(value));
}

function showHighScore(value) {
  highEl.textContent = value;
}
