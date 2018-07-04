var player;
var fading;
var grid;
var gridGraphics;
var gridSize = 16;
var foodCount = 3;
var block;
var sblock;
var game = false;
var gameWidth;
var gameHeight;
var music = {
	allow: false
}

menu = {
	play: {
		x: -36,
		y: -20,
	},
	code: {
		x: 36,
		y: -20,
	},
	time: {
		x: -36,
		y: 20,
	},
	size: {
		x: 36,
		y: 20,
	}
}

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

colours = {
	list: ["magenta", "red", "blue", "green", "gold", "gray"],
	magenta: "#FF00FF",
	red: "#FF0000",
	blue: "#0000FF",
	green: "#00FF00",
	gold: "#FFD700",
	gray: "#222420",
	sparkle: false,
	rainbow: function() {
		for (var i = 0; i < this.list.length; i++) {
			this[this.list[i]] = changeHue(this[this.list[i]], 2);
		}
	}
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
	createAudio();
	gameWidth = windowWidth;
	gameHeight = windowHeight;
    createCanvas(gameWidth, gameHeight);
    block = min(gameHeight/60, gameWidth/90); // 16;
    $("img").css({width: block*48, height: block*48})
	sblock = block * sqrt(3);
    strokeWeight(2);
    createGrid(gridSize);
    createPlayer();
}

function start() {
	changeMusic("unity");
	$("img").fadeOut();
	createGrid(gridSize);
    createPlayer();
	for (var i = 0; i < foodCount; i++) {
    	spawnFood();
    }
    game = true;
}

function hardcore() {
	player.speed = 1;
	player.speeds.min = 1;
	player.speeds.max = 1;
	for (var i = 0; i < foodCount; i++) {
    	spawnFood();
    }
}

function draw() {
	background(0);
	if (game) {
		player.draw();
	}
	drawGrid();
	drawMenu();
}

function changeMusic(m) {
	if (music.allow) {
	    music.unity.pause();
		music.power.pause();
		music.dance.pause();
		music[m].play();
	}
}

function distance(a, b, c, d) {
	return sqrt((c-a)*(c-a)+(d-b)*(d-b));
}

