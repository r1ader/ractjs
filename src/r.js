import Staff from "./Staff";
import { arrayLikeProxy, r_warn, typeCheck } from "./util";

const staffs = new Map()

const register = function (el) {
    if (!typeCheck(el)) return r_warn('unsupported register object ' + el.__proto__.toString())
    if (staffs.has(el)) return staffs.get(el)
    return staffs.set(el, new Staff(el)).get(el)
}

export default function (...registry_queue) {
    return arrayLikeProxy(
        registry_queue
            .map(o => register(o))
            .filter(o => o)
    )
}
