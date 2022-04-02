import _ from "./src/lodash.js";
import { parseEasings } from "./src/math.js"
import act from './src/act.js'
import {
    getNumberFromCssValue,
    isAnimationValid,
    r_warn,
    parseColorProps,
    defineNameForAct,
    generate_id
} from "./src/util.js";

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
    'default',
    'ease_func',
]

const config_props_list = [
    'callback',
    'reverse',
    'duration',
    'delay',
    'ease',
]

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
            if (!isAnimationValid(this[key])) {
                return r_warn(`syntax error ${ key } : ${ this[key] }`)
            }
            Object.keys(support_props).forEach(prop_type => {
                if (support_props[prop_type].indexOf(key) > -1) {
                    if (!ref) return
                    const computed_style = getComputedStyle(ref)
                    // todo check -> if (prop_type === 'color_props') {parseColorProps}
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
        this.ease_func = (a) => a
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
        this.ease_func = parseEasings(config.ease)
        return true
    }

    render(frame_index) {
        const config = this.busy_with
        if (!config) return
        const ratio = this.ease_func(Math.min((frame_index * 16 / config.duration), 1.0))
        Object.keys(config).forEach(key => {
            const extract_number_reg = /\[(-|\d|\.)+?~(-|\d||\.)+?\]/g
            if (!_.isString(config[key])) return
            const extract_res = config[key].match(extract_number_reg)
            if (!_.isArray(extract_res) || !extract_res.length) return
            let groove = config[key].replace(extract_number_reg, '{}')
            const slots = extract_res.map(range => {
                let [start_value, end_value] = range.replace('[', '').replace(']', '').split('~').map(o => _.toNumber(o))
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
        if (_.isFunction(config.parallel)) {
            config.parallel(ratio)
        }
        if (frame_index * 16 < config.duration) {
            requestAnimationFrame(() => this.render(frame_index + 1))
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
        return this
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
        return this
    }

    r_then(func) {
        this.schedule.push(new Act({ duration: 0, callback: func }))
        return this
    }

    r_busy() {
        return this
    }

    r_skip() {
        this.schedule.shift()
        return this
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
        return this
    }

    r_default(config) {
        this.default = { ...config }
        return this
    }
}

class Director extends Actor {
    constructor() {
        super(
            generate_id(),
            document.createElement('div')
        );
        this.id = generate_id()

        this.registered_dict = {}

        this.registered_queue = []

        this.default = {}

    }

    register(args) {
        // todo deal the situation that one dom was registered for more than one time
        const wait_register_queue = []
        if (!_.isArray(args)) {
            const r_id = generate_id()
            wait_register_queue.push(r_id)
            this.registered_dict[r_id] = new Actor(r_id, args)
            this.registered_queue.push(this.registered_dict[r_id])
        } else {
            args = _.compact(args)
            args.forEach(item => {
                const r_id = generate_id()
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

class ActorGroup extends Actor {
    constructor() {
        super();
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

export {
    Director,
    r_register,
    r_default,
    act,
    r
}

