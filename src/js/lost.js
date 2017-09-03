var sub = new v2d(0,0) 
var speed = new v2d(3,2)
var SPEED = 0
var accInput = new v2d(0,0)

var c = new v2d(100,100)
SUB_LENGTH= 128
SUB_HEIHGT = 64
LEVEL_WIDTH = 0
SCREEN_WIDTH = 20;
SCREEN_HEIGHT = 20;

//sub carac
isShutdown = false
harpoon = 1
arming = 0
chaarge = 0
isDead = false
fade=0
var bubbles = []
var i,j;
var level= {};
screenCenter=null
boss = {
    p : new v2d(0,0),
    seq : 0,
    hp : 10
}



var acc = new v2d(0,0)
function step(delta) {
  
    if(isDead) {
        fade++;
    }
    
    accInput = acc.setVector(m).sub(screenCenter)
    
    if(accInput.norm() < 100) {
        speed.scale(0.9)
        if(speed.norm() < 1) {
            speed.setPoint(0,0)
        }
    } else {
        acc.setVector(accInput).normalize()
        speed.add(acc.scale(0.3))
    }
    c.x = sub.x
    c.y = sub.y
    liveHostile()
    if(isShutdown) {
        speed.setPoint(0,1.1)
    }
    liveProjectile()
    weaponCicle()
    speed.maxLength(SPEED==0?2:7)
    
    testTrigger()
    
    //bubbles
    liveBubble(acc.x > 0)
    
    render()
    
    if(COLLIDE) collide()
    drawWeapon()
    showDialog()
    drawUI()
    
}

window.onmousedown = function() {
    arming = true
}
window.onmouseup = function() {
    arming = false
    if(chaarge>100) {
        fire()
    }
}

function weaponCicle() {
    if(arming) {
        chaarge+=delta
    }
}

arrows = []
arrow = null
freeArrow = null
var arpoonO = new v2d(0,0)
var arpoonDelta = new v2d(60,64)
var visor = new v2d(0,0)
function fire() {
    if(chaarge < 300) {
        chaarge=0;return
    }
    freeArrow = false
    visor.setVector(m)
    visor.sub(screenCenter)

        
    for(i=0; i<arrows.length;i++) {
        if(!arrows[i].isAlive) {
            arrows[i].setVector(sub).add(arpoonDelta)
            arrows[i].dir = visor.clone()
            arrows[i].isAlive=true
            freeArrow = true
        } 
    }
   
    if(freeArrow === false) {
        arrow = new v2d(0,0)
        arrow.setVector(sub).add(arpoonDelta)
        arrow.isAlive=true
        arrow.dir = visor.clone()
        arrows.push(arrow) 
    }       
    chaarge = 0
}

function liveProjectile() {
    for(i=0;i < arrows.length;i++) {
        if(arrows[i].isAlive)
            arrows[i].add(arrows[i].dir.normalize().scale(8))
    }
}

function liveHostile() {

}

function drawHostile() {
    drawAbSprite(boss.p,3)

}

function drawWeapon() {
    for(i=0;i < arrows.length;i++) {
        if(arrows[i].isAlive) {
            ctx.beginPath()
            ctx.arc(arrows[i].x-c.x+screen.width/2,arrows[i].y-c.y+screen.height/2,3,0,2*Math.PI)
            ctx.fillStyle="#444"
            ctx.fill()
        }
    }

    
    if(arming) {
        arpoonO.setVector(sub).add(arpoonDelta)
        ctx.beginPath()
        ctx.moveTo(arpoonO.x-c.x+screen.width/2, arpoonO.y-c.y+screen.height/2)
        var visorOO = new v2d(m.x,m.y)
        visorOO.sub(new v2d(2,32))
        visorOO.sub(screenCenter)
        visorOO.normalize()
        ///visorOO.sub(arpoonO)


        for(i=1; i < Math.min(chaarge/200,4);i++) {
            visorOO.normalize().scale(100*i)
            drawAbSprite(visorOO.clone().add(new v2d(screen.width/2+60,screen.height/2+60)),2)
        }
        drawAbSprite(m,3)
        //visorOO.add(screenCenter)
        //visorOO.scale(30)

    } else {
        drawAbSprite(m,4)
    }
}

c=''
function drawUI() {
    ctx.beginPath()
    ctx.strokeStyle = "#fff"
    ctx.arc(sub.x-c.x+screen.width/2+SUB_LENGTH/2,sub.y-c.y+screen.height/2+SUB_HEIHGT/2, 72, 0, Math.PI*2)
    ctx.closePath()
    ctx.stroke()
    if(isShutdown) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(0,0,screen.width,screen.height)
    }
    if(isDead) {
        ctx.fillStyle = `rgba(0, 0, 0, ${fade/50}`
        ctx.fillRect(0,0,screen.width,screen.height)
         ctx.fillStyle="#fff"
        ctx.textAlign='center'
        ctx.font = '30px Arial'
        ctx.fillText('All is lost', screen.width/2,screen.height/2,500)
    }
    c=''
    for(i=0;i<10;i++) {
        c+= boss.hp>i?' ▮': ' ▯'
    }


    
    ui.innerHTML = `+speed : ${SPEED==0?'Slow':'Fast'}<br>harpoon ${harpoon ? 'armed' : 'error'}<br>${chaarge<200?'▯ ▯ ▯':chaarge>400&&chaarge<600?'▮ ▮ ▯':chaarge>600?'▮ ▮ ▮': '▮ ▯ ▯'}<div id="boss">${c}</div>`
}


