const CELL_SIZE = 35;
const OPPOSITE = {
	north: "south",
	south: "north",
	east: "west",
	west: "east"
}

function Cell(row, col) {
	this.pos = {
		row: row,
		col: col
	}

	this.walls = {
		north: true,
		south: true,
		east: true,
		west: true
	}

	this.size = {
		width: CELL_SIZE + "px",
		height: CELL_SIZE + "px"
	}

	this.neighbors = {
		north: null,
		south: null,
		east: null,
		west: null
	}

	this.visited = false;

	this.id;
}

Cell.prototype.drawCell = function(row, col) {
	let div = document.createElement("div");

	div.style.float = "left";
	div.style.boxSizing = "border-box";
	div.id = "cell-" + row + "-" + col;

	div = this.drawCellWalls(div);
	div = this.drawCellSize(div);

	return div;
}

Cell.prototype.drawCellWalls = function(div) {
	const border_style = "2px solid black"
	if (this.walls.north === true) {
		div.style.borderTop = border_style;
	}
	if (this.walls.south === true) {
		div.style.borderBottom = border_style;
	}
	if (this.walls.east === true) {
		div.style.borderRight = border_style;
	}
	if (this.walls.west === true) {
		div.style.borderLeft = border_style;
	}

	return div;
}

Cell.prototype.drawCellSize = function(div) {
	div.style.width = this.size.width;
	div.style.height = this.size.height;

	return div;
}

Cell.prototype.getNotVisitedNeighbors = function() {
	let neighbors = [];

	if(this.neighbors.north && !this.neighbors.north.visited) {
		neighbors.push("north");
	}
	if(this.neighbors.south && !this.neighbors.south.visited) {
		neighbors.push("south");
	}
	if(this.neighbors.east && !this.neighbors.east.visited) {
		neighbors.push("east");
	}
	if(this.neighbors.west && !this.neighbors.west.visited) {
		neighbors.push("west");
	}

	return neighbors;
}

function Maze(rows, cols) {
	this.numRows = rows;
	this.numCols = cols;
	this.cells = [];
	this.visited = [];
	this.player = {
		pos: {
			row: 0,
			col: 0
		},
		color: "red"
	}
}

Maze.prototype.generateCells = function() {
	let i, j, cell;
	let container = document.getElementById('maze');

	while(container.lastElementChild) {
		container.removeChild(container.lastElementChild);
	}

	container.style.width = CELL_SIZE*this.numCols +"px";
	container.style.height = CELL_SIZE*this.numRows +"px";

	for(i = 0; i < this.numRows; i++) {
		this.cells[i] = [];
		for(j = 0; j < this.numCols; j++) {
			cell = new Cell(i, j);
			container.appendChild(cell.drawCell(i, j));
			cell.id = "cell-" + i + "-" + j;
			this.cells[i][j] = cell;
		}
	}

	this.setNeighbors();
}

Maze.prototype.resetVisits = function() {
	let i, j;

	for(i = 0; i < this.numRows; i++) {
		this.visited[i] = [];
		for(j = 0; j < this.numCols; j++) {
			this.visited[i][j] = false;
		}
	}
}

Maze.prototype.setNeighbors = function() {
	let i, j, cell;
	for(i = 0; i < this.cells.length; i++) {
		for(j = 0; j < this.cells[i].length; j++) {
			cell = this.cells[i][j];
			if(cell.pos.row > 0) {
				cell.neighbors.north = this.cells[cell.pos.row-1][cell.pos.col];
			}
			if(cell.pos.col > 0) {
				cell.neighbors.west = this.cells[cell.pos.row][cell.pos.col-1];
			}
			if(cell.pos.row < this.numRows - 1) {
				cell.neighbors.south = this.cells[cell.pos.row+1][cell.pos.col];
			}
			if(cell.pos.col < this.numCols - 1) {
				cell.neighbors.east = this.cells[cell.pos.row][cell.pos.col+1];
			}
		}
	}
}

