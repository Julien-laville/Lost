screen = document.getElementById('screen')
screen.width = window.innerWidth
screen.height = window.innerHeight
var frameHandler = null
GAME_STATE_PAUSE = 0
GAME_STATE_RUN = 1


MAX_SPEED = 7

ctx = screen.getContext("2d")
var m = new v2d(1,1)


var time = performance.now()
var delta = 0
var ips = 0
function loop() {
	delta = performance.now() - time
	ips = 1000 / delta
	info.innerHTML = ips.toFixed(1)




	/* game loop */


        step(delta)
        

	/* end game loop */



	frameHandler = requestAnimationFrame(loop)
	time = performance.now()
}

gameState = GAME_STATE_RUN


window.onkeypress =function(e) {
	if(e.keyCode === 32) {
		if(gameState===GAME_STATE_RUN) {
			//pause
			cancelAnimationFrame(frameHandler)
			gameState = GAME_STATE_PAUSE
			pauseScreen.style.display = 'block'
		} else {
			//run
			loop()
			gameState = GAME_STATE_RUN
			pauseScreen.style.display = 'none'
		}
	}
}

window.onmousemove = function(e) {
    m.x = e.pageX
    m.y = e.pageY
}