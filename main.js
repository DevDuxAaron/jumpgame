document.addEventListener("DOMContentLoaded", () => {
    const mapGame = document.getElementById('main')
    const startBtn = document.getElementById('btn')
    const numClouds = 6
    const spaceInterval = Math.floor(mapGame.clientHeight / numClouds)
    const minInterval = Math.floor(spaceInterval / 2)
    let clouds = []
    let gameId
    let player1

    class Cloud {
        constructor(x,y){
            this.visual = document.createElement('div')
            this.bottom = y
            this.left = (x >= 100 ? x - 100 : x)

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            mapGame.appendChild(visual)
        }
    }
    class Player {
        constructor(x,y){
            this.visual = document.createElement('div')
            this.bottom = y
            this.left = x - 30
            this.move = 0
            this.movingId
            this.limit = 250
            this.Rcorner = x + 30
            this.Lcorner = x - 30

            const visual = this.visual
            visual.classList.add('player')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            mapGame.appendChild(visual)
        }
        jump(){
            let sw = true
            let down = false
            this.movingId = setInterval(() => {
                this.visual.style.bottom = this.bottom + 'px'
                if (this.bottom === 0) {
                    this.dead()
                }
                if (this.move < this.limit && sw){
                    down = false
                    this.bottom += 10;
                    this.move += 10
                }
                else{
                    down = true
                    sw = false
                    this.bottom -= 10;
                    this.move -= 10
                }
                clouds.forEach(cloud => {
                    if (
                            (cloud.bottom + 10 == this.bottom && down) &&
                            (
                                (this.Rcorner > cloud.left && this.Rcorner < (cloud.left + 100)) ||
                                (this.Lcorner > cloud.left && this.Lcorner < (cloud.left + 100))
                            )
                        ) {
                        this.move = 0
                        sw = true
                        console.log(`works ${cloud.bottom}`);
                    }
                })
            },30)

        }
        dead(){
            console.log("Game over\nPor dead");
            gameOver()
        }
    }

    function createMap(cloudsAmount){
        clouds = []
        const limitY = mapGame.clientHeight
        const limitX = mapGame.clientWidth
        let cloudsMade = 0
        let i = 0
        while (i < limitY && cloudsMade < cloudsAmount) {
            i += Math.floor(Math.random()*spaceInterval) + minInterval
            xAxis = Math.floor(Math.random()*limitX)
            let newCloud = new Cloud(xAxis , i)
            clouds.push(newCloud)
            cloudsMade++;
        }
    }

    function moveMap() {
        clouds.forEach(cloud => {
            cloud.bottom -= 5
            let visual = cloud.visual
            visual.style.bottom = cloud.bottom + 'px'
            if (cloud.bottom < -5) {
                let firstCloud = clouds[0].visual
                firstCloud.classList.remove('platform')
                mapGame.removeChild(clouds.shift().visual)
                const limitX = mapGame.clientWidth
                const xAx = Math.floor(Math.random()*limitX)
                let newCloud = new Cloud(xAx ,600)
                clouds.push(newCloud)
            }
        })
    }
    function createPlayer(){
        let x = Math.floor(mapGame.clientWidth / 2)
        let y = Math.floor(mapGame.clientHeight / 100) * 20
        console.log(x,y,"player");
        player1 = new Player(x,y);
        player1.jump()
    }
    function startGame(){
        startBtn.addEventListener('click',()=> {
            startBtn.classList.add('btn-hide')
            startBtn.classList.remove('btn')
            mapGame.classList.add('main-game')
            createMap(numClouds)
            gameId = setInterval(moveMap, 30)
            createPlayer()
            setTimeout(gameOver, 10000)
        })
    }
    function gameOver() {
        clearInterval(player1.movingId)
        clearInterval(gameId)
        // startBtn.classList.remove('btn-hide')
        // startBtn.classList.add('btn')
    }
    startGame()
})
