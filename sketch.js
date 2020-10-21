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

const GRIDSIZE = 16;

let cellsToCheck;
let cellThatHaveBeenChecked;
let startingPoint;
let endingPoint;
let cellWidth, cellHeight;
let path;
let currentValue;
let isPathFound = false;

let endScreenDisplay;

let level, levelPath;

let enemyX = 0;
let enemyY = 0;
let enemyHealth = 100;
let enemies;
let pathToFollow = [];

let canon;
let canonXCordinate, canonYCordinate, canonWidth, canonHeight;

let x, y, isDragging;

let score = 0;

function preload() {
  level = loadStrings("assets/level1.txt");
  levelPath = loadStrings("assets/level1path.txt");
}

function setup() {
  createCanvas(1069, 757);
 
  cellsToCheck = [];
  cellThatHaveBeenChecked = [];
  path = [];

  generateGrid();

  // startingPoint point
  startingPoint = level[0][0];
  //startingPoint.wall = false;
  // endingPoint point
  endingPoint = level[13][12];
  //endingPoint.wall = false;

  cellsToCheck.push(startingPoint);

  enemies = new Enemy (enemyX, enemyY, pathToFollow, cellHeight, cellWidth, enemyHealth);

  //place enemyReachedEnd,enemy
  // this.setInterval(enemies.move, 5000);

  canon = loadImage("canon.jpg");
  canonXCordinate = windowWidth - windowWidth/1.11;
  canonYCordinate = windowHeight - windowHeight/1.82;
  canonWidth = cellWidth*3;
  canonHeight = cellHeight*3;
  
}

function draw() {

  background(0);
  findPath();
  displayPath();
  
  // Make wall where need
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      if (levelPath[x][y] === 1) {
        level[x][y].wall = true;
      }
    }
  }

  //move();
  if (enemies.health > 0) {
    enemies.display();
  }
  enemies.healthBar();
  // enemies.moveEnemies();

  //canonShooter();
  
}

// function keyPressed() {
//   enemies.pathLocation = path.length - 1;
// }

class Enemy {
  constructor(x, y, path, height, width, health, healthBarColor) {
    this.startX = x;
    this.startY = y;
    this.color = color(random (255), random (255), random (255));
    this.width = width;
    this.height = height;
    this.health = health;

    this.x = x;
    this.y = y;
    this.pathLocation = 0;
    this.followPath = path;

    this.healthBarWidth = width;
    this.healthBarHeight = height / 3;
    // this.healthBarColor = healthBarColor;
    // this.pathLocation = path.length - 1;
  }

  move() {
    this.pathLocation += 1;
    levelPath[this.x][this.y] = 0;
    this.y = this.followPath[this.pathLocation].y;
    this.x = this.followPath[this.pathLocation].x;
    levelPath[this.x][this.y] = 2;
    console.log("have moved");
  }

  display() {
    //console.log(this);
    // if (x === 0 && y === 0) {
    levelPath[this.x][this.y] = 2;
    // }
    //display enemyReachedEnd,enemy 
    for (let x = 0; x < GRIDSIZE; x++) {
      for (let y = 0; y < GRIDSIZE; y++) {
        if (levelPath[x][y] === 2) {
          fill("black");
          rect(this.x * this.width, this.y * this.height, this.width, this.height);
          // level[x][y].displayGrid(color("red"));
        }
      }
    }
  }

  healthBar() {
    noFill();
    // stroke();
    strokeWeight(2);
    rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth, this.healthBarHeight, 10, 10);

    noStroke();
    if (this.health <= 100 && this.health >= 60) {
      fill("green");
      rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth, this.healthBarHeight, 10, 10);

    }
    else if (this.health < 90 && this.health >= 30) {

      fill("yellow");
      rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth - 20, this.healthBarHeight, 10, 10);
    }
    else if (this.health < 60 && this.health > 0) {
      fill("red");
      rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth - 40, this.healthBarHeight, 10, 10);
    }
  }
}