function hexagon(x, y, r) {
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

function createAudio() {
	music.unity = new Audio("aud/unity.mp3");
	music.power = new Audio("aud/power.mp3");
	music.dance = new Audio("aud/dance.mp3");
	music.death = new Audio("aud/death.mp3")
	music.yum = new Audio("aud/yum.mp3");
	music.unity.loop = true;
	music.power.loop = true;
	music.dance.loop = true;
	music.unity.muted = true;
	music.power.muted = true;
	music.dance.muted = true;
	music.death.muted = true;
	music.yum.muted = true;
	music.unity.volume = 0.6;
	music.power.volume = 0.6;
	music.dance.volume = 0.6;
	music.death.volume = 0.6;
	music.yum.volume = 0.6;
}

function createGrid() {
	grid = []
	for (var i = 0; i < gridSize*2+1; i++) {
		var gridLine = [];
		for (var j = 0; j < gridSize*2+1; j++) {
			var x = gameWidth/2+i*block-j*block;
			var y = gameHeight/2-gridSize*sblock*2+i*sblock+j*sblock;
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

function drawMenu() {
	mouseHovered();
	push();
	translate(gameWidth/2, gameHeight/2);

	stroke("white");
	fill(colours.red);
	hexagon(-block*36, -block*20, block*8);
	

	fill(colours.red);
	hexagon(block*36, -block*20, block*8);
	fill(colours.red);
	hexagon(-block*36, block*20, block*8);
	fill(colours.red);
	hexagon(block*36, block*20, block*8);

	fill("white");
	textAlign(CENTER);
	
	if (game) {
		textSize(13*block);
		text("\u21BB", -block*36, -block*15.5);
		if (player.speed == 1) {
			text("\u262F", block*36, -block*15.5);
		} else {
			text("\u2618", block*36, -block*15.5);
		}

		if (str(player.steps).length > 2) {
			textSize(5*block);
			text(player.steps, -block*36, block*(20 + 5/3));
		} else {
			textSize(10*block);
			text(player.steps, -block*36, block*(20 + 10/3));
		}
		
		if (str(player.len).length > 2) {
			textSize(5*block);
			text(player.len, block*36, block*(20 + 5/3));
		} else {
			textSize(10*block);
			text(player.len, block*36, block*(20 + 10/3));
		}

	} else {
		fill("white");
		textSize(12*block);
		text("\u25B6", -block*35, -block*16);
		textSize(9*block);
		text("</>", block*36, -block*17);
		textSize(12*block);
		text("🕬", -block*36, block*23);
		textSize(16*block);
		text("\u2727", block*36, block*25.5);
	}

	pop();

	if (colours.sparkle) {
		colours.rainbow();
	}
}

function drawGrid() {
	for (var i = 0; i < gridSize*2+1; i++) {
		for (var j = 0; j < gridSize*2+1; j++) {
			var hex = grid[i][j];
			fill("#222420");
			if (player.speed == 2) {
				var sna = "lightblue";
			} else {
				var sna = "white"
			}
			if (hex.space == "wall") {
				stroke("white");
				fill("black")
				hexagon(hex.x, hex.y, block);
			} else if (hex.space == "empty" || (hex.space == "food" && game == false)) {
				stroke(colours.red);
				hexagon(hex.x, hex.y, block);
			} else if (hex.space == "snake") {
				stroke(colours.green);
				fill(sna);
				hexagon(hex.x, hex.y, block);
			} else if (hex.space == "head") {
				stroke(colours.gold);
				fill(sna);
				hexagon(hex.x, hex.y, block);
			} else if (hex.space == "tail") {
				stroke(colours.red);
				hexagon(hex.x, hex.y, block);
				stroke("gray");
				fill(sna);
				if (player.extra > 0) {
					var size = block;
				} else {
					var size = block*player.animate;
					fill(sna);
				}
				hexagon(hex.x, hex.y, size);
			} else if (hex.space == "dead") {
				stroke("white");
				fill("black");
				hexagon(hex.x, hex.y, block);
			} else if (hex.space == "food") {
				stroke(colours.red);
				fill(colours.blue);
				hexagon(hex.x, hex.y, block);
			}
			if (hex.space != "none") {
				
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
		len: 0,
		life: 0,
		steps: 0,
		animate: 0,
		speeds: {
			min: 2,
			max: 4,
		},
		speed: 4,
		extra: 6,
		gains: 3,
		queue: "",
		direction: "D",
		lastDirection: "D",
		draw: function() {
			this.life++;

			fill("turquoise")
			//stroke(colours.blue);

			var head = this.body[this.body.length - 1];
			var tail = this.body[0];
			this.animate = 1 - min((this.life % this.speed) / this.speed, 1);
			if (this.queue && controls[this.lastDirection].opposite != this.queue[this.queue.length - 1]) {
				this.direction = this.queue[this.queue.length - 1];
			}

			if (this.animate == 1 && this.body.length > 0) {
				this.steps++;
				this.lastDirection = this.direction;
				this.occupy(grid[head.i+controls[this.direction].i][head.j+controls[this.direction].j]);
			}
		},
		die: function() {
			if (game) {
				changeMusic("death");
			}
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
				music.yum.play();
				this.body[0].space = "empty";
				if (this.body.length > 1) {
					this.body[1].space = "tail";
				}
				this.body.shift();
				this.extra += this.gains+1;
				this.len--;
				spawnFood();
			}
			var death = hex.space;
			hex.space = "head";
			this.body.push(hex);
			if (this.extra > 0) {
				this.extra--;
				this.len++;
			} else {
				this.body[0].space = "empty";
				if (this.body.length > 1) {
					this.body[1].space = "tail";
				}
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


function mouseHovered() {
	for (var i = 0; i < 4; i++) {
		widget = menu[["play", "code", "time", "size"][i]];
		if (distance(mouseX, mouseY, widget.x*block+gameWidth/2, widget.y*block+gameHeight/2) < block*8) {
			noFill();
			stroke("white");
			ellipse(widget.x*block+gameWidth/2, widget.y*block+gameHeight/2, block*16);
		}
	}
}


function mouseClicked() {
	if (distance(mouseX, mouseY, menu.play.x*block+gameWidth/2, menu.play.y*block+gameHeight/2) < block*8) {
		if (game) {
			changeMusic("dance");
			game = false;
			player.die();
			$("img").fadeIn();
		} else {
			start();
		}
	}

	if (distance(mouseX, mouseY, menu.code.x*block+gameWidth/2, menu.code.y*block+gameHeight/2) < block*8) {
		if (game) {
			if (player.speed != 1 && player.body.length > 0) {
				changeMusic("power");
				hardcore()
			}
		} else {
			var win = window.open("https://github.com/asdera/Snake", "_blank");
			win.focus();
		}
  		
	}

	if (distance(mouseX, mouseY, menu.time.x*block+gameWidth/2, menu.time.y*block+gameHeight/2) < block*8) {
		music.allow = true;
		music.unity.muted = !music.unity.muted;
	    music.power.muted = !music.power.muted;
	    music.dance.muted = !music.dance.muted;
	    music.death.muted = !music.death.muted;
	    music.yum.muted = !music.yum.muted;
		if (game) {
		    if (player.speed == 1) {
				changeMusic("power");
		    } else {
		    	changeMusic("unity");
		    }
		} else {
			changeMusic("dance");
		}
  		
	}

	if (distance(mouseX, mouseY, menu.size.x*block+gameWidth/2, menu.size.y*block+gameHeight/2) < block*8) {
		colours.sparkle = !colours.sparkle;
	}
}


function keyPressed() {
	if (keyCode == 87 || keyCode == 85) {
		player.queue += "W";
	}
	if (keyCode == 69 || keyCode == 73) {
		player.queue += "E";
	}
	if (keyCode == 68 || keyCode == 75) {
		player.queue += "D";
	}
	if (keyCode == 88 || keyCode == 77) {
		player.queue += "X";
	}
	if (keyCode == 90 || keyCode == 78) {
		player.queue += "Z";
	}
	if (keyCode == 65 || keyCode == 72) {
		player.queue += "A";
	}
	if (keyCode == 83 || keyCode == 74 || keyCode == 32) {
		player.speed = player.speeds.min;
		music.unity.playbackRate = 1.5;
	}
}

function keyReleased() {
	if (keyCode == 87 || keyCode == 85) {
		player.queue = player.queue.replace(/i/g, "W");
	}
	if (keyCode == 69 || keyCode == 73) {
		player.queue = player.queue.replace(/i/g, "E");
	}
	if (keyCode == 68 || keyCode == 75) {
		player.queue = player.queue.replace(/i/g, "D");
	}
	if (keyCode == 88 || keyCode == 77) {
		player.queue = player.queue.replace(/i/g, "X");
	}
	if (keyCode == 90 || keyCode == 78) {
		player.queue = player.queue.replace(/i/g, "Z");
	}
	if (keyCode == 65 || keyCode == 72) {
		player.queue = player.queue.replace(/i/g, "A");
	}
	if (keyCode == 83 || keyCode == 74 || keyCode == 32) {
		player.speed = player.speeds.max;
		music.unity.playbackRate = 1;
	}
}