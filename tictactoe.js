// game state
function GameState(boardSize) {
  // private properties
  var cells = Array(boardSize);
  var playerTurn = 1;
  var playerHasWon = false;
  var score = {
    1: 0,
    2: 0
  };
  //

  // getters
  this.getCellValue = function(cell) {
    const cellValue = cells[cell.row - 1][cell.column - 1];
    const isInvalidValue = (cellValue < 0 || cellValue > 2);

    if (isInvalidValue) {
      throw 'An invalid value was set at ' + cell + '.';
    }

    return cellValue;
  };

  this.getScore = function() {
    return score;
  };

  this.checkPlayerHasWon = function() {
    return playerHasWon;
  };
  
  this.getGridSize = function() {
  	// board will always be square
  	return cells.length;
  };
  //
  
  // setters
  this.setGridSize = function(newGridSize) {
  	const minGridSize = 2;
    
    if (newGridSize === cells.length 
    	|| isNaN(newGridSize)
    	|| newGridSize < minGridSize) {
    	return false;
    }
    
    cells = Array(newGridSize);
    
    buildMatrix();
    this.reset();
    
    return true;
  }
  //

  // public methods
  this.reset = function() {
    // set all cells to 0;
    for (i = 0; i < cells.length; i++) {
      for (j = 0; j < cells[i].length; j++) {
        cells[i][j] = 0;
      }
    }

    setPlayerTurn(1);
    playerHasWon = false;
  };

  this.playerMove = function(cell) {
    if (updateCell(cell, playerTurn)) {
      togglePlayer();
    }

    winCheck(cell);
  };
  //

  // private methods
  var buildMatrix = function() {
    for (var i = 0; i < cells.length; i++) {
      cells[i] = Array(cells.length);
      for (var j = 0; j < cells[i].length; j++) {
        cells[i][j] = 0;
      }
    }
  };

  var setCellValue = function(cell, value) {
    var isInvalidValue = (value < 0 || value > 2);

    if (isInvalidValue) {
      throw 'Cell cannot be set to ' + value + '!';
    }
    
    if (!cellExists(cell)) {
      throw 'Tried to set cell that does not exist!';
    }

    cells[cell.row - 1][cell.column - 1] = value;
  };

  var setPlayerTurn = function(player) {
    var isInvalidPlayer = (player < 1 || player > 2);

    if (isInvalidPlayer) {
      throw 'Attempted to set invalid player.';
    }

    playerTurn = player;
  };

  var updateCell = function(cell, player) {
    if (!cellExists(cell)) {
      throw 'Tried to update cell that doesn\'t exist!';
    }
	
		if (!playerHasWon) {
    	setCellValue(cell, player);
      return true;
    }

    return false;
  };

  var togglePlayer = function() {
    if (playerTurn === 1) {
      setPlayerTurn(2);
    } else if (playerTurn === 2) {
      setPlayerTurn(1);
    }
  };

  var cellExists = function(cell) {
    return cell.row - 1 >= 0 && cell.column - 1 >= 0 && cell.row - 1 < cells.length && cell.column - 1 < cells[cell.row - 1].length
  };

  var winCheck = function(cell) {
    var player = cells[cell.row - 1][cell.column - 1];
    var counter = 0;
    var winCondition = cells.length;

    // check top left to bottom right diagonal
    // if given cell is on the diagonal line
    if (cell.row === cell.column) {
      for (var i = 0; i < cells.length; i++) {
        if (cells[i][i] === player) {
          counter++;
        } else {
          break;
        }
      }

      if (counter === winCondition) {
        score[player]++;
        playerHasWon = true;
      }
    }

    // check top right to bottom left diagonal
    // if given cell is on the diagonal line
    if (cells.length - (cell.column - 1) === cell.row) {
      counter = 0;

      for (var i = 0; i < cells.length; i++) {
        if (cells[i][(cells[i].length - 1) - i] === player) {
          counter++;
        } else {
          break;
        }
      }

      if (counter === winCondition) {
        score[player]++;
        playerHasWon = true;
      }
    }

    counter = 0;
    //check row
    for (var i = 0; i < winCondition; i++) {
      if (player === cells[cell.row - 1][i]) {
        counter++;
      } else {
        break;
      }
    }

    if (counter === winCondition) {
      score[player]++;
      playerHasWon = true;
    }

    counter = 0;
    // check column
    for (var i = 0; i < cells[cell.row - 1].length; i++) {
      if (player === cells[i][cell.column - 1]) {
        counter++;
      } else {
        break;
      }
    }

    if (counter === winCondition) {
      score[player]++;
      playerHasWon = true;
    }

    return false;
  };
  //


  buildMatrix();
}
//

