class Snake {
    constructor(ctx, w, h) {
        this.ctx = ctx
        this.h = h
        this.w = w

        this.len = 5
        this.r = 12

        this.set = new Map()
        this.point_set = new Map()
        this.score = 0


        this.newGame()
    }

    newGame() {
        log('new game')
        this.game_start = false
        this.game_pause = false
        this.score = 0
        this.initPoint()
        this.initSnake()
        this.drawSnakeAndPoint()
    }

    // =======================================================================================
    // 前后节点
    getLastNode([last_x, last_y]) {
        switch (this.cur_dir) {
            case 0:
                last_x -= 1
                break
            case 1:
                last_y -= 1
                break
            case 2:
                last_x += 1
                break
            case 3:
                last_y += 1
                break
        }
        return [last_x, last_y]
    }

    getNextNode([last_x, last_y]) {
        switch (this.cur_dir) {
            case 0:
                last_x += 1
                break
            case 1:
                last_y += 1
                break
            case 2:
                last_x -= 1
                break
            case 3:
                last_y -= 1
                break
        }
        return [last_x, last_y]
    }

    // =======================================================================================
    // 初始化 蛇 和 分数
    getRandomEmptyNode(flag=false) {
        let x
        let y

        while (true) {
            if (flag) {
                x = randomInt(10, 20)
                y = randomInt(7, 14)
            } else {
                x = randomInt(30)
                y = randomInt(20)
            }

            let tmp_str = `${x}_${y}`
            if (!this.set.has(tmp_str) && !this.point_set.has(tmp_str)) {
                return [x, y]
            }
        }
    }

    setPointNode([x, y]) {
        log("new point", [x, y])
        let tmp_str = `${x}_${y}`
        this.point.push([x, y])
        this.point_set.set(tmp_str, this.point.length - 1)
    }

    initPoint() {
        this.point = []
        this.point_set = new Map()
        let [x, y] = this.getRandomEmptyNode()
        this.setPointNode([x, y])
    }

    setSnakeNode([x, y], position=0) {
        let tmp_str = `${x}_${y}`
        if (position === 0) {
            this.body.unshift([x, y])
            this.set.set(tmp_str, 0)
        } else {
            this.body.push([x, y])
            this.set.set(tmp_str, this.body.length - 1)
        }
    }

    initSnake() {
        this.cur_dir = randomInt(4)
        log("init direction", this.cur_dir)

        this.body = []
        this.set = new Map()
        let [x, y] = this.getRandomEmptyNode(true)
        for (let i = 0; i < this.len; i++) {
            if (i !== 0) {
                [x, y] = this.getNextNode([x, y])
            }
            this.setSnakeNode([x, y], i)
        }
        log('init snake', [...this.body])
    }

    // =======================================================================================
    // 画图
    drawBackground() {
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, this.w , this.h)
        this.drawNode([30, 0], "body")
    }

    drawNode([x, y], type) {
        this.ctx.beginPath();
        this.ctx.arc(x * 2 * this.r + this.r, y * 2 * this.r + this.r, this.r, 0, Math.PI * 2, true)
        this.ctx.stroke()
        if (type === 'head') {
            this.ctx.fillStyle = "green"
        } else if (type === 'body') {
            this.ctx.fillStyle = "red"
        } else if (type === 'point') {
            this.ctx.fillStyle = "blue"
        }
        this.ctx.fill()
    }

    drawSnakeAndPoint() {
        this.drawBackground()
        for (let i = 0; i < this.body.length; i++) {
            let type = 'body'
            if (i === 0) {
                type = 'head'
            }

            let [x, y] = this.body[i]
            this.drawNode([x, y], type)
        }

        for (let [x, y] of this.point) {
            let type = 'point'
            this.drawNode([x, y], type)
        }
    }

    // =======================================================================================
    // 向某方向移动一次
    getNewHead() {
        let [x, y] = this.body[0]
        let [head_x, head_y] = this.getLastNode([x, y])
        return [head_x, head_y]
    }

    checkHead([x, y]) {
        let flag
        let tmp_str = `${x}_${y}`
        if (this.set.has(tmp_str) || x < 0 || y < 0 || x >= 30 || y >= 20) {
            flag = -1
        } else if (this.point_set.has(tmp_str)) {
            flag = 1
        } else {
            flag = 0
        }
        return flag
    }

    gainPoint([x, y]) {
        this.score += 1

        // 删除分数记录
        let tmp_dir = `${x}_${y}`
        let index = this.point_set.get(tmp_dir)
        this.point_set.delete(tmp_dir)

        this.point.splice(index, 1)
        for (let [key, value] of this.point_set) {
            if (value > index) {
                this.point_set.set(key, value - 1)
            }
        }
    }

    headForward([head_x, head_y]) {
        this.setSnakeNode([head_x, head_y], 0)
    }

    tailForward() {
        let [tail_x, tail_y] = this.body.pop()
        let tmp_str = `${tail_x}_${tail_y}`
        this.set.delete(tmp_str)
    }

    move() {
        log("======================")
        log("move start")
        // this.ctx.save();
        this.ctx.clearRect(0, 0, this.w, this.h)
        this.drawBackground()

        log('current snake', [...this.body])
        log('current point', [...this.point])
        let [new_head_x, new_head_y] = this.getNewHead()
        log('new head', [new_head_x, new_head_y])
        let flag = this.checkHead([new_head_x, new_head_y])
        log('flag', flag)
        if (flag !== -1) {
            this.headForward([new_head_x, new_head_y])
            if (flag === 0) {
                this.tailForward()

            } else {
                this.gainPoint([new_head_x, new_head_y])
            }

            log("new snake", [...this.body])

        } else {
            this.gameOver()
            this.pop_modal('gameover')
        }
        this.drawSnakeAndPoint()
        // this.ctx.restore()
        log("move end")
    }

    // =======================================================================================
    // 定时器，蛇向前移动 和 生成分数
    pointGenerator() {
        this.point_clock = setInterval(() => {
            let [x, y] = this.getRandomEmptyNode()
            this.setPointNode([x, y])
        }, 5000)
    }

    autoMove() {
        this.move()
        this.clock = setInterval(() => {
            this.move()
        }, 1000)
    }

    // =======================================================================================
    // 流程控制
    startGame() {
        this.game_start = true
        this.game_pause = false
        this.autoMove()
        this.pointGenerator()
    }

    pop_modal(from) {
        let modal = e(".modal-container")
        modal.classList.remove("hide")

        if (from === 'gameover') {
            let ele = modal.querySelector(".end-container")
            ele.classList.remove("hide")
        } else if (from === 'pause') {
            let ele = modal.querySelector(".pause-container")
            ele.classList.remove("hide")
        } else if (from === 'restart') {
            let ele = modal.querySelector(".restart-container")
            ele.classList.remove("hide")
        }

    }

    gameOver() {
        this.game_start = false
        clearInterval(this.clock)
        clearInterval(this.point_clock)
    }


    pause(pattern) {
        this.game_pause = true
        clearInterval(this.clock)
        clearInterval(this.point_clock)
        this.pop_modal(pattern)
    }

    restartCheck() {
        this.pause('restart')
    }

    restart() {
        this.newGame()
    }
}