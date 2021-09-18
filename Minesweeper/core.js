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
// 实现扫雷程序的流程如下
// 1, 生成扫雷数据
// 2, 根据扫雷数据画图
// 3, 点击的时候根据情况判断

// 为了方便, 我们跳过第一步, 直接用下面给定的数据即可, 这样方便测试
// 假设写死的数据为
// let s = '[[9,1,0,0,0,1,1,1,0],[1,1,0,0,1,2,9,1,0],[1,1,1,0,1,9,2,1,0],[1,9,2,1,1,1,1,0,0],[1,2,9,1,0,0,1,1,1],[1,2,1,1,0,1,2,9,1],[9,1,0,0,1,2,9,2,1],[1,2,1,1,1,9,2,1,0],[0,1,9,1,1,1,1,0,0]]'
// 可以发现这个数据实际上是 JSON 格式的字符串(这是非常常见的处理方式)
// 所以可以把字符串转成数组, 注意这是一个二维数组
// let square = JSON.parse(s)

// 以我们这个数据(二维数组)为例, 网页布局实际上应该 9 * 9 的表格
// 最终完成的效果如下图所示
// 如果不理解这个图, 可以尝试先在线玩一下
// https://www.saolei.org.cn/
// | 9 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 |
// | 1 | 1 | 0 | 0 | 1 | 2 | 9 | 1 | 0 |
// | 1 | 1 | 1 | 0 | 1 | 9 | 2 | 1 | 0 |
// | 1 | 9 | 2 | 1 | 1 | 1 | 1 | 0 | 0 |
// | 1 | 2 | 9 | 1 | 0 | 0 | 1 | 1 | 1 |
// | 1 | 2 | 1 | 1 | 0 | 1 | 2 | 9 | 1 |
// | 9 | 1 | 0 | 0 | 1 | 2 | 9 | 2 | 1 |
// | 1 | 2 | 1 | 1 | 1 | 9 | 2 | 1 | 0 |
// | 0 | 1 | 9 | 1 | 1 | 1 | 1 | 0 | 0 |

// 接下来就是要在网页上画一个这样的表格
// 可以一次画一排, 这样画 9 排就可以完成一个完整的表格
// 比如第一排可以生成下面形式的 html 字符串
// 考虑到 float 布局比较方便, 所以直接用 float 来完成布局效果
// 所以在父元素上面增加了 clearfix class, 用来解决浮动的问题
// <div class="row clearfix">
//     <div class="cell">9</div>
//     <div class="cell">1</div>
//     <div class="cell">0</div>
//     <div class="cell">0</div>
//     <div class="cell">0</div>
//     <div class="cell">1</div>
//     <div class="cell">1</div>
//     <div class="cell">1</div>
//     <div class="cell">0</div>
// </div>

// 考虑到我们在展开格子的时候会计算周围 8 个的情况
// 所以最好把下标信息也放在标签里面存入
// 修改之后的 html 标签形式如下
// <div class="row clearfix">
//     <div class="cell" data-number="9" data-x="0" data-y="0">9</div>
//     <div class="cell" data-number="1" data-x="0" data-y="1">1</div>
//     <div class="cell" data-number="0" data-x="0" data-y="2">0</div>
//     <div class="cell" data-number="0" data-x="0" data-y="3">0</div>
//     <div class="cell" data-number="0" data-x="0" data-y="4">0</div>
//     <div class="cell" data-number="1" data-x="0" data-y="5">1</div>
//     <div class="cell" data-number="1" data-x="0" data-y="6">1</div>
//     <div class="cell" data-number="1" data-x="0" data-y="7">1</div>
//     <div class="cell" data-number="0" data-x="0" data-y="8">0</div>
// </div>

// 其中 data-number 是数字, 也就是翻出来之后的数字
// data-x 和 data-y 分别是数组中的下标
// 比如 data-x="0" data-y="3" 表示 square[0][3], 也就是第 1 行第 4 列的格子

//  接下来就可以实现相关的函数
// 1. templateCell 函数, 参数为数组 line 和变量 x
// line 是每一行的数组
// 比如第一行就是 | 9 | 1 | 0 | 0 | 0 | 1 | 1 | 1 | 0 |
// x 表示第几行
// 这个函数返回 line.length 个 cell 拼接的字符串
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

// 2. templateRow 的参数 square 是二维数组
// 用来表示雷相关的数据, 我们这里是直接写死的数据
// 返回 square.length 个 row 拼接的字符串
// row 的内容由 templateCell 函数生成
const templateRow = function(square) {
    let l = []
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        l.push(templateCell(line, i))
    }
    return l
}