function displayPath() {
// display level
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      level[x][y].displayGrid(color(230,230,230));
      if (levelPath[x][y] === 3) {
        level[x][y].displayGrid(color("red"));
      }
      // if (levelPath[x][y] === 4) {
      //   level[x][y].displayGrid(color("blue"));
      // }
      // if (levelPath[x][y] === 2) { // Check this if statement works
      //   console.log("trying to display");
      //   fill("black");
      //   rect(x*cellWidth, y*cellHeight, cellWidth, cellHeight);
      //   level[x][y].displayGrid(color(enemies.color));
      // }
    }
  }
  
  // // color the end red
  // for (let x = 0; x < GRIDSIZE; x++) {
  //   for (let y = 0; y < GRIDSIZE; y++) {
  //   }
  // }

  // // chenge the color of cell when mouse clicked
  // for (let x = 0; x < GRIDSIZE; x++) {
  //   for (let y = 0; y < GRIDSIZE; y++) {
  //   }
  // }

  //find the path
  if (isPathFound) {
    path = [];
    let value = currentValue;
    while (value.previous) {
      path.push(value.previous);
      value = value.previous;
    }
  }

  while(path.length > 0) {
    pathToFollow.push(path.pop());
    //console.log(path);
    //console.log(pathToFollow);
  }
  //*************************************************************** FOR DEBUGGING *********************************************************
  // //Display the fastest path from startingPoint to finish
  // for (let x = 0; x < cellThatHaveBeenChecked.length; x++) {
  //   cellThatHaveBeenChecked[x].displayGrid(color(231, 13, 143));
  // }

  // //change the color of the cells that have already been checked
  // for (let x = 0; x < cellsToCheck.length; x++) {
  //   cellsToCheck[x].displayGrid(color(185, 19, 231));
  // }

  //display best path
  // if (currentValue === endingPoint){
  //   for (let x = 0; x < path.length; x++) {
  //     path[x].displayGrid(color("white"));
  //   }
  // }
}

function generateGrid() {
  cellWidth = width / GRIDSIZE;
  cellHeight = height / GRIDSIZE;

  // convert Level into 2D array
  for (let i = 0; i < level.length; i++) {
    level[i] = level[i].split(",");
  }

  //loop through the whole 2D array, and turn everything to numbers
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      level[x][y] = int(level[x][y]);
    }
  }

  // convert Level Path into 2D array
  for (let i = 0; i < levelPath.length; i++) {
    levelPath[i] = levelPath[i].split(",");
  }

  //loop through the whole 2D array, and turn everything to numbers
  for (let y = 0; y < GRIDSIZE; y++) {
    for (let x = 0; x < GRIDSIZE; x++) {
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

function mouseClicked() {
  let cellX = floor(mouseX / cellWidth);
  let cellY = floor(mouseY / cellHeight);
  enemies.health -= 10;
  console.log(enemies.health);

  // if (cellX >= 0 && cellX < GRIDSIZE && cellY >= 0 && cellY < GRIDSIZE) {
  //   if (levelPath[cellX][cellY] === 1){
  //     levelPath[cellX][cellY] = 4;
  //     console.log("mouseClicked");
  //   }
  // }
  // console.log(cellX, cellY);
  // console.log(enemies.x, enemies.y);
  enemies.move();
}

// ************************************************************ TEST *******************************************************************
// function move() {
//   for (let i = 1; i <= path.length; i++) { 
//     levelPath[enemyX][enemyY] = 0;
//     enemyY = path[path.length - i].y;
//     enemyX = path[path.length - i].x;
//     levelPath[enemyX][enemyY] = 2;
//     console.log("moved");
//   }
// }


// function canonShooter(){
//   imageMode(CENTER);
//   image(canon, canonXCordinate, canonYCordinate, canonWidth, canonHeight);
// }


// function mouseReleased() {
//   isDragging = false;
// }

// function isMouseInsideCanon() {
//   return mouseX > canonXCordinate &&
//          mouseX < canonXCordinate + canonWidth &&
//          mouseY > canonYCordinate &&
//          mouseY < canonYCordinate + canonHeight;
// }

// function moveRectangle() {
//   // move rectangle if required
//   if (isDragging) {
//     canonXCordinate = mouseX - canonWidth/2;
//     canonYCordinate = mouseY - canonHeight/2;
//   }
// }
// function mousePressed() {
//   if (isMouseInsideCanon()) {
//     isDragging = true;
//   }
// }

// *********************************************************** PATHFINDER ***************************************************************
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
    strokeWeight(0);
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

  if (isPathFound === false) {
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
        // enemies.setStartingLocation();
        isPathFound = true;
        console.log(isPathFound);
        console.log(path);
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
      isPathFound = true;
      //screenState = "endScreen";
    }
  }
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




// move() {
//   if (isPathFound && finishMakingPath) {
//     console.log(levelPath);
//     console.log(this);
//     levelPath[this.x][this.y] = 0;
//     this.pathLocation += 1;
//     console.log(this.pathLocation);
//     console.log(path);
//     this.y = this.followPath[this.pathLocation].y;
//     this.x = this.followPath[this.pathLocation].x;
//     levelPath[this.x][this.y] = 2;
//     console.log("have moved");
//   }
// }