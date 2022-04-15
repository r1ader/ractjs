import _ from "./src/lodash.js";
import Actor from "./src/Actor";
import acts from './src/acts.js'
import Follower from "./src/Follower";

const staffs = new Map()
const followers = new Map()

class Staff {
    constructor(el) {
        this.actor = new Actor(el)
        this.follower = new Follower(el)
        const _this = this
        return new Proxy(el, {
            get(target, prop) {
                if (prop in _this.actor) return _this.actor[prop]
                if (prop in _this.follower) return _this.follower[prop]
            },
            set(target, prop, value) {
                if (prop in _this.actor) return Reflect.set(_this.actor, prop, value)
                if (prop in _this.follower) return Reflect.set(_this.follower, prop, value)
            }
        })
    }
}

const register = function (el) {
    if (staffs.has(el)) return staffs.get(el)
    const res = new Staff(el)
    staffs.set(el, res)
    return res
}

const r = function (...staff_list) {
    return new Proxy(staff_list.map(o => register(o)), {
        get: function (target, p) {
            if (target.every(o => _.isFunction(o[p]))) {
                return function () {
                    const _args = arguments
                    target.forEach(function (actor) {
                        actor[p](..._args)
                    })
                    return this
                }
            } else {
                return new Map(target.map(o => [o, o[p]]))
            }
        }
    })

}

// if (import.meta.hot) {
//     import.meta.hot.accept()
// }

export {
    acts,
    r
}