Maze.prototype.generateMaze = function() {
	// 1. Generate cells
	// 2. Pick a random cell as current cell and mark as visited
	// 3. While cell(s) are unvisited
	//		a. Cell has neighbor
	//			i.    Choose random neighbor
	//			ii.   Push current cell to stack
	//			iii.  Remove wall between cells
	//			iiii. Mark choosen cell as current cell and mark visited
	//		b. Cell doesn't have neighbor
	//			i.	  Pop cell from stack
	//			ii.   Mark as current cell

	let curRow, curCol, neighbors, ranNeighbor, stack;

	this.generateCells();
	this.resetVisits();

	curRow = randomBetween(0, this.numRows - 1);
	curCol = randomBetween(0, this.numCols - 1);

	stack = new Stack();

	currentCell = this.cells[curRow][curCol];
	currentCell.visited = true;

	while(this.thereAreNotVistedCells()) {

		neighbors = currentCell.getNotVisitedNeighbors();

		if(neighbors.length > 0) {
			ranNeighbor = neighbors[randomBetween(0, neighbors.length - 1)];
			stack.push(currentCell);
			currentCell.walls[ranNeighbor] = false;
			currentCell.neighbors[ranNeighbor].walls[OPPOSITE[ranNeighbor]] = false;

			if(ranNeighbor === "north") {
				curRow--;
			}
			if(ranNeighbor === "south") {
				curRow++;
			}
			if(ranNeighbor === "east") {
				curCol++;
			}
			if(ranNeighbor === "west") {
				curCol--;
			}

			currentCell = this.cells[curRow][curCol];
			currentCell.visited = true;
		} else {
			currentCell = stack.pop();
			curRow = currentCell.pos.row;
			curCol = currentCell.pos.col;

		}
	}

	this.drawWalls();
	this.generatePlayer();
}

Maze.prototype.drawWalls = function() {
	let i, j, cellWalls, cellElement;
	for(i = 0; i < this.cells.length; i++) {
		for(j = 0; j < this.cells[i].length; j++) {
			cellElement = document.getElementById(this.cells[i][j].id);
			cellWalls = this.cells[i][j].walls;

			if(!cellWalls.north) {
				cellElement.style.borderTop = "";
			}
			if(!cellWalls.south) {
				cellElement.style.borderBottom = "";
			}
			if(!cellWalls.east) {
				cellElement.style.borderRight = "";
			}
			if(!cellWalls.west) {
				cellElement.style.borderLeft = "";
			}
			
		}
	}

	cellElement = document.getElementById(this.cells[0][0].id);
	cellElement.style.borderLeft = "";
	cellElement = document.getElementById(this.cells[this.numRows-1][this.numCols-1].id);
	cellElement.style.borderRight = "";
}

Maze.prototype.thereAreNotVistedCells = function() {
	for(let i = 0; i < this.cells.length; i++) {
		for(let j = 0; j < this.cells[i].length; j++) {
			if(!this.cells[i][j].visited) {
				return true;
			}
		}
	}

	return false;
}

Maze.prototype.generatePlayer = function() {
	let player = this.player;
	let currentCell = this.cells[player.pos.row][player.pos.col];
	let cellElement = document.getElementById(currentCell.id);
	let playerElement = document.createElement("div");

	playerElement.style.backgroundColor = player.color;
	playerElement.style.width = CELL_SIZE - 5 + "px";
	playerElement.style.height = CELL_SIZE - 5 + "px";
	playerElement.style.borderRadius = "50%";
	cellElement.appendChild(playerElement)

}

Maze.prototype.movePlayer = function(keyCode) {
	// east: 39
	// west: 37
	// north: 38
	// south: 40
	let valid;
	let player = this.player;
	let previousCell = this.cells[player.pos.row][player.pos.col];
	let cellElement = document.getElementById(previousCell.id);
	
	while(cellElement.lastElementChild) {
		cellElement.removeChild(cellElement.lastElementChild);
	}

	if(keyCode === 39 && !previousCell.walls.east) {
		player.pos.col++;
		valid = true;
	}
	if(keyCode === 37 && !previousCell.walls.west) {
		player.pos.col--;
		valid = true;
	}
	if(keyCode === 38 && !previousCell.walls.north) {
		player.pos.row--;
		valid = true;
	}
	if(keyCode === 40 && !previousCell.walls.south) {
		player.pos.row++;
		valid = true;
	}

	maze.generatePlayer();

}

function Stack() {
	this.items = [];
}

Stack.prototype.push = function(item) {
	this.items.push(item);
}

Stack.prototype.pop = function() {
	if(this.items.length === 0) {
		return -1;
	}

	return this.items.pop();
}


function randomBetween(start, end) {
	return Math.round(Math.random() * (end-start)) + start;
}


let maze = new Maze(20,20);

window.onkeydown = function(e) {
	maze.movePlayer(e.keyCode);
}
