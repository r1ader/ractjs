import MK from "./MK";
import _ from "./lodash";
import { calculateStyleValue, isKeyboardState } from "./util";

export default class Follower {
    constructor(el) {
        this.ref = el
    }

    create_env(config) {
        // use Proxy to let MK know which key or mouse event was dependent on
        const env = new Proxy({}, {
            get(target, p, receiver) {
                if (p in MK.M) return MK.M[p]
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

    create_callback(config) {
        return () => {
            const env = this.create_env(config)
            this.updateElStyle(config, env)
        }
    }

    bind(config) {
        MK.add_callback(this.create_callback(config))
    }
}