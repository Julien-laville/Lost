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
    speed.maxLength(SPEED==0?2:7)
    
    
    
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
var isC = true
var futureSub = new v2d(0,0)
var nextColumn = new v2d(0,0)
var nextLine = new v2d(0,0)
var corners = {ne : new v2d(0,0)}
var closePos = new v2d(0,0)
function colide() {
    isC = false
    if(speed.stance <= 0) return;
    corners.ne.setPoint(sub.x+SUB_LENGTH, sub.y-SUB_HEIHGT)
    
    if(speed.x>0) { //right
        C = Math.ceil((corners.ne.x) / 32) * 32 
    } else { //left
        C = Math.floor((corners.ne.x) / 32) * 32 
    }
    
    if(speed.y>0) { //down
        L = Math.ceil((corners.ne.y) / 32) * 32
    } else { //top
        L = Math.floor((corners.ne.y) / 32) * 32
    }
    
    // a: director coefficient
    a = speed.y / speed.x //y = a * x
    
    //interesection with column
    
    
    ctx.beginPath()
    ctx.moveTo(C, 0)
    ctx.lineTo(C, 1300 )
    ctx.strokeStyle = "#ff0000"
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, L)
    ctx.lineTo(1300, L )
    ctx.strokeStyle = "#ff0000"
    ctx.stroke()

    
    ctx.beginPath()
    ctx.moveTo(corners.ne.x, corners.ne.y)
    ctx.lineTo(sub.x+SUB_LENGTH +speed.x*1000, sub.y-SUB_HEIHGT + speed.y*1000 )
    ctx.strokeStyle = "#FFFFFF"
    ctx.stroke()
    
    // Find intersection with column C
    nextColumn.setPoint(C,  a * (C - sub.x - SUB_LENGTH) + sub.y - SUB_HEIHGT)
    nextLine.setPoint((L-sub.y+SUB_HEIHGT) / (a) + sub.x+SUB_LENGTH, L)
    
    ctx.fillStyle = "#00FF00"

    if(nextColumn.stance(corners.ne) < nextLine.stance(corners.ne))  {
        closePos.setVector(nextColumn)
    } else {
        closePos.setVector(nextLine)
    }
    d = new v2d(speed.x>0?8:-8, speed.y>0?8:-8)
    closePos.add(d)
    var tile = level.tiles[Math.floor((closePos.x)/32) + Math.floor((closePos.y)/32)*LEVEL_WIDTH]
    if(tile !== 0) {
        ctx.strokeStyle = "#CD3378"
                           
    } else {
        ctx.strokeStyle = "#00FF00"
    }
    ctx.beginPath()
    ctx.rect(Math.floor((closePos.x)/32) * 32, Math.floor((closePos.y)/32)*32, 32,32)
    ctx.stroke()

    
    ctx.beginPath()
    ctx.arc(closePos.x,closePos.y, 2, 0, 7)
    ctx.fill()
    
    

  
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


