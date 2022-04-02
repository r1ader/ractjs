
function isObjectLike(value) {
    return typeof value === 'object' && value !== null
}

const lodash_toString = Object.prototype.toString

function getTag(value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]'
    }
    return lodash_toString.call(value)
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

/* harmony default export */ const lodash = ({
    isNumber,
    isArray,
    isString,
    toNumber,
    isFunction,
    compact
});
;// CONCATENATED MODULE: ./src/math.js
function ease_functions(method) {
    switch (method) {
        case 'easeInSine':
            return (x) => {
                return 1 - Math.cos((x * Math.PI) / 2);
            }
        case 'easeInCirc':
            return (x) => {
                return 1 - Math.sqrt(1 - Math.pow(x, 2));
            }

        case 'easeOutSine':
            return (x) => {
                return Math.sin((x * Math.PI) / 2);
            }
        case 'easeOutCirc':
            return (x) => {
                return Math.sqrt(1 - Math.pow(x - 1, 2));
            }

        case 'easeInOutSine':
            return (x) => {
                return -(Math.cos(PI * x) - 1) / 2;
            }
        case 'easeInOutCirc':
            return (x) => {
                return x < 0.5
                    ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
            }

        case 'easeInQuad':
            return (x) => {
                return x * x;
            }
        case 'easeInBack':
            return (x) => {
                const c1 = 1.70158;
                const c3 = c1 + 1;

                return c3 * x * x * x - c1 * x * x;
            }

        case 'easeOutQuad':
            return (x) => {
                return 1 - (1 - x) * (1 - x);
            }
        case 'easeOutExpo':
            return (x) => {
                return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
            }
        case 'easeOutBack':
            return (x) => {
                const c1 = 1.70158;
                const c3 = c1 + 1;

                return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
            }


        case 'easeInOutQuad':
            return (x) => {
                return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
            }
        case 'easeInOutBack':
            return (x) => {
                const c1 = 1.70158;
                const c2 = c1 * 1.525;

                return x < 0.5
                    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
            }
        case 'easeInOutExpo':
            return (x) => {
                return x === 0
                    ? 0
                    : x === 1
                        ? 1
                        : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
                            : (2 - Math.pow(2, -20 * x + 10)) / 2;
            }

        default:
            return (x) => {
                return x
            }
    }
}
;// CONCATENATED MODULE: ./src/util.js
// todo support more unit
function getNumberFromCssValue(value, unit) {
    unit = unit || ''
    // const px_reg = /(-|\d+|\.)+?px/g
    const reg = new RegExp(`^(-|\\d+|\\.)+[${unit}]*$`, 'gi')
    const res = reg.exec(value)
    // clog(value, reg, res)
    if (!res) return undefined
    return parseFloat(res[0].replace('px', ''))
}

function r_warn(msg) {
    console.warn(`r_animate.js warning: ${ msg }`)
}

function isAnimationValid(str) {
    str = str.toString().replace(/(\[(?:-?(?:\d+\.*)*\d+?)?~-?(?:\d+\.*)*\d+?])/g, '0')
    let check_reg = /^-?(?:\d+\.*)*\d+?(?:px|deg|%|turn)?$/g
    if (check_reg.test(str)) return true

    check_reg = /^rgba*\((?:\d+\.*)*\d+?(?:,\s?(?:\d+\.*)*\d+?){2,3}\)$/g
    if (check_reg.test(str)) return true

    check_reg = /^(?:(?:scale|translate|rotate|perspective|skew|matrix)[XYZ]?\(-?(?:\d+\.*)*\d+?(?:px|deg|%|turn)?(?:,\s?-?(?:\d+\.*)*\d+?(?:px|deg|%|turn)?){0,2}\)\s*)+$/g
    return check_reg.test(str);


}

function parseColorProps(start_color, end_color) {
    if ((start_color + end_color).indexOf('a') === -1) {
        const [sr, sg, sb] = start_color.replace('rgb(', '').replace(')', '').replace(/\s/g, '').split(',')
        const [er, eg, eb] = end_color.replace('rgb(', '').replace(')', '').replace(/\s/g, '').split(',')
        return `rgb([${ sr }~${ er }],[${ sg }~${ eg }],[${ sb }~${ eb }])`
    }
}

function defineNameForAct(config) {
    return Object.keys(config).filter(o => config[o])
        .map(o => `${ o } : ${ config[o].toString() }`)
        .join('\n')
}

function util_uuidv4() {
    return Math.floor(Math.random() * 100000000).toString()
}

const clog = console.log
;// CONCATENATED MODULE: ./src/act.js
/* harmony default export */ const act = ({
    FADE_OUT: {
        opacity: '[1~0]'
    },
    FADE_IN: {
        opacity: '[0~1]'
    }
});
;// CONCATENATED MODULE: ./index.js




