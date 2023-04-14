// Part 1: Set-Up

const canvas = document.querySelector("canvas"); //queries for the html canvas
const c = canvas.getContext("2d"); //gets the 2D context for drawing using html.canvas 
canvas.width = 1024; //fixes dimensions of the canvas (I did this because I couldn't figure out how to make the game scale with window size/ work with screens of different aspect ratios)
canvas.height = 576; //16:9 Aspect Ratio

const scoreEl = document.querySelector("#scoreElement"); //queries for score element in html

const livesEl = document.querySelector("#livesElement");
console.log(canvas); 

const restartButton = document.querySelector("#restart")

restartButton.style.visibility = "hidden"


//Part 2: Setting up the Classes of each component of the game. 
// - Player 
// - Invader 
// - Grid 
// - Projectiles (both player's and invader's)
// - Particles 

class Player { 	//creates a class for the player
	constructor() {
		this.movement = { //acts as the movement input e.g when keypress +1 to x, moves the player to the right by 1
			x: 0,
			y: 0,
		};
    this.lives = 3
		this.rotation = 0; //code for the rotation logic of the player 
		this.opacity = 1; //logic for fading the player after dying 
		const image = new Image(); //Image() constructor, instantiates a html Image element (acts as an object)
		image.src = "./img/spaceship.png"; //src for the above image 
		image.onload = () => { //once the image has been loaded, to execute this logic 
			const scale = 0.05; //my png for the spaceship was too big so I scaled it down 
			this.width = image.width * scale; //sets the dimensions of the image 
			this.height = image.height * scale;
			this.image = image; //sets the this.image of the Player class to the new Image from the img constructor in line 23
			this.position = { //acts as the starting position for the Player
				x: canvas.width / 2 - this.width / 2, //to put the player in the middle on the x-axis. I realised that canvas.width doesn't put the player smack in the middle because that position is where JavaScript STARTS to render the image, which is why I minused width/2 to get the exact middle. 
				y: canvas.height - this.height -20 ,  //fun-fact, html canvas y axis starts from top to bottom (i.e topmost coordinate of a html page is 0) canvas.height - this.height gives the y-coordinate for the to player to be at the middle of the y axis. - 20 moves the player further down to the bottom. 
			};
		};
	}

	draw() { //draw method, a html canvas method
		c.save(); //c.save and c.restore are canvas methods to save and restore the current state (e.g fillstyle, fillrect etc) of the canvas (i.e to save/restore the canvas after executing the code block for every frame) 
		c.globalAlpha = this.opacity; //sets the opacity of the drawing, references the constructor in the Player class 
		c.translate( //didn't have enough time to understand this method fully but translate essentially acts as origin logic to set the rotation logic in reference to the center of the player object. without this the origin of rotate will be the top left corner of the canvas (i.e the entire canvas rotates)  
			player.position.x + player.width / 2, //coordinates for the center of the player 
			player.position.y + player.height / 2
		);
		c.rotate(this.rotation); //rotates the player based on this.rotation specified in the player class
		c.translate( //resets the origin of the rotation back to the top left position, to ensure that the drawImage below takes the default canvas origin as reference, instead of the center of the player
			-player.position.x - player.width / 2,
			-player.position.y - player.height / 2
		);
		c.drawImage( //canvas method for drawing the image onto the canvas, using this. values specified in the Player class
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
		c.restore(); //restores the context to the previous state, undoing any transformations made since the previous c.save call (e.g undoing the rotation)
	}

	update() { //this method gets called at every frame of the animate loop (will be shown below)
		{
			if (this.image) { //this line ensures that the player image has been loaded before executing the draw function above
				this.draw();
				this.position.x += this.movement.x; //updates the position of the player object after accounting for any movement (seen below)
			}
		}
	}
}

class Invader { //class for each Invader. Individual invaders are pushed in to a Grid array, this logic is for each singular invader, grid logic can be found below 
	constructor({ position }) {
		this.movement = { //similar to Player class, this.movement acts as the movement logic for each invader 
			x: 0,
			y: 0,
		};
		const image = new Image(); //explained above, instantiates a new html image 
		image.src = "./img/invader.png";
		image.onload = () => { //similar code to the Player Class
			const scale = 0.06;
			this.width = image.width * scale;
			this.height = image.height * scale;
			this.image = image;
			this.position = { // this.position is referenced from the position parameter included in the constructor. This is done because invaders have many different starting positions that are dependent on the Grid class when they are animated
				x: position.x,
				y: position.y,
			};
		};
	}

