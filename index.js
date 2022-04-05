import _ from "./src/lodash.js";
import { parseEasings } from "./src/math.js"
import acts from './src/act.js'
import {
    getNumberFromCssValue,
    isAnimationValid,
    r_warn,
    parseColorProps,
    defineNameForAct,
    generate_id, updateElStyle
} from "./src/util.js";

const EASE = Symbol('ease_function')

const support_parse_props = {
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
    'target'
]

class Act {
    constructor(argus) {
        Object.keys(argus).forEach(key => {
            this[key] = argus[key]
        })
        this.callback = argus.callback
        this.duration = _.isNumber(argus.duration) ? argus.duration : 1000
        this.ease = argus.ease || 'easeOutExpo'
        this.delay = argus.delay || 0
        this.loop = argus.loop
        this.loop_mode = argus.loop_mode
        this.name = argus.name
        this.parallel = argus.parallel
        this.reverse = argus.reverse || false
        this.target = argus.target || 'self'
    }

    // todo support the single item of transform
    //  and auto fill other item with update function

    // todo support the unit change e.g.(em px vw vh)

    // todo move the check step to the constructor
    update(ref) {
        Object.keys(this).filter(o => class_prop.indexOf(o) === -1).forEach(key => {
            // if (!isAnimationValid(this[key])) {
            //     return r_warn(`syntax error ${ key } : ${ this[key] }`)
            // }
            if (/\[(-|\d|\.)+?~(-|\d|\.)+?]/.test(this[key])) {
                return
            }
            Object.keys(support_parse_props).forEach(prop_type => {
                if (support_parse_props[prop_type].indexOf(key) > -1) {
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
                    if (!_.isNumber(css_value)) {
                        return r_warn(`Unrecognized Style Value "${ this[key] }"`)
                    }
                    this[key] = `[${ origin_value }~${ css_value }]${ unit }`
                }
            })
        })
        if (_.isString(this.loop)) {
            const { loop } = this
            if (loop.split(' ').length === 2) {
                const [loop_num, loop_mode] = loop.split(' ')
                this['loop'] = parseInt(loop_num)
                this['loop_mode'] = loop_mode
            }
        }
    }

    get plan_duration() {
        let res = 0
        if (_.isNumber(this.delay)) res += this.delay
        if (_.isNumber(this.duration)) res += this.duration
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
        this.orignal_ref = el
        this.busy = false
        this.busy_with = null
        this.schedule = []
        this[EASE] = (a) => a
        this.default = {}
        this.render_process = null
    }

    run() {
        if (!this.beforeRender()) return
        const config = this.busy_with
        if (config.delay > 0) {
            setTimeout(() => {
                this.render_process = requestAnimationFrame(() => this.render(0))
            }, config.delay)
        } else {
            this.render_process = requestAnimationFrame(() => this.render(0))
        }
    }

    beforeRender() {
        if (this.busy) return false
        const config = this.schedule.shift()
        if (!config) return false
        if (config.target === 'wrap' && this.ref === this.orignal_ref) this.createWrap()
        if (config.target === 'copy') this.createCopy()
        config.update(this.ref)
        this.busy_with = config
        this.busy = true
        this[EASE] = parseEasings(config.ease)
        return true
    }

    render(frame_index) {
        const config = this.busy_with
        if (!config) return
        const ratio = this[EASE](Math.min((frame_index * 16.7 / config.duration), 1.0))
        Object.keys(config).forEach(key => {
            if (!_.isString(config[key])) return
            // todo extract regex out of render
            updateElStyle(this.ref, key, config[key], ratio, config.reverse)
        })
        if (_.isFunction(config.parallel)) {
            config.parallel(ratio)
        }
        if (frame_index * 16.7 < config.duration) {
            this.render_process = requestAnimationFrame(() => this.render(frame_index + 1))
        } else {
            this.rendered()
        }
    }

    rendered() {
        const config = this.busy_with
        if (config.callback) this.createCallback()
        if (config.loop) this.createLoop()
        if (config.target === 'wrap' && !config.loop) this.cleanWrap()
        if (config.copy) this.cleanCopy()
        this.busy = false
        this.busy_with = null
        if (!!this.schedule.length) this.run()
    }

    createCallback() {
        const config = this.busy_with
        if (_.isFunction(config.callback)) {
            config.callback(this)
        }
        if (_.isArray(config.callback) && config.callback.length) {
            this.schedule = config.callback.map(o => new Act(o)).concat(this.schedule)
        }
    }

    createLoop() {
        const config = new Act({ ...this.busy_with })
        if (_.isNumber(config.loop)) {
            config.loop = config.loop - 1
        }
        if (config.loop === 'alternate' || config.loop_mode === 'alternate') {
            config.reverse = !config.reverse
        }
        config.delay = 0
        this.schedule.unshift(config)
    }

    createWrap() {
        const parent = this.ref.parentElement
        parent.removeChild(this.ref)
        const container = document.createElement('div')
        container.appendChild(this.ref)
        parent.appendChild(container)
        this.ref = container
    }

    createCopy() {
        const parent = this.ref.parentElement
        const copy = this.ref.cloneNode(true)
        copy.style.position = 'absolute'
        parent.appendChild(copy)
        this.ref = copy
    }

    cleanWrap() {
        const parent = this.ref.parentElement
        parent.removeChild(this.ref)
        parent.appendChild(this.orignal_ref)
        this.ref = this.orignal_ref
    }

    cleanCopy() {
        const parent = this.ref.parentElement
        parent.removeChild(this.ref)
        parent.appendChild(this.orignal_ref)
        this.ref = this.orignal_ref
    }

    cancel() {
        if (this.render_process) {
            cancelAnimationFrame(this.render_process)
            this.render_process = undefined
        }
        this.busy = false
        this.busy_with = null
        this.schedule = []
        return this
    }

    act(config) {
        this.schedule.push(new Act(Object.assign({ ...this.default }, config)))
        if (this.busy) return this
        window.queueMicrotask(() => this.run())
        return this
    }

    then(func) {
        this.schedule.push(new Act({ duration: 0, callback: func }))
        return this
    }
}

const actors = new Map()

const register_actor = function (el) {
    if (el.r_id) {
        r_warn(`"${ el.tagName }.${ el.className }" is already registered`)
        return el
    }
    if (actors.has(el)) {
        return actors.get(el)
    }
    const res = new Proxy(new Actor(generate_id(), el), {
        get(target, prop) {
            if (prop in target) {
                return target[prop]
            } else {
                return target['ref'][prop]
            }
        },
        set(target, prop, value) {
            if (prop in target) {
                return Reflect.set(target, prop, value)
            } else {
                return Reflect.set(target['ref'], prop, value)
            }
        }
    })
    actors.set(el, res)
    return res
}

const r = function () {
    let actor_list = []
    for (let el_index in arguments) {
        actor_list.push(register_actor(arguments[el_index]))
    }
    if (actor_list.length === 1) {
        return actor_list[0]
    } else {
        return new Proxy(actor_list, {
            get: function (target, p) {
                if (target.every(o => _.isFunction(o[p]))) {
                    return function () {
                        const _argus = arguments
                        target.forEach(function (actor) {
                            actor[p](..._argus)
                        })
                        return this
                    }
                } else {
                    return new Map(target.map(o => [o, o[p]]))
                }
            }
        })
    }
}

// if (import.meta.hot) {
//     import.meta.hot.accept()
// }

export {
    acts,
    r
}