const expose_func_list = [
    'clean_remain_process',
    'r_animate',
    'r_then',
    'r_busy',
    'r_schedule',
    'r_skip',
    'r_cancel',
    'r_default',
]

const expose_props_list = [
    'r_id',
    'busy',
    'busy_with',
    'schedule',
]

const config_props_list = (/* unused pure expression or super */ null && ([
    'callback',
    'reverse',
    'duration',
    'delay',
    'ease',
]))

const support_props = {
    px_props:
        [
            'width',
            'height',
            'top',
            'left',
            'right',
            'right',
            'bottom',
            'padding',
            'margin',
            'borderRadius',
        ],
    number_props: [
        'zIndex',
        'opacity'
    ],
    color_props: [
        'borderColor',
        'backgroundColor'
    ]
}

const class_prop = [
    'name',
    'callback',
    'reverse',
    'duration',
    'delay',
    'ease',
    'parallel',
    'loop',
    'loop_mode',
]


class Act {
    constructor(argus) {
        Object.keys(argus).forEach(key => {
            this[key] = argus[key]
        })
        this.callback = argus.callback
        this.duration = lodash.isNumber(argus.duration) ? argus.duration : 1000
        this.ease = argus.ease || 'easeOutExpo'
        this.delay = argus.delay || 0
        this.loop = argus.loop
        this.loop_mode = argus.loop_mode
        this.name = argus.name
        this.parallel = argus.parallel
        this.reverse = argus.reverse || false
    }

    // todo support the single item of transform
    //  and auto fill other item with update function

    // todo support the unit change e.g.(em px vw vh)

    // todo move the check step to the constructor
    update(ref) {
        Object.keys(this).filter(o => class_prop.indexOf(o) === -1).forEach(key => {
            if (!isAnimationValid(this[key])) {
                return r_warn(`syntax error ${ key } : ${ this[key] }`)
            }
            Object.keys(support_props).forEach(prop_type => {
                if (support_props[prop_type].indexOf(key) > -1) {
                    if (!ref) return
                    const computed_style = getComputedStyle(ref)
                    if (prop_type === 'color_props') {
                        this[key] = parseColorProps(computed_style[key], this[key])
                        return
                    }
                    const unit = {
                        px_props: 'px',
                        number_props: '',
                    }[prop_type] || ''
                    const uppercasePropName = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                    const origin_str = ref.style[key] || computed_style.getPropertyValue(uppercasePropName) || '0';
                    const origin_value = getNumberFromCssValue(origin_str, unit)
                    if (/\[(-|\d|\.)*?~(-|\d|\.)+?\]/.test(this[key])) {
                        this[key] = this[key].replace(/([\[])(\~)/g, `[${ origin_value }~`)
                        return
                    }
                    const css_value = getNumberFromCssValue(this[key], unit)
                    if (!lodash.isNumber(css_value)) {
                        return r_warn(`Unrecognized Style Value "${ this[key] }"`)
                    }
                    this[key] = `[${ origin_value }~${ css_value }]${ unit }`
                }
            })
        })
    }

    get plan_duration() {
        let res = 0
        if (lodash.isNumber(this.delay)) res += this.delay
        if (lodash.isNumber(this.duration)) res += this.duration
        return res
    }

    toString() {
        return defineNameForAct(this)
    }
}

class Actor {
    constructor(r_id, el) {
        this.r_id = r_id
        this.ref = el
        this.busy = false
        this.busy_with = null
        this.schedule = []
        this.inter_func = (a) => a
        this.default = {}
    }

    run() {
        if (this.busy) return
        if (this.schedule.length === 0) {
            console.warn(this.ref.toString() + '’s schedule is empty')
        }
        const config = this.schedule.shift()
        if (!config) return
        config.update(this.ref)
        this.busy_with = config
        this.busy = true
        this.inter_func = ease_functions(config.ease)
        if (config.delay > 0) {
            setTimeout(() => {
                this.render_process = requestAnimationFrame(() => this.render(0))
            }, config.delay)
        } else {
            this.render_process = requestAnimationFrame(() => this.render(0))

        }
    }

