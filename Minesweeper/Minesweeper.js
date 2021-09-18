const bindClearButton = function() {
    let ele = e("#refresh")
    ele.addEventListener("click", function(){
        restart()
    })
}

const bindSubmit = function() {
    let button = e("#input-size-commit")
    button.addEventListener("click", function() {
        let h = e("#input-height").value
        let w = e("#input-width").value
        if (h !== "" && w !== "") {
            h = parseInt(h)
            w = parseInt(w)
            let n = parseInt(h * w / 5.0)
            setCfg(h, w, n)

            restart()
        } else {
            alert("请填入数字！")
        }
    })
}

const bindInput = function() {
    let inputs = es("input")
    for (let input of inputs) {
        input.addEventListener("focus", function() {
            input.value = ""
        })
    }
}

const bindSelection = function() {
    let ele = e("#input-size-selection")
    ele.addEventListener("change", function() {
        log("select event")
        let config = {
            "chu": {
                h: 9,
                w: 9,
                n: 10,
            },
            "zhong": {
                h: 16,
                w: 16,
                n: 40,
            },
            "gao": {
                h: 16,
                w: 30,
                n: 99,
            },
        }
        let diy = e("#input-size")
        let index = ele.selectedIndex
        let value = ele.options[index].value
        let pre_set_list = Object.keys(config)

        if (pre_set_list.includes(value)) {
            if (!diy.classList.contains("hide")) {
                diy.classList.add("hide")
            }

            let current_cfg = config[value]
            setCfg(current_cfg.h, current_cfg.w, current_cfg.n)
            restart()
        } else {
            if (diy.classList.contains("hide")) {
                diy.classList.remove("hide")
            }
        }
    })
}

const bindEvents = function() {
    bindEventDelegate()
    log("bind event delegate")
    bindClearButton()
    bindSubmit()
    bindInput()
    bindSelection()
}

const restart = function() {
    removeAllCells()
    start()
}

const start = function() {
    // 读取配置，生成全 0 矩阵
    log("start! init!")
    localStorage.init = 'false'
    localStorage.gameover = 'false'
    let [h, w, n] = readCfg()
    log("read localStorage h, w, n = ", h, w, n)

    let square = getZeroMap(h, w)
    log("get all-zero matrix")
    renderSquare(square, "#id-div-mime")
    log("insert square to div")
}

const __main__ = function() {
    // let s = '[[9,1,0,0,0,1,1,1,0],[1,1,0,0,1,2,9,1,0],[1,1,1,0,1,9,2,1,0],[1,9,2,1,1,1,1,0,0],[1,2,9,1,0,0,1,1,1],[1,2,1,1,0,1,2,9,1],[9,1,0,0,1,2,9,2,1],[1,2,1,1,1,9,2,1,0],[0,1,9,1,1,1,1,0,0]]'
    // let square = JSON.parse(s)
    // log(square)
    localStorage.debug = "false"
    setCfg(9, 9, 10)
    start()
    bindEvents()
}

__main__()