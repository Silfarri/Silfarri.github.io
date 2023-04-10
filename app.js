// // $(() => {
// // const $canvas = $("canvas") //sets canvas to a variable 
// // const c = $canvas[0].getContext('2d') // sets context to a variable 

// // let windowWidth = $(window).width() //sets window width to a variable
// // let windowHeight = $(window).height() //sets window height to a variable

// // $canvas.width(windowWidth) //sets canvas width to window width
// // $canvas.height(windowHeight) //sets canvas height to window height
const scoreEl = document.querySelector('#scoreElement')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 768
console.log(canvas)

class Player { //creates a class for the player
    constructor() {
        
        this.movement = {
            x : 0, 
            y : 0
        }
        this.rotation = 0
        this.opacity = 1
        const image = new Image()
        image.src = './img/spaceship.png'
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
        c.save()
        c.globalAlpha = this.opacity
        c.translate(player.position.x + player.width/2, player. position.y + player.height/2)
        c.rotate(this.rotation)
        c.translate(-player.position.x - player.width/2, - player. position.y - player.height/2)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }  


    update() {{ 
        if(this.image) {
        this.draw()
        this.position.x += this.movement.x
    }}



}}


class Invader { //creates a class for the player
  constructor({ position }) {
      
      this.movement = {
          x : 0, 
          y : 0
      }
      this.rotation = 0
      const image = new Image()
      image.src = './img/invader.png'
      image.onload = () => {
          const scale = 0.06
          this.width = image.width * scale
          this.height = image.height * scale
          this.image = image
          this.position = {
              x: position.x ,
              y: position.y ,
          }
      }
      } 
      
  draw() {
      
      c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
  }  


  update({movement}) {
      if(this.image) {
      this.draw()
      this.position.x += movement.x
      this.position.y += movement.y
  }}

  shoot(invaderProjectiles) {
    invaderProjectiles.push(new InvaderProjectile({
      position : {
        x: this.position.x + this.width/2,
        y: this.position.y + this.height
      },
      movement: {
        x: 0,
        y: 5
      }
    })
    )
  }




}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }
     this.movement = {
      x: 3,
      y: 0
     }
     this.invaders = []
     const columnNum = Math.floor(Math.random()*10 +5)
     const rowNum = Math.floor(Math.random()*5 +2)

     this.width = columnNum * 40
     for (let i = 0; i< columnNum; i++) {
      for (let j = 0; j< rowNum; j++) {
        this.invaders.push(
          new Invader({
            position : {
            x: i * 40,
            y: j * 40
          }
        })
        )
     }
    }
     console.log(this.invaders)
  }

  update() {
    this.position.x += this.movement.x
    this.position.y += this.movement.y
    this.movement.y = 0
    if(this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.movement.x = -this.movement.x
      this.movement.y = 40

    }
  }

}



class Projectile {
  constructor({position, movement}) {
    this.position = position
    this.movement = movement
    this.radius = 4
  }
  draw () { 
    c.beginPath()
    c.arc(this.position.x,this.position.y, this.radius, 0, Math.PI *  2)
    c.fillStyle = "white"
    c.fill()
    c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.movement.x 
    this.position.y += this.movement.y 

  }
}

class InvaderProjectile {
  constructor({position, movement}) {
    this.position = position
    this.movement = movement
    this.width = 3
    this.height = 10
  }
  draw () { 
  c.fillStyle="red"
  c.fillRect(this.position.x,this.position.y,this.width,this.height)
  }

  update() {
    this.draw()
    this.position.x += this.movement.x 
    this.position.y += this.movement.y 

  }
}

class Particle {
  constructor({position, movement, radius, color, fades}) {
    this.position = position
    this.movement = movement
    this.radius = radius
    this.color = color
    this.opacity = 1
    this.fades = fades
  }
  draw () { 
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x,this.position.y, this.radius, 0, Math.PI *  2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()
    this.position.x += this.movement.x 
    this.position.y += this.movement.y 

    if(this.fades) {
    this.opacity -= 0.01
    }

  }
}





const player = new Player() //creates a new player
const projectiles = []
const grids = []
const invaderProjectiles=[]
const particles = []
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

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
  over: false,
  active: true
}

for (let i =0; i < 100; i++) {
  particles.push(
    new Particle({
    position: {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    }, 
    movement : {
      x: 0, 
      y: 0.5
    },
    radius: Math.random() * 3,
    color : "white"
  }))
}