// 3. square 是二维数组, 用来表示雷相关的数据
// 用 square 生成 9 * 9 的格子, 然后插入到页面中
// div container 是 <div id="id-div-mime"></div>
const renderSquare = function(square, insertElementSelector) {
    let rows = templateRow(square)
    let parent = e(insertElementSelector)
    for (let line of rows) {
        parent.innerHTML += line
    }
}

// 4. 实现 bindEventDelegate 函数
// 用事件委托的形式在父元素上面绑定 click 事件, 只处理格子
// 也就是 .cell(即 class 包含 cell 字符串) 元素
// 如果点击的是 .cell 元素, 那么调用 vjkl 函数
// 注意, 我们在 bindEventDelegate 里面不处理具体的逻辑, 只调用函数
// 具体逻辑放在 vjkl 函数里面实现
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
                setColor()
                log("generate hint")
            }

            let flag = localStorage.gameover
            if (flag === "false") {
                let res  = vjkl(self, square)
                if (res === -1) {
                //     点中炸弹后，清除点击事件
                //     parent.removeEventListener(event.type, arguments.callee, false)
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

// 5. vjkl 是点击格子后执行的函数, 我们需要把扫雷的逻辑写在这个函数中
// 要注意的是我们在初始情况下就把数字写到了 html 中
// <div class="cell" data-number="1" data-x="0" data-y="1">1</div>
// 而初始情况下数字不应该显示出来的, 可以直接用 font-size: 0; 来隐藏文字
// 点击的时候根据情况用 font-size: 14px; 的方式显示文字
// 当然这一步应该用 class 来完成, 比如 opened class 里面写 font-size: 14px;
// 点击的时候根据 class 来执行具体逻辑
// 如果已经显示过(也就是 class 包含 opened), 则不做任何处理
// 如果没有显示过(也就是 class 不包含 opened), 判断下列情况
// 1. 假设点击的是数字 9, 展开, 游戏结束
// 2. 假设点击的是数字 0
// 此时需要展开 0 周围的一片, 通过调用 vjklAround 函数来完成
// 也就是说依然把逻辑写在下一层函数 vjklAround 中
// 3. 假设点击的是其他数字, 展开
const vjkl = function(cell, square) {
    let x = Number(cell.dataset.x)
    let y = Number(cell.dataset.y)
    let number = cell.dataset.number
    log("click event", x, y, number)

    if (number === "9") {
        let cells = es(`[data-number="9"]`)
        for (let cell of cells) {
            cell.classList.add("opened")
        }
        return -1
    } else if (number === "0"){
        vjklAround(square, x, y)
    } else {
        cell.classList.add("opened")
    }
}

// 6. vjklAround 展开周围 cell 周围 8 个元素,
// x 和 y 分别是下标
// 展开周围的元素通过调用 vjkl1 来解决
// 注意, 依然把逻辑放在下一层来处理
const vjklAround = function(square, x, y) {
    log("vjklAround", x, y)
    let selector = `[data-x="${x}"][data-y="${y}"]`
    let ele = e(selector)
    if (!ele.classList.contains("opened")) {
        ele.classList.add("opened")
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

// 7. vjkl1 是重点函数
// 如果满足边界调节, 则继续
// 满足边界的意思是下标符合范围
// 因为 vjkl1 这个函数的作用是展开格子, 所以如果已经展开过, 那么就不展开元素
// 根据 x 和 y 还有属性选择器选择出格子, 具体可以参考
// https://developer.mozilla.org/zh-CN/docs/Web/CSS/Attribute_selectors
// 比如想选中 data-x=3 的元素, 语法是 e('[data-x="3"]')
// 比如想同时选中 data-x=3 且 data-y=5 的元素, 语法是 e('[data-x="3"][data-y="5"]')
// 选择元素之后根据情况来判断
// 如果没有展开过, 继续判断下列情况
// 如果碰到的是 9, 什么都不做.
// 注意, 这里 9 的处理方式和直接点击格子 9 的处理方式不一样
// 点击格子 9 也就是点击到雷, 直接结束游戏
// 这里展开到 9 是指展开到边界情况
// 如果碰到的是 0, 展开, 并且递归调用 vjklAround 函数
// 如果碰到的是其他元素, 展开
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
                ele.classList.add("opened")
            }
        }
    }
}