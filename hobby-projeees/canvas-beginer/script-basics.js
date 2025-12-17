const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particles = [];

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  //   ctx.fillStyle = "lightblue";
  //   ctx.fillRect(10, 10, 100, 100);
});

// ctx.fillStyle = "lightblue";
// ctx.fillRect(10, 10, 100, 100);

const mouse = {
  x: null,
  y: null,
};

canvas.addEventListener("click", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

function drawCircle() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 30, 0, Math.PI * 2);
  ctx.fill();
}

class Particle {
  constructor() {
    // this.x = mouse.x;
    // this.y = mouse.y;
    this.x = Math.floor(Math.random() * canvas.width);
    this.y = Math.floor(Math.random() * canvas.height);
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

init();

function handleParticles() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }
}

// ctx.fillStyle = "red";
// ctx.strokeStyle = "blue";
// ctx.lineWidth = 5;
// ctx.beginPath();
// ctx.arc(100, 100, 50, 0, Math.PI * 2);
// ctx.fill()
// ctx.stroke();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handleParticles();
  requestAnimationFrame(animate);
}

animate();
