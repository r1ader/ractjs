import { isKeyboardState, isMouseState } from "./util";

export class MK {
    constructor() {
        const _this = this
        this.M = this.init_M()
        this.K = this.init_K()
        this.callback = null
        this.callback_count = 0
        this.mousemove_followers = new Map()
        this.keydown_followers = new Map()
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
                _this.mousemove_followers.set(_this.callback_count, _this.callback)
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
            get: function (target, key, receiver) {
                // console.log('get', p)
                if (!_this.callback || !isKeyboardState(key)) return target[key]
                !_this.keydown_followers.has(key) && _this.keydown_followers.set(key, new Map())
                _this.keydown_followers.get(key).set(_this.callback_count, _this.callback)
                return target[key]
            },
            set: function (target, key, value, receiver) {
                // console.log('set', p)
                const res = Reflect.set(target, key, value)
                _this.keydown_followers.has(key) && _this.keydown_followers.get(key).forEach(func => {
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
        return this.callback_count++
    }

    cancel_callback(callback_id) {
        this.keydown_followers.forEach(mp => {
            mp instanceof Map &&
            mp.has(callback_id) &&
            mp.delete(callback_id)
        })
        this.mousemove_followers.has(callback_id) && this.mousemove_followers.delete(callback_id)
    }
}

export default new MK()
