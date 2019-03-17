let cell_temp = {
	pos: {
		row: 0,
		col: 0
	},
	walls: {
		north: true,
		south: true,
		east: true,
		west: true
	},
	size: {
		width: "100px",
		height: "100px"
	}
}

function draw_cell(cell) {
	let maze = document.getElementById("maze");
	let div = document.createElement("div");

	

	div.style.float = "left";
	div.style.boxSizing = "border-box"

	div = draw_cell_walls(div, cell);
	div = draw_cell_size(div, cell);

	maze.appendChild(div);

}

function draw_cell_walls(div, cell) {
	const border_style = "2px solid black"
	if (cell.walls.north === true) {
		div.style.borderTop = border_style;
	}
	if (cell.walls.south === true) {
		div.style.borderBottom = border_style;
	}
	if (cell.walls.east === true) {
		div.style.borderRight = border_style;
	}
	if (cell.walls.west === true) {
		div.style.borderLeft = border_style;
	}

	return div;
}

function draw_cell_size(div, cell) {
	div.style.width = cell.size.width;
	div.style.height = cell.size.height;

	return div;
}

