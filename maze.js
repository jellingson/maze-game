const CELL_SIZE = 100;

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

	this.visited = false;
}

Cell.prototype.drawCell = function() {
	let div = document.createElement("div");

	div.style.float = "left";
	div.style.boxSizing = "border-box"

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

function Maze(width, height) {
	this.width = width;
	this.height = height;
	this.cells = [];
}

Maze.prototype.generateCells = function() {
	let i, j, cell, rowOfCells = [];
	let container = document.getElementById('maze');

	while(container.lastElementChild) {
		container.removeChild(container.lastElementChild);
	}

	container.style.width = CELL_SIZE*this.width +"px";
	container.style.height = CELL_SIZE*this.height +"px";

	for(i = 0; i < this.height; i++) {
		for(j = 0; j < this.width; j++) {
			cell = new Cell(i, j);
			container.appendChild(cell.drawCell());
			rowOfCells[j] = cell;
		}
		this.cells.push(rowOfCells)
	}
}

function Stack() {
	this.items = [];
}

Stack.prototype.push = function(item) {
	this.items.push(item);
}

Stack.prototype.pop = function() {
	if(this.array.length === 0) {
		return -1;
	}

	return this.items.pop();
}

let maze = new Maze(5,5);