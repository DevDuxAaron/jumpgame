document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platform = []
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0
    const interval = 20


    function createDoodler() {
        doodler.classList.add('doodler')
        grid.appendChild(doodler)
        doodlerLeftSpace = platform[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    class Platform {
        constructor(newPlatBottom){
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
            platform.push(newPlatform)
        }
    }

    function movePlatforms() {
        if(doodlerBottomSpace > 200) {
            platform.forEach(plt => {
                plt.bottom -= 4
                let visual = plt.visual
                visual.style.bottom = plt.bottom + 'px'

                if (plt.bottom < 10) {
                    let firstPlatform = platform[0].visual
                    firstPlatform.classList.remove('platform')
                    platform.shift();
                    score++;
                    let newPlatform = new Platform(600)
                    platform.push(newPlatform)
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(() => {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200) {
                fall()
            }
        },interval)
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(() => {
            doodlerBottomSpace -= 10
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platform.forEach(plt => {
                if (
                    (doodlerBottomSpace >= plt.bottom) &&
                    (doodlerBottomSpace <= plt.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= plt.left) &&
                    (doodlerLeftSpace <= (plt.left + 85)) &&
                    !isJumping
                ){
                    startPoint = doodlerBottomSpace
                    jump()
                }
            })
        },interval)
    }

    function gameOver() {
        console.log("Game over");
        isGameOver = true
        while (grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function control(e) {
        // console.log(e);
        if (e.key === "ArrowLeft") {
            console.log("left");
            moveLeft()
        } else if (e.key === "ArrowRight") {
            console.log("right");
            moveRight()
        } else if (e.key === "ArrowUp") {
            console.log("up");
            moveStraight()
        }
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(() => {
            if (doodlerLeftSpace >= 0){
                doodlerLeftSpace -= 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()
        },interval)
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        leftTimerId = setInterval(() => {
            if (doodlerLeftSpace <= 340){
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        },interval)
    }

    function moveStraight() {
        isGoingLeft = false
        isGoingRight = false
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function start() {
        if (!isGameOver){
            createPlatforms()
            createDoodler()
            document.addEventListener('keydown',control)
            setInterval(movePlatforms, interval)
            jump()
        }
    }

    start()


// FIXME:
// TODO:
// NOTE:
// HACK:
// REVIEW:
})