// 读写 localStorage 配置
const setCfg = function(h, w, n) {
    localStorage.h = String(h);
    localStorage.w = String(w);
    localStorage.n = String(n);
}

const readCfg = function() {
    let h = parseInt(localStorage.h)
    let w = parseInt(localStorage.w)
    let n = parseInt(localStorage.n)
    return [h, w, n]
}

// ==============================================================
// 矩阵生成
const getZeroMap = function(h, w) {
    let zero_map = []
    for (let i = 0; i < h; i++) {
        let line = new Array(w).fill(0)
        zero_map.push(line)
    }
    return zero_map
}

const randomInt = function(maxNum) {
    let res = parseInt(Math.random() * maxNum, 10)
    return res
}

const getMineCoords = function(h, w, n, click_x, click_y) {
    let mine_coords = new Map()
    let mine_list = []
    let len = 0
    while (len < n) {
        let x = randomInt(h)
        let y = randomInt(w)
        let coord = [x, y]
        let condition1 = !mine_coords.has(`${x}_${y}`)
        let condition2 = x < click_x - 1 || x > click_x + 1
        let condition3 = y < click_y - 1 || y > click_y + 1
        if (condition1 && (condition2 || condition3)) {
            mine_coords.set(`${x}_${y}`, 1)
            mine_list.push(coord)
            len += 1
        }
    }
    return mine_list
}

const insertMine = function(zero_map, mine_coords) {
    for (let [x, y] of mine_coords) {
        log(x, y)
        zero_map[x][y] = 9
        log("after 9")
    }
    return zero_map
}

const addAround = function(map, x, y) {
    let h = map.length
    let w = map[0].length
    log("h, w", h, w)
    if (x >= 0 && x < h && y >= 0 && y < w) {
        log(x, y)
        if (map[x][y] !== 9) {
            map[x][y] += 1
        }
    }
    return map
}

const addNumbers = function(map, mine_coords) {
    for (let [x, y] of mine_coords) {
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (x !== i || y !== j) {
                    map = addAround(map, i, j)
                }
            }
        }
    }
    return map
}

const getMineMap = function(zero_map, mine_coords) {
    let map = insertMine(zero_map, mine_coords)
    map = addNumbers(map, mine_coords)
    return map
}

const generateRandomMineMap = function(h, w, n, x, y) {
    let zero_map = getZeroMap(h, w)
    let mine_coords = getMineCoords(h, w, n, x, y)
    log("coords", mine_coords)
    let map = getMineMap(zero_map, mine_coords)
    return map
}

// ==============================================================
// 统计标记
const isMarked = function(x, y) {
    let [h, w, n] = readCfg()
    if (x >= 0 && x < h && y >= 0 && y < w) {
        let cell = e(`[data-x="${x}"][data-y="${y}"]`)
        let r = cell.dataset.right
        if (r === "🚩") {
            return 1
        } else if (r === "?") {
            return 0
        } else {
            return -1
        }
    }
}

const getMarkedSquaresNumber = function(ele) {
    let x = parseInt(ele.dataset.x)
    let y = parseInt(ele.dataset.y)
    let total_marked_mine = 0

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i !== x || j !== y) {
                let r = isMarked(i, j)
                if (r === 0) {
                    total_marked_mine++
                }
            }
        }
    }

    return total_marked_mine
}

const openNumber = function(square, x, y) {
    let [h, w, n] = readCfg()
    if (x >= 0 && x < h && y >= 0 && y < w) {
        let cell = e(`[data-x="${x}"][data-y="${y}"]`)
        let number = cell.dataset.number
        if (!cell.classList.contains("opened") && number !== "9") {
            if (number === "0"){
                vjklAround(square, x, y)
            } else {
                cell.classList.add("opened")
            }
        }
    }
}

const openAround = function(ele, square) {
    let x = parseInt(ele.dataset.x)
    let y = parseInt(ele.dataset.y)

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i !== x || j !== y) {
                openNumber(square, i, j)
            }
        }
    }
}

// ==============================================================
// cell 控制
const removeAllCells = function() {
    let copy = e("#id-div-mime-copy")
    if (copy !== null) {
        copy.remove()
    }

    let div = e("#id-div-mime")
    let cells = div.querySelectorAll(".cell")
    for (let cell of cells) {
        cell.remove()
    }
}

const showAllCopyCells = function() {
    let ele = e("#id-div-mime-copy")
    let cells = ele.querySelectorAll(".cell")
    for (let cell of cells) {
        cell.classList.add("opened")
    }
}

const copyMap = function(square) {
    let comp = `<div id="id-div-mime-copy"></div>`
    let map = e("#id-div-mime")
    map.insertAdjacentHTML("afterend", comp)

    renderSquare(square, "#id-div-mime-copy")
    showAllCopyCells()
}

const setColor = function() {
    for (let i = 0; i < 5; i++) {
        let cells = es(`[data-number="${i}"]`)
        for (let cell of cells) {
            cell.classList.add(`number-${i}`)
        }
    }
}

