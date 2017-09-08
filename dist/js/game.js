screen = document.getElementById('screen')
screen.width = window.innerWidth
screen.height = window.innerHeight
var frameHandler = null
GAME_STATE_PAUSE = 0
GAME_STATE_RUN = 1
GAME_STATE_LEVEL = 2
DEBUG = false
COLLIDE = true
MOUSECTRL = false
ctx = screen.getContext("2d")
var m = new v2d(1,1)


var time = performance.now()
var delta = 0
var ips = 0
function loop() {
	delta = performance.now() - time
	ips = 1000 / delta
	info.innerHTML = ips > 50 ? ips.toFixed(3) : '<span style="color:red">'+ips.toFixed(3)+'</span>'

    ctx.filter = "none";


	/* game loop */
	frameHandler = requestAnimationFrame(loop)


        step(delta)
        

	/* end game loop */



	time = performance.now()
}

gameState = GAME_STATE_LEVEL

up = left = right = down = 0
window.onkeydown = function(e) {
    if(e.keyCode === 87 || e.keyCode === 90)
        up = 1
    if(e.keyCode === 65 || e.keyCode === 81)
        left = 1
    if(e.keyCode === 83) 
        down = 1
    if(e.keyCode === 68)
        right = 1
}
window.onkeyup = function(e) {
    if(e.keyCode === 87 || e.keyCode === 90)
        up = 0
    if(e.keyCode === 65 || e.keyCode === 81)
        left = 0
    if(e.keyCode === 83) 
        down = 0
    if(e.keyCode === 68)
        right = 0
}


window.onkeypress =function(e) {
    touche = e.keyCode || e.charCode
	if(touche === 32) {
		if(gameState===GAME_STATE_RUN) {
			//pause
			cancelAnimationFrame(frameHandler)
			gameState = GAME_STATE_PAUSE
			pauseScreen.style.display = 'block'
            levelsD.style.display = 'none'
            menu.style.display = 'none'
            screen.width += 0
		} else {
			//run
			loop()
			gameState = GAME_STATE_RUN
			pauseScreen.style.display = 'none'
		}
    } else if(canStart && touche===102){
        splash.className = ''
        setTimeout(loop, 500)
    }
}

window.onwheel = function(e) {
    SPEED-=e.deltaY / 10
    if(SPEED>100)SPEED=100
    if(SPEED<0)SPEED=0
}


window.onmousemove = function(e) {
    m.x = e.pageX
    m.y = e.pageY
}


// menu 

function home() {
    homeD.style.display = 'block'
    menu.style.display = 'block'
    levelsD.style.display = 'none';
    pauseScreen.style.display = 'none'
}

function levels() {
    menu.style.display = 'none'
    pauseScreen.style.display = 'none'
    levelsD.style.display = 'block';
}