let gridHeight = 9;
let gridWidth = 9;
let tiles = [];
let icons = [];
let snakeX = [Math.ceil(gridWidth/2) - 4, Math.ceil(gridWidth/2) - 3, Math.ceil(gridWidth/2) - 2];
let snakeY = [Math.ceil(gridHeight/2), Math.ceil(gridHeight/2), Math.ceil(gridHeight/2)];
let addSnake = false;
let apple = [Math.ceil(gridWidth/2), Math.ceil(gridHeight/2)];
let moveType = "right";
let move = true;
let prevMove = moveType;
let playing = false;
let snakeIndex;
let text = "KOLESE KANISIUS";
let speed = 8;
let user = "";
let lbOrder;
let leaderboard = window.localStorage.getItem("lb") == undefined ? {} : JSON.parse(window.localStorage.getItem("lb"));

function clearBoard() {
  tiles = [];
  icons = [];
  for(i = 1; i <= gridHeight; i++) {
    for(w = 1; w <= gridWidth; w += 2) {
      tiles.push(i % 2 == 1 ? "#a2d149" : "#aad751");
      if(w + 1 <= gridWidth) {
        tiles.push(i % 2 == 1 ? "#aad751" : "#a2d149");
      }
    }
  }
  for(z = 0; z < gridHeight * gridWidth; z++) {
    icons.push("")
  }
}

function replaceBlock(x, y, replacement) {
  icons[(x - 1) + (gridHeight - y) * gridWidth] = replacement;
}

function fillBlock(x, y) {
  replaceBlock(x, y, "1")
}

function printSnake() {
  clearBoard();
  for(i = 0; i < snakeX.length; i++) {
    fillBlock(snakeX[i], snakeY[i]);
  }
  replaceBlock(apple[0], apple[1], "2");
  updateTiles();
}

function checkCollision() {
  let colliding = false;
  for(a = 0; a < snakeX.length; a++) {
    for(b = 0; b < snakeX.length; b++) {
      colliding = (((snakeX[a] == snakeX[b]) && (snakeY[a] == snakeY[b]) && (a != b)) ? true : colliding);
    }
  }
  return colliding;
}

function collidingApple() {
  let appleHit = false;
  for(i = 0; i < snakeX.length; i++) {
    appleHit = snakeX[i] == apple[0] && snakeY[i] == apple[1] ? true : appleHit;
  }
  return appleHit;
}

function moveSnake() {
  if(moveType == "right") {
    snakeX.push(snakeX[snakeX.length - 1] + 1);
    snakeY.push(snakeY[snakeY.length - 1]);
  }
  else if(moveType == "left") {
    snakeX.push(snakeX[snakeX.length - 1] - 1);
    snakeY.push(snakeY[snakeY.length - 1]);
  }
  else if(moveType == "up") {
    snakeX.push(snakeX[snakeX.length - 1]);
    snakeY.push(snakeY[snakeY.length - 1] + 1);
  }
  else if(moveType == "down") {
    snakeX.push(snakeX[snakeX.length - 1]);
    snakeY.push(snakeY[snakeY.length - 1] - 1);
  }

  prevMove = moveType;

  if(addSnake == false) {
    snakeY.shift();
    snakeX.shift();
  }
  else {
    addSnake = false;
  }
  
  if(snakeX[snakeX.length - 1] == apple[0] && snakeY[snakeY.length - 1] == apple[1]) {
    addSnake = true;
    while(collidingApple()) {
      apple[0] = Math.ceil(Math.random() * gridWidth);
      apple[1] = Math.ceil(Math.random() * gridHeight);
    }
  }

  if(checkCollision() || snakeX.lengths + 1 >= gridHeight * gridWidth || snakeX[snakeX.length - 1] < 1 || snakeX[snakeX.length - 1] > gridWidth || snakeY[snakeY.length - 1] < 1 || snakeY[snakeY.length - 1] > gridHeight) {
    death()
  }
  else {
    printSnake();
  }

  if(move) {
    setTimeout(moveSnake, 1000 / speed);
  }
}

