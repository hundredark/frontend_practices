class Grids {
    constructor(ctx) {
        this.h = 11
        this.w = 11
        this.side = 60
        this.radis = 5
        this.line = this.side - this.radis * 2
        this.color_n = 6
        this.color_dict = {
            0: "red",
            1: "green",
            2: "pink",
            3: "purple",
            4: "yellow",
            5: "blue",
        }

        this.current = 1
        this.showLevel()
        this.score = 0
        this.showPoint()
        this.selected = new Map()
        this.ctx = ctx
        this.square = this.initSquare()
        this.drawSquare()
    }

    initSquare() {
        let square = []
        this.square_coords = []

        for (let i = 0; i < this.h; i++) {
            let line = []
            let line_coords = []

            for (let j = 0; j < this.w; j++) {
                let color_index = randomInt(this.color_n)
                line.push(color_index)
                line_coords.push([i - this.h, j])
            }
            square.push(line)
            this.square_coords.push(line_coords)
        }
        log("init, square", [...square])
        return square
    }

    // ======================================================================
    // 画图
    drawBackground() {
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(0, 0, 662, 662)
    }

    drawBorder([center_x, center_y], color_index, selected) {
        this.ctx.beginPath();

        if (selected === 1) {
            this.ctx.strokeStyle = "white"
            this.ctx.lineWidth = 2
        } else {
            this.ctx.strokeStyle = "black"
        }

        let x0 = center_x - this.side / 2 + 1
        let y0 = center_y - this.side / 2 + 1
        let x1 = x0 + this.radis
        let y1 = y0
        this.ctx.moveTo(x1, y1)

        let x2 = x1 + this.line
        let y2 = y1
        this.ctx.lineTo(x2, y2)

        let tmp_x = x2 + this.radis
        let tmp_y = y1
        let x3 = tmp_x
        let y3 = tmp_y + this.radis
        this.ctx.arcTo(tmp_x, tmp_y, x3, y3, this.radis);

        let x4 = x3
        let y4 = y3 + this.line
        this.ctx.lineTo(x4, y4)

        tmp_y = y4 + this.radis
        let x5 = tmp_x - this.radis
        let y5 = tmp_y
        this.ctx.arcTo(tmp_x, tmp_y, x5, y5, this.radis)

        let x6 = x5 - this.line
        let y6 = y5
        this.ctx.lineTo(x6, y6)

        tmp_x = x6 - this.radis
        let x7 = tmp_x
        let y7 = tmp_y - this.radis
        this.ctx.arcTo(tmp_x, tmp_y, x7, y7, this.radis)

        let x8 = x7
        let y8 = y7 - this.line
        this.ctx.lineTo(x8, y8)

        this.ctx.arcTo(x0, y0, x1, y1, this.radis)

        let color = this.color_dict[color_index]
        this.ctx.fillStyle = color
        this.ctx.fill()

        this.ctx.stroke()
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        this.ctx.strokeStyle = "black"
        this.ctx.lineWidth = 1

        cx += 2
        cy += 2
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        this.ctx.strokeSyle = "#000";
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius)
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y)
            rot += step

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y)
            rot += step
        }
        this.ctx.lineTo(cx, cy - outerRadius)
        this.ctx.closePath();
        this.ctx.stroke();

    }

    drawGrid([center_x, center_y], flag) {
        let color_index = this.square[center_y][center_x]
        center_x = center_x * this.side + this.side / 2
        center_y = center_y * this.side + this.side / 2
        this.drawBorder([center_x, center_y], color_index, flag)
        this.drawStar(center_x, center_y, 5, this.side / 2 - 3, this.side / 5)
    }

    drawSquare() {
        log('draw square')
        log('select', this.selected)
        this.drawBackground()
        let selected = []

        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                if (this.square[j][i] >= 0) {
                    let flag = this.checkCoord([i, j])
                    if (flag === -1) {
                        this.drawGrid([i, j], flag)
                    } else {
                        selected.push([i, j])
                    }
                }
            }
        }

        for (let [x, y] of selected) {
            this.drawGrid([x, y], 1)
        }
    }

    // ======================================================================
    // 事件
    getCoords([x, y]) {
        let canvas = e("#popstar-canvas")
        let offset_left = canvas.offsetLeft
        let offset_top = canvas.offsetTop

        let coord_x = parseInt((x - offset_left) / 60)
        let coord_y = parseInt((y - offset_top) / 60)
        return [coord_x, coord_y]
    }

    saveCoord([x, y], selected=true) {
        let tmp_str = `${x}_${y}`
        if (selected) {
            this.selected.set(tmp_str, 1)
            this.selected_list[x].push(y)
        } else {
            this.checked.set(tmp_str, 1)
        }

    }

    checkCoord([x, y]) {
        let tmp_str = `${x}_${y}`
        if (this.selected.has(tmp_str)) {
            return 1
        } else {
            return -1
        }
    }

    checkColor([x, y], check_color) {
        let tmp_str = `${x}_${y}`
        let condition1 = x >= 0 && x < this.w && y >= 0 && y < this.h
        let condition2 = !this.selected.has(tmp_str) && !this.checked.has(tmp_str)

        if (condition1 && condition2) {
            if (this.square[y][x] === check_color) {
                this.saveCoord([x, y])
                return 1
            } else {
                this.saveCoord([x, y], false)
                return -1
            }
        } else {
            return -1
        }
    }

    checkAround([x, y]) {
        let self_color = this.square[y][x]
        log("check around", x, y, this.color_dict[self_color])

        let around = []
        let coords_list = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1]
        ]

        for (let [i, j] of coords_list) {
            let flag = this.checkColor([i, j], self_color)
            if (flag === 1) {
                around.push([i, j])
            }
        }

        log('around', around.length, around)
        if (around.length > 0) {
            for (let [i, j] of around) {
                this.checkAround([i, j])
            }
        }
        log('check around end')
        return around.length
    }

    checkContinuous([x, y]) {
        log("check continuous", x, y)
        this.clearTmp()

        this.saveCoord([x, y])
        this.checkAround([x, y])

        this.drawSquare()
        log("check continuous end")
    }

    checkAll() {
        log('check all')
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                log(i, j, this.square[j][i])
                if (this.square[j][i] !== -1) {
                    this.clearTmp()
                    let flag = this.checkAround([i, j])
                    if (flag > 0) {
                        log("pass")
                        return false
                    }
                }
            }
        }
        return true
    }

    hover([x, y]) {
        let [coord_x, coord_y] = this.getCoords([x, y])
        if (coord_x >= 0 && coord_x < this.w && coord_y >=0 && coord_y < this.h && this.square[coord_y][coord_x] !== -1) {
            this.checkContinuous([coord_x, coord_y])
        }
    }

    columnWiseEliminate() {
        let move_left = 0
        for (let i = 0; i < this.w; i++) {
            if (this.selected_list[i].length > 0) {
                let insert_index = this.h - 1
                for (let j = this.h - 1; j >= 0; j--) {
                    if (!this.selected_list[i].includes(j)) {
                        this.square[insert_index][i] = this.square[j][i]
                        insert_index--
                    }
                }

                for (let j = insert_index; j >= 0; j--) {
                    this.square[j][i] = -1
                }

                if (this.square[this.h - 1][i] === -1) {
                    this.selected_list[i] = -1
                    move_left++
                }
            }
        }

        return move_left
    }

    moveOneColumn(src, dst) {
        for (let j = 0; j < this.h; j++) {
            this.square[j][dst] = this.square[j][src]
            this.square[j][src] = -1
        }
        this.selected_list[src] = -1
    }

    rowWiseMove() {
        let i = this.selected_list.indexOf(-1)
        let j = i + 1
        while (j < this.w) {
            if (this.selected_list[i] === -1) {
                if (this.selected_list[j] !== -1) {
                    this.moveOneColumn(j, i)
                    i++
                    j++
                } else {
                    j++
                }
            }
        }
    }

    showPoint() {
        let ele = e("#score")
        ele.innerHTML = this.score
    }

    click([x, y]) {
        let [coord_x, coord_y] = this.getCoords([x, y])
        log("click", coord_x, coord_y)
        log("number", this.selected.size)

        if (this.selected.size >= 2) {
            let add = this.selected.size * this.selected.size * 5
            this.score += add
            this.showPoint()

            let move_left = this.columnWiseEliminate()
            this.drawSquare()

            if (move_left > 0) {
                this.rowWiseMove()
            }
            this.drawSquare()

            if (this.checkAll()) {
                this.gameover()
            } else {
                this.hover([x, y])
            }
        }
    }

    clearTmp() {
        this.selected = new Map()
        this.checked = new Map()
        this.selected_list = []
        for (let i = 0; i < this.w; i++) {
            let tmp = new Array()
            this.selected_list.push(tmp)
        }
    }

    gameover() {
        setTimeout(() => {
            let modal = e(".modal-container")
            modal.classList.remove("hide")
        }, 100)

    }

    showLevel() {
        let ele = e(".level-div")
        ele.innerHTML = `第${this.current}关`
    }

    restart() {
        this.clearTmp()
        this.current += 1
        this.showLevel()
        this.score = 0
        this.showPoint()

        this.square = this.initSquare()
        this.drawSquare()
    }
}