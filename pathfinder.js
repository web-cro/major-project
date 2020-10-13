// 2D array A* pathfinder
// Abdul Raffey
// October 11, 2020
//
//Work Cite:
//https://en.wikipedia.org/wiki/A*_search_algorithm
//https://www.youtube.com/watch?v=aKYlikFAV4k
//https://www.slant.co/versus/11584/11585/~dijkstra-s-algorithm_vs_a-algorithm
//https://www.youtube.com/watch?v=GC-nBgi9r0U
//https://www.youtube.com/watch?v=EaZxUCWAjb0
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// **********************************************************************
//  A* educated guess to find the best path from point A to point B
//  A* formula is f(n) = g(n) + h(n)

const GRIDSIZE = 50;
let grid;

let cellsToCheck;
let cellThatHaveBeenChecked;
let startingPoint;
let endingPoint;
let cellWidth, cellHeight;
let path;
let currentValue;

let screenState = "startScreen";
let endScreenDisplay;

function setup() {
  createCanvas(windowWidth, windowHeight);

  grid = new Array(GRIDSIZE); 
  cellsToCheck = [];
  cellThatHaveBeenChecked = [];
  path = [];

  generateGrid();

  // startingPoint point
  startingPoint = grid[0][0];
  startingPoint.wall = false;
  // endingPoint point
  endingPoint = grid[24][0];
  endingPoint.wall = false;

  cellsToCheck.push(startingPoint);
}

function draw() {
  runGame();
}

// look through the array and remove a cells that we have already visted
function removeFromArray(array, value) {
  for (let x = array.length - 1; x >= 0; x--) {
    if (array[x] === value) {
      array.splice(x, 1);
    }
  }
}

// check the distance between the starting and ending points
function checkDistance(a , b) {
  let distance = abs(a.x - b.x) + abs(a.y - b.y);
  return distance;
}

class Pathfinder {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighborsToCheck = [];
    this.previous = undefined;
    this.wall = false;

    if (random(1) < 0.3) {
      this.wall = true;
    } 
  }
  // create and color rects to use when display grid
  displayGrid(color) {
    fill(color);
    if (this.wall) {
      fill(0);
    }
    rect(this.x * cellWidth, this.y * cellHeight, cellWidth - 1, cellHeight - 1);
  }

  checkNeighbors(grid) {
    let x = this.x;
    let y = this. y;
    // Check neighbors
    if (x < GRIDSIZE - 1) {
      this.neighborsToCheck.push(grid[x + 1] [y]);
    }

    if (x > 0) {
      this.neighborsToCheck.push(grid[x - 1] [y]);
    }

    if (y < GRIDSIZE - 1) {
      this.neighborsToCheck.push(grid[x] [y + 1]);
    }
    
    if (y > 0) {
      this.neighborsToCheck.push(grid[x] [y - 1]);
    }
  }
}

// A grid
function generateGrid() {
  cellWidth = width / GRIDSIZE;
  cellHeight = height / GRIDSIZE;

  // making an 2D array
  for (let x = 0; x < GRIDSIZE; x++) {
    grid[x] = new Array(GRIDSIZE);
  }

  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      grid[x][y] = new Pathfinder (x, y);
    }
  }

  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      grid[x][y].checkNeighbors(grid);
    }
  }

    
}

function findPath () {

  // keep searching for A path
  if (cellsToCheck.length > 0) { 

    let lowestValue = 0;
    for (let x = 0; x < cellsToCheck.length; x++) {
      if (cellsToCheck[x].f < cellsToCheck[lowestValue].f) {
        lowestValue = x;
      }
    }
    currentValue = cellsToCheck[lowestValue]; 

    if (currentValue === endingPoint) {
      endScreenDisplay = "Solution Found";
      screenState = "endScreen";
    }

    // remove the value from the cellsToCheck and push it into the cellThatHaveBeenChecked
    removeFromArray(cellsToCheck, currentValue);
    cellThatHaveBeenChecked.push(currentValue);

    let neighborsToCheck = currentValue.neighborsToCheck;
    for (let x = 0; x < neighborsToCheck.length; x++) {
      let myNeighbours = neighborsToCheck[x];

      // Check to see that your neighbour is not a wall and has not already been checked
      if (!cellThatHaveBeenChecked.includes(myNeighbours) && !myNeighbours.wall) {
        let gValue = currentValue.g + 1;

        if (cellsToCheck.includes(myNeighbours)) {
          if (gValue < myNeighbours.g) {
            myNeighbours.g = gValue;
          }
        }
        else {
          myNeighbours.g = gValue;
          cellsToCheck.push(myNeighbours);
        }
        // make an educated guess for the fastest path
        myNeighbours.h = checkDistance(myNeighbours, endingPoint);
        myNeighbours.f = myNeighbours.g + myNeighbours.h;
        myNeighbours.previous = currentValue;
      }
    }
  }

  // No Solution
  else {
    endScreenDisplay = "No Solution Found";
    screenState = "endScreen";
  }
}

function displayPath() {
// display grid
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      grid[x][y].displayGrid(color(230,230,230));
    }
  }
  // Display the fastest path from startingPoint to finish
  for (let x = 0; x < cellThatHaveBeenChecked.length; x++) {
    cellThatHaveBeenChecked[x].displayGrid(color(231, 13, 143));

  }
  // change the color of the cells that have already been checked
  for (let x = 0; x < cellsToCheck.length; x++) {
    cellsToCheck[x].displayGrid(color(185, 19, 231));
  }

  // find the path
  path = [];
  let value = currentValue;
  while (value.previous) {
    path.push(value.previous);
    value = value.previous;
  }
  // display best path
  if (currentValue === endingPoint){
    for (let x = 0; x < path.length; x++) {
      path[x].displayGrid(color(0, 0, 255));
    }
  }
}

// controls what the screen the user sees
function runGame() {
    
  if (screenState === "startScreen") {
    background(0);
    showStartScreen();
  } 
  
  else if (screenState === "gameScreen") {
    background(0);
    findPath();
    displayPath();
  } 
  
  else if (screenState === "endScreen") {
    background("white");
    gameOver();
  }
}

// controls the Start screen text, its style, location, and size
function showStartScreen() {
  background("white");
  textAlign(CENTER);
  ///textStyle(BOLDITALIC);
  textSize(18);
  text("Start Screen", width / 2, height / 2);
  text("Click Anywhere To Start", width / 2, height / 2 + 25);
}

// controls the game over screen text, its style, location, and size
function gameOver() {
    
  textAlign(CENTER);
  //textStyle(BOLDITALIC);
  textSize(18);
  fill("Black");
  text(endScreenDisplay, width / 2, height / 2);
  text("Press R to restart Game", width / 2, height / 2 + 25);
}

// change startScreen to gameScreen when mouse Clicked
function mousePressed() {
  if (screenState === "startScreen") {
    screenState = "gameScreen";
  }
}

// restart the game
function keyPressed() {
  if (key === "r") {
    setup();
    screenState = "gameScreen";
  }
}