document.onkeydown = (k)=> {
  let keyPress = k.key.toLowerCase();
  keyPress == " " && playing == false ? (move = true, playing = true,moveSnake())  : "";
  (keyPress == "w" || keyPress == "arrowup") && prevMove != "down" ? (moveType = "up") : "";
  (keyPress == "a" || keyPress == "arrowleft") && prevMove != "right" ? (moveType = "left") : "";
  (keyPress == "s" || keyPress == "arrowdown") && prevMove != "up" ? (moveType = "down") : "";
  (keyPress == "d" || keyPress == "arrowright") && prevMove != "left" ? (moveType = "right") : "";
}

function updateTiles() {
  for(d = 0; d < gridHeight * gridWidth; d++) {
    document.getElementById("box" + (d + 1).toString()).style.backgroundColor = tiles[d];
  }
  for(x = 0; x < gridHeight * gridWidth; x++) {
    let documentItem = document.getElementById("icon" + (x + 1).toString());
    documentItem.innerHTML = "";
    if(icons[x] -= "") {
      if (icons[x] == 1) {
        for(y = 0; y < snakeX.length - 1; y++) {
          if(x == (snakeX[y] - 1) + (gridHeight - snakeY[y]) * gridWidth) {
            snakeIndex = y;
          }
        }
        documentItem.style.color = "white";
        documentItem.style.backgroundColor = "#416ee2";
        if(icons[x] == 1 && x == (snakeX[snakeX.length - 1] - 1) + (gridHeight - snakeY[snakeY.length - 1]) * gridWidth){
          documentItem.innerHTML = text.charAt(0);
          documentItem.style.borderRadius = snakeBorderRadiusStart();
        }
        else if(icons[x] == 1 && x == (snakeX[0] - 1) + (gridHeight - snakeY[0]) * gridWidth){
          documentItem.innerHTML = text.charAt((snakeX.length - 1) % (text.length + 1));
          documentItem.style.borderRadius = snakeBorderRadiusEnd();
        }
        else {
          documentItem.innerHTML = text.charAt(((snakeX.length - 1) - (snakeIndex)) % (text.length + 1));
          documentItem.style.borderRadius = snakeBorderRadiusMiddle();
        }
      }
      else if(icons[x] == 2) {
        documentItem.style.color = "white";
        documentItem.style.borderRadius = "15px";
        documentItem.style.backgroundColor = "#e7471d";
        documentItem.innerHTML = text.charAt((snakeX.length) % (text.length + 1));
      }
    }
    else {
      documentItem.style.backgroundColor = tiles[x];
    }
  }
  document.getElementById("score").innerHTML = snakeX.length - 3;
  updateLeaderboard();
}

function snakeBorderRadiusMiddle() {
  const hasUp = () => snakeY[snakeIndex] + 1 == snakeY[snakeIndex - 1] || snakeY[snakeIndex] + 1 == snakeY[snakeIndex + 1];
  const hasBottom = () => snakeY[snakeIndex] - 1 == snakeY[snakeIndex - 1] || snakeY[snakeIndex] - 1 == snakeY[snakeIndex + 1];
  const hasRight = () => snakeX[snakeIndex] + 1 == snakeX[snakeIndex - 1] || snakeX[snakeIndex] + 1 == snakeX[snakeIndex + 1];
  const hasLeft = () => snakeX[snakeIndex] - 1 == snakeX[snakeIndex - 1] || snakeX[snakeIndex] - 1 == snakeX[snakeIndex + 1];
  return hasRight() && hasUp() ? "0px 0px 0px 15px" : hasLeft() && hasUp() ? "0px 0px 15px 0px" : hasLeft() && hasBottom() ? "0px 15px 0px 0px" : hasRight() && hasBottom() ? "15px 0px 0px 0px" : "0px";
}

