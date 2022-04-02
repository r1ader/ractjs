function isObjectLike(value) {
    return typeof value === 'object' && value !== null
}

const toString = Object.prototype.toString

function getTag(value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }
    return toString.call(value)
}

function isNumber(value) {
    return typeof value === 'number' ||
        (isObjectLike(value) && getTag(value) == '[object Number]')
}

const isArray = Array.isArray

function isString(value) {
    const type = typeof value
    return type === 'string' || (type === 'object' && value != null && !Array.isArray(value) && getTag(value) == '[object String]')
}

const NAN = 0 / 0

/** Used to match leading and trailing whitespace. */
const reTrim = /^\s+|\s+$/g

/** Used to detect bad signed hexadecimal string values. */
const reIsBadHex = /^[-+]0x[0-9a-f]+$/i

/** Used to detect binary string values. */
const reIsBinary = /^0b[01]+$/i

/** Used to detect octal string values. */
const reIsOctal = /^0o[0-7]+$/i

/** Built-in method references without a dependency on `root`. */
const freeParseInt = parseInt

function isObject(value) {
    const type = typeof value
    return value != null && (type === 'object' || type === 'function')
}

function isSymbol(value) {
    const type = typeof value
    return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]')
}

function toNumber(value) {
    if (typeof value === 'number') {
        return value
    }
    if (isSymbol(value)) {
        return NAN
    }
    if (isObject(value)) {
        const other = typeof value.valueOf === 'function' ? value.valueOf() : value
        value = isObject(other) ? `${ other }` : other
    }
    if (typeof value !== 'string') {
        return value === 0 ? value : +value
    }
    value = value.replace(reTrim, '')
    const isBinary = reIsBinary.test(value)
    return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value)
}

function isFunction(value) {
    return typeof value === 'function'
}

function compact(array) {
    let resIndex = 0
    const result = []

    if (array == null) {
        return result
    }

    for (const value of array) {
        if (value) {
            result[resIndex++] = value
        }
    }
    return result
}

export default {
    isNumber,
    isArray,
    isString,
    toNumber,
    isFunction,
    compact
}