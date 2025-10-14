const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const NUM_POINTS = 100;
const BORDER = 40

var width = 0
var height = 0
var points

var grad

// Resize canvas to fill the window
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight + BORDER;
  width = canvas.width;
  height = canvas.height;
  points = Array.from({ length: NUM_POINTS }, () => [
    Math.random() * (width + BORDER),
    Math.random() * (height),


  ]);
  grad = ctx.createLinearGradient(0, height - (height * 0.3), 0, height);
  grad.addColorStop(0, "black");
  grad.addColorStop(1, getComputedStyle(document.body).getPropertyValue('--background'));

}
resize();
window.addEventListener("resize", resize);




// Generate random points

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

    if (points[i][0] < 0 - BORDER || points[i][0] > width + BORDER) velocities[i][0] *= -1;
    if (points[i][1] < 0 - BORDER || points[i][1] > height) velocities[i][1] *= -1;
  }
}
let x = Math.random() * (width + BORDER)
let y = Math.random() * (height)
document.addEventListener("mousemove", updateCursorPos);
document.addEventListener("scroll", updateCursorPos);

function updateCursorPos(event) {
  // Get the cursor relative to the canvas
  x = event.pageX;
  y = event.pageY + document.body.scrollTop;

  // Clamp to canvas bounds
  x = (x + width) % width;
  y = (y + height) % height;
}




function draw() {
  ctx.fillStyle = "black"
  ctx.strokeStyle = "black";
  ctx.clearRect(0, 0, width, height);
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;


  ctx.fillStyle = grad;
  ctx.fillRect(0, height - (height * 0.3), width, height * 0.3);
  points[0] = [x, y]

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

  ctx.fillStyle = "white"
  // Draw points as small white dots
  for (let [x, y] of points) {

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }


}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
