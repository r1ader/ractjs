import { isKeyboardState, isMouseState } from "./util";

export class MK {
    constructor() {
        const _this = this
        this.M = this.init_M()
        this.K = this.init_K()
        this.callback = null
        this.mousemove_followers = []
        this.keydown_followers = {}
        document.addEventListener('mousemove', function (e) {
            _this.M.clientX = e.clientX
            _this.M.clientY = e.clientY
        }, true)
        document.addEventListener('keydown', function (e) {
            _this.K[e.code] = true
        }, true)
        document.addEventListener('keyup', function (e) {
            _this.K[e.code] = false
        }, true)
    }

    init_M() {
        const _this = this
        return new Proxy({
            clientX: 0,
            clientY: 0,
        }, {
            get: function (target, p, receiver) {
                if (!_this.callback || !isMouseState(p)) return target[p]
                if (_this.mousemove_followers.indexOf(_this.callback) === -1) {
                    _this.mousemove_followers.push(_this.callback)
                }
                return target[p]
            },
            set(target, p, value, receiver) {
                // console.log('set', p)
                const res = Reflect.set(target, p, value)
                _this.mousemove_followers && _this.mousemove_followers.forEach(func => {
                    typeof func === 'function' && func()
                })
                return res
            }
        })
    }

    init_K() {
        const _this = this
        return new Proxy({}, {
            get: function (target, p, receiver) {
                // console.log('get', p)
                if (!_this.callback || !isKeyboardState(p)) return target[p]
                _this.keydown_followers[p] ||= []
                if (_this.keydown_followers[p].indexOf(_this.callback) === -1) {
                    _this.keydown_followers[p].push(_this.callback)
                }
                return target[p]
            },
            set: function (target, p, value, receiver) {
                // console.log('set', p)
                const res = Reflect.set(target, p, value)
                _this.keydown_followers[p] && _this.keydown_followers[p].forEach(func => {
                    typeof func === 'function' && func()
                })
                return res
            }
        })
    }


    update() {

    }

    add_callback(callback) {
        this.callback = callback
        // console.log(callback)
        callback(this.M, this.K)
        this.callback = null
    }
}

export default new MK()