function snakeBorderRadiusEnd() {
  return snakeX[0] + 1 == snakeX[1] ? "15px 0px 0px 15px" : snakeX[0] - 1 == snakeX[1] ? "0px 15px 15px 0px" : snakeY[0] + 1 == snakeY[1] ? "0px 0px 15px 15px" : snakeY[0] - 1 == snakeY[1] ? "15px 15px 0px 0px" : "";
}

function snakeBorderRadiusStart() {
  return moveType == "up" ? "15px 15px 0px 0px" : moveType == "down" ? "0px 0px 15px 15px" : moveType == "left" ? "15px 0px 0px 15px" : moveType == "right" ? "0px 15px 15px 0px" : "";
}

function death() {
  updateLeaderboard()
  snakeX = [Math.ceil(gridWidth/2) - 4, Math.ceil(gridWidth/2) - 3, Math.ceil(gridWidth/2) - 2];
  snakeY = [Math.ceil(gridHeight/2), Math.ceil(gridHeight/2), Math.ceil(gridHeight/2)];
  apple = [Math.ceil(gridWidth/2), Math.ceil(gridHeight/2)];
  moveType = "right";
  move = false; 
  tiles = [];
  icons = [];
  playing = false;
}

function setup() {
  gridWidth < 9 || gridWidth.toString() == "NaN" ? gridWidth = 9 : "";
  gridHeight < 1 || gridHeight.toString() == "NaN" ? gridHeight = 1 : "";
  speed < 1 || speed.toString() == "NaN" ? speed = 125 : "";
  document.getElementById("height").value = gridHeight;
  document.getElementById("text").value = text;
  document.getElementById("width").value = gridWidth;
  document.getElementById("speed").value = speed;
  document.getElementById("items").innerHTML = "";
  for(r = 1; r <= gridHeight; r++) {
    createDiv = (name, index) => {
      let element = document.createElement('div');
      element.id = name + index;
      element.className = name;
      return element
    }
    for(q = 1; q <= gridWidth; q++) {
      document.getElementById("items").appendChild(createDiv("row", r));
      document.getElementById("row" + r).appendChild(createDiv("box", ((r - 1) * gridWidth + q)));
      document.getElementById("box" + ((r - 1) * gridWidth + q)).appendChild(createDiv("icon", ((r - 1) * gridWidth + q)));
    }
  }
  document.getElementById("items").style.marginLeft = -gridWidth + "em";
  document.getElementById("items").style.marginTop = -gridHeight + "em";
  death();
  printSnake();
  orderLeaderboard();
}

function changeVar() {
  gridHeight = +(document.getElementById("height").value);
  gridWidth = +(document.getElementById("width").value);
  speed = +(document.getElementById("speed").value);
  text = document.getElementById("text").value;
  user = document.getElementById("user").value;
  setup();
}

function updateLeaderboard() {
  if(user == "") {
    user = "Anonymous";
  }
  gridHeight == 9 && gridWidth == 9 && (snakeX.length - 3 > leaderboard[user.toUpperCase()] || Object.keys(leaderboard).includes(user.toUpperCase()) == false) ? leaderboard[user.toUpperCase()] = snakeX.length - 3 : "";
  window.localStorage.setItem("lb", JSON.stringify(leaderboard));
  orderLeaderboard();
  for(d = 0; d < 5; d++) {
    document.getElementById("place" + (d + 1)).innerHTML = d + 1 <= lbOrder.length ?  (d + 1) + ". " + lbOrder[d] + ", Score: " + leaderboard[lbOrder[d]] : "";
  }
}

function orderLeaderboard() {
  lbOrder = Object.keys(leaderboard);
  for(a = 0; a < lbOrder.length + 1; a++) {
    for(b = 0; b < lbOrder.length; b++) {
    if(leaderboard[lbOrder[b + 1]] > leaderboard[lbOrder[b]]) {
      let lbItem = lbOrder[b];
      lbOrder[b] = lbOrder[b + 1];
      lbOrder[b + 1] = lbItem;
    }
    }
  }
}

setup();