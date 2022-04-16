import _ from "./lodash";
import { class_prop, support_parse_props } from "./const";
import { defineNameForAct, getNumberFromCssValue, parseColorProps, r_warn } from "./util";

export default class Act {
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

    toString() {
        return defineNameForAct(this)
    }
}
