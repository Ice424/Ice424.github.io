//import { Vector } from "../../../.vscode/extensions/samplavigne.p5-vscode-1.2.16/p5types/index";

function setup() {
  createCanvas(1200, 1100, WEBGL);
  angleMode(DEGREES);
  strokeWeight(5);
  noFill();
  stroke(32, 8, 64);
  
}

let frame = 0
function draw() {
  background(94, 75, 215);
  frame += 1
  frame = frame % 30

  // Call every frame to adjust camera based on mouse/touch
  rotateY(90)

  // Rotate rings in a half circle to create a sphere of cubes
  for (let zAngle = 0; zAngle < 180; zAngle += 30) {
    // Rotate cubes in a full circle to create a ring of cubes
    for (let xAngle = 0; xAngle < 360; xAngle += 30) {
      push();

      // Rotate from center of sphere
      rotateZ(zAngle+frame);
      rotateX(xAngle+frame);

      // Then translate down 400 units
      translate(0, 300, 0);
      box();
      pop();
    }
  }
}
