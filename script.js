const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let keys = {};
let score = 0;
let paused = false;

let player = {
  x: 200,
  y: 200,
  size: 20,
  speed: 4,
  inShip: false
};

let ship = {
  x: 400,
  y: 300,
  size: 30
};

let enemy = {
  x: 600,
  y: 200,
  size: 20,
  speed: 2
};

let bullets = [];

let resources = [];
for (let i = 0; i < 20; i++) {
  resources.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 8
  });
}

window.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.key === "Escape") {
    paused = !paused;
    document.getElementById("pauseMenu").classList.toggle("hidden");
  }

  if (e.key === "e") {
    enterShip();
  }

  if (e.key === " ") {
    shoot();
  }
});

window.addEventListener("keyup", e => {
  keys[e.key] = false;
});

function movePlayer() {
  let speed = player.inShip ? 8 : player.speed;

  if (keys["w"]) player.y -= speed;
  if (keys["s"]) player.y += speed;
  if (keys["a"]) player.x -= speed;
  if (keys["d"]) player.x += speed;
}

function enterShip() {
  let dx = player.x - ship.x;
  let dy = player.y - ship.y;
  let dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 50) {
    player.inShip = !player.inShip;
  }
}

function shoot() {
  bullets.push({
    x: player.x,
    y: player.y,
    size: 5,
    speed: 10
  });
}

function updateBullets() {
  bullets.forEach(b => b.y -= b.speed);
}

function moveEnemy() {
  if (enemy.x < player.x) enemy.x += enemy.speed;
  if (enemy.x > player.x) enemy.x -= enemy.speed;
  if (enemy.y < player.y) enemy.y += enemy.speed;
  if (enemy.y > player.y) enemy.y -= enemy.speed;
}

function checkCollisions() {
  resources = resources.filter(r => {
    let dx = player.x - r.x;
    let dy = player.y - r.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < player.size) {
      score++;
      document.getElementById("score").innerText = score;
      return false;
    }
    return true;
  });

  bullets.forEach((b, i) => {
    let dx = b.x - enemy.x;
    let dy = b.y - enemy.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < enemy.size) {
      enemy.x = Math.random() * canvas.width;
      enemy.y = Math.random() * canvas.height;
    }
  });
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = player.inShip ? "orange" : "cyan";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  ctx.fillStyle = "gray";
  ctx.fillRect(ship.x, ship.y, ship.size, ship.size);

  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);

  ctx.fillStyle = "yellow";
  resources.forEach(r => {
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "white";
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, b.size, b.size);
  });
}

function update() {
  if (!paused) {
    movePlayer();
    moveEnemy();
    updateBullets();
    checkCollisions();
    draw();
  }

  requestAnimationFrame(update);
}

function resumeGame() {
  paused = false;
  document.getElementById("pauseMenu").classList.add("hidden");
}

update();
