var sub = new v2d(0,0) 
var speed = new v2d(3,2)
var accInput = new v2d(0,0)
var light = 100
var bubbles = []
for(var i = 0; i < 10; i ++) {
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
    
    
    sub.add(speed.maxLength(MAX_SPEED))
    //bubbles
    liveBubble(acc.x > 0)
    
    //back  
    ctx.fillStyle = "#111200"
    ctx.fillRect(0,0,10000,100000)
    drawLevel()
    
    /*ctx.save()
    ctx.globalCompositeOperation = "multiply";
    var sha = ctx.createRadialGradient(sub.x,sub.y,0,sub.x,sub.y,100)
    sha.addColorStop(0,"white");
    sha.addColorStop(1,"black");
    ctx.restore()
    ctx.fillStyle = sha 
    ctx.fillRect(sub.x-100,sub.y-100,200,200)
*/
    
    //obstacles
    ctx.fillStyle = "#444444"
    ctx.fillRect(400,100,40,40)
    
    drawSprite(sub, 'SUB', acc.x > 0)
    
    drawBubble()
    
    
    
    //ui
    ctx.fillStyle = "#DD0044"
    ctx.fillRect(m.x,m.y,3,3)
    
    ctx.beginPath()
    ctx.strokeStyle = "#fff"
    ctx.arc(sub.x,sub.y, 50, 0, Math.PI*2)
    ctx.closePath()
    ctx.stroke()
    
    lightd.innerHTML = light
}


function toggleL() {
    light = light === 100 ? 0 : 100 
}


function drawBubble() {
    ctx.fillStyle = "#ffffff"
    for(var i = 0;i < bubbles.length; i ++) {
        if(bubbles[i].size > 0)  {
            ctx.beginPath()
            ctx.arc(bubbles[i].pos.x, bubbles[i].pos.y, bubbles[i].size/10, 0, Math.PI*2)
            ctx.closePath()
            ctx.fill()
        }
    }
}
function liveBubble(rev) {
    for(var i = 0; i < bubbles.length; i ++) {
        if(bubbles[i].size < 0) {
            bubbles[i].size = 70
            bubbles[i].pos = sub.clone().add(new v2d(Math.random()*5+(rev ? -32 : 32), Math.random()*5))
        } else{
            bubbles[i].pos.add(new v2d(0, -1.5))
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
var i,j;
function drawLevel() {
    
    for(i = 0; i < 32; i++) {
        for(j = 0; j < 32;j++) {
            tile = TileMaps.level2.layers[0].data[i+j]
            if(tile===20) {
                ctx.drawImage(sprite, 64, 32, 16, 16, 16*i, 16*j, 32, 32)
            }
        }
    }
    
}
