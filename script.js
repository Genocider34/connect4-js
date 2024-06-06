// Canvas element and its drawing context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Number of rows and columns of the game board
const numRows = 6;
const numCols = 7;

// Define the radius of the circles (tokens)
const circleRadius = canvasWidth / (numCols * 2);

// The game grid and turn flag
let tokenGrid = [];
let turnRed = true; // True means it's red's turn, false means it's yellow's turn

// Scores for red and yellow players
let redScore = 0;
let yellowScore = 0;

// Get DOM elements for score display and game winner announcement
const redScoreElement = document.getElementById("redScore");
const yellowScoreElement = document.getElementById("yellowScore");
const winnerElement = document.getElementById("winner");
const resetButton = document.getElementById("resetButton");

// Add event listener to the reset button to reset the game
resetButton.addEventListener("click", resetGame);

// the game board and event listeners
function main() {
  drawBoard(); // Draw the empty game board
  canvas.addEventListener("click", placeToken); // Add click event listener to place tokens
  resetGrid(); // Initialize the game grid
}

// Reset the game grid to empty state
function resetGrid() {
  tokenGrid = []; // Clear the grid array
  for (let row = 0; row < numRows; row++) {
    tokenGrid[row] = []; // Create a new row
    for (let col = 0; col < numCols; col++) {
      tokenGrid[row][col] = null; // Set each cell in the row to null (empty)
    }
  }
}

// Draw the empty game board
function drawBoard() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear the canvas
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      drawCircle(col, row, "white"); // Draw a white circle at each position
    }
  }
  winnerElement.style.visibility = "hidden"; // Hide the winner announcement
}

// Draw a circle (token) at a specific column and row with the given color
function drawCircle(col, row, color) {
  const x = col * (canvasWidth / numCols) + circleRadius; // Calculate x-coordinate
  const y = row * (canvasHeight / numRows) + circleRadius; // Calculate y-coordinate
  ctx.beginPath(); // Start drawing a new path
  ctx.arc(x, y, circleRadius - 2, 0, Math.PI * 2); // Draw a circle
  ctx.fillStyle = color; // Set fill color
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; // Set shadow color
  ctx.shadowBlur = 10; // Set shadow blur
  ctx.fill(); // Fill the circle with color
  ctx.closePath(); // Close the path
  ctx.shadowBlur = 0; // Reset shadow blur to default
}

// Handle the placement of a token when the canvas is clicked
function placeToken(event) {
  const col = Math.floor(event.offsetX / (canvasWidth / numCols)); // Determine the column based on the click position
  for (let row = numRows - 1; row >= 0; row--) {
    if (tokenGrid[row][col] === null) {
      // Find the first empty row in the column
      const color = turnRed ? "red" : "yellow"; // Determine the color based on the turn
      drawCircle(col, row, color); // Draw the token on the board
      tokenGrid[row][col] = color; // Update the grid with the token color
      if (checkWinner(row, col)) {
        // Check if this move wins the game
        announceWinner(color); // Announce the winner
        updateScore(color); // Update the score for the winning player
        canvas.removeEventListener("click", placeToken); // Disable further clicks
      }
      turnRed = !turnRed; // Switch the turn to the other player
      return; // Exit the function after placing the token
    }
  }
}

// Check if the current player has won the game
function checkWinner(row, col) {
  const color = tokenGrid[row][col]; // Get the color of the token at the given position
  return (
    checkDirection(row, col, 0, 1, color) || // Check horizontally
    checkDirection(row, col, 1, 0, color) || // Check vertically
    checkDirection(row, col, 1, 1, color) || // Check diagonally (down-right)
    checkDirection(row, col, 1, -1, color) // Check diagonally (down-left)
  );
}

// Check a specific direction for four in a row
function checkDirection(row, col, dRow, dCol, color) {
  let count = 0; // Initialize count of consecutive tokens
  for (let i = -3; i <= 3; i++) {
    const newRow = row + i * dRow; // Calculate the new row position
    const newCol = col + i * dCol; // Calculate the new column position
    if (
      newRow >= 0 &&
      newRow < numRows && // Ensure the new row is within bounds
      newCol >= 0 &&
      newCol < numCols && // Ensure the new column is within bounds
      tokenGrid[newRow][newCol] === color // Check if the token matches the color
    ) {
      count++; // Increment the count of consecutive tokens
      if (count === 4) return true; // If four in a row, return true (win)
    } else {
      count = 0; // Reset the count if the token does not match
    }
  }
  return false; // Return false if no four in a row is found
}

// Announce the winner of the game
function announceWinner(color) {
  winnerElement.textContent = `${
    color.charAt(0).toUpperCase() + color.slice(1)
  } wins!`; // Set the winner message
  winnerElement.style.visibility = "visible"; // Make the winner message visible
}

// Update the score for the winning player
function updateScore(color) {
  if (color === "red") {
    redScore++; // Increment red player's score
    redScoreElement.textContent = `Red: ${redScore}`; // Update red player's score display
  } else {
    yellowScore++; // Increment yellow player's score
    yellowScoreElement.textContent = `Yellow: ${yellowScore}`; // Update yellow player's score display
  }
}

// Reset the game to the initial state
function resetGame() {
  resetGrid(); // Reset the game grid
  drawBoard(); // Redraw the empty game board
  canvas.addEventListener("click", placeToken); // Re-enable click event listener
}

// Initialize the game
main();
