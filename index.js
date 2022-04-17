
import Staff from "./src/Staff";
import acts from './src/acts'
import { arrayLikeProxy, r_warn, typeCheck } from "./src/util";

const staffs = new Map()

const register = function (el) {
    if (!typeCheck(el)) {
        r_warn('unsupported register object')
        return false
    }
    if (staffs.has(el)) return staffs.get(el)
    const res = new Staff(el)
    staffs.set(el, res)
    return res
}

const r = function (...staff_list) {
    return arrayLikeProxy(staff_list.map(o => register(o)).filter(o => o))
}

// if (import.meta.hot) {
//     import.meta.hot.accept()
// }

export {
    acts,
    r
}

