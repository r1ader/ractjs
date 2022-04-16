// todo support more unit
import _ from "./lodash";

export function getNumberFromCssValue(value, unit) {
    unit = unit || ''
    // const px_reg = /(-|\d+|\.)+?px/g
    const reg = new RegExp(`^(-|\\d+|\\.)+[${unit}]*$`, 'gi')
    const res = reg.exec(value)
    // clog(value, reg, res)
    if (!res) return undefined
    return parseFloat(res[0].replace('px', ''))
}

export function r_warn(msg) {
    console.warn(`ract.js warning: ${ msg }`)
}

export function isAnimationValid(str) {
    str = str || ''
    str = str.toString().replace(/(\[(?:-?(?:\d+\.*)*\d+?)?~-?(?:\d+\.*)*\d+?])/g, '0')
    let check_reg = /^-?(?:\d+\.*)*\d+?(?:px|deg|%|turn)?$/g
    if (check_reg.test(str)) return true

    check_reg = /^rgba*\((?:\d+\.*)*\d+?(?:,\s?(?:\d+\.*)*\d+?){2,3}\)$/g
    if (check_reg.test(str)) return true

    check_reg = /^(?:(?:blur|scale|translate|rotate|perspective|skew|matrix)[XYZ]?\(-?(?:\d+\.*)*\d+?(?:px|deg|%|turn)?(?:,\s?-?(?:\d+\.*)*\d+?(?:px|deg|%|turn)?){0,2}\)\s*)+$/g
    return check_reg.test(str);


}

function extractNumber(input) {
    return input.split(',').map(o => o.replace(/\D/g, ''))
}

export function parseColorProps(start_color, end_color) {
    let sr, sg, sb
    let sa = 1
    let er, eg, eb
    let ea = 1
    if (start_color.indexOf('a') === -1) {
        [sr, sg, sb] = extractNumber(start_color)
    } else {
        [sr, sg, sb, sa] = extractNumber(start_color)
    }
    if (end_color.indexOf('a') === -1) {
        [er, eg, eb] = extractNumber(end_color)
    } else {
        [er, eg, eb, ea] = extractNumber(end_color)
    }
    return `rgba([${ sr }~${ er }],[${ sg }~${ eg }],[${ sb }~${ eb }],[${ sa }~${ ea }])`

}

export function defineNameForAct(config) {
    return Object.keys(config).filter(o => config[o])
        .map(o => `${ o } : ${ config[o].toString() }`)
        .join('\n')
}

export function generate_id() {
    return Math.floor(Math.random() * 100000000).toString()
}

export const clog = console.log

export function updateElStyle(el, key, value, ratio, reverse = false) {
    const extract_number_reg = /\[(-|\d|\.)+?~(-|\d|\.)+?]/g
    const extract_res = value.match(extract_number_reg)
    if (!_.isArray(extract_res) || !extract_res.length) return
    let groove = value.replace(extract_number_reg, '{}')
    const slots = extract_res.map(range => {
        let [start_value, end_value] = range.replace('[', '').replace(']', '').split('~').map(o => _.toNumber(o))
        if (reverse) {
            [start_value, end_value] = [end_value, start_value]
        }
        return start_value + (end_value - start_value) * ratio
    })
    slots.forEach(value => {
        let num_value = Math.round(value * 1000) / 1000
        if (key === 'zIndex') {
            num_value = Math.round(num_value)
        }
        groove = groove.replace('{}', num_value)
    })
    if (el.style[key] !== groove) {
        el.style[key] = groove
    }
}

export function calculateStyleValue(value, env) {
    let value_reg_global = /\[(.+?)]/g
    let value_reg = /\[(.+?)]/
    let groove = value.replaceAll(value_reg_global, '{}')
    let slots = []
    let temp_str = value
    while (value_reg.test(temp_str)) {
        slots.push(value_reg.exec(temp_str)[1])
        temp_str = temp_str.replace(value_reg, '')
    }
    slots = slots.map(o => {
        for (let key in env) {
            try {
                if (new RegExp(`(?:^|[\(\)+\\-*/\s])${key}(?:$|[\(\)+\\-*/\s])`).test(o)) {
                    return eval(o.replace(key, env[key]))
                }
            } catch (e) {
            }
        }
        return o
    })
    while (slots.length) groove = groove.replace('{}', slots.shift())
    return groove
}

export function isKeyboardState(prop) {
    // todo support all key event at all os
    if (/Key[A-Z]/.test(prop)) return true
    return /(Enter)/.test(prop);

}

export function isMouseState(prop) {
    // todo support all mouse event at all os
    return ['clientX', 'clientY'].indexOf(prop) > -1
}