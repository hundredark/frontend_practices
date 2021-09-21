// 随机生成值
const getZeroSquare = function(h, w) {
    let square = []
    for (let i = 0; i < h; i++) {
        let line = new Array(w).fill(0)
        square.push(line)
    }

    return square
}

const gameOver = function() {
    localStorage.gameover = true
    window.square = arrayDeepClone(getZeroSquare(4, 4))
    alert("Game Over")
}

const checkCross = function(x, y) {
    let value = window.square[x][y]
    let coords = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
    for (let [x, y] of coords) {
        if (x >= 0 && x <= 3 && y >= 0 && y <= 3) {
            let check_value = window.square[x][y]
            if (check_value === value) {
                return false
            }
        }
    }
    return true
}

const checkGameOver = function() {
    log("check game over")
    let empty_cells = es(".empty")
    let condition1 = empty_cells.length === 0
    log("empty number: ", empty_cells.length)
    if (!condition1) {
        return false
    }

    for (let i = 0; i <= 3; i++) {
        for (let j = 0; j <= 3; j++) {
            let flag = checkCross(i, j)
            if (flag === false) {
                return false
            }
        }
    }

    return true
}

const randomInitBlock = function() {
    // 从空 cell 中选一个
    let cells = es(".empty")
    let empty_len = cells.length
    let index = randomInt(empty_len)
    let cell = cells[index]

    let x = parseInt(cell.dataset.x)
    let y = parseInt(cell.dataset.y)
    let value = cell.dataset.number

    // 随机选个数字
    let init_numbers = [2, 4]
    let p = Math.random()
    if (p > 0.8) {
        index = 1
    } else {
        index = 0
    }
    let number = init_numbers[index]
    log(`random pick empty x=${x} y=${y}, ${value} to ${number}`)
    setCellValueByDOM(cell, number)
}

const setCellValueByDOM = function(cell, number) {
    let color_dict = {
        2: "#eee4da",
        4: "#ede0c8",
        8: "#f2b179",
        16: "#f59563",
        32: "#f67c5f",
        64: "#f65e36",
        128: "#edcf72",
        256: "#edcc61",
        512: "#edc850",
        1024: "#3365a5",
        2048: "#09c",
        4096: "#a6bc",
        8192: "#93c",
    }
    let x = parseInt(cell.dataset.x)
    let y = parseInt(cell.dataset.y)
    window.square[x][y] = number

    if (number === 0) {
        cell.innerHTML = ""
        cell.style.backgroundColor = ""
        cell.classList.remove("number")
        cell.classList.add("empty")
    } else {
        cell.innerHTML = number
        cell.classList.add("number")
        cell.classList.remove("empty")
        cell.style.backgroundColor = color_dict[number]
    }
}

// 将矩阵制成 html 格子
const templateCell = function(line, x) {
    let row = '<div class="row clearfix">'
    for (let i = 0; i < line.length; i++) {
        let str = `<div class="cell empty" data-number="${line[i]}" data-x="${x}" data-y="${i}">${line[i]}</div>`
        row += str
    }
    return row
}

const templateRow = function() {
    let l = []
    for (let i = 0; i < window.square.length; i++) {
        let line = window.square[i]
        l.push(templateCell(line, i))
    }
    return l
}

const renderSquare = function(insertElementSelector) {
    let rows = templateRow()
    let parent = e(insertElementSelector)
    for (let line of rows) {
        parent.innerHTML += line
    }
}

// 移动
const getRange = function(flag) {
    let start = undefined
    let end = undefined
    if (flag === 1) {
        start = 3
        end = -1
    } else {
        start = 0
        end = 4
    }

    return [start, end]
}

const setCellValueByCoords = function(x, y, value) {
    let cell = e(`[data-x="${x}"][data-y="${y}"]`)
    setCellValueByDOM(cell, value)
}

const moveCell = function(old_coord, new_coord) {
    log(`move from ${old_coord} to ${new_coord}`)
    let [x, y] = old_coord
    let number = window.square[x][y]
    setCellValueByCoords(x, y, 0);

    [x, y] = new_coord
    setCellValueByCoords(x, y, number)
}

