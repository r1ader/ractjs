import MK from "./MK";
import _ from "./lodash";
import { calculateStyleValue, isKeyboardState, isMouseState, typeCheck } from "./util";

export default class Follower {
    constructor(target) {
        this.ref = target
        this.type = typeCheck(target)
    }

    create_env(config) {
        // use Proxy to let MK know which key or mouse event was dependent on
        // todo init env only once, update env for every follower
        const env = new Proxy({}, {
            get(target, p, receiver) {
                if (isMouseState(p)) return MK.M[p]
                if (isKeyboardState(p)) return MK.K[p]
                return target[p]
            }
        })
        config.computed && Object.keys(config.computed).forEach(key => {
            const func = config.computed[key]
            typeof func === 'function' && (env[key] = func.bind(env)())
        })
        return env
    }

    updateElStyle(config, env) {
        Object.keys(config)
            .filter(o => ['computed'].indexOf(o) === -1)
            .forEach(key => {
                if (typeof config[key] === 'function') {
                    this.ref.style[key] = config[key].bind(env)()
                    return
                }
                this.ref.style[key] = calculateStyleValue(config[key], env)
            })
    }

    updateFoValue(config, env) {
        const updater = this.ref.updater || ((value) => this.ref.value = value)
        _.isString(config) && updater(env[config])
        _.isFunction(config) && updater(config.bind(env)())
    }

    create_callback(config) {
        return () => {
            const env = this.create_env(config)
            this.type === 'dom' && this.updateElStyle(config, env)
            this.type === 'obj' && this.updateFoValue(config, env)
        }
    }

    bind(config) {
        if(!this.ref) return
        return MK.add_callback(this.create_callback(config))
    }

    // todo unbind
    unbind(callback_id) {
        MK.cancel_callback(callback_id)
    }
}
