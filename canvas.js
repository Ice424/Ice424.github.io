const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Resize canvas to fill the window
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const NUM_POINTS = 80;

// Generate random points
let points = Array.from({ length: NUM_POINTS }, () => [
  Math.random() * WIDTH,
  Math.random() * HEIGHT,
]);

// Give each point a velocity
let velocities = points.map(() => [
  (Math.random() - 0.5) * 4, // vx
  (Math.random() - 0.5) * 4, // vy
]);

function update() {
  // Move points and bounce off edges
  for (let i = 0; i < points.length; i++) {
    points[i][0] += velocities[i][0];
    points[i][1] += velocities[i][1];

    if (points[i][0] < 0 || points[i][0] > WIDTH) velocities[i][0] *= -1;
    if (points[i][1] < 0 || points[i][1] > HEIGHT) velocities[i][1] *= -1;
  }
}

function draw() {
  ctx.fillStyle = "123456";
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;

  const delaunay = d3.Delaunay.from(points);
  const triangles = delaunay.triangles;

  // Draw triangle edges
  for (let i = 0; i < triangles.length; i += 3) {
    let a = points[triangles[i]];
    let b = points[triangles[i + 1]];
    let c = points[triangles[i + 2]];

    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]);
    ctx.closePath();
    ctx.stroke();
  }

  // Draw points as small white dots
  ctx.fillStyle = "white";
  for (let [x, y] of points) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
