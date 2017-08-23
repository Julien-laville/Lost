var sub = new v2d(0,0) 
var speed = new v2d(3,2)
var SPEED = 0
var accInput = new v2d(0,0)
SUB_LENGTH= 32
SUB_HEIHGT = 16
LEVEL_WIDTH = 0
SCREEN_WIDTH = 20;
SCREEN_HEIGHT = 20
var bubbles = []
var i,j;
var level= {};
for(i = 0; i < 10; i ++) {
    bubbles.push({pos : new v2d(0,0), size : 10*i % 70})
}

var acc = new v2d(0,0)
function step(delta) {
    //mv
    accInput = acc.setVector(m).sub(sub)
    if(accInput.norm() < 50) {
        speed.scale(0.9)
        if(speed.norm() < 1) {
            speed.setPoint(0,0)
        }
    } else {
        acc.setVector(accInput).normalize()
        speed.add(acc.scale(0.3))
    }
    
    
    
    
    //bubbles
    liveBubble(acc.x > 0)
    
    //back  
    ctx.fillStyle = "#111200"
    ctx.fillRect(0,0,10000,100000)
    drawLevel()
    
    
    if(COLIDE) colide()
    
    

    drawSprite(sub, 'SUB', acc.x > 0)
    drawBubble()
    
    drawUI()
    
}


function drawUI() {

    ctx.beginPath()
    ctx.strokeStyle = "#fff"
    ctx.arc(sub.x,sub.y, 50, 0, Math.PI*2)
    ctx.closePath()
    ctx.stroke()
    ui.innerHTML = `+speed : ${SPEED==0?'Slow':'Fast'}<br>`
}


function drawBubble() {
    ctx.strokeStyle = "#ffffff"
    for(var i = 0;i < bubbles.length; i ++) {
        if(bubbles[i].size > 0)  {
            ctx.beginPath()
            ctx.arc(bubbles[i].pos.x, bubbles[i].pos.y, bubbles[i].size/10, 0, Math.PI*2)
            ctx.closePath()
            ctx.stroke()
        }
    }
}
function liveBubble(rev) {
    for(var i = 0; i < bubbles.length; i ++) {
        if(bubbles[i].size < 0) {
            bubbles[i].size = 70
            bubbles[i].pos = sub.clone().add(new v2d(Math.random()*5+(rev ? -32 : 32), Math.random()*5))
        } else{
            bubbles[i].pos.add(new v2d(Math.cos(time+bubbles[i].pos.y), -1.5))
            bubbles[i].size-- 
        }
    }
}


function drawSprite(p, img, rev) {
    //ctx["mozImageSmoothingEnabled"] = false;
    ctx["imageSmoothingEnabled"] = false;

    
    if(rev === true) {
        ctx.save()
        ctx.translate(sub.x, sub.y)
        ctx.scale(-1, 1);        
        ctx.translate(-sub.x, -sub.y)
    }
    ctx.drawImage(sprite, 0, 0, 32, 16, p.x-32, p.y-16, 64, 32)
    if(rev === true) {
        ctx.restore()
    }
}

var tile = 0
var tp = new v2d(0,0)
//<3
var isC
var futureSub = new v2d(0,0)
function colide() {
    isC = false
    futureSub.setVector(sub).add(speed.maxLength(SPEED==0?2:7))
    if(DEBUG) {
        ctx.beginPath()
        ctx.rect(sub.x-SUB_LENGTH,sub.y-SUB_HEIHGT, SUB_LENGTH*2, SUB_HEIHGT*2)
        ctx.strokeStyle = "#00ffff"
        ctx.stroke()
    }

    if(level.tiles[Math.floor((futureSub.x+SUB_LENGTH)/32) + Math.floor((futureSub.y+SUB_HEIHGT)/32)*LEVEL_WIDTH] != 0) {
        isC = true
    }
    if(level.tiles[Math.floor((futureSub.x+SUB_LENGTH)/32) + Math.floor((futureSub.y-SUB_HEIHGT)/32)*LEVEL_WIDTH] != 0) {
        isC = true
    }
    if(level.tiles[Math.floor((futureSub.x-SUB_LENGTH)/32) + Math.floor((futureSub.y+SUB_HEIHGT)/32)*LEVEL_WIDTH] != 0) {
        isC = true  
    } 
    if(level.tiles[Math.floor((futureSub.x-SUB_LENGTH)/32) + Math.floor((futureSub.y-SUB_HEIHGT)/32)*LEVEL_WIDTH] != 0) {
          isC = true  
    }
    if(!isC) {
        sub.setVector(futureSub)
    }
    
            
}

function initLevel(levelNumber) {
    cancelAnimationFrame(frameHandler)
    LEVEL_WIDTH = TileMaps[levelNumber].width
    LEVEL_HEIGHT= TileMaps[levelNumber].height
    sub.setPoint(311,100)
    level.tiles = TileMaps[levelNumber].layers[0].data
    gameState = GAME_STATE_RUN
    loop()
}

function drawLevel() {
    
    for(i = 0; i < LEVEL_HEIGHT || i < SCREEN_HEIGHT; i++) {
        for(j = 0;j < LEVEL_WIDTH || j < SCREEN_WIDTH; j ++) {
        tile = level.tiles[i*LEVEL_WIDTH+j]
            if(tile!=0) {
                ctx.drawImage(sprite, 48, 16, 16, 16, 32*j, 32*i, 32, 32)
            }
        }
    }
    
}


