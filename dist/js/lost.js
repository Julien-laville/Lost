var sub = new v2d(0,0) 
var speed = new v2d(3,2)
var SPEED = 20
var accInput = new v2d(0,0)

var c = new v2d(100,100)
SUB_LENGTH= 128
SUB_HEIHGT = 64
LEVEL_WIDTH = 0
SCREEN_WIDTH = 20;
SCREEN_HEIGHT = 20;

//sub carac
isShutdown = false
harpoon = 0
arming = 0
chaarge = 0
isDead = false
fade=0
var bubbles = []
var i,j,k;
var level= {};
var accMod = new v2d(0,0)
screenCenter=null
canStart=false
boss = {
    active:false,
    p : new v2d(200,200),
    seq : 0,
    hp : 10
}
artefact = {
    active:false
}
timer = {
    active:false
}

var acc = new v2d(0,0)
function step(delta) {
  
    if(isDead) {
        fade++;
    }
    if(MOUSECTRL) {
        accInput = acc.setVector(m).sub(screenCenter)

        if(accInput.norm() < 100) {
            speed.scale(0.9)
            if(speed.norm() < 1) {
                speed.setPoint(0,0)
            }
        } else {
            acc.setVector(accInput).normalize()
            speed.add(acc.normalize()   .scale(0.3))
        }
    } else {
        x=y=0
        if(up) 
            y=-1
        if(down) 
            y=1
        if(left) 
            x=-1
        if(right) 
            x=1
        acc.setPoint(x,y)
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
    speed.maxLength(SPEED/20)
    
    testTrigger()
    
    //bubbles
    liveBubble(speed.x > 0)
    
    render()
    
    if(COLLIDE) collide()
    drawWeapon()
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
    if(arming && harpoon) {
        chaarge+=delta
    }
}

arrows = []
arrow = null
freeArrow = null
var arpoonO = new v2d(0,0)
var arpoonDelta = new v2d(56,64)
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
            arrows[i].chaarge=chaarge
            freeArrow = true
        } 
    }
   
    if(freeArrow === false) {
        arrow = new v2d(0,0)
        arrow.setVector(sub).add(arpoonDelta)
        arrow.isAlive=true
        arrow.dir = visor.clone()
        arrows.chaarge=chaarge
        arrows.push(arrow) 
    }       
    chaarge = 0
}

function liveProjectile() {
    for(i=0;i < arrows.length;i++) {
        if(arrows[i].isAlive===true) {
            arrows[i].add(arrows[i].dir.normalize().scale(8))
            if(arrows[i].x>boss.p.x&&arrows[i].y>boss.p.y&&arrows[i].x<boss.p.x+160&&arrows[i].y<boss.p.y+100) {
                boss.hp--;
                if(boss.hp < 1) {
                    boss.d = boss.p.clone() 
                }
                arrows[i].isAlive = false
            }
        }
    }
}

function liveHostile() {
    if(boss.active) {
        if(boss.hp>0)
            boss.p.add(sub.clone().addP(64,32).sub(boss.p.clone().addP(80,50)).normalize().scale(0.5))
        else
            boss.p.add(new v2d(0,1))
        
        if(sub.clone().addP(64,32).stance(boss.p.clone().addP(80,50)) < 110) {
            isDead=true
        }
    }
}
var ballPos = new v2d()
function drawHostile() {
    if(boss.active) {
        drawSprite(boss.p,5)
        if(boss.d) {
            ballPos.setVector(boss.d)
        } else {
            ballPos.setVector(boss.p)
        }
        grd = ctx.createRadialGradient(ballPos.x-c.x+screen.width/2,ballPos.y-c.y+screen.height/2,0,ballPos.x-c.x+screen.width/2,ballPos.y-c.y+screen.height/2,30);
        
        // Add colors
        grd.addColorStop(0, 'rgba(255, 171, 26, 1)');
        grd.addColorStop(0.4, 'rgba(255, 171, 26, 0.77)');
        grd.addColorStop(0.43, 'rgba(255, 171, 26, 0.13)');
        grd.addColorStop(1.000, 'rgba(255, 171, 26, 0)');
        

        // Fill with gradient
        ctx.beginPath()
        ctx.arc(ballPos.x-c.x+screen.width/2,ballPos.y-c.y+screen.height/2,30,0,2*Math.PI)
        ctx.fillStyle = grd;
        ctx.fill()
    } 
}