function render() {
    drawBack()
    drawLevel()
    drawPlayer()
    drawBubble()
    drawHostile()
}

function drawBack() {
    var grd=ctx.createLinearGradient(0,0,0,screen.height);
    grd.addColorStop(0,"#3cb9fe");
    grd.addColorStop(1,"#3b4158");
    ctx.fillStyle = grd
    ctx.fillRect(0,0,10000,100000)
}

function drawPlayer() {
    if(DEBUG) {
        ctx.rect(sub.x-c.x+screen.width/2,sub.y-c.y+screen.height/2,SUB_LENGTH,SUB_HEIHGT)
        ctx.strokeStyle = "#edff00"
        ctx.stroke()
    }
    drawSprite(sub, 0, acc.x > 0)
}


function drawBubble() {
    ctx.strokeStyle = "#ffffff"
    
    for(var i = 0;i < bubbles.length; i ++) {
        if(bubbles[i].size > 0)  {
            ctx.beginPath()
            ctx.arc(bubbles[i].pos.x-c.x+screen.width/2, bubbles[i].pos.y-c.y+screen.height/2, bubbles[i].size/10, 0, Math.PI*2)
            ctx.closePath()
            ctx.stroke()
        }
    }
}
function liveBubble(rev) {
    for(var i = 0; i < bubbles.length; i ++) {
        var b = bubbles[i]
        if(b.size < 0) {
            if(b.save) 
                b.pos.setVector(b.save)
            else 
                b.pos = sub.clone().add(new v2d(Math.random()*5+(rev ? 0 : SUB_LENGTH), Math.random()*5+20))
            b.size = 70
        } else {
            if(b.save) 
                b.pos.add(new v2d(b.dir==2?2:-2,0))
            else 
                bubbles[i].pos.add(new v2d(Math.cos(time+b.pos.y), -1.5))
            b.size-- 
        }
    }
}



function gamo() {
    for(i=0;i<40;i++) {
        bubbles.push({pos : new v2d(sub.x-SUB_LENGTH+Math.random()*SUB_LENGTH*2, sub.y-SUB_HEIHGT+Math.random()*SUB_HEIHGT*2), size : 10*i % 70})    
    }
    isDead=true
    
}
sprt = [
    0,0,64,32,//sub
    64,128,32,32,//harp
    128,0,3,3,//dot
    131,0,7,7,//cross
    139,0,6,9   
]

function drawSprite(p, img, rev) {
    ctx["imageSmoothingEnabled"] = false
    ctx.drawImage(sprite, sprt[img*4]+rev?sprt[img*4+2]:0, sprt[img*4+1], sprt[img*4+2], sprt[img*4+3], p.x-c.x+screen.width/2, p.y-c.y+screen.height/2, sprt[img*4+2]*2, sprt[img*4+3]*2)
   // ctx["imageSmoothingEnabled"] = true
}

function drawAbSprite(p, img) {
    ctx.drawImage(sprite, sprt[img*4], sprt[img*4+1], sprt[img*4+2], sprt[img*4+3], p.x, p.y, sprt[img*4+2]*2, sprt[img*4+3]*2)

}