const moveOneLineByDirection = function(x, y) {
    let done = false
    let flag
    if (typeof x === "string") {
        flag = parseInt(x);
    } else {
        flag = parseInt(y)
    }
    let [start, end] = getRange(flag)
    let insert_index = start

    for (let index = start; index !== end; index = index - flag) {
        let number
        if (typeof x === "string") {
            number = window.square[index][y]
        } else {
            number = window.square[x][index]
        }

        if (number !== 0) {
            if (index !== insert_index) {
                let old_coord, new_coord
                if (typeof x === "string") {
                    old_coord = [index, y]
                    new_coord = [insert_index, y]
                } else {
                    old_coord = [x, index]
                    new_coord = [x, insert_index]
                }
                moveCell(old_coord, new_coord)
                done = true
            }
            insert_index = insert_index - flag
        }
    }
    return done
}

const gainPoint = function(point) {
    let add = e(".add_score")
    add.innerHTML = `+${point}`
    add.classList.add("up")

    point = parseInt(localStorage.current_score) + point
    localStorage.current_score = point
    let current_score = e("#current_score")
    current_score.innerHTML = point

    let best = e("#best_score")
    let best_score = parseInt(localStorage.best_score)
    if (point > best_score) {
        localStorage.best_score = point
        best.innerHTML = point
    }
}

const mergeTwoCells = function(old_coord, new_coord) {
    log(`merge ${new_coord} to ${old_coord}`)
    let [x, y] = old_coord
    let number = window.square[x][y] * 2
    setCellValueByCoords(x, y, number);

    [x, y] = new_coord
    setCellValueByCoords(x, y, 0)

    gainPoint(number)
}

const mergeOneLineNumbers = function (x, y) {
    let done = false
    let flag
    if (typeof x === "string") {
        flag = parseInt(x);
    } else {
        flag = parseInt(y)
    }
    let [start, end] = getRange(flag)
    end += flag

    let index = start
    while (index !== end && index >= 0 && index <= 3) {
        let number, next, old_coord, new_coord
        if (typeof x === "string") {
            number = window.square[index][y]
            next = window.square[index - flag][y]
            old_coord = [index, y]
            new_coord = [index - flag, y]
        } else {
            number = window.square[x][index]
            next = window.square[x][index - flag]
            old_coord = [x, index]
            new_coord = [x, index - flag]
        }

        if (number !== 0 && next!== 0 ) {
            if (number === next) {
                mergeTwoCells(old_coord, new_coord)
                done = true
                index -= flag * 2
            } else {
                index -= flag
            }
        } else {
            break
        }
    }
    return done
}

const moveCells = function(x, y) {
    log(arrayDeepClone(window.square))
    let flag = false
    if (x !== 0) {
        for (let j = 0; j < 4; j++) {
            let flag1 = moveOneLineByDirection(String(x), j)
            let flag2 = mergeOneLineNumbers(String(x), j)
            let flag3 = moveOneLineByDirection(String(x), j)
            flag = flag || flag1 || flag2 || flag3
        }

    } else {
        for (let i = 0; i < 4; i++) {
            let flag1 = moveOneLineByDirection(i, String(y))
            let flag2 = mergeOneLineNumbers(i, String(y))
            let flag3 = moveOneLineByDirection(i, String(y))
            flag = flag || flag1 || flag2 || flag3
        }
    }
    log(arrayDeepClone(window.square))
    return flag
}

const bindMoveEvents = function() {
    let body = e("body")
    body.addEventListener("keydown", function(event) {
        let add = e(".add_score")
        add.innerHTML = ""
        add.classList.remove("up")

        if (localStorage.gameover === 'false') {
            let code = event.keyCode
            let x = 0
            let y = 0
            let direction = ""

            let keyboard = e("#keyboard")
            if ([37, 38, 39, 40].includes(code)) {
                switch (code) {
                    case 37:
                        y = -1
                        direction = "left"
                        keyboard.innerHTML = "←"
                        break
                    case 38:
                        x = -1
                        direction = "up"
                        keyboard.innerHTML = "↑"
                        break
                    case 39:
                        y = 1
                        direction = "right"
                        keyboard.innerHTML = "→"
                        break
                    case 40:
                        x = 1
                        direction = "down"
                        keyboard.innerHTML = "↓"
                        break
                }

                log("===============================================")
                log(`press ${direction}, x = ${x}, y = ${y}`)
                let flag = moveCells(x, y)
                log("if move cells:", flag)

                let is_game_over
                if (flag) {

                    setTimeout(function() {
                        randomInitBlock()

                        setTimeout(function() {
                            is_game_over = checkGameOver()
                            if (is_game_over) {
                                gameOver()
                            }
                        }, 500)
                    }, 500)
                }
            }
        }
    })
}
