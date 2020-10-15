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

const GRIDSIZE = 15;

let cellsToCheck;
let cellThatHaveBeenChecked;
let startingPoint;
let endingPoint;
let cellWidth, cellHeight;
let path;
let currentValue;

let screenState = "startScreen";
let endScreenDisplay;

let level, levelPath;

let playerX = 0;
let playerY = 0;

function preload() {
  level = loadStrings("assets/level1.txt");
  levelPath = loadStrings("assets/level1path.txt");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
 
  cellsToCheck = [];
  cellThatHaveBeenChecked = [];
  path = [];

  generateGrid();

  // startingPoint point
  startingPoint = level[0][0];
  startingPoint.wall = false;
  // endingPoint point
  endingPoint = level[14][10];
  endingPoint.wall = false;

  cellsToCheck.push(startingPoint);

  //place player
  levelPath[playerX][playerY] = 2;
}

function draw() {
  runGame();

  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      if (levelPath[x][y] !== 0 && levelPath[x][y] !== 2) {
        level[x][y].wall = true;
      }
    }
  }

  movePlayer();
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
  }
  // create and color rects to use when display level
  displayGrid(color) {
    fill(color);
    if (this.wall) {
      fill(0, 255, 0);
    }
    rect(this.x * cellWidth, this.y * cellHeight, cellWidth - 1, cellHeight - 1);
  }

  checkNeighbors(level) {
    let x = this.x;
    let y = this. y;
    // Check neighbors
    if (x < GRIDSIZE - 1) {
      this.neighborsToCheck.push(level[x + 1] [y]);
    }

    if (x > 0) {
      this.neighborsToCheck.push(level[x - 1] [y]);
    }

    if (y < GRIDSIZE - 1) {
      this.neighborsToCheck.push(level[x] [y + 1]);
    }
    
    if (y > 0) {
      this.neighborsToCheck.push(level[x] [y - 1]);
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
      console.log(endScreenDisplay);
      noLoop();
      //screenState = "endScreen";
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
    console.log(endScreenDisplay);
    noLoop();
    //screenState = "endScreen";
  }
}

function displayPath() {
// display level
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      level[x][y].displayGrid(color(230,230,230));
    }
  }
  // display Player 
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      if (levelPath[x][y] === 2) {
        level[x][y].displayGrid(color("red"));
      }
    }
  }
  //Display the fastest path from startingPoint to finish
  // for (let x = 0; x < cellThatHaveBeenChecked.length; x++) {
  //   cellThatHaveBeenChecked[x].displayGrid(color(231, 13, 143));
  // }

  //change the color of the cells that have already been checked
  // for (let x = 0; x < cellsToCheck.length; x++) {
  //   cellsToCheck[x].displayGrid(color(185, 19, 231));
  // }

  // find the path
  path = [];
  let value = currentValue;
  while (value.previous) {
    path.push(value.previous);
    value = value.previous;
  }
  //display best path
  // if (currentValue === endingPoint){
  //   for (let x = 0; x < path.length; x++) {
  //     path[x].displayGrid(color(0, 0, 255));
  //   }
  // }
}

// A level
function generateGrid() {
  cellWidth = width / GRIDSIZE;
  cellHeight = height / GRIDSIZE;

  // convert Level into 2d array
  for (let i=0; i<level.length; i++) {
    level[i] = level[i].split(",");
  }

  //loop through the whole 2d array, and turn everything to numbers
  for (let x = 0; x <GRIDSIZE; x++) {
    for (let y = 0; y <GRIDSIZE; y++) {
      level[x][y] = int(level[x][y]);
    }
  }

  // convert Level Path into 2d array
  for (let i=0; i<levelPath.length; i++) {
    levelPath[i] = levelPath[i].split(",");
  }

  //loop through the whole 2d array, and turn everything to numbers
  for (let y = 0; y<GRIDSIZE; y++) {
    for (let x = 0; x<GRIDSIZE; x++) {
      levelPath[y][x] = int(levelPath[y][x]);
    }
  }

  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      level[x][y] = new Pathfinder (x, y);
    }
  }

  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      level[x][y].checkNeighbors(level);
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

// function movePlayer() {
//   //move up
//   for (let y = 0; y < GRIDSIZE; y++) {
//     for (let x = 0; x < GRIDSIZE; x++) {
//       if (levelPath[playerY - 1][playerX] === 0) {
//         level[playerY][playerX] = 2;
//         playerY -= 1;
//         level[playerY][playerX] = levelPath[playerY][playerX];
//       }
//       //move down
//       else if (levelPath[playerY + 1][playerX] === 3) {
//         level[playerY][playerX] = 0;
//         playerY += 1;
//         level[playerY][playerX] = levelPath[playerY][playerX];
//       }
    
//       //move right
//       else if (levelPath[playerY][playerX + 1] === 3) {
//         level[playerY][playerX] = 0;
//         playerX += 1;
//         level[playerY][playerX] = levelPath[playerY][playerX];
//       }
      
//       //move left
//       else if (levelPath[playerY][playerX - 1] === 3) {
//         level[playerY][playerX] = 0; //resetting players current location to white
//         playerX -= 1;
//         level[playerY][playerX] = levelPath[playerY][playerX]; //set new location to red
//       }
//     }
//   }
// }

function movePlayer() {
  for (let i = 1; i < path.length; i++) {
    playerY = path[path.length- i].y;
  }
}