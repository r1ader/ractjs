import _ from "./src/lodash.js";
import Actor from "./src/Actor";
import acts from './src/acts.js'

const actors = new Map()

const register_actor = function (el) {
    if (actors.has(el)) {
        return actors.get(el)
    }
    const res = new Proxy(new Actor(el), {
        get(target, prop) {
            if (prop in target) {
                return target[prop]
            } else {
                return target['ref'][prop]
            }
        },
        set(target, prop, value) {
            if (prop in target) {
                return Reflect.set(target, prop, value)
            } else {
                return Reflect.set(target['ref'], prop, value)
            }
        }
    })
    actors.set(el, res)
    return res
}

const r = function () {
    let actor_list = []
    for (let el_index in arguments) {
        actor_list.push(register_actor(arguments[el_index]))
    }
    if (actor_list.length === 1) {
        return actor_list[0]
    } else {
        return new Proxy(actor_list, {
            get: function (target, p) {
                if (target.every(o => _.isFunction(o[p]))) {
                    return function () {
                        const _argus = arguments
                        target.forEach(function (actor) {
                            actor[p](..._argus)
                        })
                        return this
                    }
                } else {
                    return new Map(target.map(o => [o, o[p]]))
                }
            }
        })
    }
}

// if (import.meta.hot) {
//     import.meta.hot.accept()
// }

export {
    acts,
    r
}