	draw() { //same as Player class, references this. parameters to draw the Invader 
		c.drawImage(
			this.image,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
	}

	update({ movement }) { // the movement parameter stated here is passed through as the movement of the grid, you'll see this later in line 373. this is to ensure that the invaders move based on the grid objects 
		if (this.image) {  //same as above, checks if image is loaded before drawing the image, position is dependent on the movement parameter specified in the Grid class
			this.draw();
			this.position.x += movement.x;
			this.position.y += movement.y;
		}
	}

	shoot(invaderProjectiles) {  //the shoot function takes the invaderProjectiles parameter, which is an array of projectiles
		invaderProjectiles.push(
			new InvaderProjectile({ //pushes a new projectile in to the array. the array is defined below. The parameter of this class is an object which contains both the position and movement keys. InvaderProjectile class can be found below. 
				position: { //indicates where to spawn the projectile, which is in the middle of the invader. 
					x: this.position.x + this.width / 2, 
					y: this.position.y + this.height,
				},
				movement: {
					x: 0,
					y: 5, //this is the speed of the projectile for each frame
				},
			})
		);
	}
}

class Grid { //class for each Grid 
	constructor() {
		this.position = {//starting position for the grid i.e top left hand corner of the page 
			x: 0,
			y: 0,
		};
		this.movement = { //this is the speed of the entire grid (it moves 3 pixels per frame)
			x: 3,
			y: 0,
		};
		this.invaders = []; //empty invader array to push in new invaders
// these two codes indicate the number of columns and rows to spawn 
		const columnNum = Math.floor(Math.random() * 9 + 5); //a random integer, minimum is 5 
		const rowNum = Math.floor(Math.random() * 4 + 3); // a random integer but the minimum is 3

		this.width = columnNum * 40; //to make the width of the grid = to the number of columns in pixels 
    //40 is chosen simply because it is the default value that ensures the the grid doesn't go off the screen

// loops through the column and row to push a new invader into the grid 
		for (let i = 0; i < columnNum; i++) { 
			for (let j = 0; j < rowNum; j++) {
				this.invaders.push(
					new Invader({
						position: { //position is the argument that the Invader class accepts. Value is the number of columns/rows multiplied by the pixels 
							x: i * 40, 
							y: j * 40,
						},
					})
				);
			}
		}
	}

	update() { //updates the grid for every frame
		this.position.x += this.movement.x;
		this.position.y += this.movement.y;
		this.movement.y = 0; //resets the position of the grid back to 0, which is the spawn point for each grid 
		if (this.position.x + this.width >= canvas.width || this.position.x <= 0) { //collision detection code for the invader grids, it will reverse the movement on the x-axis and move the entire grid by one pixel on the y-axis whenever the grid reaches the edge of the canvas 
			this.movement.x = -this.movement.x;
			this.movement.y = 40;
		}
	}
}

class Projectile { //class for player's projectiles 
	constructor({ position, movement }) { //uses position and movement within a single object as parameters, defined in the animation loop 
		this.position = position;
		this.movement = movement;
		this.radius = 4; //radius of the projectile, to draw using c.arc later
	}
	draw() {
		c.beginPath(); //indicates the starting point of the drawing commands. creates a new path everytime draw is called, to ensure that each drawing is a seperate shape 
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); //center point of the circle, radius of the circle, 0 and math.pi is to ensure that it is a full circle 
		c.fillStyle = "white";
		c.fill(); //fills the current path as the value indicated in fillstyle 
		c.closePath(); //ends the current path, so that the next timee the draw function is ran it is a new path 
	}

	update() { //same as above, runs every frame 
		this.draw();
		this.position.x += this.movement.x;
		this.position.y += this.movement.y;
	}
}

class InvaderProjectile {  //mostly similar to invader's projectiles, but instead of circular they are rectangular
	constructor({ position, movement }) {
		this.position = position;
		this.movement = movement;
    //dimensions of the projectile
		this.width = 3;
		this.height = 10;
	}
	draw() {
		c.fillStyle = "red";
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update() {
		this.draw();
		this.position.x += this.movement.x;
		this.position.y += this.movement.y;
	}
}

class Particle { //class for the particles that spawn when player or invader is hit. also used for the "stars" in the background to act as a scrolling background
	constructor({ position, movement, radius, color, fades }) { 
    //constructor parameters for each value because same class is used for 3 different things 
		this.position = position;
		this.movement = movement;
		this.radius = radius;
		this.color = color;
		this.opacity = 1;
		this.fades = fades; //indicates whether the particle should fade or not 
	}
	draw() { //similar draw method 
		c.save();
		c.globalAlpha = this.opacity; //takes the this.opacity value for the alpha value of the drawing  
		c.beginPath();
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		c.fillStyle = this.color;
		c.fill();
		c.closePath();
		c.restore();
	}