function drawWeapon() {
    for(i=0;i < arrows.length;i++) {
        if(arrows[i].isAlive) {
            ctx.beginPath()
            ctx.arc(arrows[i].x-c.x+screen.width/2,arrows[i].y-c.y+screen.height/2,3,0,2*Math.PI)
            ctx.fillStyle="#4ac495"
            ctx.fill()
        }
    }

    
    if(arming && harpoon) {
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

bstr=''
function drawUI() {
    ctx.beginPath()
    ctx.strokeStyle = "#fff"
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
        ctx.fillText('You swim in the deep forever', screen.width/2,screen.height/2,500)
    }
    cData=''
    cClass=''
    if(boss.active){
        cData += 'Boss HP : '
        for(i=0;i<10;i++) {
            cData+= boss.hp>i?' ▮': ' ▯'
        }
        cCLass="boss"
    } else if(timer.active) {
        cData = 'Time remaining : ' 
        timer.remaining-=delta
        for(i=0;i<10;i++) {
            cData+= (timer.remaining / timer.initial * 10 > i) ? ' ▮': ' ▯'
        }
        cClass="time"
    }
    


    grd = ctx.createRadialGradient(screen.width/2, screen.height/2, 0.000, screen.width/2, screen.height/2, screen.width/2);

    // Add colors
    grd.addColorStop(0, 'rgba(0, 0, 0, 0.000)');
    grd.addColorStop(0.718, 'rgba(0, 0, 0, 0.000)');
    grd.addColorStop(1.000, 'rgba(0, 0, 0, 1.000)');

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, screen.width, screen.height)
    ui.innerHTML = `+speed : ${SPEED}<br>${harpoon ? 'Harpoon armed' : 'Module available'}<br><div class="contextBar ${cClass}">${cData}</div>`
}


function render() {
    drawBack()
    drawLevel()
    drawPlayer()
    drawHostile()
    drawBubble()
}

function drawBack() {
    var grd=ctx.createLinearGradient(0,0,0,screen.height);
    grd.addColorStop(0,"#1b212c");
    grd.addColorStop(1,"#0a0e15");
    ctx.fillStyle = grd
    ctx.fillRect(0,0,10000,100000)
}

function drawPlayer() {
    if(DEBUG) {
        ctx.rect(sub.x-c.x+screen.width/2,sub.y-c.y+screen.height/2,SUB_LENGTH,SUB_HEIHGT)
        ctx.strokeStyle = "#edff00"
        ctx.stroke()
    }
    if(harpoon) {
        drawSprite(sub,6, speed.x > 0)
    } else {
        drawSprite(sub, 0, speed.x > 0)
    }
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
    139,0,6,9,//cur
    160,5,82,53,//boss
    0,0,64,40,//sub-cannon
    192,64,18,30//artefact
    
]

