export class MK {
    constructor() {
        const _this = this
    }

    add_M_event(func) {
        document.addEventListener('mousemove', function (e) {
            func({
                MOUSE_X: e.clientX,
                MOUSE_Y: e.clientY
            }, {})
        }, true)
    }
}

export default new MK()