import Actor from "./Actor";
import Follower from "./Follower";
// todo register follower only when it is necessary
export default class Staff {
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
