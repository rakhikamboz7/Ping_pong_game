const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Load Player 1's image (if uploaded)
const player1Image = new Image();
const player1Pic = sessionStorage.getItem('player1Pic');

if (player1Pic) {
    player1Image.src = player1Pic;
}

// Load a default image for the computer
const computerImage = new Image();
computerImage.src = 'path_to_default_computer_icon.png'; // Replace with your computer icon path

// Game elements
const net = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: canvas.height,
    color: "#05EDFF"
};

const player1 = {
    x: 0,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    color: "#05FcFF",
    score: 0
};

const player2 = {
    x: canvas.width - 10,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    color: "#FF5733",
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "#FFC300"
};

// Helper Functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "50px Arial";
    ctx.fillText(text, x, y);
}

function drawImage(img, x, y, w, h) {
    ctx.drawImage(img, x, y, w, h);
}

function movePaddle(event) {
    let rect = canvas.getBoundingClientRect();
    player1.y = event.clientY - rect.top - player1.height / 2;
}

// Collision Detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// Reset Ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// Update game objects
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    player2.y += ((ball.y - (player2.y + player2.height / 2)) * 0.1);

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width / 2) ? player1 : player2;

    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);

        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed += 0.5;
    }

    if (ball.x - ball.radius < 0) {
        player2.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        resetBall();
    }
}

// Render game objects with both profile pictures
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#231d34");

    drawRect(net.x, net.y, net.width, net.height, net.color);

    drawText(player1.score, canvas.width / 4, canvas.height / 5, "#FFd300");
    drawText(player2.score, 3 * canvas.width / 4, canvas.height / 5, "#FFC300");

    drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
    drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);

    // Draw Player 1's image (if uploaded)
    if (player1Pic) {
        drawImage(player1Image, 10, canvas.height - 80, 70, 70);
    }

    // Draw Computer's image


    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Game loop
function gameLoop() {
    update();
    render();
}

// Start the game immediately
function startGame() {
    canvas.addEventListener("mousemove", movePaddle);
    setInterval(gameLoop, 1000 / 60);
}

startGame();

