const getNextIndex = function(shift) {
    let img_div = e(".slide-imgs")
    let img_number = Number(img_div.dataset.imgs)
    let current_id = Number(img_div.dataset.active)
    let new_id = (current_id + img_number + shift) % img_number
    return new_id
}

const dotShow = function(index) {
    removeClassAll("slide-dot-active")
    let dot = e(`#slide-img-dot-${index}`)
    dot.classList.add("slide-dot-active")
}

const imgShow = function(index) {
    removeClassAll("slide-img-active")
    let img = e(`#id-img-${index}`)
    img.classList.add("slide-img-active")
}

const div_active_update = function(index) {
    let img_div = e(".slide-imgs")
    img_div.dataset.active = String(index)
}

const showAtIndex = function(index) {
    imgShow(index)
    dotShow(index)
    div_active_update(index)
}

const imgSlide = function(shift) {
    let new_id = getNextIndex(shift)
    showAtIndex(new_id)
}

const bindButtonEvents = function() {
    let button_div = e(".slide-img-buttons")
    button_div.addEventListener("click", function(event) {
        let self = event.target
        if (self.classList.contains("slide-img-button")) {
            let shift = Number(self.dataset.offset)
            imgSlide(shift)
        }
    })
}

const dotSlide = function(dot_ele) {
    let dot_id = dot_ele.id
    dot_id = Number(dot_id[dot_id.length - 1])

    showAtIndex(dot_id)
}

const bindDotEvents = function() {
    let ele = e(".slide-img-dots")
    ele.addEventListener("mouseover", function (event) {
        self = event.target
        if (self.classList.contains("slide-img-dot")) {
            dotSlide(self)
        }
    })
}

const bindAllEvents = function() {
    bindButtonEvents()
    bindDotEvents()
}

const showNext = function() {
    let new_id = getNextIndex(1)
    showAtIndex(new_id)
}

const autoPlay = function() {
    let clock = setInterval(showNext, 2000)
}

const __main__ = function() {
    bindAllEvents()
    autoPlay()
}

__main__()