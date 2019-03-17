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
		width: "100px",
		height: "100px"
	}
}

Cell.prototype.draw_cell = function() {
	let div = document.createElement("div");

	div.style.float = "left";
	div.style.boxSizing = "border-box"

	div = this.draw_cell_walls(div);
	div = this.draw_cell_size(div);
}

Cell.prototype.draw_cell_walls = function(div) {
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

Cell.prototype.draw_cell_size = function(div) {
	div.style.width = this.size.width;
	div.style.height = this.size.height;

	return div;
}

first_cell = new Cell(0, 0);