// creates particles in the background
let createParticles = ({object, color, fades}) => {
  for (let i =0; i < 15; i++) {
    particles.push(
      new Particle({
      position: {
        x: object.position.x + object.width/2,
        y: object.position.y + object.height/2
      }, 
      movement : {
        x: (Math.random() - 0.5)*2, 
        y: (Math.random() - 0.5)*2
      },
      radius: Math.random() * 3,
      color : color || "red",
      fades : true
    }))
  }
}

let score = 0

function animate() {
  if(!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    particles.forEach ((particle,i) => {
      if(particle.position.y - particle.radius >= canvas.height) {
        particle.position.x = Math.random() * canvas.width
        particle.position.y = - particle.radius
      }
      if (particle.opacity <= 0) {
        setTimeout(()=> {
          particles.splice(i,1)
        }, 0)
      } else {
      particle.update()
    }})
    invaderProjectiles.forEach ((invaderProjectile,index) => {

      if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
        setTimeout(()=> {
          invaderProjectiles.splice(index,1)



        }, 0)

   
      } else 
      invaderProjectile.update()

      if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y && invaderProjectile.position.x + invaderProjectile.width >= player.position.x && invaderProjectile.position.x <= player.position.x + player.width ) 
      {
        console.log("you lose")
        setTimeout(() => {
          invaderProjectiles.splice(index,1)
          player.opacity = 0,
          game.over= true
      }, 0)
        createParticles({
          object:player,
          color: "grey",
          fades : true
        })
        setTimeout(()=> {
          game.active = false
          }, 2000)
            

      }
    })

    projectiles.forEach((projectile,index) => {
      if (projectile.position.y + projectile.radius <= 0) {
        setTimeout(() => {
        projectiles.splice(index, 1)},0)
        } else {
      projectile.update() }
    })

    grids.forEach((grid, gridIndex) => {
      grid.update()
      // spawns projectiles
    if (frames % 100 === 0 && grid.invaders.length>0) {
      grid.invaders[Math.floor(Math.random()* grid.invaders.length)].shoot(
        invaderProjectiles)
    }
    grid.invaders.forEach((invader, vadeindex) => {
        invader.update({movement: grid.movement})
//projectile hitting enemey
        projectiles.forEach((projectile, pindex) => {
          if (
            projectile.position.y - projectile.radius <= invader.position.y + invader.height && projectile.position.x + projectile.radius >= invader.position.x && projectile.position.x - projectile.radius <= invader.position.x + invader.width && projectile.position.y + projectile.radius >= invader.position.y
            ) {

            setTimeout(() => {
              const invaderFound = grid.invaders.find(
                (invader2) => invader2 === invader
                ) 
              
              const projectileFound = projectiles.find(
                (projectile2) => projectile2 === projectile
                )
                
              
// removes invader and projectile
              if (invaderFound && projectileFound) {
                score += 100
                scoreEl.innerHTML = score
                createParticles({
                  object:invader,
                  fades : true
                })
              grid.invaders.splice(vadeindex,1)
              projectiles.splice(pindex,1)

              // if(grid.invaders.length>0) {
              //   const firstInvader = grid.invaders[0]
              //   const lastInvader = grid.invaders[grid.invaders.length-1]

              //   grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width

              //   grid.position.x = firstInvader.position

              // } else {
              //   grids.splice(gridIndex,1)
              // }
          }
        }, 0)

          }
        })
      })
    })

    if (keys.arrowLeft.isDown && player.position.x >= 0) {
        player.movement.x = -5
        player.rotation = -0.15
    } else if (keys.arrowRight.isDown && player.position.x + player.width <= canvas.width) {
        player.movement.x = 5
        player.rotation = 0.15
    } else {
        player.movement.x = 0
        player.rotation = 0
    }
//spawns enemies
    if(frames % randomInterval === 0){
      grids.push(new Grid())
      randomInterval = Math.floor(Math.random() * 500 + 500)
    }

    
    frames++
}
    
window.addEventListener('keydown', ({key}) => {
  if(game.over) return
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
          projectiles.push( new Projectile({
            position : { 
              x: player.position.x + player.width/2,
              y: player.position.y
            }, 
            movement : {
              x : 0, 
              y : -10
            }
            }
          ))
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



