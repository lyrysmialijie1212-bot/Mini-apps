const tg = window.Telegram.WebApp;
tg.expand();

let secretNumber = Math.floor(Math.random() * 100) + 1;

const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

guessBtn.addEventListener('click', () => {
    const guess = parseInt(guessInput.value);
    if (!guess || guess < 1 || guess > 100) {
        message.textContent = "Please enter a number between 1 and 100.";
        return;
    }

    if (guess === secretNumber) {
        message.textContent = `🎉 Congrats! The number was ${secretNumber}.`;
        guessBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';
    } else if (guess < secretNumber) {
        message.textContent = "⬆️ Too low! Try again.";
    } else {
        message.textContent = "⬇️ Too high! Try again.";
    }
});

restartBtn.addEventListener('click', () => {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    message.textContent = "";
    guessInput.value = "";
    guessBtn.style.display = 'inline-block';
    restartBtn.style.display = 'none';
});
