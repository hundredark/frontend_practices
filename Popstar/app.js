const init = (canvas) => {
    let ctx = canvas.getContext("2d")

    let grid = new Grids(ctx)
    return grid
}

const bindMousemoveEvent = (grid) => {
    let canvas = e("#popstar-canvas")
    canvas.addEventListener("mousemove", (event) => {
        let x = event.clientX
        let y = event.clientY

        grid.hover([x, y])
    })
}

const bindKeydownEvent = (grid) => {
    let canvas = e("#popstar-canvas")
    canvas.addEventListener("click", (event) => {
        let x = event.clientX
        let y = event.clientY

        grid.click([x, y])
    })
}

const bindClickEvent = (grid) => {
    let button = e(".ok-button")
    button.addEventListener("click", () => {
        grid.restart()
        let modal = e(".modal-container")
        modal.classList.add("hide")
    })
}

const bindEvents = (grid) => {
    bindMousemoveEvent(grid)
    bindKeydownEvent(grid)
    bindClickEvent(grid)
}

const __main__ = () => {
    let canvas = e("#popstar-canvas")
    canvas.width = 662
    canvas.height = 662

    if (canvas.getContext){
        let grid = init(canvas)
        bindEvents(grid)


    } else {
        // canvas-unsupported code here
        alert("你的浏览器不支持 canvas，请升级你的浏览器。")
    }
}

__main__()