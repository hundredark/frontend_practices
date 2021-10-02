log = console.log.bind(console)

const e = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `元素没找到, 选择器 ${selector} 不对`
        alert(s)
        // return null 方便后续处理 e 函数的返回值
        return null
    } else {
        return element
    }
}

const es = function(selector) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        let s = `元素没找到, 选择器 ${selector} 不对`
        alert(s)
        // return [] 方便后续处理 es 函数的返回值
        return []
    } else {
        return elements
    }
}

const removeClassAll = function(className) {
    let elements = es(`.${className}`)
    for (let element of elements) {
        element.classList.remove(className)
    }
}