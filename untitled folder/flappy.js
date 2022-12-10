/* 	flappy bird clone for school research thingie
	Gilles Coremans 2016
*/
"use strict";

/*//////////////////
//global variables//
//////////////////*/
var canvas = document.getElementById("flappyCanvas");
var ctx = canvas.getContext("2d");

var started = false;

//bird data
var bx = canvas.width / 2;
var by = canvas.height / 2;
var mom = 0;
var birdSize = 10;
var score = 0;

//pipe data
var pipes = [];
var pipeDelayStart = 2.5 * 100; //amount of time between pipe spawns
var pipeDelay = 0;
var pipeWidth = 30;
var pipeColor = "#3CC128";
var gapSizeDef = 65

draw();
setInterval(mainLoop, 10);

/*///////
//input//
///////*/
document.addEventListener("keydown", inputHandler, false);
document.addEventListener("click", inputHandler, false);

function inputHandler(e)
{
	if(started)
	{
		mom = Math.min(mom + 3, 20);
	}
	else
	{
		bx = canvas.width / 2;
		by = canvas.height / 2;
		mom = 0;
		pipes = [];
		score = 0;
		started = true;
	}
}


function mainLoop()
{
	if(started)
	{
		proc();
		draw();
	}
}


/*/////////////////////////
//changing the game state//
/////////////////////////*/
function proc()
{
	movePipes();

	by -= mom;
	mom = Math.max(-15, mom - 0.100);
	
	checkColl();
	checkPipes();
}

function movePipes()
{
	pipes.forEach(function(pipe)
	{
		pipe.x--;
		if(!pipe.scored && pipe.x < canvas.width / 2)
		{
			score++;
			pipe.scored = true;
		}
	});
}

function checkColl()
{
	//top/bottom check
	if(by - birdSize < 0 || by + birdSize > canvas.height)
	{
		fail()
	}
	
	//pipe check
	pipes.forEach(function(pipe)
	{
		//check both upper and lower rectangle. birdsize has some extra margin so it doesnt look like you didnt hit the pipe but lost anyway
		if((pointRectDist(bx, by, pipe.x - pipe.width, 0, pipe.width, pipe.gapStart) < birdSize - 2)
			|| (pointRectDist(bx, by, pipe.x - pipe.width, pipe.gapStart + pipe.gapSize, pipe.width, canvas.height - (pipe.gapStart + pipe.gapSize)) < birdSize - 2))
			{
				fail();
			}
	});
}

function checkPipes()
{
	pipeDelay = Math.max(pipeDelay - 1, 0)
	if(pipes.length < 3 && pipeDelay === 0)
	{
		pipeDelay = pipeDelayStart;
		pipes[pipes.length] = 
					{		x 			: 	canvas.width + pipeWidth,
							width 		: 	pipeWidth,
							gapStart 	:	randomBetween(100, canvas.height - 100),
							gapSize		:	randomBetween(gapSizeDef - 15, gapSizeDef + 15),
							scored		:	false
					};
	}

	if(pipes.length >= 1 && pipes[0].x <= 0)
	{
		pipes.shift();
	}

}

function fail()
{
		started = false;
}

/*/////////////////////////////
//drawing stuff to the screen//
/////////////////////////////*/
function draw()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawPipes();
	drawBird();
	drawScore();
}

function drawPipes()
{
	pipes.forEach(function(pipe)
	{
		ctx.beginPath();
		ctx.rect(pipe.x, 0, -pipe.width, pipe.gapStart);
		ctx.fillStyle = pipeColor;
		ctx.fill();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.rect(pipe.x, pipe.gapStart + pipe.gapSize, -pipe.width, canvas.height - (pipe.gapStart + pipe.gapSize));
		ctx.fillStyle = pipeColor;
		ctx.fill();
		ctx.closePath();
	});
}

function drawBird()
{
	ctx.beginPath();
	ctx.arc(bx, by, birdSize, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawScore()
{
	ctx.fillStyle = "#000000"
	ctx.font = "32px serif";
	ctx.textAlign = "center"
	ctx.fillText(score, canvas.width / 2, 50);
	if(!started)
	{
		ctx.font = "25px serif"
		ctx.fillText("You lost.", canvas.width / 2, canvas.height / 2 - 50)
		ctx.fillText("Press any key to try again.", canvas.width / 2, canvas.height / 2)
	}
}


function randomBetween(min, max) //not an npm package
{
	return Math.random() * (max - min) + min;
}

function pointRectDist(px, py, rx, ry, rwidth, rheight)
{
    var cx = Math.max(Math.min(px, rx+rwidth ), rx);
    var cy = Math.max(Math.min(py, ry+rheight), ry);
    return Math.sqrt( (px-cx)*(px-cx) + (py-cy)*(py-cy) );
}