const init = function() {
    localStorage.gameover = false

    renderSquare("#grid")
    randomInitBlock()
    randomInitBlock()
    log("init square", window.square)

    let current = e("#current_score")
    localStorage.current_score = 0
    current.innerHTML = "0"

    let best = e("#best_score")
    let best_score = localStorage.best_score
    if (best_score === undefined) {
        best.innerHTML = 0
    } else {
        best.innerHTML = best_score
    }

    let keyboard = e("#keyboard")
    keyboard.innerHTML = ""
}

const bindRefreshEvents= function() {
    let ele = e("#refresh")
    ele.addEventListener("click", function() {
        log("===============================================")
        log("restart game")
        let rows = es(".row")
        for (let row of rows) {
            row.remove()
        }

        window.square = arrayDeepClone(getZeroSquare(4, 4))
        init()
    })
}

const __main = function() {
    init()
    bindMoveEvents()
    bindRefreshEvents()
}

var square = getZeroSquare(4, 4);
__main()