const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const road = new Image();
road.src = './images/road.png';
const carImg = new Image();
carImg.src = './images/car.png';

let lastObstacle = Date.now();
let obstacles;
let obstacleSpeed;
let score;
let collision;

const car = {
  x: width / 2 - 25,
  y: height - 150,
  left: false,
  right: false,
  vx: 5,
  move() {
    if (this.left && this.x > 0) {
      this.x -= this.vx;
    } else if (this.right && this.x < width - 50) {
      this.x += this.vx;
    }
  }
};

window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  function startGame() {
    score = 0;
    obstacleSpeed = 5;
    obstacles = [];
    collision = false;
    drawTrack();
    drawCar();

    window.requestAnimationFrame(() => {
      update();
    });
  }
};

const checkCollisions = () => {
  obstacles.forEach((obstacle) => {
    if (
      car.y <= obstacle.y + 20 &&
      car.x + 50 >= obstacle.x &&
      car.x <= obstacle.x + obstacle.width
    ) {
      collision = true;
    }
  });
};

const gameOver = () => {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'red';
  ctx.font = '50px sans-serif';
  ctx.fillText('GAME OVER!', 100, 100);
};

const drawTrack = () => {
  ctx.drawImage(road, 0, 0, width, height);
};

const drawCar = () => {
  ctx.drawImage(carImg, car.x, car.y, 50, 100);
};

const drawScore = () => {
  ctx.fillStyle = 'white';
  ctx.font = '20px sans-serif';
  ctx.fillText(`Score: ${score}`, 100, 50);
};

const cleanObstacles = () => {
  obstacles.forEach((o, i) => {
    if (o.y > height) {
      score++;
      obstacles.splice(i, 1);
    }
  });
};

const drawObstacles = (obstacles, currentTime, obstacleInterval) => {
  if (currentTime - lastObstacle > obstacleInterval) {
    let min = Math.ceil(width - 350);
    let max = Math.floor(width - 200);
    let obstacle = {
      width: Math.floor(Math.random() * (max - min) + min),
      y: 0
    };
    obstacle.x = Math.floor(Math.random() * (width - obstacle.width - 100));
    obstacles.push(obstacle);
    lastObstacle = currentTime;
    obstacleSpeed += 0.1;
  }

  for (const obstacle of obstacles) {
    obstacle.y += obstacleSpeed;
    ctx.fillStyle = 'darkred';
    ctx.fillRect(obstacle.x + 50, obstacle.y, obstacle.width, 20);
  }
};

window.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key === 'ArrowLeft') {
    car.left = true;
  } else if (key === 'ArrowRight') {
    car.right = true;
  }
});

window.addEventListener('keyup', (e) => {
  const key = e.key;
  if (key === 'ArrowLeft') {
    car.left = false;
  } else if (key === 'ArrowRight') {
    car.right = false;
  }
});

const update = () => {
  const obstacleInterval = 5000;
  const currentTime = Date.now();

  ctx.clearRect(0, 0, width, height);
  drawTrack();
  drawCar();
  cleanObstacles();
  drawObstacles(obstacles, currentTime, obstacleInterval);
  drawScore();
  checkCollisions();

  car.move();

  if (!collision) {
    window.requestAnimationFrame(update);
  } else {
    gameOver();
  }
};
