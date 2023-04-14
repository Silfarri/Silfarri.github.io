# silfarri.github.io

Space Invaders! 
--
A spin on the classic game made in Javascript. 
This game was made with Javascript, HTML and a little bit of CSS. Animatons were made using HTML canvas methods. 

The Javascript code for this game has been split into 4 parts.

Part 1 : Set-Up 
--
The set-up part of the code involves querying for the various HTML elements. The major query in part 1 is the querying of the canvas. 
Without this, html canvas methods would not work. getContext was then used to get the 2D context for the drawing 2D objects. 
HTML elements such as the score, lives count and the restart buttons were also queried here. 
Lastly, the canvas was set to fixed dimensions, to ensure playability on different resolutions. 

Part 2: Classes
--
Classes were used to create the objects for the individual elements of the game: 
- Player 
- Invader 
- Grids 
- Player Projectiles 
- Invader Projectiles 
- Particle Effects 

Some key things of note would be that the grids of invaders were instantiated using the Invader class, and new grids of Invaders 
were spawned using a class for grids. 
Particle effects were also used to create both a kill effect and to create a scrolling background.

(detailed explanations can be found in the comments within app.js)

Part 3: Arrays and other general housekeeping 
--
Empty arrays were defined in this section, with arrays made for both player and invader projectiles, grids and particles.
A new player object is also instantiated here.
The score variable, frame variable and game state variables are also defined here. 
There are 2 more important things accomplished in this part of the code: particle logic and event listeners. 

Particle Logic: Involves logic for spawning in the background and spawning when player/invader get hit by a projectile.

Event Listeners: Functions for both keydown and keyup events in the browser. 

Part 4: Animate Loop 
-- 
The meat of the game, this is logic for what is drawn on the canvas at every frame of the game. 

A few things are accomplished in this loop: 
- Setting the background of the canvas as a black rectangle 
- Updating the player's and invader's positions
- Collision detection code for both invader projectiles and player projectiles 
- Checking and updating the game state 
- Grid animations
- Spawning of projectiles/invaders 
- Movement logic
- Garbage collection: clearing projectiles and dead invaders from the arrays

Part 5: Restart Function 
-- 
Technically, the restart function could have been written in part 3 but for the sake of continuity I put it in a section by itself.
Essentially resets the game state when you press the restart HTML button. 
Clears all arrays, scores and instantiates a new player.



