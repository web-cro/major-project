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

let grid, levelPath;

let enemies = [];
let numberOfEnemies = 2;
let enemyX = 0;
let enemyY = 0;
let enemyHealth = 100;
let pathToFollow = [];

let canon;
let canonXCordinate, canonYCordinate, canonWidth, canonHeight;

let x, y, isDragging;

let score = 0;
let level = 1;

// timer for spawning enemies
let enemyTime;
let spawnTime = 5000;
let newEnemySpawn;

// making enemies move by themself on a timer
let moveTime;
let movementDelay = 900;

function preload() {
  grid = loadStrings("assets/level1.txt");
  levelPath = loadStrings("assets/level1path.txt");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
 
  cellsToCheck = [];
  cellThatHaveBeenChecked = [];
  path = [];

  generateGrid();

  // startingPoint point
  startingPoint = grid[0][0];

  // endingPoint point
  endingPoint = grid[13][12];

  cellsToCheck.push(startingPoint);

  // push enemy into the enemiesArray
  enemies.push(new Enemy (enemyX, enemyY, pathToFollow, cellHeight, cellWidth, enemyHealth));


  // ***************************************//
  canon = loadImage("canon.jpg");
  canonXCordinate = windowWidth - windowWidth/1.11;
  canonYCordinate = windowHeight - windowHeight/1.82;
  canonWidth = cellWidth*3;
  canonHeight = cellHeight*3;

  // Spawn Delay
  enemyTime = new Timer(spawnTime);
  newEnemySpawn = new Timer(spawnTime);

  // movement Delay
  moveTime = new Timer(movementDelay);
}

function draw() {

  background(0);
  findPath();
  displayPath();
  makePathForEnemy();
  
  spawnMultipulEnemies();

  moveEnemies();

  displayLevel();
  displayScore();
  changeDisplay(); // changes the level and score displays
}

class Enemy {
  constructor(x, y, path, height, width, health, healthBarColor) {
    this.startX = x;
    this.startY = y;
    this.color = color(random (255), random (255), random (255));
    this.width = width;
    this.height = height;
    this.health = health;
    this.isEnemyAlive = true;

    this.x = x;
    this.y = y;
    this.pathLocation = 0;
    this.followPath = path;

    this.healthBarWidth = width;
    this.healthBarHeight = height / 3;

    this.healthDisplay = 0;
  }

  move() {
    this.pathLocation += 1;
    levelPath[this.x][this.y] = 0;
    this.y = this.followPath[this.pathLocation].y;
    this.x = this.followPath[this.pathLocation].x;
    levelPath[this.x][this.y] = 2;
    // console.log("have moved");
  }

  display() {
    // console.log("display working");
    levelPath[this.x][this.y] = 2;

    for (let x = 0; x < GRIDSIZE; x++) {
      for (let y = 0; y < GRIDSIZE; y++) {
        if (levelPath[x][y] === 2) {
          fill("black");
          rect(this.x * this.width, this.y * this.height, this.width, this.height);
        }
      }
    }
  }

  healthBar() {
    //console.log("working");
    noFill();
    strokeWeight(2);
    rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth, this.healthBarHeight, 10, 10);

    if (this.health <= 100 && this.health >= 60) {
      fill(0, 255, 0);
      rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth - this.healthDisplay, this.healthBarHeight, 10, 10);

    }
    else if (this.health < 90 && this.health >= 30) {

      fill("yellow");
      rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth - this.healthDisplay, this.healthBarHeight, 10, 10);
    }
    else if (this.health < 60 && this.health > 0) {
      fill("red");
      rect(this.x * this.width, this.y * this.height - 20, this.healthBarWidth - this.healthDisplay, this.healthBarHeight, 10, 10);
    }
  }

  enemyAlive() {
    for(let i = 0; i < enemies.length; i++) {
      if (enemies[i].health <= 0) {
        enemies[i].isEnemyAlive = false;
      }
    }
  }
}


