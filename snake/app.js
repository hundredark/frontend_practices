const init = (canvas) => {
    let canvas_w = parseInt(canvas.width)
    let canvas_h = parseInt(canvas.height)

    let ctx = canvas.getContext("2d")
    let snake = new Snake(ctx, canvas_w, canvas_h)
    return snake
}

const bindKeyboardEvents = (snake) => {
    let body = e("body")
    body.addEventListener("keydown", (event) => {
        let input = e("#input")
        let input_dict = {
            13: "enter",
            37: "left arrow",
            38: "up arrow",
            39: "right arrow",
            40: "down arrow",
            82: "r",
        }

        let code = event.keyCode
        log('press', code)
        if ([37, 38, 39, 40].includes(code) && snake.game_start === true && snake.game_pause === false) {
            let new_dir = code - 37
            snake.cur_dir = new_dir
            log('方向', new_dir)
            clearInterval(snake.clock)
            snake.autoMove()
            input.innerHTML = input_dict[code]
        } else if (code === 13 && snake.game_start === false) {
            log('开始')
            snake.startGame()
            input.innerHTML = input_dict[code]
        } else if (code === 13 && snake.game_start === true && snake.game_pause === false) {
            log('暂停')
            snake.pause('pause')
            input.innerHTML = input_dict[code]
        } else if(code === 82 && snake.game_start === true) {
            log('重新开始')
            snake.restartCheck()
            input.innerHTML = input_dict[code]
        }
    })
}

const bindClickEvents = (snake) => {
    let div = e(".modal-container")
    div.addEventListener("click", (event) => {
        self = event.target

        if (self.classList.contains("ok-button")) {
            let mask = e(".modal-container")
            mask.classList.add("hide")
            let parent = self.parentElement.parentElement
            parent.classList.add("hide")
            if (parent.classList.contains("pause-container")) {
                log("暂停后的 继续")
                snake.startGame()
            } else if (parent.classList.contains("end-container") || parent.classList.contains("restart-container"))  {
                log('重新开始')
                snake.restart()
            }
        } else if (self.classList.contains("cancel-button")) {
            log("取消重新开始后的 继续")
            let mask = e(".modal-container")
            mask.classList.add("hide")
            let parent = self.parentElement.parentElement
            parent.classList.add("hide")

            snake.startGame()
        }
    })
}

const bindEvents = (snake) => {
    bindKeyboardEvents(snake)
    bindClickEvents(snake)
}

const __main__ = () => {
    let canvas = e("#game-canvas")

    if (canvas.getContext){
        let snake = init(canvas)
        bindEvents(snake)
    } else {
        // canvas-unsupported code here
        alert("你的浏览器不支持 canvas，请升级你的浏览器。")
    }
}

__main__()