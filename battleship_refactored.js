/**********************************************
*	Credit to Casey Horne for the AI logic.   *
***********************************************/

var misses0 = 0; // score and misses for human player
var score0 = 0;
var misses1 = 0; // score and misses for ai player
var score1 = 0;
var end = false; // signifiy the end of the game

function show_board() {
	"use strict";
	// create an html table on the fly. 
	for(var i = 0; i < 2; i++) {
		var board = $("#board" + i); // the actual game board
		var top = $("#top" + i); // the top coordinates
		var side = $("#side" + i); // the side coordinates
		
		for(var j = 0; j < 1; j++) { // create the top bar for each board
			top.append("<tr id = toptr" + j + ">" + j + "</tr>");
			for(var k = 0; k < 10; k++) {
				$("#top" + i + " [id = 'toptr" + j + "']").append("<td id = toptd" + k + ">" + k + "</td>");
			}
		}

		side.append("<th></th>"); // header acts as whitespace
		for(var l = 0; l < 10; l++) { // create the side bar for each board
			side.append("<tr id = sidetr" + l + ">");
			$("#side" + i + " [id = 'sidetr" + l + "']").append("<td id = sidetd" + l + ">" + l + "</td>");
			side.append("</tr>");
		}

		// create each board
		for(var tr = 0, td = 0; tr < 10; tr++) { // 10 rows
			board.append("<tr id = row" + tr + ">");
			for(td; td < 10; td++) { // 10 columns
				$("#board" + i + " [id = 'row" + tr + "']").append("<td id = row" + tr + "col" + td + "></td>");
			}
			board.append("</tr>");
			td = 0;
		}
	}
}

function Ship(size, name) {
	"use strict";
	this.size = size;
	this.hp = size;
	this.name = name;
	this.col = 0;
	this.row = 0;
	this.dir = 0;
}

Ship.prototype.place = function(num) {
	"use strict";
	var that = this;
	var player_num = num;
	var roll = function(freset) {
		do{
			/*if(num === 0) {
				if(freset === true) {
					$("#row" + that.row + "col" + that.col).removeClass();
					alert("That is not a legal move!\nTry again.");
				}
				$("#side0 tr").toggleClass("side");
				that.row = parseInt(prompt("Which row do you want the " + that.name + " to be in?"), 10);
				$("#side0 tr").toggleClass("side");
				$("#top0 td").toggleClass("top");
				that.col = parseInt(prompt("Which column do you want the " + that.name + " to be in?"), 10);
				$("#top0 td").toggleClass("top");
				$("#board0 [id = 'row" + that.row + "col" + that.col + "']").addClass("target");
				that.dir = prompt("Do you want the " + that.name + " to go up, right, down or left?");
				if(that.dir === "up") {
					that.dir = 1;
				} else if(that.dir === "right") {
					that.dir = 2;
				} else if(that.dir === "down") {
					that.dir = 3;
				} else if(that.dir === "left") {
					that.dir = 4;
				} else {
					roll(true);
				}
			} else {*/
				that.row = Math.floor((Math.random() * 100) / 10);
				that.col = Math.floor((Math.random() * 100) / 10);
				that.dir = Math.floor((Math.random() * 100) / 25) + 1; // value 1 through 4
			//}															//up: 1, right: 2, down: 3, left: 4
		}while(check_placement(that, player_num) === false);
	};
	roll();
	$("#board" + num + " [id = 'row" + this.row + "col" + this.col + "']").attr("id", this.name + "0");
	for(var i = 0; i < this.size; i++) { // place the ship on the board
		if(this.dir === 1 && i > 0) {
			this.row -= 1;
		} else if(this.dir === 2 && i > 0) {
			this.col += 1;
		} else if(this.dir === 3 && i > 0) {
			this.row += 1;
		} else if(this.dir === 4 && i > 0) {
			this.col -= 1;
		}
		$("#board" + num + " [id = 'row" + this.row + "col" + this.col + "']").attr("id", this.name + i);

		// debugging tool: shows the AI's ships. comment out to turn off.
		//$("#board" + num + " [id = '" + this.name + i + "']").addClass("target");//.html(this.name + i);

		if(num === 0) {
			$("#" + this.name + i).addClass("target");
		}
	}
};

