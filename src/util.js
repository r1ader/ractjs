// todo support more unit
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

function extractNumber(input){
    return input.split(',').map(o=>o.replace(/\D/g, ''))
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