// game class
function GameBoard(canvas, width, height, gridLines) {

  // private properties
  var ctx = canvas.getContext('2d');
  var gridLines = gridLines;
  var columnWidth = width / (gridLines - 1);
  var rowHeight = height / (gridLines - 1);
  //
  
  // setters
  this.setNewDimensions = function(dimensions) {
  	if (!isNaN(dimensions.width)) {
    	setWidth(dimensions.width);
    }
    
    if (!isNaN(dimensions.height)) {
    	setHeight(dimensions.height);
    }
  };
  
  this.setGridLines = function(newGridLines) {
  	if (isNaN(newGridLines)) {
    	throw "Grid can only be set to a number."
    }
    
    columnWidth = ctx.canvas.width / (newGridLines - 1);
    rowHeight = ctx.canvas.height / (newGridLines - 1);
    
    gridLines = newGridLines;
  }
  //

  // public methods
  this.reset = function() {
    drawNewGameBoard();
  };

  // find the cell which the given
  // coordinates reside in
  this.getClickedCell = function(coords) {
    var cell = {};

    // instead of using one loop each for column
    // and row, they are combined into a single
    // loop. Once the column or row is found,
    // the respective check is ignored.
    for (var i = 1; i <= gridLines; i++) {
      var isColumnFound = !!cell.column;
      var isRowFound = !!cell.row;

      if (!isColumnFound) {
        var nextColumnBound = columnWidth * i;
        var isWithinCurrentColumn = coords.x < nextColumnBound;

        if (isWithinCurrentColumn) {
          cell.column = i;
        }
      }

      if (!isRowFound) {
        var nextRowBound = rowHeight * i;
        var isWithinCurrentRow = coords.y < nextRowBound;

        if (isWithinCurrentRow) {
          cell.row = i;
        }
      }

      if (isColumnFound && isRowFound) {
        return cell;
      }
    }
  };

  this.drawPlayerMove = function(cell, player) {
    if (player === 0) {
      return;
    }

    const cellBoundaries = getCellBounds(cell);

    if (player === 1) {
      drawX(cellBoundaries, 'red');
    } else if (player === 2) {
      drawO(cellBoundaries, 'blue');
    }
  };
  //

  // private methods
  var init = function() {
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    drawNewGameBoard();
  };
  
  var setHeight = function(newHeight) {
  	const minHeight = 50;
    
    if (!newHeight) { return; }
    
    if (newHeight < minHeight) {
    	throw "Can't set height lower than " + minHeight;
    }
    
    rowHeight = newHeight / (gridLines - 1);
    ctx.canvas.height = newHeight;
  }
  
  var setWidth = function(newWidth) {
  	const minWidth = 50;
    
    if (!newWidth) { return; }
    
    if (newWidth < minWidth) {
    	throw "Can't set width lower than " + minWidth;
    }
    
    columnWidth = newWidth / (gridLines - 1);
    ctx.canvas.width = newWidth;
  }

  var fillSpace = function(color) {
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color || "white";
    ctx.fill();
  };

  var drawLine = function(coords, color) {
    ctx.beginPath();
    ctx.strokeStyle = color || "black";
    ctx.moveTo(coords.startX, coords.startY);
    ctx.lineTo(coords.endX, coords.endY);
    ctx.stroke();
  };

  var drawGrid = function(color) {
    var coords = {};
    ctx.lineWidth = "2";

    for (var i = 0; i <= gridLines; i++) {
      // column
      coords.startX = columnWidth * i;
      coords.startY = 0;
      coords.endX = columnWidth * i;
      coords.endY = canvas.height;
      drawLine(coords, color);

      // row
      coords.startX = 0;
      coords.startY = rowHeight * i;
      coords.endX = canvas.width;
      coords.endY = rowHeight * i;
      drawLine(coords, color);
    }
  };

  var drawNewGameBoard = function() {
    fillSpace();
    drawGrid();
  };

  var getCellBounds = function(cell) {
    return {
      top: rowHeight * (cell.row - 1),
      bottom: rowHeight * cell.row,
      left: columnWidth * (cell.column - 1),
      right: columnWidth * cell.column
    };
  };

  var drawX = function(bounds, color) {
    var lineCoords = {};
    // use 10% of the cell for padding
    const horizontalPadding = columnWidth / 10;
    const verticalPadding = rowHeight / 10;

    lineCoords.startX = bounds.left + horizontalPadding;
    lineCoords.startY = bounds.top + verticalPadding;
    lineCoords.endX = bounds.right - horizontalPadding;
    lineCoords.endY = bounds.bottom - verticalPadding;
    drawLine(lineCoords, color);

    lineCoords.startX = bounds.right - horizontalPadding;
    lineCoords.startY = bounds.top + verticalPadding;
    lineCoords.endX = bounds.left + horizontalPadding;
    lineCoords.endY = bounds.bottom - verticalPadding;
    drawLine(lineCoords, color);
  };

  var drawO = function(bounds, color) {
    const center = {
      x: bounds.right - (columnWidth / 2),
      y: bounds.bottom - (rowHeight / 2)
    };

    var radius = 0;
    const horizontalRadius = (columnWidth - (columnWidth / 5)) / 2;
    const verticalRadius = (rowHeight - (rowHeight / 5)) / 2;

    if (horizontalRadius < verticalRadius) {
      radius = horizontalRadius;
    } else {
      radius = verticalRadius;
    }

    ctx.beginPath();

    ctx.arc(center.x, center.y, radius, 0, (Math.PI * 2));

    ctx.strokeStyle = color || "black";
    ctx.stroke();
  };
  //

  init();
}
//