var tile = 0
var tp = new v2d(0,0)
//<3
var isC = true
var futureSub = new v2d(0,0)
var nextColumn = new v2d(0,0)
var nextLine = new v2d(0,0)
var corners = {ne : new v2d(0,0),nw : new v2d(0,0),se : new v2d(0,0),sw : new v2d(0,0)}
var closePos = new v2d(0,0)
var futureDelta = new v2d(0,0)
var moveOk = new v2d(0,0)
function collide() {
    isC = false
    if(speed.norm() <= 0 || isDead) return;
    corners.ne.setPoint(sub.x+SUB_LENGTH, sub.y)
    corners.nw.setPoint(sub.x, sub.y)
    corners.se.setPoint(sub.x+SUB_LENGTH, sub.y+SUB_HEIHGT)
    corners.sw.setPoint(sub.x, sub.y+SUB_HEIHGT)
    
    
    for(i = 0; i < 4;i++ ){
        var corner = corners[Object.keys(corners)[i]]
        
        moveOk.setPoint(0,0)
        for(j=0;j<speed.norm();j++) {
            closePos.setVector(speed).normalize().scale(j)
            futureDelta = closePos.clone()
            closePos.add(corner)
            var tile = level.tiles[Math.floor((closePos.x)/64) + Math.floor((closePos.y)/64)*LEVEL_WIDTH]
            if(tile==81) {
                gamo();return;
            }

            if(tile !== 0) { 
                ctx.strokeStyle = "#CD3378"
            } else {
                ctx.strokeStyle = "#00FF00"
            }
            if(DEBUG) {
                ctx.beginPath()
                ctx.rect(Math.floor((closePos.x)/64) * 64-c.x+screen.width/2, Math.floor((closePos.y)/64)*64-c.y+screen.height/2, 64,64)
                ctx.stroke()
            } 
            if(tile!==0) {
                isC = true
                break
            }
        }
       
        
        ctx.strokeStyle = "#771111"
        if(!isC) {
            ctx.strokeStyle = "#007700"

        }
        if(DEBUG) {
            ctx.beginPath()
            ctx.moveTo(corner.x-c.x+screen.width/2, corner.y-c.y+screen.height/2)
            ctx.lineTo(corner.x+speed.x*1000, corner.y + speed.y*1000)
            ctx.stroke()
        }

            
        if(isC) {
            break
        }
        moveOk.setVector(futureDelta)
    }
    sub.add(moveOk)
}

var dialog;
function showDialog() {
    if(level.layers[2]) {
        for(i = 0; i < level.layers[2].objects.length; i ++) {
            dialog = level.layers[2].objects[i]
            if(sub.x > dialog.x*2 && sub.x < dialog.x*2 + dialog.width*2 && sub.y > dialog.y*2 && sub.y < dialog.y*2 + dialog.height*2) {
                dialogd.innerHTML = dialog.properties.ct
            }
        }
    }
}

var trigger;
function testTrigger() {
    if(level.layers[3]) {
         for(i = 0; i < level.layers[3].objects.length; i ++) {
            trigger = level.layers[3].objects[i]
            if(sub.x > trigger.x*2 && sub.x < trigger.x*2 + trigger.width*2 && sub.y > trigger.y*2 && sub.y < trigger.y*2 + trigger.height*2) {
                if(trigger.type === 'shutdown') {
                    isShutdown = true
                } 
                if(trigger.type === 'start') {
                    isShutdown = false
                }
                if(trigger.type === 'powup') {
                    if(trigger.properties.i === 1) {
                        harpoon = 1
                        dialog.innerHTML = 'Harpoon aquiererd'
                    } 
                }
                if(trigger.type === 'stream') {
                    if(trigger.properties.dir === 1) {
                        speed.sub(new v2d(30,10))
                    }
                }
            }
        }
    }
}


function initLevel(levelNumber) {
    screenCenter = new v2d(screen.width/2,screen.height/2).add(new v2d(SUB_LENGTH/2,SUB_HEIHGT/2))
    homeD.style.display = 'none'
    levelsD.style.display = 'none'
    cancelAnimationFrame(frameHandler)
    LEVEL_WIDTH = TileMaps[levelNumber].width
    LEVEL_HEIGHT= TileMaps[levelNumber].height
    sub.setPoint(311,100)
    level.tiles = TileMaps[levelNumber].layers[0].data
    level.layers = TileMaps[levelNumber].layers
    gameState = GAME_STATE_RUN
    
    for(i = 0; i < 10; i ++) {
        bubbles.push({pos : new v2d(0,0), size : 10*i % 70})
    }
    
    for(i = 0; i < TileMaps.level3.layers[3].objects.length; i ++) {    
        var obj = TileMaps.level3.layers[3].objects[i]
        if(obj.type === 'stream') {
            for(i = 0; i < 30; i ++) {
                var p = new v2d(2*obj.x+2*Math.random()*obj.width,2*obj.y+2*Math.random()*obj.height)
                bubbles.push({pos : p, save : p.clone(), size : 10*i % 70, dir : obj.properties.dir})
            }
        }
    }
    
    loop()
}

function drawPowUp() {
    for(i = 0; i < TileMaps.level3.layers[3].objects.length; i ++) {
        powup = TileMaps.level3.layers[3].objects[i]
        if(powup.type === 'powup') {
            if(powup.properties.i == 1) {   
                drawSprite(new v2d().setVector(powup).scale(2), 1) 
            }
        }
    }
} 

tilesT = []
tilesT[20] = [96, 32]
tilesT[81] = [0, 160]
function drawLevel() { 
    drawPowUp()
    for(i = 0; i < LEVEL_HEIGHT || i < SCREEN_HEIGHT; i++) {
        for(j = 0;j < LEVEL_WIDTH || j < SCREEN_WIDTH; j ++) {
        tile = level.tiles[i*LEVEL_WIDTH+j]

            if(tilesT[tile]) {
                ctx.drawImage(sprite, tilesT[tile][0], tilesT[tile][1], 32, 32, 64*j-c.x+screen.width/2, 64*i-c.y+screen.height/2, 64, 64)
            }
        }
    }
}