	update() { 
		this.draw();
		this.position.x += this.movement.x;
		this.position.y += this.movement.y;

		if (this.fades) { //if the particle is supposed to fade (i.e this.fades = true) opacity will be reduced for each frame. 
			this.opacity -= 0.01;
		}
	}
}

//Part 2: Defining classes, arrays and other general housekeeping 

let player = new Player(); //creates a new player

//Creating new arrays for the animate loop to work on 
let projectiles = []; //
let grids = [];
let invaderProjectiles = [];
const particles = [];
//keys variable for event listeners to use later 
const keys = {
	arrowLeft: {
		isDown: false,
	},
	arrowRight: {
		isDown: false,
	},
	space: {
		isDown: false,
	},
};

let score = 0; //starts at zero, every kill will +100 to score, which is reflected on the html using queryselector.innerhtml
let frames = 0; //defines start of game at 0 frames, with every animate loop will ++ to frames
let randomInterval = Math.floor(Math.random() * 500 + 500); 
//randomized interval for spawning grids, this variable is called in the animate loop. I put it outside here just to make it easier to adjust the spawn rate 
let game = {  //default game state, refered to in animation loop during collision detection 
	over: false,
	active: true,
};

// creates star particles in the background
for (let i = 0; i < 100; i++) {
	particles.push(
		new Particle({
			position: {
				x: Math.random() * canvas.width, //random position on x axis
				y: Math.random() * canvas.height,//random position on y axis
			},
			movement: {
				x: 0,
				y: 0.5, //since it is supposed to act like a scrolling background, only moves on the y axis
			},
			radius: Math.random() * 3, //Math.random() = 1 
			color: "white",
		})
	);
}

//function for animate loop to call to create particles during collision detection. 
let createParticles = ({ object, color, fades }) => {
	for (let i = 0; i < 15; i++) { //will spawn only 15 particles
		particles.push(
			new Particle({
				position: {
          //middle of the object(player or invader)
					x: object.position.x + object.width / 2, 
					y: object.position.y + object.height / 2,
				},
				movement: {
          //to create an explosion effect, each particle will have a random x and y value 
					x: (Math.random() - 0.5) * 2,
					y: (Math.random() - 0.5) * 2,
				},
				radius: Math.random() * 3,
				color: color || "red", //default of red for the invader particles 
				fades: true, //for the animation loop to read the fade 
			})
		);
	}
};

// Part 2.1 : Event Listeners (Keydown and Keyup)
window.addEventListener("keydown", ({ key }) => {
	if (game.over) return; //if gameover = true, will kill the function, not allowing anymore inputs 
	switch (key) { //using switch case instead of if else 
    //sets the keys object as true, so that it can be referenced in the animate loop 
		case "ArrowLeft":
			keys.arrowLeft.isDown = true;
			break;
		case "ArrowRight":
			keys.arrowRight.isDown = true; 
			break;
		case " ": //spacebar case will push a new projectile object at the player's position into the the projectiles array
		setTimeout(() =>  { 
      projectiles.push(
      new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y, // this is the front of the player 
        },
        movement: {
          x: 0,
          y: -10, //to move up 
        },
      })
    )}, 100)	
    
			break;
	}
});
//added a keyup listener to stop the movement of the player 
window.addEventListener("keyup", ({ key }) => {
	switch (key) {
		case "ArrowLeft":
			keys.arrowLeft.isDown = false;
			break;
		case "ArrowRight":
			keys.arrowRight.isDown = false;
			break;
	}
});

