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
    console.warn(`r_animate.js warning: ${ msg }`)
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

export function parseColorProps(start_color, end_color) {
    if ((start_color + end_color).indexOf('a') === -1) {
        const [sr, sg, sb] = start_color.replace('rgb(', '').replace(')', '').replace(/\s/g, '').split(',')
        const [er, eg, eb] = end_color.replace('rgb(', '').replace(')', '').replace(/\s/g, '').split(',')
        return `rgb([${ sr }~${ er }],[${ sg }~${ eg }],[${ sb }~${ eb }])`
    }
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