// ==============================================================
const templateCell = function(line, x) {
    let row = '<div class="row clearfix">'
    for (let i = 0; i < line.length; i++) {
        let c = ""
        if (line[i] === 9) {
            c = "💣"
        } else {
            c = String(line[i])
        }
        let str = `<div class="cell" data-number="${line[i]}" data-x="${x}" data-y="${i}">${c}</div>`
        row += str
    }
    return row
}

const templateRow = function(square) {
    let l = []
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        l.push(templateCell(line, i))
    }
    return l
}

const renderSquare = function(square, insertElementSelector) {
    let rows = templateRow(square)
    let parent = e(insertElementSelector)
    for (let line of rows) {
        parent.innerHTML += line
    }
}

const bindEventDelegate = function() {
    let square = undefined
    let parent = e("#id-div-mime")
    parent.addEventListener("click", function(event){
        let self = event.target
        if (self.classList.contains("cell")) {
            if (localStorage.init === 'false') {
                localStorage.init = 'true'
                let x = parseInt(self.dataset.x)
                let y = parseInt(self.dataset.y)
                log(`click with x = ${x}, y = ${y}`)

                let [h, w, n] = readCfg()
                square = generateRandomMineMap(h, w, n, x, y)
                log("insert random matrix")
                removeAllCells()
                renderSquare(square, "#id-div-mime")

                if (localStorage.debug === 'true') {
                    copyMap(square)
                }
                // setColor()
                log("generate hint")
            }

            let flag = localStorage.gameover
            if (flag === "false") {
                let res  = vjkl(self, square)
                if (res === -1) {
                    localStorage.gameover = 'true'
                }
            }
        }
    })
    parent.addEventListener("contextmenu", function(event) {
        self = event.target
        let flag = localStorage.gameover
        if (flag === "false") {
            if (self.classList.contains("cell") && !self.classList.contains("opened")) {
                let r = self.dataset.right
                if (r === "🚩") {
                    self.dataset.right = "?"
                    r = "?"
                } else if (r === "?") {
                    self.dataset.right = "undefined"
                    r = self.dataset.number
                } else {
                    self.dataset.right = "🚩"
                    r = "🚩"
                }

                if (r === "9") {
                    r = "💣"
                }
                self.innerHTML = r
                if (["🚩", "?"].includes(r)) {
                    if (!self.classList.contains("right_click")) {
                        self.classList.add("right_click")
                    }
                } else {
                    if (self.classList.contains("right_click")) {
                        self.classList.remove("right_click")
                    }
                }
            }
        }
    })

    let leftButtonDown = false;
    let rightButtonDown = false;
    parent.addEventListener(("mousedown"), function (event) {
        let flag = localStorage.gameover
        if (flag === "false") {
            if (event.button === 0) {
                leftButtonDown = true;
            }
            if (event.button === 2) {
                rightButtonDown = true;
            }

            if (leftButtonDown && rightButtonDown) {
                self = event.target
                if (self.classList.contains("opened")) {
                    log("left and right")
                    let marked_number = getMarkedSquaresNumber(self)
                    log(marked_number)
                    let number = parseInt(self.dataset.number)
                    if (number === marked_number) {
                        openAround(self, square)
                    }
                }
            }
        }
    })
}

const vjkl = function(cell, square) {
    let x = Number(cell.dataset.x)
    let y = Number(cell.dataset.y)
    let number = cell.dataset.number
    log("click event", x, y, number)

    if (number === "9") {
        cell.classList.add("boom")
        let cells = es(`[data-number="9"]`)
        for (let cell of cells) {
            if (!['?', '🚩'].includes(cell.dataset.right)) {
                cell.classList.add("opened")
            }
        }
        return -1
    } else if (number === "0"){
        vjklAround(square, x, y)
    } else {
        open(cell, number)
    }
}

const vjklAround = function(square, x, y) {
    log("vjklAround", x, y)
    let selector = `[data-x="${x}"][data-y="${y}"]`
    let ele = e(selector)
    if (!ele.classList.contains("opened")) {
        open(ele, 0)
    }

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            log(i, j)
            if (i !== x || j !== y) {
                vjkl1(square, i, j)
            }
        }
    }
}

const open = function(ele, number) {
    ele.classList.add("opened")
    ele.classList.add(`number-${number}`)
}

const vjkl1 = function(square, x, y) {
    let [h, w, n] = readCfg()
    if (x >= 0 && x < h && y >= 0 && y < w) {
        log("open", x, y)
        let selector = `[data-x="${x}"][data-y="${y}"]`
        let ele = e(selector)
        let number = ele.dataset.number

        if (!ele.classList.contains("opened")) {
            if (number === "9") {
                log("expand", x, y, 9, "!!!")
            } else if (number === "0") {
                vjklAround(square, x, y)
            } else {
                open(ele, number)
            }
        }
    }
}