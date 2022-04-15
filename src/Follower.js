import MK from "./MK";

export default class Follower {
    constructor(el) {
        this.ref = el
    }


    bind(config) {
        let value_reg_global = /\[(.+?)]/g
        let value_reg = /\[(.+?)]/

        MK.add_M_event((M, K) => {
            for (let key in config) {
                let groove = config[key].replaceAll(value_reg_global, '{}')
                let slots = []
                let temp_str = config[key]
                while (value_reg.test(temp_str)) {
                    slots.push(value_reg.exec(temp_str)[1])
                    temp_str = temp_str.replace(value_reg, '')
                }
                slots = slots.map(o => {
                    for (let key in M) {
                        if (o.indexOf(key) > -1) return o.replace(key, M[key])
                    }
                    return o
                }).map(o => eval(o))
                while (slots.length) groove = groove.replace('{}', slots.shift())
                this.ref.style[key] = groove
            }
        })
    }
}