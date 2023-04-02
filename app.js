// $(() => {
// const $canvas = $("canvas") //sets canvas to a variable 
// const c = $canvas[0].getContext('2d') // sets context to a variable 

// let windowWidth = $(window).width() //sets window width to a variable
// let windowHeight = $(window).height() //sets window height to a variable

// $canvas.width(windowWidth) //sets canvas width to window width
// $canvas.height(windowHeight) //sets canvas height to window height

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
console.log(canvas)

class Player { //creates a class for the player
    constructor() {
        
        this.movement = {
            x : 0, 
            y : 0
        }
        const image = new Image()
        image.src = './img/pngegg.png'
        image.onload = () => {
            const scale = 0.05
            this.width = image.width * scale
            this.height = image.height * scale
            this.image = image
            this.position = {
                x: canvas.width/2 - this.width/2 ,
                y: canvas.height - this.height - 20,
            }
        }
        } 
        
    draw() {
        
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }  

    update() {{ 
        if(this.image) {
        this.draw()
        this.position.x += this.movement.x
    }}



}}




const player = new Player() //creates a new player
// player.draw()
const keys = {
    arrowLeft : {
        isDown: false,
    },
    arrowRight : {
        isDown: false,
    },
    space : {
        isDown: false,
    }

}
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()

    if (keys.arrowLeft.isDown && player.position.x >= 0) {
        player.movement.x = -5
    } else if (keys.arrowRight.isDown && player.position.x + player.width <= canvas.width) {
        player.movement.x = 5
    } else {
        player.movement.x = 0
    }
}
    
window.addEventListener('keydown', ({key}) => {
    switch (key) { 
        case 'ArrowLeft' :
            keys.arrowLeft.isDown = true
            // console.log("left")
            break
        case 'ArrowRight' :
            keys.arrowRight.isDown = true
            // console.log("right")
            break
        case ' ':
            // console.log("space")
            break

    }

})

window.addEventListener('keyup', ({key}) => {
    switch (key) { 
        case 'ArrowLeft' : 
            keys.arrowLeft.isDown = false
            // console.log("left")
            break
        case 'ArrowRight':
            keys.arrowRight.isDown = false
            // console.log("right")
            break
        case ' ':
            console.log("space")
            break

    }

})



animate()




