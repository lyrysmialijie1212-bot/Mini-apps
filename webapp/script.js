const tg = window.Telegram.WebApp;
tg.expand();

const startBtn = document.getElementById('startBtn');
const character = document.getElementById('character');
const meterDisplay = document.getElementById('meter');
const instruction = document.getElementById('instruction');
const message = document.getElementById('message');
const buttons = document.querySelectorAll('.reactionBtn');
const leaderboardEl = document.getElementById('leaderboard');

let meter = 50, score = 0, currentDirection = null, gameInterval, roundTime = 2000;

function updateCharacterPosition() {
    character.style.left = `${meter}%`;
    meterDisplay.textContent = meter;
}

function getRandomDirection() { return Math.random() > 0.5 ? 'left' : 'right'; }

async function updateLeaderboard() {
    try {
        const res = await fetch('http://localhost:3001/leaderboard');
        const topScores = await res.json();
        leaderboardEl.innerHTML = topScores.map(e => `<li>${e.username}: ${e.score}</li>`).join('');
    } catch(err) { console.error(err); }
}

function nextRound() {
    currentDirection = getRandomDirection();
    instruction.textContent = `Click the ${currentDirection.toUpperCase()} reaction!`;
}

async function startGame() {
    meter = 50; score = 0; roundTime = 2000;
    updateCharacterPosition();
    startBtn.disabled = true; message.textContent = '';
    nextRound();

    gameInterval = setInterval(() => {
        nextRound();
        roundTime = Math.max(500, roundTime - 50);
        if(meter <= 0 || meter >= 100) endGame();
    }, roundTime);
}

async function endGame() {
    clearInterval(gameInterval);
    message.textContent = `😵 Mood tipped! Game over. Your score: ${score}`;
    startBtn.disabled = false; instruction.textContent = ''; currentDirection = null;

    const username = prompt("Enter your Telegram name to submit score:");
    if(!username) return;

    try {
        await fetch('http://localhost:3001/submit-score', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, score})
        });
        await updateLeaderboard();
    } catch(err) { console.error(err); }
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        if(!currentDirection) return;
        const choice = btn.dataset.direction;
        if(choice === currentDirection){ meter+=5; score++; character.classList.add('correct'); }
        else { meter-=5; character.classList.add('wrong'); }
        setTimeout(()=>character.classList.remove('correct','wrong'),300);
        updateCharacterPosition();
    });
});

startBtn.addEventListener('click', startGame);
updateLeaderboard();
