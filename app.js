document.addEventListener('DOMContentLoaded', () => {
	const grid = document.querySelector('.grid') 
	const scoreDisplay = document.querySelector("#score")
	const startBtn = document.querySelector("#start-button")
	const width = 10
	const cSpeed = 300
	const startPos = 4
	let squares = Array.from(document.querySelectorAll('.grid div'))
	let nextRandom = 0
	let score = 0
	let curPos = startPos
	let currentRotation = 0
	let posOffset = 0
	
	const colors = [
		'#e67e22',	//orange
		'#e74c3c',	//red
		'#9b59b6',	//purple
		'#2ecc71',	//green
		'#3498db',	//blue
		'#00ffff', 	//cyan
		'#4a86e8'	//cornflower
	]
	
	// The Tetrominoes
	const lTetromino = [
		[1, width+1, width*2+1, 2],
		[width, width+1, width+2, width*2+2],
		[1, width+1, width*2+1, width*2],
		[width, width*2, width*2+1, width*2+2]		
	]
	
	const zTetromino = [
		[0, 1, width+1, width+2],
		[1, width, width+1, width*2],
		[0, 1, width+1, width+2],
		[1, width, width+1, width*2]
	]
	
	const sTetromino = [
		[1, 2, width, width+1],
		[0, width, width+1, width*2+1],
		[1, 2, width, width+1],
		[0, width, width+1, width*2+1]
	]
	
	const tTetromino = [
		[1, width, width+1, width+2],
		[1, width+1, width+2, width*2+1],
		[width, width+1, width+2, width*2+1],
		[1, width, width+1, width*2+1]
	]
	
	const oTetromino = [
		[0, 1, width, width+1],
		[0, 1, width, width+1],
		[0, 1, width, width+1],
		[0, 1, width, width+1]
	]
	
	const iTetromino = [
		[1, width+1, width*2+1, width*3+1],
		[width, width+1, width+2, width+3],
		[1, width+1, width*2+1, width*3+1],
		[width, width+1, width+2, width+3]
	]
	
	const rTetromino = [
		[1, 2, width+2, width*2+2],
		[2, width, width+1, width+2],
		[0, width, width*2, width*2+1],
		[0, 1, 2, width]
	]
	
	const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, rTetromino, sTetromino]
	
	
	//randomly select a Tetromino and its first rotation
	let random = Math.floor(Math.random() * theTetrominoes.length)
	let current = theTetrominoes[random][currentRotation]
	
	//draw the Tetromino
	function draw() {
		current.forEach(index => {
			squares[curPos + index].classList.add('tetromino')
			squares[curPos + index].style.backgroundColor = colors[random]
		})
	}
	
	//undraw the Tetromino
	function undraw() {
		current.forEach(index => {
			squares[curPos + index].classList.remove('tetromino')
			squares[curPos + index].style.backgroundColor = ''
		})
	}
	
	//make the tetromino move down every second
	//timerId = setInterval(moveDown, 500)
	
	
	//assign functions to keyCodes
	function control(e) {
		if(e.keyCode === 37) {
			moveLeft()
		} else if (e.keyCode === 38) {
			rotate()
		} else if (e.keyCode === 39) {
			moveRight()
		} else if (e.keyCode === 40) {
			moveDown()
		}
		
	}
	document.addEventListener('keyup', control)
	
	//move down function
	function moveDown() {
		undraw()
		if (posOffset !== 0) console.log("posOffset: " + posOffset)
		curPos += width + posOffset
		posOffset=0
		draw()
		freeze()
	}
	
	//freeze fucntion
	function freeze() {
		if (current.some(index => squares[curPos + index + width].classList.contains('taken'))) {
			current.forEach(index => squares[curPos + index].classList.add('taken'))
			
			addScore()
			gameOver()
			//start a new tetromino falling
			random = nextRandom//Math.floor(Math.random() * theTetrominoes.length)
			nextRandom = Math.floor(Math.random() * theTetrominoes.length)
			current = theTetrominoes[random][currentRotation]
			curPos = startPos
			 
			draw()
			displayShape()
		}
	}
	
	//move the tetromino left, unless is at the edge or there is a blockage
	function moveLeft() {
		undraw()
		const isAtLeftEdge = current.some(index => (curPos + index) % width === 0)
		
		if (!isAtLeftEdge) {
			let leftMostSquares = current.map(a => (a+curPos) % width)
			const minLeftMostPos = leftMostSquares.reduce((a,b) => a<b? a: b)
			leftMostSquares = leftMostSquares.filter(a => (a<=minLeftMostPos)) 
			 console.log("leftMostSquares : " + leftMostSquares)
			if (current.some(index => squares[curPos + index-1].classList.contains('taken'))) {
				console.log("bi chan ben trai")
				if (current.some(index => squares[curPos + index + width - 1].classList.contains('taken'))) {
					posOffset = 0
				} else {
					posOffset = -1
					console.log("posOffset : " + posOffset)
				}
			} else {
				curPos -= 1
			} 		
		}
		
		if (current.some(index => squares[curPos + index].classList.contains('taken'))) {
			curPos += 1
		}
		
		draw()
	}
	
	//move the tetromino right, unless is at the edge or there is a blockage
	function moveRight() {
		undraw()
		const isAtRightEdge = current.some(index => (curPos + index) % width === width - 1)
		
		if (!isAtRightEdge) curPos += 1
		
		if (current.some(index => squares[curPos + index].classList.contains('taken'))) {
			curPos -= 1
		}
		
		draw()
	}
	
	// rotate the tetromino
	function rotate() {
		undraw()
		
		currentRotation++
		if (currentRotation === current.length) currentRotation = 0
		
		current = theTetrominoes[random][currentRotation]
		draw()
	}
	
	//show up-next tetromino in mini-grid display
	const displaySquares = document.querySelectorAll('.mini-grid div')
	const miniWidth = 4
	let displayIndex = 0
	
	//the Tetrominoes without rotations
	const upNextTetrominoes = [
		[1, miniWidth+1, miniWidth*2+1,2],				//lTetromino
		[0, 1, miniWidth+1, miniWidth+2], 				//zTetromino
		[1, miniWidth, miniWidth+1, miniWidth+2],		//tTetromino
		[0, 1, miniWidth, miniWidth+1],					//oTetromino
		[1, miniWidth+1, miniWidth*2+1, miniWidth*3+1],	//iTetromino
		[1, miniWidth+2, miniWidth*2+2, 2],				//rTetromino
		[1, 2, miniWidth+1,miniWidth],					//sTetromino
	]
	
	//display the shape in the mini-grid display
	function displayShape() {
		displaySquares.forEach(square => {
			square.classList.remove('tetromino')			
			square.style.backgroundColor = ''
		}) 
		upNextTetrominoes[nextRandom].forEach(index => {
			displaySquares[displayIndex + index].classList.add('tetromino')			
			displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
		})
	}
	var timerId
	//add functionallity to the button 
	startBtn.addEventListener('click', () =>{
		
		if (timerId) {
			clearInterval(timerId)
			timerId = null
		} else {
			draw()
			timerId = setInterval(moveDown, cSpeed)
			nextRandom = Math.floor(Math.random() * theTetrominoes.length)
			displayShape()
		}
	})
	
	//add score
	function addScore() {
		for (let i = 0; i < 199; i+=width) {
			const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
			
			if(row.every(index => squares[index].classList.contains('taken'))) {
				score += 10
				scoreDisplay.innerHTML = score
				row.forEach(index => {
					squares[index].classList.remove('taken')
					squares[index].classList.remove('tetromino')
					squares[index].style.backgroundColor = ''
				})
				const squaresRemoved = squares.splice(i,width)
				//console.log(squaresRemoved)  
				squares = squaresRemoved.concat(squares)
				squares.forEach(cell => grid.appendChild(cell))
			}
		}
	}
	
	//game over check
	function gameOver() {
		if(current.some(index => squares[startPos + index].classList.contains('taken'))) {
			scoreDisplay.innerHTML = 'end'
			clearInterval(timerId)
		}
	}
	
})