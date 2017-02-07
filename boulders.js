// Natalie Wittenbrook May 17 2012
// Boulder smashing game

"use strict";
var HEIGHT = 12;
var WIDTH = 14;
var COLORS = ["yellow", "blue", "gray", "green"];
var SCORE = 0;
var BEST = 0;
var PREVSTATE = null;
var CURRSCORE = 0;
var HIGH = 0;
var BEATN = false;
var BEATG = false; 

window.onload = function() {
	if ($("best")) {
		BEST = $("best").innerHTML;
	}
	HIGH = $("highn").innerHTML;
	createBoulders();
	$("treasure").addClassName("treasureFade");
	$("chestclick").hide();
	$("restart").observe("click", restart);
}

// Adds boulders of random colors to the screen
function createBoulders() {
	var topPos = 0;
	var leftPos = 0;
	for (var i = 0; i < (HEIGHT*WIDTH); i++) {
		if (leftPos == WIDTH) { 
			topPos++;		// shifts to the next row
			leftPos = 0;	
		}
		var color = COLORS[parseInt(Math.random()*(COLORS.length))];
		var img = document.createElement("img");
		img.addClassName('boulder');
		img.addClassName(color);
		img.src = color + ".png";
		$("boulderarea").appendChild(img);
		moveOne(img, leftPos, topPos);
		leftPos++;
	}
	markColors();
}	

// marks boulder groups of the same color
function markColors() {
	$("score").innerHTML = (SCORE);
	$("undo").disabled = true;
	var groupNum = 0;
	var boulders = $$('.boulder');
	var adjs = [];
	for (var i = 0; i < boulders.length; i++) {
		var currB = boulders[i];
		currB.observe("click", boulderClick);
		//currB.observe("dblclick", boulderDel);
		var xPos = parseInt(currB.style.left)/40;
		var yPos = parseInt(currB.style.top)/30;
		var right = $(toId(xPos + 1, yPos));
		var down = $(toId(xPos, yPos + 1)); 
		adjs = [right, down];
		var thisGroup = 'group' + groupNum;
		if (!currB.hasClassName('hasGroup')) {
			currB.addClassName(thisGroup);
		}
		for (var j = 0; j < adjs.length; j++) {
			if (adjs[j] !== null && (!currB.hasClassName(getGroup(adjs[j])))) {
				if (getColor(currB) === getColor(adjs[j])) {
					var currGroup = getGroup(currB);
					if (adjs[j].hasClassName('hasGroup')) {
						var thatGroup = getGroup(adjs[j]);
						thisGroup = $$("." + currGroup);
						thisGroup.invoke('addClassName', thatGroup);
						thisGroup.invoke('removeClassName', currGroup);
					} else {
						adjs[j].addClassName(currGroup);
						adjs[j].addClassName('hasGroup');
					}
					currB.addClassName('hasGroup');
				}
			}
		}
		if (!currB.hasClassName('hasGroup')) {
			currB.removeClassName(thisGroup);
		} else {
			groupNum++;
		}
	}
}


// fades or unfades boulder group on click
function boulderClick(event) {
	var thisBoulder = event.element();
	if(thisBoulder.hasClassName("faded")) {
		boulderDel(thisBoulder);
	} else {
		var prevFaded = $$(".faded");
 		prevFaded.invoke('removeClassName', 'faded');
		var groupName = $$("." + getGroup(event.element()));
		groupName.invoke('addClassName','faded');
	}
}

