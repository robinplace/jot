var JOT = {}
JOT.textarea = document.getElementById ('jot')
JOT.controls = {}
JOT.controls.contrast = document.getElementById ('contrast')

JOT.update = function () {
    document.body.setAttribute ('class', localStorage.classes || '')
    JOT.textarea.value = localStorage.text || ''

    JOT.textarea.focus ()

    JOT.textarea.selectionStart = localStorage.selectionStart || 0
    JOT.textarea.selectionEnd = localStorage.selectionEnd || 0

    JOT.textarea.scrollTop = localStorage.scroll || 0
}
window.addEventListener ('storage', function () {
    // just queue it if we're unfocused
    if (!JOT.focused) {
        JOT.shouldUpdate = true
        return
    }

    JOT.update ()
})


// WINDOW FREEZE ON BLUR MECHANISM
window.addEventListener ('focus', function () { JOT.focus () })
document.addEventListener ('visibilitychange', function () {
    console.log ('vc')
    if (document.visibilityState === 'visible') JOT.focus ()
    else JOT.blur () })
window.addEventListener ('blur', function () { JOT.blur () })
JOT.focus = function () {
    JOT.focused = true
    console.log ('in')

    // if there've been changes, update (see 'storage' listener)
    if (JOT.shouldUpdate) {
        JOT.update ()
        JOT.shouldUpdate = false
    }

    JOT.textarea.disabled = false
}
JOT.blur  = function () {
    JOT.focused = false
    JOT.textarea.disabled = true
}
JOT.update ()


// TEXTAREA SAVE CHANGES MECHANISM
var throttle = function (fn, threshold) {
    var last, deferTimer
    return function () {
        var now = Date.now (),
            args = arguments
        if (last && now < last + threshold) {
            clearTimeout (deferTimer)
            setTimeout (function () {
                last = now
                fn.apply (this, args)
            }, threshold)
        } else {
            last = now
            fn.apply (this, args)
        }
    }
}
JOT.textarea.addEventListener ('keyup', throttle (function () {
    localStorage.text = JOT.textarea.value
}, 200))


// SCROLL SAVE MECHANISM
JOT.textarea.addEventListener ('scroll', throttle (function () {
    localStorage.scroll = JOT.textarea.scrollTop
}, 200))


// SELECTION SAVE MECHANISM
JOT.selectChange = throttle (function () {
    localStorage.selectionStart = JOT.textarea.selectionStart
    localStorage.selectionEnd = JOT.textarea.selectionEnd
}, 200)
document.addEventListener ('select', JOT.selectChange)
document.addEventListener ('selectionchange', JOT.selectChange)


// LIGHTNESS SAVE MECHANISM
JOT.controls.contrast.addEventListener ('click', function () {
    var classes = (localStorage.classes || '').split (/ +/g)

    var index = classes.indexOf ('light')
    if (index === -1) classes.push ('light')
    else classes.splice (classes.indexOf ('light'), 1)

    localStorage.classes = classes.join (' ')
    JOT.update ()
})

JOT.textarea.addEventListener ('keydown', function (ev) {
    if (ev.keyCode === 9) { // don't leave on <Tab>
        ev.preventDefault ()
    }
})
