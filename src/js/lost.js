var sub = new v2d(0,0) 
var speed = new v2d(3,2)
var SPEED = 0
var accInput = new v2d(0,0)
SUB_LENGTH= 64
SUB_HEIHGT = 32
LEVEL_WIDTH = 0
SCREEN_WIDTH = 20;
SCREEN_HEIGHT = 20;

//sub carac
isShutdown = false
harpoon = 0

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
    if(isShutdown) {
        speed.setPoint(0,1)
    }
    speed.maxLength(SPEED==0?2:7)
    
    testTrigger()
    
    //bubbles
    liveBubble(acc.x > 0)
    
    //back  
    ctx.fillStyle = "#111200"
    ctx.fillRect(0,0,10000,100000)
    drawLevel()
    
    
    if(COLIDE) colide()
    
    

    drawSprite(sub, 0, acc.x > 0)
    drawBubble()
    showDialog()
    drawUI()
    
}


function drawUI() {
    if(isShutdown) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
        ctx.fillRect(0,0,screen.width,screen.height)
    }

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
    for(var i = 0;i < bubble2.length; i ++) {
        if(bubble2[i].size > 0)  {
            ctx.beginPath()
            ctx.arc(bubble2[i].pos.x, bubble2[i].pos.y, bubble2[i].size/10, 0, Math.PI*2)
            ctx.closePath()
            ctx.stroke()
        }
    }
}
function liveBubble(rev) {
    for(var i = 0; i < bubbles.length; i ++) {
        if(bubbles[i].size < 0) {
            bubbles[i].size = 70
            bubbles[i].pos = sub.clone().add(new v2d(Math.random()*5+(rev ? -64 : 64), Math.random()*5))
        } else{
            bubbles[i].pos.add(new v2d(Math.cos(time+bubbles[i].pos.y), -1.5))
            bubbles[i].size-- 
        }
    }
    
    for(var i = 0; i < bubble2.length; i ++) {
        if(bubble2[i].size < 0) {
            bubble2[i].size = 70
            bubble2[i].pos.setVector(bubble2[i].save)
        } else{
            var dir = new v2d( bubble2[i].dir === 2 ?4 : -4,0)
            bubble2[i].pos.add(dir)
            bubble2[i].size-- 
        }
    }
}

sprt = [
    0,0,64,32,//sub
    64,128,32,32//harp
]

function drawSprite(p, img, rev) {
    ctx["imageSmoothingEnabled"] = false;
    if(rev === true) {
        ctx.save()
        ctx.translate(sub.x, sub.y)
        ctx.scale(-1, 1);        
        ctx.translate(-sub.x, -sub.y)
    }
    ctx.drawImage(sprite, sprt[img*4], sprt[img*4+1], sprt[img*4+2], sprt[img*4+3], p.x-32, p.y-16, sprt[img*4+2]*2, sprt[img*4+3]*2)
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
    d = new v2d(speed.x>0?0:-1, speed.y>0?0:-1)
    closePos.add(d)
    var tile = level.tiles[Math.floor((closePos.x)/32) + Math.floor((closePos.y)/32)*LEVEL_WIDTH]
    if(tile !== 0) { //colide
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
    var stanceTo = new v2d(closePos.x, closePos.y)
    stanceTo.sub(corners.ne)
    if(tile === 0 ||stanceTo.norm() > speed.norm()) {
        sub.add(speed)
    } else {
        
    }
}

var dialog;
function showDialog() {
    for(i = 0; i < TileMaps.level3.layers[2].objects.length; i ++) {
        dialog = TileMaps.level3.layers[2].objects[i]
        if(sub.x > dialog.x*2 && sub.x < dialog.x*2 + dialog.width*2 && sub.y > dialog.y*2 && sub.y < dialog.y*2 + dialog.height*2) {
            dialogd.innerHTML = dialog.properties.ct
        }
    }
}

var trigger;
function testTrigger() {
    for(i = 0; i < TileMaps.level3.layers[3].objects.length; i ++) {
        trigger = TileMaps.level3.layers[3].objects[i]
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


bubble2 = []
function initLevel(levelNumber) {
    cancelAnimationFrame(frameHandler)
    LEVEL_WIDTH = TileMaps[levelNumber].width
    LEVEL_HEIGHT= TileMaps[levelNumber].height
    sub.setPoint(311,100)
    level.tiles = TileMaps[levelNumber].layers[0].data
    
    gameState = GAME_STATE_RUN
    
    for(i = 0; i < TileMaps.level3.layers[3].objects.length; i ++) {    
        var obj = TileMaps.level3.layers[3].objects[i]
        if(obj.type === 'stream') {
            for(i = 0; i < 30; i ++) {
                var p = new v2d(2*obj.x+2*Math.random()*obj.width,2*obj.y+2*Math.random()*obj.height)
                bubble2.push({pos : p, save : p.clone(), size : 10*i % 70, dir : obj.dir})
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
                ctx.drawImage(sprite, tilesT[tile][0], tilesT[tile][1], 32, 32, 64*j, 64*i, 64, 64)
            }
        }
    }
}