var human_ships = [];
human_ships[0] = new Ship(2, "patrol_boat");
human_ships[1] = new Ship(3, "destroyer");
human_ships[2] = new Ship(3, "submarine");
human_ships[3] = new Ship(4, "battleship");
human_ships[4] = new Ship(5, "aircraft_carrier");

var ai_ships = [];
ai_ships[0] = new Ship(2, "patrol_boat");
ai_ships[1] = new Ship(3, "destroyer");
ai_ships[2] = new Ship(3, "submarine");
ai_ships[3] = new Ship(4, "battleship");
ai_ships[4] = new Ship(5, "aircraft_carrier");

function get_name(id) {
	"use strict";
	var newid = id;
	var first_letter = newid.charAt(0);
	newid = newid.replace(first_letter, first_letter.toUpperCase());
	if(newid.search(/_/) !== -1) {
		newid = newid.replace("_", " ");
		var second_letter = " " + newid.charAt(newid.indexOf(" ") + 1);
		newid = newid.replace(second_letter, second_letter.toUpperCase());
	}
	newid = newid.replace(/[0-4]/, "");
	return newid;
}

function highlight(e) {
	"use strict";
	var cell = $(e.target);
	var board_num = e.target.parentNode.parentNode.parentNode.id;
	var parent_row = cell.context.parentElement.id;
	var child_col = cell.context.cellIndex;

	cell.toggleClass("highlight");
	board_num = board_num[5];
	parent_row = parent_row[3];
	parent_row = parseInt(parent_row, 10) + 1;
	child_col = child_col + 1;

	$("#side" + board_num + " tr:nth-of-type(" + parent_row + ")").toggleClass("side");
	$("#top" + board_num + " td:nth-of-type(" + child_col + ")").toggleClass("top");
}

function miss(e, player_num) {
	"use strict";
	if(player_num === 1) {
		if(e.target.id == "miss") {
			$("#output1").html("Nope... still nothing...");
			return 0;
		} else {
			var cell = $(e.target);
			cell.addClass("miss");
			cell.id = "miss";
			misses1 += 1;
		}
	} else {
		if(e.coordinates.id == "miss") {
			$("#output0").html("Nope... still nothing...");
			return 0;
		}
		e.coordinates.attr("id", "miss");
		e.can_attack = false;
		e.last_attack = "miss";
		e.coordinates.removeClass();
		e.coordinates.addClass("miss");
		misses0 += 1;
	}
}

function hit(e, player_num) {
	"use strict";
	var cell = $(e[0]);
	if(player_num === 1) {
		if(e.target.id == "hit") {
			$("#output1").html("Yep... it's definitely dead now...");
			return;
		}
		cell = $(e.target);
	}
	cell.removeClass();
	cell.addClass("hit");
}

function check_placement(that, num) {
	"use strict";
	var row = that.row;
	var col = that.col;
	var good_placement = true;

	for(var i = 0; i < that.size; i++) {
		if(i > 0) {
			if(that.dir === 1) {
				row -= 1;
			} else if(that.dir === 2) {
				col += 1;
			} else if(that.dir === 3) {
				row += 1;
			} else if(that.dir === 4) {
				col -= 1;
			}
		}
		if($("#board" + num + " [id = 'row" + row + "col" + col + "']").attr("id") !== undefined) {
			good_placement = true;
		} else {
			return false;
		}
	}
	return good_placement;
}

function player_hit(e, ship_number, target_name, player_num) {
	"use strict";
	var ships = human_ships;
	var name = null;
	
	if(player_num === 0) {
		ships = ai_ships;
		name = get_name(e[0].id);
	} else {
		name = get_name(e.target.id);
	}
	for(var i = 0; i <= 4; i++) {
		if(get_name(ships[i].name) === name) {
			ships[i].hp -= 1;
			ship_number = i;
		}
	}
	if(ships[ship_number].hp === 0) {
		$("#output" + player_num).html("You sank the " + name + "!");
		if(player_num === 0) {score0 += 3;} else {score1 += 3;}
	} else {
		$("#output" + player_num).html("You hit the " + name + "!");
		if(player_num === 1) {score1 += 1;} else {score0 += 1;}
	}
}

function get_player_num(e) {
	"use strict";
	return parseInt(e.target.parentNode.parentNode.parentNode.id[5], 10);
}

function player_missed(e, player_num) {
	"use strict";
	if(player_num !== 0) {
		player_num = get_player_num(e);
	}
	if(player_num === 1) {
		miss(e, player_num);
		ai.can_attack = true;
	} else {
		miss(e, player_num);
	}
	$("#output" + player_num).html("You missed!");
}