//Part 3: Animate Loop 
function animate() {
	if (!game.active) return; // ends the animation loop if game.active is false 
	requestAnimationFrame(animate); //canvas method that requests the next frame to call the animate function on 
  //setting the canvas background to a black fill rect 
	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
  //updates the player's position and rotation, as referenced in the class 
	player.update();
 
	particles.forEach((particle, i) => {
    //this is for the background particles, this checks if the middle of the background particles have left the screen, then resets the position back to a random position on the canvas
		if (particle.position.y - particle.radius >= canvas.height) {
			particle.position.x = Math.random() * canvas.width;
			particle.position.y = -particle.radius;
		}
     //Garbage Collection: checks if particles have faded away and splices it out of the array,
		if (particle.opacity <= 0) {
			setTimeout(() => {
				particles.splice(i, 1);
			}, 0);
		} else {
			particle.update();
		}
	});

  //Garbage collection : checks if player's projectiles have left the screen
	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius <= 0) {
			setTimeout(() => {
				projectiles.splice(index, 1);
			}, 0);
		} else {
			projectile.update();
		}
	});

  //Garbage collection : checks if invader projectiles have left the screen
	invaderProjectiles.forEach((invaderProjectile, index) => {
		if (
			invaderProjectile.position.y + invaderProjectile.height >=
			canvas.height
		) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1);
			}, 0);
		} else invaderProjectile.update(); //continues spawning projectiles

    //collision detection code for invader projectiles to the player 

		if (
			invaderProjectile.position.y + invaderProjectile.height >=
				player.position.y &&
			invaderProjectile.position.x + invaderProjectile.width >=
				player.position.x &&
			invaderProjectile.position.x <= player.position.x + player.width
		) {
      //minuses one life from player object and splices that projectile out of the array of projectiles 
      player.lives--;
      invaderProjectiles.splice(index, 1)
      livesEl.innerHTML = player.lives
    }

    //logic to check for game over condition 

      if (player.lives <= 0) {
        game.over = true;
			console.log("you lose");
			setTimeout(() => { //splices the projectile out of the array and fades the player to 0 
				invaderProjectiles.splice(index, 1);
				(player.opacity = 0)
			}, 0);
      //creates an explosion like effect 
			createParticles({
				object: player,
				color: "grey",
				fades: true,
			});
      //sets the game condition to false 
			setTimeout(() => {
				game.active = false;
        restartButton.style.visibility = "visible"
			}, 2000);
      
    }
		
	});

  //animation for the grid 

	grids.forEach((grid) => {
		grid.update();
		// spawns projectiles at every 100th frame at a random invader position
		if (frames % 100 === 0 && grid.invaders.length > 0) {
			grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
				invaderProjectiles
			);
		}
		grid.invaders.forEach((invader, vadeindex) => {
			invader.update({ movement: grid.movement }); //updates the position of invader based on the grid's movement 

			//logic for player projectiles hitting the invaders 
			projectiles.forEach((projectile, pindex) => {
				if (
					projectile.position.y - projectile.radius <=
						invader.position.y + invader.height &&
					projectile.position.x + projectile.radius >= invader.position.x &&
					projectile.position.x - projectile.radius <=
						invader.position.x + invader.width &&
					projectile.position.y + projectile.radius >= invader.position.y
				) {
          //logic for finding the invader and projectile that collided 
					setTimeout(() => {
						const invaderFound = grid.invaders.find(
							(invader2) => invader2 === invader //invader2 is a parameter that represents the grid.invaders array. this logic is checking for whether the "invader2" is equals to the invader that was hit (as per the conditional)
						)

						const projectileFound = projectiles.find(
							(projectile2) => projectile2 === projectile //similar to above
						);

						// removes invader and projectile
						if (invaderFound && projectileFound) {
							score += 100;
							scoreEl.innerHTML = score;
							createParticles({ //explosion on-hit 
								object: invader,
								fades: true,
							});
              //removes the invader and the projectile from the game 
							grid.invaders.splice(vadeindex, 1);
							projectiles.splice(pindex, 1);
						}
					}, 0);
				}
			});
		});
	});

  //movement logic for player 
	if (keys.arrowLeft.isDown && player.position.x >= 0) {
		player.movement.x = -5;
		player.rotation = -0.15;
	} else if (
		keys.arrowRight.isDown &&
		player.position.x + player.width <= canvas.width
	) {
		player.movement.x = 5;
		player.rotation = 0.15;
	} else {
		player.movement.x = 0;
		player.rotation = 0;
	}
	//spawns a new grid of enemies at random intervals, referenced previously
	if (frames % randomInterval === 0) {
		grids.push(new Grid());
	}

	frames++;
}


animate();


//Part 4: Restart Function 
function restart() {
  // Resets all  game variables
  if (game.active == false && game.over == true) {
  game.active = true;
  game.over = false;
  player.lives = 3;
  score = 0;
  scoreEl.innerHTML = score;
  livesEl.innerHTML = player.lives;
  restartButton.style.visibility = "hidden"



  // Remove all existing invaders and projectiles
  grids = [];
  projectiles = [];
  invaderProjectiles = [];
  player = new Player()

  // Start the game loop again
  animate();
}
}