// Factory
var Game = function(canvas, gridSize, width, height) {
	gridSize = gridSize || 3;
  width = width || 350;
  height = height || 350;

  var state = new GameState(gridSize || 3);
  var board = new GameBoard(canvas, width, height, gridSize + 1);

  // public interface
  this.click = function(relativeCoords) {
    const cell = board.getClickedCell(relativeCoords);

    setPlayerMove(cell);

    return state.checkPlayerHasWon();
  };

  this.reset = function() {
    board.reset();
    state.reset();
  };

  this.getPlayerScores = function() {
    return state.getScore();
  };
  
  this.getGridSize = function() {
  	return state.getGridSize();
  };
  
  this.currentBoardSize = function() {
  	return {
    	width: board.getWidth(),
      height: board.getHeight()
    };
  };
  
  this.setNewBoardSize = function(dimensions) {
  	board.setNewDimensions(dimensions);
  };
  
  this.setNewGridSize = function(newGridSize) {
  	state.setGridSize(newGridSize);
    board.setGridLines(newGridSize + 1);
  };
  
  this.redraw = function() {
  	board.reset();
  	drawCurrentState();
  }
  //

  // private methods
  var cellAlreadyPlayed = function(cell) {
    const cellValue = state.getCellValue(cell);

    return cellValue !== 0;
  };

  var setPlayerMove = function(cell) {
    if (cellAlreadyPlayed(cell)) {
      return;
    }

    state.playerMove(cell);

    board.drawPlayerMove(cell, state.getCellValue(cell));
  };
  
  var drawCurrentState = function() {
  	var gridSize = state.getGridSize();
    var cell = {};
    
    // get player moves from the game state and
    // draw them on the game board
    for (var row = 1; row <= gridSize; row++) {
    	for (var column = 1; column <= gridSize; column++) {
      	cell.row = row;
        cell.column = column;
      	board.drawPlayerMove(cell, state.getCellValue(cell));
      }
    }
  };
  //
};
//

// get globals
var canvas = document.getElementById("game");
var resetButton = document.getElementById("reset-button");
var setOptionsButton = document.getElementById("options").getElementsByTagName("button")[0];
var player1 = document.getElementById("p1-score");
var player2 = document.getElementById("p2-score");
var game = new Game(canvas);
//

// set click event listeners
canvas.addEventListener('click', clickHandler);
resetButton.addEventListener('click', resetHandler);
setOptionsButton.addEventListener('click', setOptions);
//

// initialize page elements
document.getElementById("board-height").placeholder = canvas.height;
document.getElementById("board-width").placeholder = canvas.width;
document.getElementById("board-grid").placeholder = game.getGridSize();
//

// event handlers
function clickHandler(event) {
  const gameClickCoords = {
    x: event.pageX - canvas.offsetLeft,
    y: event.pageY - canvas.offsetTop
  };

  var isWinningMove = game.click(gameClickCoords);

  if (isWinningMove) {
    var scores = game.getPlayerScores();

    player1.innerHTML = scores[1];
    player2.innerHTML = scores[2];
  }
}

function resetHandler(event) {
  game.reset();
}

function setOptions(event) {
	var widthBox = document.getElementById("board-width");
  var heightBox = document.getElementById("board-height");
  var gridBox = document.getElementById("board-grid");
  
  try {
  	game.setNewBoardSize({
      width: parseInt(widthBox.value),
      height: parseInt(heightBox.value)
    });
    
    game.setNewGridSize(parseInt(gridBox.value));
  } catch(msg) {
  	console.error(msg);
  }
  
  game.redraw();
  
  gridBox.placeholder = game.getGridSize();
  widthBox.placeholder = canvas.width;
  heightBox.placeholder = canvas.height;
  
  gridBox.value = "";
  widthBox.value = "";
  heightBox.value = "";
}
//
