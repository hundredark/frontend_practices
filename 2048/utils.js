log = console.log.bind(console)

const e = function(selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `元素没找到, 选择器 ${selector} 错误`
        log(s)
        return null
    } else {
        return element
    }
}

const es = function(selector) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        let s = `元素没找到, 选择器 ${selector} 错误`
        log(s)
        //
        return []
    } else {
        return elements
    }
}

const arrayDeepClone = function(array) {
    // deepClone 一个数组并且返回
    // 注意, 要求实现深拷贝

    // 新建一个空数组 l
    // 遍历 array 得到元素
    // 如果元素是数组
    //      递归调用 arrayDeepClone 函数并把元素作为参数
    //      将得到的返回值添加到 l 中
    // 如果元素不是空数组
    //      直接把元素添加到 l 中
    let l = []
    for (let ele of array) {
        if (Array.isArray(ele)) {
            l.push(arrayDeepClone(ele))
        } else {
            l.push(ele)
        }
    }
    return l
}

const randomInt = function(maxNum) {
    let res = parseInt(Math.random() * maxNum, 10)
    return res
}