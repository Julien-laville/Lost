var sub = new v2d(0,0) 
var light = 100
var bubbles = []
for(var i = 0; i < 10; i ++) {
    bubbles.push({pos : new v2d(0,0), size : 10*i % 70})
}

function step(delta) {
    //mv
    var o = new v2d(0,0)
    o.setVector(m).sub(sub).normalize()
    sub.add(o)
    
    //bubbles
    liveBubble()
    
    //back  
    ctx.fillStyle = "#111200"
    ctx.fillRect(0,0,10000,100000)
    
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
    
    drawSprite(sub, 'SUB')
    
    drawBubble()
    
    
    
    //ui
    ctx.fillStyle = "#DD0044"
    ctx.fillRect(m.x,m.y,3,3)
    
    lightd.innerHTML = light
}


function toggleL() {
    light = light === 100 ? 0 : 100 
}


function drawBubble() {
    ctx.fillStyle = "#ffffff"
    for(var i = 0;i < bubbles.length; i ++) {
        if(bubbles[i].size > 0) 
            ctx.beginPath()
            ctx.arc(bubbles[i].pos.x, bubbles[i].pos.y, bubbles[i].size/10, 0, Math.PI*2)
            ctx.fill()
    }
}
function liveBubble() {
    for(var i = 0; i < bubbles.length; i ++) {
        if(bubbles[i].size === 0) {
            bubbles[i].size = 70
            bubbles[i].pos = sub.clone().add(new v2d(Math.random()*5+64, Math.random()*5+16))
        } else{
            bubbles[i].pos.add(new v2d(0, -1))
            bubbles[i].size-- 
        }
    }
}


function drawSprite(p, img) {
    //ctx["mozImageSmoothingEnabled"] = false;
    ctx["imageSmoothingEnabled"] = false;
    if(img === 'SUB')
        ctx.drawImage(sprite, 0, 0, 32, 24, p.x, p.y, 64, 48)
}