function displayPath() {
// display grid
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      grid[x][y].displayGrid(color(230,230,230));
      if (levelPath[x][y] === 3) {
        grid[x][y].displayGrid(color("red"));
      }
    }
  }

  // Make wall where need
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      if (levelPath[x][y] === 1) {
        grid[x][y].wall = true;
      }
    }
  }

}

function generateGrid() {
  cellWidth = width / GRIDSIZE;
  cellHeight = height / GRIDSIZE;

  // convert Level into 2D array
  for (let i = 0; i < grid.length; i++) {
    grid[i] = grid[i].split(",");
  }

  //loop through the whole 2D array, and turn everything to numbers
  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      grid[x][y] = int(grid[x][y]);
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
      grid[x][y] = new Pathfinder (x, y);
    }
  }

  for (let x = 0; x < GRIDSIZE; x++) {
    for (let y = 0; y < GRIDSIZE; y++) {
      grid[x][y].checkNeighbors(grid);
    }
  } 
}

function mouseClicked() {
  // get the cell where you are clicking
  let cellX = floor(mouseX / cellWidth);
  let cellY = floor(mouseY / cellHeight);

}

// display grid
function displayLevel() {
  // textAlign(CENTER);
  //textStyle(BOLDITALIC);
  fill("Blue");
  textSize(24);
  text("Level: " + level, width - 120, 25);
}

// display score
function displayScore() {
  // textAlign(CENTER);
  //textStyle(BOLDITALIC);
  fill("blue");
  textSize(24);
  text("Score: " + score, width - 121, 55);
}

function changeDisplay() {
  if (enemies.length === numberOfEnemies){
    for (let i = 0; i < numberOfEnemies; i++) {
      if (!enemies[i].isEnemyAlive){
        level ++;
        score = numberOfEnemies * 100;
      }
    }
  }
}

function spawnMultipulEnemies() {
  if (enemies.length < numberOfEnemies){
    if (newEnemySpawn.isDone() ) {
      console.log("new enemy");
      enemies.push(new Enemy (enemyX, enemyY, pathToFollow, cellHeight, cellWidth, enemyHealth));
      newEnemySpawn.reset();
    }
  }

  for(let i = 0; i < enemies.length; i++) {
    // console.log(enemies[i].isEnemyAlive);
    enemies[i].enemyAlive();

    if (enemies[i].isEnemyAlive) {
      enemies[i].display();
      enemies[i].healthBar();  
    }
    // else if (!enemies.isEnemyAlive) {
    //   enemies[i].splice(i, 1);
    // }
    // else {
    //   enemies[i].splice(i, 1);
    // }
  }
  enemyTime.reset();
}

function moveEnemies() {
  if (isPathFound){
    if (moveTime.isDone() ) {
      for(let i = 0; i < enemies.length; i++) {
        if (enemies[i].isEnemyAlive) {
          console.log("movement Delay Working");
          for(let i = 0; i < enemies.length; i++) {
            enemies[i].move();
            enemies[i].health -= 10;
            enemies[i].healthDisplay += 6;
          }
          moveTime.reset();
          // console.log(enemies.healthDisplay);
          // console.log(enemies.health);
  
        }
      }
    }
  }
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
  // create and color rects to use when display grid
  displayGrid(color) {
    strokeWeight(0);
    fill(color);
    if (this.wall) {
      fill("green");
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

function makePathForEnemy() {
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

  }
}
//*************************************************************************************************************************************/

class Timer {
  constructor(waitTime) {
    this.waitTime = waitTime;
    this.beginTime = millis();
    this.endTime = this.beginTime + this.waitTime;
  }

  isDone() {
    return millis() >= this.endTime;
  }

  reset() {
    this.beginTime = millis();
    this.endTime = this.beginTime + this.waitTime;
  }

  setWaitTime(waitTime) {
    this.waitTime = waitTime;
  }
}