var player;
var fading;
var grid;
var gridGraphics;
var gridSize = 16;
var foodCount = 3;
var block;
var sblock;

controls = {
	W: {
		opposite: "X",
		i: -1,
		j: 0
	},
	E: {
		opposite: "Z",
		i: 0,
		j: -1
	},
	D: {
		opposite: "A",
		i: 1,
		j: -1
	},
	X: {
		opposite: "W",
		i: 1,
		j: 0
	},
	Z: {
		opposite: "E",
		i: 0,
		j: 1
	},
	A: {
		opposite: "D",
		i: -1,
		j: 1
	},
}

function pp(x) {
	console.log(x)
}

function Hex(i, j, x, y, type) {
  this.space = type;
  this.i = i;
  this.j = j;
  this.x = x;
  this.y = y;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    block = 16;
	sblock = block * sqrt(3);
    createGrid(gridSize);
    createPlayer();
    for (var i = 0; i < foodCount; i++) {
    	spawnFood();
    }
    strokeWeight(2);
}

function draw() {
	background(0);
	drawGrid();
	player.draw();
}

function hexagon(x, y, r, g=false) {
	if (g) {
		g.push();
		g.translate(x, y);
		g.beginShape();
		g.vertex(0, r);
		g.vertex(sqrt(3)*r/2, r/2);
		g.vertex(sqrt(3)*r/2, -r/2);
		g.vertex(0, -r);
		g.vertex(-sqrt(3)*r/2, -r/2);
		g.vertex(-sqrt(3)*r/2, r/2);
		g.endShape(CLOSE);
		g.pop();
	} else {
		push();
		translate(x, y);
		beginShape();
		vertex(0, r);
		vertex(sqrt(3)*r/2, r/2);
		vertex(sqrt(3)*r/2, -r/2);
		vertex(0, -r);
		vertex(-sqrt(3)*r/2, -r/2);
		vertex(-sqrt(3)*r/2, r/2);
		endShape(CLOSE);
		pop();
	}
}

function createGrid() {
	grid = []
	for (var i = 0; i < gridSize*2+1; i++) {
		var gridLine = [];
		for (var j = 0; j < gridSize*2+1; j++) {
			var x = windowWidth/2+i*block-j*block;
			var y = windowHeight/2-gridSize*sblock*2+i*sblock+j*sblock;
			var t = "none"
			if (i+j > gridSize-1 && i+j < gridSize*3+1) {
				if (min(i, j) == 0 || max(i, j) == gridSize*2 || i+j == gridSize || i+j == gridSize*3) {
					t = "wall";
				} else {
					t = "empty";
				}
			} 
			gridLine.push(new Hex(i, j, x, y, t));
		}
		grid.push(gridLine);
	}
}

function drawGrid() {
	for (var i = 0; i < gridSize*2+1; i++) {
		for (var j = 0; j < gridSize*2+1; j++) {
			hex = grid[i][j];
			fill("#222420");
			if (hex.space == "wall") {
				stroke("magenta");
			} else if (hex.space == "empty") {
				stroke("red");
			} else if (hex.space == "snake") {
				stroke("pink");
				fill("green");
			} else if (hex.space == "head") {
				stroke("pink");
				fill("gold");
			} else if (hex.space == "dead") {
				stroke("white");
				fill("black");
			} else if (hex.space == "food") {
				stroke("red");
				fill("darkblue");
			}
			if (hex.space != "none") {
				hexagon(hex.x, hex.y, block);
			}
		}
	}
}

function spawnFood() {
	var hex = random(random(grid));
	while (hex.space != "empty") {
		hex = random(random(grid));
	}
	hex.space = "food"
}

function createPlayer() {
	player = {
		body: [],
		radius: 18,
		life: 0,
		speeds: {
			min: 3,
			max: 6,
		},
		speed: 30,
		extra: 6,
		gains: 3,
		queue: "",
		direction: "D",
		lastDirection: "D",
		speed: 6,
		draw: function() {
			this.life++;

			fill("turquoise")
			//stroke("blue");

			var head = this.body[this.body.length - 1];
			var tail = this.body[0];
			var animate = min((this.life % this.speed) / this.speed, 1);

			if (this.queue && controls[this.lastDirection].opposite != this.queue[this.queue.length - 1]) {
				this.direction = this.queue[this.queue.length - 1];
			}

			if (animate == 0 && this.body.length > 0) {
				this.lastDirection = this.direction;
				this.occupy(grid[head.i+controls[this.direction].i][head.j+controls[this.direction].j]);
			}
		},
		die: function() {
			for (var i = this.body.length - 1; i >= 0; i--) {
				this.body[i].space = "dead";
			}
			this.body = [];
		},
		occupy: function(hex) {
			if (this.body.length > 0) {
				this.body[this.body.length - 1].space = "snake";
			}
			if (hex.space == "food") {
				this.extra += this.gains;
				spawnFood();
			}
			var death = hex.space;
			hex.space = "head";
			this.body.push(hex);
			if (this.extra > 0) {
				this.extra--;
			} else {
				this.body[0].space = "empty";
				this.body.shift();
			}
			if (["wall", "snake"].includes(death)) {
				this.die();
			}
		},
	}
	player.direction = random("WEDXZA".split(""))
	player.occupy(grid[gridSize][gridSize])
}

function keyPressed() {
	if (keyCode == 87) {
		player.queue += "W";
	}
	if (keyCode == 69) {
		player.queue += "E";
	}
	if (keyCode == 68) {
		player.queue += "D";
	}
	if (keyCode == 88) {
		player.queue += "X";
	}
	if (keyCode == 90) {
		player.queue += "Z";
	}
	if (keyCode == 65) {
		player.queue += "A";
	}
	if (keyCode == 83) {
		player.speed = player.speeds.min;
	}
}

function keyReleased() {
	if (keyCode == 87) {
		player.queue = player.queue.replace(/i/g, "W");
	}
	if (keyCode == 69) {
		player.queue = player.queue.replace(/i/g, "E");
	}
	if (keyCode == 68) {
		player.queue = player.queue.replace(/i/g, "D");
	}
	if (keyCode == 88) {
		player.queue = player.queue.replace(/i/g, "X");
	}
	if (keyCode == 90) {
		player.queue = player.queue.replace(/i/g, "Z");
	}
	if (keyCode == 65) {
		player.queue = player.queue.replace(/i/g, "A");
	}
	if (keyCode == 83) {
		player.speed = player.speeds.max;
	}
}