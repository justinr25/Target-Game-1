const canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");

// variables
let mousePos = {
	x: undefined,
	y: undefined,
};

const timeLimit = 15;
let score = 0;
let secondsPassed;
let start = Date.now();

// event listeners
window.addEventListener("mousemove", (event) => {
	mousePos.x = event.clientX;
	mousePos.y = event.clientY;
});

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

canvas.addEventListener("click", (event) => {
	whenTargetIsClicked();
});

// utility functions
function distance(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// objects
function Target(x, y, dx, dy, radius) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.color = "red";

	this.draw = function () {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.strokeStyle = "black";
		c.fillStyle = this.color;
		c.fill();
		c.stroke();
	};

	this.update = function () {
		if (
			this.x - this.radius + this.dx < 0 ||
			this.x + this.radius + this.dx > innerWidth
		) {
			this.dx = -this.dx;
		}
		if (
			this.y - this.radius + this.dy < 0 ||
			this.y + this.radius + this.dy > innerHeight
		) {
			this.dy = -this.dy;
		}

		this.x += this.dx;
		this.y += this.dy;

		this.draw();
	};

	this.newPosition = function () {
		this.x = randomIntFromRange(radius, innerWidth - radius);
		this.y = randomIntFromRange(radius, innerHeight - radius);
	};

	this.newVelocity = function () {
		this.dx = randomIntFromRange(-5, 5);
		this.dy = randomIntFromRange(-5, 5);
	};
}

// implementation
let target;

function init() {
	const radius = 70;
	const x = randomIntFromRange(radius, innerWidth - radius);
	const y = randomIntFromRange(radius, innerHeight - radius);
	const dx = randomIntFromRange(-5, 5);
	const dy = randomIntFromRange(-5, 5);

	target = new Target(x, y, dx, dy, radius);
}

function displaySeconds() {
	secondsPassed = Math.floor((Date.now() - start) / 1000);
	c.font = "25px Verdana";
	c.fillStyle = "#000";
	c.textAlign = "left";
	c.fillText("Time Left: " + (timeLimit - secondsPassed), 20, 50);
}

function mouseIntersect(target) {
	return distance(mousePos.x, mousePos.y, target.x, target.y) < target.radius;
}

function whenTargetIsClicked() {
	if (!mouseIntersect(target)) return;

	let gunshot = new Audio("media/happy-pop-2.wav");
	gunshot.play();
	target.newPosition();
	target.newVelocity();
	score += 10;
}

function displayScore() {
	c.font = "50px Verdana";
	c.fillStyle = "#000";
	c.textAlign = "center";
	c.fillText("Score: " + score, innerWidth / 2, 50);
}

function gameOver() {
	c.clearRect(0, 0, innerWidth, innerHeight);

	displayScore();

	c.font = "100px Arial";
	c.fillStyle = "#000";
	const textString = "GAME OVER",
		textWidth = c.measureText(textString).width;
	c.textAlign = "center";
	c.fillText(textString, innerWidth / 2, innerHeight / 2);

	// displayRestartButton()
}

// function resetGame() {
//     start = Date.now()
//     score = 0
//     init()
//     animate()
// }

// function displayRestartButton() {
//     const restartButton = document.createElement('button')
//     restartButton.innerText = 'Restart Game'
//     restartButton.addEventListener('click', () => {
//         resetGame()
//         restartButton.remove()
//     })
//     document.body.appendChild(restartButton)
// }

// animation loop
function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0, 0, innerWidth, innerHeight);

	target.update();

	displaySeconds();
	displayScore();

	if (timeLimit - secondsPassed <= 0) {
		gameOver();
		return;
	}

	// console.log(target.dx);
	// console.log(target.dy);
}

init();
animate();