function player_wins(player_num) {
	"use strict";
	var misses = null;
	var score = null;
	if(player_num === 1) {
		misses = misses1;
		score = score1;
	} else {
		misses = misses0;
		score = score0;
	}

	$("#output" + player_num).html("You are winner!");
	$("#output" + player_num).append("<br />You missed " + misses + " times.");
	$("#output" + player_num).append("<br />You got " + score + " score points!");

	$("#output" + player_num).html("You are loser...");
	$("#output" + player_num).append("<br />You missed " + misses + " times.");
	$("#output" + player_num).append("<br />You got " + score + " score points!");
	end = true;
}

function is_boat(e) {
	"use strict";
	var target_name;

	if(e.target !== undefined) {
		target_name = e.target.id;
	} else {
		target_name = e[0].id;
	}

	if(target_name.match(/^[a-z]+(_[a-z]+)?[0-4]{1}$/) !== null) {
		return true;
	} else {
		return false;
	}
}

function boat_hit(e, num) {
	"use strict";
	var ship_number = 0;
	var target_name = e;
	var player_num = num;

	if(player_num !== 0) {
		player_num = get_player_num(e);
		get_name(e.target.id);
	} else {
		target_name = get_name(target_name[0].id);
	}

	player_hit(e, ship_number, target_name, player_num);

	if(player_num === 0) {
		hit(e, 0);
		e[0].id = "hit";
	} else {
		hit(e, 1);
		e.target.id = "hit";
	}

	if(player_num === 1) {
		ai.can_attack = true;
	} else {
		ai.can_attack = false;
	}
}

function test_shot(e) {
	"use strict";
	if(end === false) {
		var counter = 0;
		var player_num = get_player_num(e);
		var ships = human_ships;
		if(player_num === 0) {
			ships = ai_ships;
		}
		if(is_boat(e)) {
			boat_hit(e);
		} else {
			player_missed(e);
		}
		for(var i = 0; i <= 4; i++) {
			if(ships[i].hp === 0) {
				counter += 1;
				if(counter === 5) {
					player_wins(player_num);
				}
			}
		}
		if(ai.can_attack === true) {
			ai.attack();
		}
	}
}

function AI() {
	"use strict";
	this.can_attack = false;
	this.row = 1;
	this.col = 1;
	this.dir = "up";
	this.coordinates = 0;
	this.hits = [];
	this.last_attack = "";
	this.last_XY = "";
	this.last_row = 0;
	this.last_col = 0;
	this.boat_list_names = [];
	this.boat_list_coordinates = [];
	this.i = 1;
	this.multiple_ships = true;
}

AI.prototype.remember_ship_name = function(name) {
	"use strict";
	this.boat_list_names.splice(this.boat_list_names.length, 1, name);
};

AI.prototype.forget_ship_name = function(name) {
	"use strict";
	for(var i = this.boat_list_names.length - 1; i >= 0; i--) {
		if(this.boat_list_names[i] == name) {
			this.boat_list_names.splice(i, 1);
		}
	}
};

AI.prototype.remember_ship_coordinates = function() {
	"use strict";
	this.boat_list_coordinates.splice(this.boat_list_coordinates.length, 1, this.coordinates.selector);
};

AI.prototype.forget_ship_coordinates = function(name) {
	"use strict";
	for(var i = this.boat_list_coordinates.length - 1; i >= 0; i--) {
		if(this.boat_list_names[i] === name) {
			this.boat_list_coordinates.splice(i, 1);
		}
	}
};

AI.prototype.already_hit = function() {
	"use strict";
	if(this.coordinates.hasClass("hit") || this.coordinates.hasClass("miss")) {
		this.can_attack = true;
		this.last_attack = "miss";
		return true;
	} else {
		return false;
	}
};

AI.prototype.hit_detect = function() {
	"use strict";
	if(this.already_hit()) {
		return; // we already shot here, try again
	}

	if(end === false) {
		if(is_boat(this.coordinates)) {
			boat_hit(this.coordinates, 0);
		} else {
			player_missed(this, 0);
			this.can_attack = false; // its still the ai's turn
		}
		if(human_ships[0].hp === 0 && human_ships[1].hp === 0 && human_ships[2].hp === 0 && human_ships[3].hp === 0 && human_ships[4].hp === 0) {
			player_wins(0);
			this.can_attack = true;
		}
	}
};

