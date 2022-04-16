import { parseEasings } from "./math";
import _ from "./lodash";
import { updateElStyle } from "./util";
import Act from "./Act";
import Follower from "./Follower";
import MK from "./MK";

const EASE = Symbol('ease_function')
const REC = Symbol('onRecord')

export default class Actor {
    constructor(el) {
        this.ref = el
        this.orignal_ref = el
        this.busy = false
        this.busy_with = null
        this.schedule = []
        this.record_schedule = []
        this[EASE] = (a) => a
        this.default = {}
        this.render_process = null
        this[REC] = false
        this.frame_index = 0
    }

    run() {
        if (!this.beforeRender()) return
        const config = this.busy_with
        this.frame_index = 0
        if (config.delay > 0) {
            setTimeout(() => {
                this.render_process = requestAnimationFrame(() => this.render())
            }, config.delay)
        } else {
            this.render_process = requestAnimationFrame(() => this.render())
        }
    }

    beforeRender() {
        if (this.busy) return false
        const config = this.schedule.shift()
        if (!config) return false
        // console.log(config.toString())
        if (config.target === 'wrap' && this.ref === this.orignal_ref) this.createWrap()
        if (config.target === 'copy') this.createCopy()
        config.update(this.ref)
        this.busy_with = config
        this.busy = true
        this[EASE] = parseEasings(config.ease)
        return true
    }

    render() {
        const config = this.busy_with
        if (!config) return
        const { frame_index } = this
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
            this.frame_index += 1
            this.render_process = requestAnimationFrame(() => this.render())
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
        if (this[REC]) this.record_schedule.push(new Act(Object.assign({ ...this.default }, config)))
        return this.start()
    }

    start() {
        if (!this.busy) window.queueMicrotask(() => this.run())
        return this
    }

    stop() {
        this.render_process &&= cancelAnimationFrame(this.render_process) || null
    }

    continue() {
        this.render_process ||= requestAnimationFrame(() => this.render())
    }

    then(func) {
        this.schedule.push(new Act({ duration: 0, callback: func }))
        return this
    }

    setDefault(config) {
        this.default = {
            ...this.default,
            ...config
        }
    }

    record() {
        this[REC] = true
        return this
    }

    reverse() {
        while (this.record_schedule.length) {
            const new_act = this.record_schedule.pop()
            new_act.reverse = !new_act.reverse
            this.schedule.push(new_act)
        }
        this[REC] = false
        return this.start()
    }
}