// deletes boulder group on double-click
function boulderDel(thisBoulder) {
	PREVSTATE = $("boulderarea").innerHTML;
	var groupName = $$("." + getGroup(thisBoulder));
	if (groupName.length > 1) {
		for (var i = 0; i < groupName.length; i++) {
			var currB = groupName[i];
			var xPos = parseInt(currB.style.left)/40;
			var yPos = parseInt(currB.style.top)/30;
			if (getColor($(toId(xPos, yPos - 1))) != getColor(currB)) {
				while ($(toId(xPos, yPos - 1)) !== null) {
					var upper = $(toId(xPos, yPos - 1));
					xPos = parseInt(upper.style.left)/40;
			 		yPos = parseInt(upper.style.top)/30;
			 		moveOne(upper, xPos, yPos + 1);
				}
			}
		}
		CURRSCORE = parseInt(Math.pow(groupName.length, 1.1));	
		SCORE += CURRSCORE;
		groupName.invoke('remove');
		for (var w = WIDTH - 1; w > 0; w--) {
			var curr = $(toId(w, HEIGHT - 1));
			var next = $(toId(w - 1, HEIGHT - 1));
			if (curr !== null && next === null) {
				shiftRight(w - 1);
				break;
			}
		}
		var boulders = $$('.boulder');
		for (var i = 0; i < boulders.length; i++) {
			var curr = boulders[i];
			curr.removeClassName('hasGroup');
			curr.removeClassName(getGroup(curr));
		}
		markColors();
		$("score").innerHTML = (SCORE);
		if (SCORE > HIGH && BEATN == false) {
			alert("Congrats! You beat Natalie's high score. You get a 200 point bonus!");
			BEATN = true;
			SCORE += 200;
			HIGH = $("highg").innerHTML;
		} else if (SCORE > HIGH && BEATG == false && BEATN == true) {
			alert("Whoa! You beat the guest high score. You get a 2000 point bonus!");
			BEATG = true;
			SCORE += 2000;
		}
		$("score").innerHTML = (SCORE);
		var groups = $$('.hasGroup');
		if (boulders.length == 0) {
			$("treasure").removeClassName("treasureFade");
			$("chestclick").show();
			$("treasure").observe("click", winner);
		} else if (groups.length == 0) {	
			if (boulders.length <= 5) {
				if (boulders.length == 1) {
					alert("You had " + boulders.length + " boulder left...so close to clearing! You can still keep playing though.");
				} else {
					alert("You had " + boulders.length + " boulders left! You can keep playing!");
				}
				newRound();
			} else {
				if (BEATN == true && BEATG == false) {
					alert("You lost, but you still beat my high score! Nice job! Press Restart to start a new game.")
				} else if (BEATG == true) {
					alert("You lost, but you set a new guest high score! Let me know that you're the new grand champion with your score of " + SCORE + "!")
				} else {
					alert("You lost. :( Press Restart to start a new game.");
				}
				if (BEST < SCORE) {
					BEST = SCORE;
				}
				$("best").innerHTML = (BEST);
				new Ajax.Request("webservice.php", {
					method: "post",
					parameters: {"best": BEST},
					onFailure: ajaxFailure,
					onException: ajaxFailure		
				});
			}
		}
	}
	$("undo").disabled = false;
	$("undo").observe("click", undo);
}

// shows winner text
function winner(event) {
	alert("Good job! You get a 100 point bonus for finding the treasure chest!");
	SCORE += 100;
	$("chestclick").hide();
	$("treasure").addClassName("treasureFade");
	newRound();
}

// undoes the last move
function undo(event) {
	$("boulderarea").innerHTML = PREVSTATE;
	var prevFaded = $$(".faded");
 	prevFaded.invoke('removeClassName', 'faded');
 	SCORE -= CURRSCORE;
 	markColors();
}

// shifts boulders right when there's space between rows
function shiftRight(xPos) {
	for (var k = xPos; k >= 0; k--) {
		var thisB = $(toId(k, HEIGHT - 1));
		if (thisB !== null) {
			var currX = parseInt(thisB.style.left)/40;
			moveOne(thisB, xPos, HEIGHT - 1);
			var currY = HEIGHT - 2;
			while ($(toId(currX, currY)) !== null) {
				moveOne($(toId(currX, currY)), xPos, currY);
				currY--;
			}
			xPos = xPos - 1;
		}
	}
}

// returns group name of element
function getGroup(boulder) {
	var group = boulder.className;
	var num = parseInt(group.match(/\d+/));
	return 'group' + num;
}


// returns the color of the element
function getColor(curr) {
	if (curr !== null) {
		for (var i = 0; i < COLORS.length; i++) {
			if ($(curr).hasClassName(COLORS[i])) {
				return COLORS[i];
			}
		}
	}
}

// moves one square's position
function moveOne(boulder, xPos, yPos) {
 	var thisId = toId(xPos, yPos);
 	if (thisId !== null) {
		boulder.id = thisId;
		boulder.style.left = 40*xPos + "px";
		boulder.style.top = 30*yPos + "px";
	}
}

// converts x, y position into a string id
function toId(xPos, yPos) {
	 return "boulder_" + xPos + "_" + yPos;
}

// starts the game over	with a new set of boulders
function restart(event) {
	SCORE = 0;
	newRound();
}

// starts a new round
function newRound() {
	var boulders = $$('.boulder');
	boulders.invoke('remove');
	createBoulders();
}

// called when the Ajax fails
function ajaxFailure(ajax, exception) {
	$("errors").innerHTML = ("Error making Ajax request:" + 
	"\n\nServer status:\n" + ajax.status + " " + ajax.statusText + 
	"\n\nServer response text:\n" + ajax.responseText);
	if (exception) {
		throw exception;
	}
}	