const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const numRows = 6;
const numCols = 7;
const circleRadius = canvasWidth / (numCols * 2);

let tokenGrid = [];
let turnRed = true;

function init() {
  drawBoard();
  canvas.addEventListener("click", placeToken);
  for (let row = 0; row < numRows; row++) {
    tokenGrid[row] = [];
    for (let col = 0; col < numCols; col++) {
      tokenGrid[row][col] = null;
    }
  }
}

function drawBoard() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      drawCircle(col, row, "white");
    }
  }
}

function drawCircle(col, row, color) {
  const x = col * (canvasWidth / numCols) + circleRadius;
  const y = row * (canvasHeight / numRows) + circleRadius;
  ctx.beginPath();
  ctx.arc(x, y, circleRadius - 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}

function placeToken(event) {
  const col = Math.floor(event.offsetX / (canvasWidth / numCols));
  for (let row = numRows - 1; row >= 0; row--) {
    if (tokenGrid[row][col] === null) {
      const color = turnRed ? "red" : "yellow";
      drawCircle(col, row, color);
      tokenGrid[row][col] = color;
      if (checkWinner(row, col)) {
        announceWinner(color);
      }
      turnRed = !turnRed;
      return;
    }
  }
}

function checkWinner(row, col) {
  const color = tokenGrid[row][col];
  return (
    checkDirection(row, col, 0, 1, color) || // Horizontal
    checkDirection(row, col, 1, 0, color) || // Vertical
    checkDirection(row, col, 1, 1, color) || // Diagonal
    checkDirection(row, col, 1, -1, color)
  ); // Diagonal
}

function checkDirection(row, col, dRow, dCol, color) {
  let count = 0;
  for (let i = -3; i <= 3; i++) {
    const newRow = row + i * dRow;
    const newCol = col + i * dCol;
    if (
      newRow >= 0 &&
      newRow < numRows &&
      newCol >= 0 &&
      newCol < numCols &&
      tokenGrid[newRow][newCol] === color
    ) {
      count++;
      if (count === 4) return true;
    } else {
      count = 0;
    }
  }
  return false;
}

function announceWinner(color) {
  const winner = document.getElementById("winner");
  winner.textContent = `${
    color.charAt(0).toUpperCase() + color.slice(1)
  } wins!`;
  winner.style.visibility = "visible";
}

init();