function drawSprite(p, img, rev) {
    ctx["imageSmoothingEnabled"] = false
    if(DEBUG) {
        ctx.beginPath()
        ctx.rect(p.x-c.x+screen.width/2,p.y-c.y+screen.height/2,sprt[img*4+2]*2, sprt[img*4+3]*2)
        ctx.strokeStyle = "#ff0"
        ctx.stroke()
    }
    
    ctx.drawImage(sprite, sprt[img*4]+(rev?sprt[img*4+2]:0), sprt[img*4+1], sprt[img*4+2], sprt[img*4+3], p.x-c.x+screen.width/2, p.y-c.y+screen.height/2, sprt[img*4+2]*2, sprt[img*4+3]*2)
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
    sub.add(accMod)
    if(speed.norm() <= 0 || isDead) return;
    corners.ne.setPoint(sub.x+SUB_LENGTH, sub.y)
    corners.nw.setPoint(sub.x, sub.y)
    corners.se.setPoint(sub.x+SUB_LENGTH, sub.y+SUB_HEIHGT)
    corners.sw.setPoint(sub.x, sub.y+SUB_HEIHGT)
    
    
    for(i = 0; i < 4;i++ ){
        var corner = corners[Object.keys(corners)[i]]
        
        moveOk.setPoint(0,0)
        for(j=0;j<speed.norm()+1;j++) {
            closePos.setVector(speed).normalize().scale(j)
            if(j >speed.norm()) {
                closePos.setVector(speed)
                
            }
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



var trigger;
function testTrigger() {
        accMod.setPoint(0,0)
    
        if(timer.active && timer.remaining < 0) {
            isDead = true
        }
    
        if(boss.d) {
            if(boss.d.stance(sub) < 50) {
                splash.className='splayed'
                splash.innerHTML='<h2>- The end -</h2>You get the warden key, it show you a way home, maybe another aventure'
                cancelAnimationFrame(frameHandler)
                ctx.filter = "blur(50px)";
            }
        }
    
         for(i = 0; i < level.triggers.length; i ++) {
            trigger = level.triggers[i]
            if(sub.x > trigger.x*2 && sub.x < trigger.x*2 + trigger.w*2 && sub.y > trigger.y*2 && sub.y < trigger.y*2 + trigger.h*2) {
                if(trigger.t === 'shutdown') {
                    isShutdown = true
                } 
                if(trigger.t === 'start') {
                    isShutdown = false
                }
                if(trigger.t === 'dialog') {
                    dialogd.innerHTML = trigger.p.ct
                }
                if(trigger.t === 'powup') {
                    if(trigger.p.i === 1) {
                        harpoon = 1
                        trigger.p.a=0
                        dialogd.innerHTML = 'Harpoon aquiererd'
                        ccd('click to fire, keep button down to charge')
                    } 
                }
                if(trigger.t === 'end') {
                   initLevel(trigger.p.next)
                }
                if(trigger.t === 'stream') {
                    if(trigger.p.dir === 1) {
                        accMod.setPoint(3,0)
                    } else if(trigger.p.dir === 4) {
                        accMod.setPoint(-3,0)
                    } 
                }
        }
    }
}

function ccd(m) {
    cc.innerHTML=m
    setTimeout(()=>{
        cc.innerHTML=''
    },4000)
}

function initLevel(levelNumber, isNext) {
    screenCenter = new v2d(screen.width/2,screen.height/2).add(new v2d(SUB_LENGTH/2,SUB_HEIHGT/2))
    homeD.style.display = 'none'
    levelsD.style.display = 'none'
    cancelAnimationFrame(frameHandler)
    ctx.filter = "blur(50px)";
    level = window[levelNumber]
    level.triggers = level.tr
    level.tiles = []
    for(i=0;i<level.w*level.h;i++){level.tiles[i] = 0}
    for(i = 0; i < level.ti.length/3; i ++){
        var x = level.ti.charCodeAt(i*3)-97
        var y = level.ti.charCodeAt(i*3+1)-97
        var id = level.ti.charCodeAt(i*3+2)-97
        level.tiles[x+y*level.w] = id
    }
    LEVEL_WIDTH = level.w
    LEVEL_HEIGHT= level.h
    
    splash.className='splayed'
    splash.innerHTML=level.p.splash+'<span>press F to start</span>'
    bubbles = []
    for(i = 0; i < 10; i ++) {
        bubbles.push({pos : new v2d(0,0), size : 10*i % 70})
    }
    
    for(j = 0; j < level.triggers.length; j ++) {
        var obj = level.triggers[j]
        if(obj.t === 'stream') {
            for(k = 0; k < 30;k ++) {
                var p = new v2d(2*obj.x+2*Math.random()*obj.w,2*obj.y+2*Math.random()*obj.h)
                bubbles.push({pos : p, save : p.clone(), size : 10*k % 70, dir : obj.p.dir})
            }
        }
        if(obj.t === 'start') {
            sub.setPoint(obj.x*2, obj.y*2)
        }
        if(obj.t === 'boss') {
            boss.active=true
            boss.p = new v2d(obj.x*2, obj.y*2)
        }
        if(obj.t === 'artefact') {
            artefact.active=true
            artefact.p = new v2d(obj.x*2, obj.y*2)
            artefact.fx = artefact.p.clone().addP(18,-30) 
        }
    }
    timer={active:false}
    if(level.p.time) {
        timer = {
            initial:level.p.time*1000,
            remaining:level.p.time*1000,
            active:true
        }
    }
    
    canStart=true;
}

function drawPowUp() {
    if(artefact.active) {
        drawSprite(artefact.p,7)
        
        grd = ctx.createRadialGradient(artefact.fx.x-c.x+screen.width/2,artefact.fx.y-c.y+screen.height/2,0,artefact.fx.x-c.x+screen.width/2,artefact.fx.y-c.y+screen.height/2,50);

        // Add colors
        grd.addColorStop(0, 'rgba(137, 255, 243, 1)');
        grd.addColorStop(0.4, 'rgba(137, 255, 243, 0.77)');
        grd.addColorStop(0.43, 'rgba(137, 255, 243, 0.13)');
        grd.addColorStop(1.000, 'rgba(137, 255, 243, 0)');

        // Fill with gradient
        ctx.beginPath()
        ctx.arc(artefact.fx.x-c.x+screen.width/2,artefact.fx.y-c.y+screen.height/2,50,0,2*Math.PI)
        ctx.fillStyle = grd;
        ctx.fill()
    }
    for(i = 0; i <  level.triggers.length; i ++) {
        powup =  level.triggers[i]
        if(powup.t === 'powup') {
            if(powup.p.i == 1 && powup.p.a) {   
                drawSprite(new v2d().setVector(powup).scale(2), 0) 
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