    render(frame_index) {
        const config = this.busy_with
        if (!config) return
        const ratio = this.inter_func(Math.min((frame_index * 16 / config.duration), 1.0))
        Object.keys(config).forEach(key => {
            const extract_number_reg = /\[(-|\d|\.)+?~(-|\d||\.)+?\]/g
            if (!lodash.isString(config[key])) return
            const extract_res = config[key].match(extract_number_reg)
            if (!lodash.isArray(extract_res) || !extract_res.length) return
            let groove = config[key].replace(extract_number_reg, '{}')
            const slots = extract_res.map(range => {
                let [start_value, end_value] = range.replace('[', '').replace(']', '').split('~').map(o => lodash.toNumber(o))
                if (config.reverse) {
                    [start_value, end_value] = [end_value, start_value]
                }
                return start_value + (end_value - start_value) * ratio
            })
            slots.forEach(value => {
                groove = groove.replace('{}', Math.round(value * 1000) / 1000)
            })
            this.ref.style[key] = groove
        })
        if (lodash.isFunction(config.parallel)) {
            config.parallel(ratio)
        }
        if (frame_index * 16 < config.duration) {
            requestAnimationFrame(() => this.render(frame_index + 1))
        } else {
            this.busy = false
            this.busy_with = null
            if (lodash.isFunction(config.callback)) {
                config.callback(this)
            }
            if (config.loop) {
                if (!config.loop) return
                if (lodash.isNumber(config.loop)) {
                    config.loop = config.loop - 1
                }
                if (config.loop === 'alternate' || config.loop_mode === 'alternate') {
                    config.reverse = !config.reverse
                }
                this.schedule.unshift(config)
            }
            if (!!this.schedule.length) {
                this.run()
            }
        }
    }

    r_stop() {
        if (this.render_process) {
            cancelAnimationFrame(this.render_process)
            this.render_process = undefined
        }
        this.busy = false
        this.busy_with = null
    }

    r_cancel() {
        if (this.render_process) {
            cancelAnimationFrame(this.render_process)
            this.render_process = undefined
        }
        this.busy = false
        this.busy_with = null
        this.schedule = []
    }

    clean_remain_process() {
        this.schedule = []
    }

    r_animate(config) {
        this.schedule.push(new Act(Object.assign({ ...this.default }, config)))
        if (!this.busy) {
            setTimeout(() => {
                this.run()
            }, 16)
        }
        return this.ref
    }

    r_then(func) {
        this.schedule.push(new Act({ duration: 0, callback: func }))
        return this.ref
    }

    r_busy() {
        return this.busy
    }

    r_skip() {
        this.schedule.shift()
        return this.ref
    }

    r_schedule() {
        return this.schedule
    }

    r_same(target) {
        target.schedule = target.schedule.concat(this.schedule)
        setTimeout(() => {
            target.run()
        }, 16)
        return target
    }

    r_sleep(delay_duration) {
        this.schedule.push(new Act({
            delay: delay_duration
        }))
        if (!this.busy) {
            setTimeout(() => {
                this.run()
            }, 16)
        }
        return this.ref
    }

    r_default(config) {
        this.default = { ...config }
    }
}

class Director extends Actor {
    constructor() {
        super(
            util_uuidv4().replace(/-/g, ""),
            document.createElement('div')
        );
        this.id = util_uuidv4().replace(/-/g, "")

        this.registered_dict = {}

        this.registered_queue = []

        this.default = {}

    }

    register(args) {
        // todo deal the situation that one dom was registered for more than one time
        const wait_register_queue = []
        if (!lodash.isArray(args)) {
            const r_id = util_uuidv4().replace(/-/g, "")
            wait_register_queue.push(r_id)
            this.registered_dict[r_id] = new Actor(r_id, args)
            this.registered_queue.push(this.registered_dict[r_id])
        } else {
            args = lodash.compact(args)
            args.forEach(item => {
                const r_id = util_uuidv4().replace(/-/g, "")
                wait_register_queue.push(r_id)
                this.registered_dict[r_id] = new Actor(r_id, item)
                this.registered_queue.push(this.registered_dict[r_id])
            })
        }

        wait_register_queue.forEach(r_id => {
            const registered_dom = this.registered_dict[r_id]
            const element = registered_dom.ref
            registered_dom.default = { ...this.default }
            expose_props_list.forEach(props_name => {
                element[props_name] = registered_dom[props_name]
            })
            expose_func_list.forEach(func_name => {
                element[func_name] = registered_dom[func_name].bind(registered_dom)
            })
        })
    }

    take(env) {
        Object.keys(env.$refs).forEach(ref_name => {
            this.register(env.$refs[ref_name])
        })
    }

    stop() {

    }

    continue() {

    }

    cut() {
        // todo rename registered_queue as actors
        this.registered_queue.forEach(member => {
            member.schedule = []
            member.stop()
        })
    }

    read() {
        console.log('I am', this.id)
        return this.registered_queue
    }

    copy(origin, targets) {
        const origin_dom = this.registered_dict[origin.r_id]
        targets.forEach(target => {
            const registered_dom = this.registered_dict[target.r_id]
            registered_dom.schedule = registered_dom.schedule.concat(origin_dom.schedule)
            setTimeout(() => {
                registered_dom.run()
            }, 16)
            return registered_dom.ref
        })
    }

    r_default(config) {
        this.default = { ...config }
        this.registered_queue.forEach(member => {
            member.default = { ...config }
        })
    }
}

const ceo = new Director()

const r_register = ceo.register.bind(ceo)
const r_default = ceo.r_default.bind(ceo)

;

const r = (el) => {
    return new Actor(util_uuidv4(), el)
}


export {
    Director,
    r_register,
    r_default,
    act,
    r
}
