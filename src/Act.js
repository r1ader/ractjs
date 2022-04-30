import _ from "./lodash";
import {
    class_prop,
    regex_standard_act_style_value
} from "./const";
import {
    define_name_for_act,
    parse_loop,
    act_style_standardify
} from "./util";

export default class Act {
    constructor(argus) {
        Object.assign(this, argus)
        this.duration ||= 1000
        this.ease ||= 'easeOutExpo'
        this.target ||= 'self'
        _.isString(this.loop) && parse_loop(this)
    }

    // todo support the single item of transform
    //  and auto fill other item with update function

    // todo support the unit change e.g.(em px vw vh)

    // todo move the check step to the constructor
    update(ref) {
        Object.keys(this)
            .filter(o => class_prop['act'].indexOf(o) === -1)
            .forEach(key => {
                if (regex_standard_act_style_value.test(this[key])) return
                this[key] ??= act_style_standardify(ref, key, this[key])
            })
    }

    toString() {
        return define_name_for_act(this)
    }
}