AI.prototype.get_coordinates_from_selector = function(coordinates) {
	"use strict";
	this.last_XY = coordinates;
	this.last_row = parseInt(this.last_XY.slice(18, 19), 10);
	if(this.last_XY.match("10") !== null) {
		this.last_col = parseInt(this.last_XY.slice(35, 37), 10);
	} else {
		this.last_col = parseInt(this.last_XY.slice(35, 36), 10);
	}
};

AI.prototype.check_boundaries = function() {
	"use strict";
	if(this.dir === "up" && (this.last_row - this.i) < 0) {
		this.dir = "down";
		this.i = 1;
	} else if(this.dir === "right" && (this.last_col + this.i) > 10) {
		this.dir = "left";
		this.i = 1;
	} else if(this.dir === "down" && (this.last_row + this.i) > 9) {
		this.dir = "up";
		this.i = 1;
	} else if(this.dir === "left" && (this.last_col - this.i) < 1) {
		this.dir = "right";
		this.i = 1;
	}
};

AI.prototype.rotate_directions = function() {
	"use strict";
	if(this.dir === "up") {
		this.dir = "right";
	} else if(this.dir === "right") {
		this.dir = "down";
	} else if(this.dir === "down") {
		this.dir = "left";
	} else if(this.dir === "left") {
		this.dir = "up";
	}
};

AI.prototype.attack = function() {
	"use strict";
	do {
		if(this.hits.length === 0) {
			this.row = Math.floor((Math.random() * 100) / 10);
			this.col = Math.floor((Math.random() * 100) / 10) + 1;
			this.coordinates = $("#board0 [id = 'row" + this.row + "'] td:nth-child(" + this.col + ")");
		}

		//if sank and boat list length > 0, target the cell
		if(this.last_attack == "sank" && this.boat_list_names.length > 0) {
			this.get_coordinates_from_selector(this.boat_list_coordinates[0]);
			this.coordinates = $(this.boat_list_coordinates[0]);
		}

		// if ai missed after it has hit a ship once, fire in the cardinal directions
		if(this.last_attack === "miss" && this.boat_list_names.length === 1) {
			this.i = 1;
			this.rotate_directions();
		// else if the ai missed after it has hit multiple times, fire in the opposite direction
		} else if(this.last_attack === "miss" && (this.boat_list_names[0] != this.boat_list_names[this.boat_list_names.length])) {
			this.i = 1;
			this.rotate_directions();
		}

		if(this.last_attack == "miss" && (this.boat_list_names.length > 1 && (this.boat_list_names[0] != this.boat_list_names[1]))) {
			this.get_coordinates_from_selector(this.boat_list_coordinates[0]);
			var a = this.last_row;
			this.get_coordinates_from_selector(this.boat_list_coordinates[1]);
			var b = this.last_row;
			if(a - b !== 0) {
				this.dir = "up";
			} else {
				this.dir = "right";
			}
		}

		if(this.last_attack === "hit" || (this.last_attack === "miss" && this.hits.length !== 0) && this.boat_list_names.length > 0) {
			this.get_coordinates_from_selector(this.boat_list_coordinates[0]);
			this.check_boundaries();
			if(this.dir === "up") {
				this.last_row -= this.i;
			} else if(this.dir === "down") {
				this.last_row += this.i;
			} else if(this.dir === "right") {
				this.last_col += this.i;
			} else if(this.dir === "left") {
				this.last_col -= this.i;
			}
			this.coordinates = $("#board0 [id = 'row" + this.last_row + "'] td:nth-child(" + this.last_col + ")");
			this.i += 1;
		}

		this.hit_detect();
	}while(this.can_attack === true && end === false);

	if(this.last_attack === "hit") {
		this.hits.push(this.coordinates.selector);
	}

	if(this.last_attack === "sank") {
		this.hits = [];
		this.i = 1;
		this.multiple_ships = true;
	}
};

var ai = new AI();

$(function() {
	"use strict";
	show_board();
	var td1 = $("#board1 td");
	var i = 0;
	td1.hover(highlight, highlight);
	td1.click(test_shot);
	for(i = 0; i <= 4; i++) {
		human_ships[i].place(0);
	}
	for(i = 0; i <= 4; i++) {
		ai_ships[i].place(1);
	}
});