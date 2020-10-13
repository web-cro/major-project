// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let numberOfRects = 500;
let rectHeight = [];
let rectwidth;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectwidth = width / numberOfRects;
  setTheHeight();
}

function draw() {
  background(220);
  displayRects();
}

function setTheHeight() {
  for (let i = 0; i < numberOfRects; i ++) {
    rectHeight.push (random(1, height));
  }
}

function displayRects() {
  for (let i = 0; i < numberOfRects; i++) {
    fill("black");
    rect(i * rectwidth, height - rectHeight[i], rectwidth, rectHeight[i]);
  }
}