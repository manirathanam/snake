/**
 * constructor
 */
var snake = function (initData) {
  this.sizeOfSnake = initData.length;
  this.data = initData;
};
snake.prototype.add = function (ele) {
  this.addStyle(ele);
  this.data.unshift(ele);
  this.resizeData();
};
snake.prototype.resizeData = function () {
  if (this.data.length > this.sizeOfSnake) {
    var removed = this.data.splice(this.sizeOfSnake);
    removed.forEach(
      function (item) {
        this.removeStyle(item);
      }.bind(this)
    );
  }
};
snake.prototype.removeStyle = function (item) {
  item.classList.remove("snake");
};
snake.prototype.addStyle = function (item) {
  if (item.classList.contains("food")) {
    this.increaseSize();
    item.classList.remove("food");
    item.innerHTML = "";
  }
  item.classList.add("snake");
};
snake.prototype.increaseSize = function () {
  var score = document.getElementsByClassName("score-label")[0];
  var oldValue = parseInt(score.innerText);
  score.innerText = ++oldValue;
  this.sizeOfSnake++;
};

var board = function (ele) {
  this.ele = ele;
  this.maxRow = Math.floor((window.visualViewport.height - 200) / 50);

  this.maxCol = Math.floor((window.visualViewport.width - 300) / 50);
};
board.prototype.create = function () {
  var width = window.visualViewport.width;
  var height = window.visualViewport.height;
  var cells = "";
  for (var i = 0; i < this.maxRow; i++) {
    var rowEle = '<div class="row">';
    var colEle = "";
    for (var j = 0; j < this.maxCol; j++) {
      colEle = colEle + '<div class="col cell-' + i + "_" + j + '"></div>';
    }
    cells = cells + rowEle + colEle + "</div>";
  }
  this.ele.innerHTML = cells;
};
board.prototype.setActiveCell = function (row, col) {
  this.currentRow = row;
  this.currentCol = col;
  this.activeCell = document.getElementsByClassName(
    "cell-" + row + "" + col
  )[0];
};
board.prototype.getBottomCell = function () {
  this.currentRow =
    this.currentRow + 1 > this.maxRow - 1 ? 0 : this.currentRow + 1;
  var leftCell = document.getElementsByClassName(
    "cell-" + this.currentRow + "_" + this.currentCol
  )[0];
  return leftCell;
};
board.prototype.getTopCell = function () {
  this.currentRow =
    this.currentRow - 1 < 0 ? this.maxRow - 1 : this.currentRow - 1;
  var leftCell = document.getElementsByClassName(
    "cell-" + this.currentRow + "_" + this.currentCol
  )[0];
  return leftCell;
};
board.prototype.getLeftCell = function () {
  this.currentCol =
    this.currentCol - 1 < 0 ? this.maxCol - 1 : this.currentCol - 1;
  var leftCell = document.getElementsByClassName(
    "cell-" + this.currentRow + "_" + this.currentCol
  )[0];
  return leftCell;
};
board.prototype.getRightCell = function () {
  this.currentCol =
    this.currentCol + 1 > this.maxCol - 1 ? 0 : this.currentCol + 1;
  var leftCell = document.getElementsByClassName(
    "cell-" + this.currentRow + "_" + this.currentCol
  )[0];
  return leftCell;
};

var ground = function () {};
ground.prototype.initBoard = function () {
  this.field = new board(document.getElementsByClassName("board")[0]);
  this.field.create();
  this.callBack = this.field.getRightCell.bind(this.field);
  this.key = "ArrowLeft";
};
ground.prototype.initSnake = function () {
  var ele = [];
  ele.push(document.getElementsByClassName("cell-5_5")[0]);
  ele.push(document.getElementsByClassName("cell-5_4")[0]);
  ele.push(document.getElementsByClassName("cell-5_3")[0]);
  this.field.setActiveCell(5, 5);
  this.python = new snake(ele);
  this.initGame();
  ele.forEach(function (item) {
    item.classList.add("snake");
  });
};
ground.prototype.listenKeys = function () {
  document.addEventListener("keyup", this.handleKey.bind(this));
};
ground.prototype.handleKey = function (e) {
  if (e.key === "ArrowUp") {
    this.callBack = this.field.getTopCell.bind(this.field);
  } else if (e.key === "ArrowDown") {
    this.callBack = this.field.getBottomCell.bind(this.field);
  } else if (e.key === "ArrowRight") {
    this.callBack = this.field.getRightCell.bind(this.field);
  } else if (e.key === "ArrowLeft") {
    this.callBack = this.field.getLeftCell.bind(this.field);
  }
};
ground.prototype.initGame = function () {
  this.listenKeys();
  this.snakeTimer = setInterval(this.handleTimer.bind(this), 200);
  this.foodTimer = setInterval(this.handleFoodSupply.bind(this), 1200);
};
ground.prototype.handleTimer = function () {
  var newEle = this.callBack();
  if (newEle.classList.contains("snake")) {
    this.handleGameOver();
    clearInterval(this.foodTimer);
    clearInterval(this.snakeTimer);
  }
  this.python.add(newEle);
};
ground.prototype.getRandomFood = function () {
  var food = ["🍔", "🍞", "🍗", "🍤", "🍩", "🍼", "🥥", "🍉", "🍒", "🍄", "🥦"];
  var ran = Math.floor(Math.random() * food.length);
  return food[ran];
};
ground.prototype.getRandomCell = function () {
  var row = Math.floor(Math.random() * this.field.maxRow);
  var col = Math.floor(Math.random() * this.field.maxCol);
  var rancell = document.getElementsByClassName("cell-" + row + "_" + col)[0];
  return rancell.classList.contains("snake") ? this.getRandomCell() : rancell;
};
ground.prototype.handleFoodSupply = function () {
  var food = this.getRandomFood();
  var cell = this.getRandomCell();
  cell.innerHTML = food;
  cell.classList.add("food");
};
ground.prototype.handleGameOver = function () {
  var board = document.getElementsByClassName("board")[0];
  var button = document.getElementsByClassName("game-over")[0];
  button.style.display = "flex";
  board.classList.add("blur");
};
