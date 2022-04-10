(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ract = {}));
})(this, (function (exports) { 'use strict';

    function isObjectLike(value) {
        return typeof value === 'object' && value !== null
    }

    const toString = Object.prototype.toString;

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

    const isArray = Array.isArray;

    function isString(value) {
        const type = typeof value;
        return type === 'string' || (type === 'object' && value != null && !Array.isArray(value) && getTag(value) == '[object String]')
    }

    const NAN = 0 / 0;

    /** Used to match leading and trailing whitespace. */
    const reTrim = /^\s+|\s+$/g;

    /** Used to detect bad signed hexadecimal string values. */
    const reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    const reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    const reIsOctal = /^0o[0-7]+$/i;

    /** Built-in method references without a dependency on `root`. */
    const freeParseInt = parseInt;

    function isObject(value) {
        const type = typeof value;
        return value != null && (type === 'object' || type === 'function')
    }

    function isSymbol(value) {
        const type = typeof value;
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
            const other = typeof value.valueOf === 'function' ? value.valueOf() : value;
            value = isObject(other) ? `${ other }` : other;
        }
        if (typeof value !== 'string') {
            return value === 0 ? value : +value
        }
        value = value.replace(reTrim, '');
        const isBinary = reIsBinary.test(value);
        return (isBinary || reIsOctal.test(value))
            ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
            : (reIsBadHex.test(value) ? NAN : +value)
    }

    function isFunction(value) {
        return typeof value === 'function'
    }

    function compact(array) {
        let resIndex = 0;
        const result = [];

        if (array == null) {
            return result
        }

        for (const value of array) {
            if (value) {
                result[resIndex++] = value;
            }
        }
        return result
    }

    var _ = {
        isNumber,
        isArray,
        isString,
        toNumber,
        isFunction,
        compact
    };

    // todo support more unit

    function getNumberFromCssValue(value, unit) {
        unit = unit || '';
        // const px_reg = /(-|\d+|\.)+?px/g
        const reg = new RegExp(`^(-|\\d+|\\.)+[${unit}]*$`, 'gi');
        const res = reg.exec(value);
        // clog(value, reg, res)
        if (!res) return undefined
        return parseFloat(res[0].replace('px', ''))
    }

    function r_warn(msg) {
        console.warn(`ract.js warning: ${ msg }`);
    }

    function extractNumber(input) {
        return input.split(',').map(o => o.replace(/\D/g, ''))
    }

    function parseColorProps(start_color, end_color) {
        let sr, sg, sb;
        let sa = 1;
        let er, eg, eb;
        let ea = 1;
        if (start_color.indexOf('a') === -1) {
            [sr, sg, sb] = extractNumber(start_color);
        } else {
            [sr, sg, sb, sa] = extractNumber(start_color);
        }
        if (end_color.indexOf('a') === -1) {
            [er, eg, eb] = extractNumber(end_color);
        } else {
            [er, eg, eb, ea] = extractNumber(end_color);
        }
        return `rgba([${ sr }~${ er }],[${ sg }~${ eg }],[${ sb }~${ eb }],[${ sa }~${ ea }])`

    }

    function defineNameForAct(config) {
        return Object.keys(config).filter(o => config[o])
            .map(o => `${ o } : ${ config[o].toString() }`)
            .join('\n')
    }

    function generate_id() {
        return Math.floor(Math.random() * 100000000).toString()
    }

    function updateElStyle(el, key, value, ratio, reverse = false) {
        const extract_number_reg = /\[(-|\d|\.)+?~(-|\d|\.)+?]/g;
        const extract_res = value.match(extract_number_reg);
        if (!_.isArray(extract_res) || !extract_res.length) return
        let groove = value.replace(extract_number_reg, '{}');
        const slots = extract_res.map(range => {
            let [start_value, end_value] = range.replace('[', '').replace(']', '').split('~').map(o => _.toNumber(o));
            if (reverse) {
                [start_value, end_value] = [end_value, start_value];
            }
            return start_value + (end_value - start_value) * ratio
        });
        slots.forEach(value => {
            let num_value = Math.round(value * 1000) / 1000;
            if (key === 'zIndex') {
                num_value = Math.round(num_value);
            }
            groove = groove.replace('{}', num_value);
        });
        if (el.style[key] !== groove) {
            el.style[key] = groove;
        }
    }

    const bezier = (() => {

        const kSplineTableSize = 11;
        const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

        function A(aA1, aA2) {
            return 1.0 - 3.0 * aA2 + 3.0 * aA1
        }

        function B(aA1, aA2) {
            return 3.0 * aA2 - 6.0 * aA1
        }

        function C(aA1) {
            return 3.0 * aA1
        }

        function calcBezier(aT, aA1, aA2) {
            return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT
        }

        function getSlope(aT, aA1, aA2) {
            return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1)
        }

        function binarySubdivide(aX, aA, aB, mX1, mX2) {
            let currentX, currentT, i = 0;
            do {
                currentT = aA + (aB - aA) / 2.0;
                currentX = calcBezier(currentT, mX1, mX2) - aX;
                if (currentX > 0.0) {
                    aB = currentT;
                } else {
                    aA = currentT;
                }

            } while (Math.abs(currentX) > 0.0000001 && ++i < 10);
            return currentT;
        }

        function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
            for (let i = 0; i < 4; ++i) {
                const currentSlope = getSlope(aGuessT, mX1, mX2);
                if (currentSlope === 0.0) return aGuessT;
                const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }
            return aGuessT;
        }

        function bezier(mX1, mY1, mX2, mY2) {

            if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) return;
            let sampleValues = new Float32Array(kSplineTableSize);

            if (mX1 !== mY1 || mX2 !== mY2) {
                for (let i = 0; i < kSplineTableSize; ++i) {
                    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
                }
            }

            function getTForX(aX) {

                let intervalStart = 0;
                let currentSample = 1;
                const lastSample = kSplineTableSize - 1;

                for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
                    intervalStart += kSampleStepSize;
                }

                --currentSample;

                const dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
                const guessForT = intervalStart + dist * kSampleStepSize;
                const initialSlope = getSlope(guessForT, mX1, mX2);

                if (initialSlope >= 0.001) {
                    return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
                } else if (initialSlope === 0.0) {
                    return guessForT;
                } else {
                    return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
                }

            }

            return x => {
                if (mX1 === mY1 && mX2 === mY2) return x;
                if (x === 0 || x === 1) return x;
                return calcBezier(getTForX(x), mY1, mY2);
            }

        }

        return bezier;

    })();

    function minMax(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    const penner = (() => {

        const eases = { linear: () => t => t };

        const functionEasings = {
            Sine: () => t => 1 - Math.cos(t * Math.PI / 2),
            Circ: () => t => 1 - Math.sqrt(1 - t * t),
            Back: () => t => t * t * (3 * t - 2),
            Bounce: () => t => {
                let pow2, b = 4;
                while (t < ((pow2 = Math.pow(2, --b)) - 1) / 11) {
                }

                return 1 / Math.pow(4, 3 - b) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - t, 2)
            },
            Elastic: (amplitude = 1, period = .5) => {
                const a = minMax(amplitude, 1, 10);
                const p = minMax(period, .1, 2);
                return t => {
                    return (t === 0 || t === 1) ? t :
                        -a * Math.pow(2, 10 * (t - 1)) * Math.sin((((t - 1) - (p / (Math.PI * 2) * Math.asin(1 / a))) * (Math.PI * 2)) / p);
                }
            }
        };

        const baseEasings = ['Quad', 'Cubic', 'Quart', 'Quint', 'Expo'];

        baseEasings.forEach((name, i) => {
            functionEasings[name] = () => t => Math.pow(t, i + 2);
        });

        Object.keys(functionEasings).forEach(name => {
            const easeIn = functionEasings[name];
            eases['easeIn' + name] = easeIn;
            eases['easeOut' + name] = (a, b) => t => 1 - easeIn(a, b)(1 - t);
            eases['easeInOut' + name] = (a, b) => t => t < 0.5 ? easeIn(a, b)(t * 2) / 2 :
                1 - easeIn(a, b)(t * -2 + 2) / 2;
            eases['easeOutIn' + name] = (a, b) => t => t < 0.5 ? (1 - easeIn(a, b)(1 - t * 2)) / 2 :
                (easeIn(a, b)(t * 2 - 1) + 1) / 2;
        });

        return eases;

    })();

    const is = {
        fnc: a => typeof a === 'function'
    };

    function parseEasingParameters(string) {
        const match = /\(([^)]+)\)/.exec(string);
        return match ? match[1].split(',').map(p => parseFloat(p)) : [];
    }

    function applyArguments(func, args) {
        return func.apply(null, args);
    }

    function parseEasings(easing, duration) {
        if (is.fnc(easing)) return easing;
        const name = easing.split('(')[0];
        const ease = penner[name];
        const args = parseEasingParameters(easing);
        switch (name) {
            // case 'spring' : return spring(easing, duration);
            case 'cubic-bezier' :
                return applyArguments(bezier, args);
            // case 'steps' : return applyArguments(steps, args);
            default :
                if (is.fnc(ease)) {
                    return applyArguments(ease, args);
                } else {
                    r_warn(`"${ name }" is unsupported, using Linear`);
                    return applyArguments(penner.linear, args);
                }
        }
    }

    function get_rotate(r, reg, axis) {
        axis = axis || 'Z';
        return {
            transform: `rotate${ axis }([0~${ r ? '' : '-' }${ reg }]deg)`,
        }
    }

    function get_various_rotate() {
        let rs = [30, 45, 60, 90, 180, 360];
        const res = {};
        rs.map(r => {
            res[`ROTATE_${ r }`] = get_rotate(true, r);
            res[`ROTATE_${ r }_REVERSE`] = get_rotate(false, r);
        });
        rs = [90, 180];
        rs.map(r => {
            res[`ROTATE_X_${ r }`] = get_rotate(true, r, 'X');
            res[`ROTATE_Y_${ r }`] = get_rotate(true, r, 'Y');
        });
        return res
    }

    const acts = {
        OUT: {
            OPACITY: { opacity: '[1~0]' },
            BLUR: {
                filter: 'blur([0~30]px)',
                opacity: '[1~1]',
                ease: 'linear',
                callback: [{
                    opacity: '[1~0]',
                    ease: 'linear',
                    duration: 300
                }],
                duration: 300,
            },
            SCROLL_UP: {
                transform: 'translate(0, [0~-200]px) perspective(500px) rotateX([0~90]deg)',
                opacity: '[1~0]',
                ease: 'cubic-bezier(.69,.05,.2,.94)'
            },
            SCROLL_DOWN: {
                transform: 'translate(0, [0~200]px) perspective(500px) rotateX([0~-90]deg)',
                opacity: '[1~0]',
                ease: 'cubic-bezier(.69,.05,.2,.94)'
            },

        },
        IN: {
            OPACITY: { opacity: '[0~1]', ease: 'linear' },
            BLUR: {
                opacity: '[1~0]',
                filter: 'blur([30~30]px)',
                ease: 'linear',
                reverse: true,
                callback: [{
                    filter: 'blur([0~30]px)',
                    reverse: true,
                    ease: 'linear',
                    duration: 300
                }],
                duration: 300,
            },
            SCROLL_DOWN: {
                transform: 'translate(0, [-200~0]px) perspective(500px) rotateX([90~0]deg)',
                opacity: '[0~1]',
                ease: 'cubic-bezier(.69,.05,.2,.94)'
            },
            SCROLL_UP: {
                transform: 'translate(0, [200~0]px) perspective(500px) rotateX([-90~0]deg)',
                opacity: '[0~1]',
                ease: 'cubic-bezier(.69,.05,.2,.94)'
            }
        },
        EMPHASIZE: {
            SHAKE_X: {
                duration: 0,
                callback: [
                    {
                        transform: 'translateX([0~5]%)',
                        ease: 'cubic-bezier(.69,.05,.98,.34)',
                        duration: 25
                    },
                    {
                        transform: 'translateX([5~-5]%)',
                        duration: 50,
                        ease: 'cubic-bezier(.69,.05,.98,.34)',
                        loop: '4 alternate'
                    },
                    {
                        transform: 'translateX([-5~0]%)',
                        ease: 'cubic-bezier(.69,.05,.98,.34)',
                        duration: 25
                    },
                ]
            },
            SHAKE_Y: {
                duration: 0,
                callback: [
                    {
                        transform: 'translateY([0~5]%)',
                        ease: 'cubic-bezier(.69,.05,.98,.34)',
                        duration: 25
                    },
                    {
                        transform: 'translateY([5~-5]%)',
                        duration: 50,
                        ease: 'cubic-bezier(.69,.05,.98,.34)',
                        loop: '4 alternate'
                    },
                    {
                        transform: 'translateY([-5~0]%)',
                        ease: 'cubic-bezier(.69,.05,.98,.34)',
                        duration: 25
                    },
                ]
            },
            SHAKE_ROTATE: {
                duration: 0,
                callback: [
                    {
                        transform: 'rotateZ([0~10]deg)',
                        ease: 'cubic-bezier(.69,.05,.98,.34)',
                        duration: 25
                    },
                    {
                        transform: 'rotateZ([10~-10]deg)',
                        duration: 50,
                        ease: 'cubic-bezier(.69,.05,.98,.34)',
                        loop: '4 alternate'
                    },
                    {
                        transform: 'rotateZ([-10~0]deg)',
                        ease: 'cubic-bezier(.69,.05,.98,.34)',
                        duration: 25
                    },
                ]
            },
            RADAR: {
                padding: '[0~30]px',
                opacity: '[1~0]',
                duration: 2000,
                target: 'copy'
            },
            BORDER_RADAR: {
                border: '[2~2]px solid',
                backgroundColor: 'rgba(0, 0, 0, [0~0])',
                padding: '[0~30]px',
                opacity: '[1~0]',
                duration: 2000,
                target: 'copy'
            },
            LARGER: {
                transform: 'scale([1~1.2])',
                loop: '1 alternate',
                target: 'wrap',
            },
            SMALLER: {
                transform: 'scale([1~0.8])',
                loop: '1 alternate',
                target: 'wrap',
            },
            BORDER_STROKE: {
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' rx='10' ry='10' fill='none' stroke='white' stroke-width='4' stroke-dasharray='1000%2c 1000' stroke-dashoffset='[-1000~0]' /%3e%3c/svg%3e")`,
                duration: 2000,
                ease: 'easeInOutExpo',
                callback: [{
                    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' rx='10' ry='10' fill='none' stroke='rgba(255,255,255,[1~0])' stroke-width='4' stroke-dasharray='1000%2c 1000' stroke-dashoffset='0' /%3e%3c/svg%3e")`,
                    ease: 'linear',
                    duration: 500
                }]
            }
        },
        NORMAL: {
            LARGER: {
                transform: 'scale([1~1.2])',
            },
            SMALLER: {
                transform: 'scale([1~0.8])',
            },
            ...get_various_rotate(),
        },
        PHYSICS: {},
        EFFECTS: {},
    };

    const add_name = (obj, name) => {
        obj.name = name;
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] !== 'object') return
            add_name(obj[key], name + '.' + key);
        });
    };
    add_name(acts, 'acts');

    const EASE = Symbol('ease_function');
    const REC = Symbol('onRecord');

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
    };

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
    ];

    class Act {
        constructor(argus) {
            Object.keys(argus).forEach(key => {
                this[key] = argus[key];
            });
            this.callback = argus.callback;
            this.duration = _.isNumber(argus.duration) ? argus.duration : 1000;
            this.ease = argus.ease || 'easeOutExpo';
            this.delay = argus.delay || 0;
            this.loop = argus.loop;
            this.loop_mode = argus.loop_mode;
            this.name = argus.name;
            this.parallel = argus.parallel;
            this.reverse = argus.reverse || false;
            this.target = argus.target || 'self';
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
                        const computed_style = getComputedStyle(ref);
                        if (prop_type === 'color_props') {
                            this[key] = parseColorProps(computed_style[key], this[key]);
                            return
                        }
                        const unit = {
                            px_props: 'px',
                            number_props: '',
                        }[prop_type] || '';
                        const uppercasePropName = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                        const origin_str = ref.style[key] || computed_style.getPropertyValue(uppercasePropName) || '0';
                        const origin_value = getNumberFromCssValue(origin_str, unit);
                        if (/\[(-|\d|\.)*?~(-|\d|\.)+?\]/.test(this[key])) {
                            this[key] = this[key].replace(/([\[])(\~)/g, `[${ origin_value }~`);
                            return
                        }
                        const css_value = getNumberFromCssValue(this[key], unit);
                        if (!_.isNumber(css_value)) {
                            return r_warn(`Unrecognized Style Value "${ this[key] }"`)
                        }
                        this[key] = `[${ origin_value }~${ css_value }]${ unit }`;
                    }
                });
            });
            if (_.isString(this.loop)) {
                const { loop } = this;
                if (loop.split(' ').length === 2) {
                    const [loop_num, loop_mode] = loop.split(' ');
                    this['loop'] = parseInt(loop_num);
                    this['loop_mode'] = loop_mode;
                }
            }
        }

        get plan_duration() {
            let res = 0;
            if (_.isNumber(this.delay)) res += this.delay;
            if (_.isNumber(this.duration)) res += this.duration;
            return res
        }

        toString() {
            return defineNameForAct(this)
        }
    }

    class Actor {
        constructor(r_id, el) {
            this.r_id = r_id;
            this.ref = el;
            this.orignal_ref = el;
            this.busy = false;
            this.busy_with = null;
            this.schedule = [];
            this.record_schedule = [];
            this[EASE] = (a) => a;
            this.default = {};
            this.render_process = null;
            this[REC] = false;
        }

        run() {
            if (!this.beforeRender()) return
            const config = this.busy_with;
            if (config.delay > 0) {
                setTimeout(() => {
                    this.render_process = requestAnimationFrame(() => this.render(0));
                }, config.delay);
            } else {
                this.render_process = requestAnimationFrame(() => this.render(0));
            }
        }

        beforeRender() {
            if (this.busy) return false
            const config = this.schedule.shift();
            if (!config) return false
            // console.log(config.toString())
            if (config.target === 'wrap' && this.ref === this.orignal_ref) this.createWrap();
            if (config.target === 'copy') this.createCopy();
            config.update(this.ref);
            this.busy_with = config;
            this.busy = true;
            this[EASE] = parseEasings(config.ease);
            return true
        }

        render(frame_index) {
            const config = this.busy_with;
            if (!config) return
            const ratio = this[EASE](Math.min((frame_index * 16.7 / config.duration), 1.0));
            Object.keys(config).forEach(key => {
                if (!_.isString(config[key])) return
                // todo extract regex out of render
                updateElStyle(this.ref, key, config[key], ratio, config.reverse);
            });
            if (_.isFunction(config.parallel)) {
                config.parallel(ratio);
            }
            if (frame_index * 16.7 < config.duration) {
                this.render_process = requestAnimationFrame(() => this.render(frame_index + 1));
            } else {
                this.rendered();
            }
        }

        rendered() {
            const config = this.busy_with;
            if (config.callback) this.createCallback();
            if (config.loop) this.createLoop();
            if (config.target === 'wrap' && !config.loop) this.cleanWrap();
            if (config.copy) this.cleanCopy();
            this.busy = false;
            this.busy_with = null;
            if (!!this.schedule.length) this.run();
        }

        createCallback() {
            const config = this.busy_with;
            if (_.isFunction(config.callback)) {
                config.callback(this);
            }
            if (_.isArray(config.callback) && config.callback.length) {
                this.schedule = config.callback.map(o => new Act(o)).concat(this.schedule);
            }
        }

        createLoop() {
            const config = new Act({ ...this.busy_with });
            if (_.isNumber(config.loop)) {
                config.loop = config.loop - 1;
            }
            if (config.loop === 'alternate' || config.loop_mode === 'alternate') {
                config.reverse = !config.reverse;
            }
            config.delay = 0;
            this.schedule.unshift(config);
        }

        createWrap() {
            const parent = this.ref.parentElement;
            parent.removeChild(this.ref);
            const container = document.createElement('div');
            container.appendChild(this.ref);
            parent.appendChild(container);
            this.ref = container;
        }

        createCopy() {
            const parent = this.ref.parentElement;
            const copy = this.ref.cloneNode(true);
            copy.style.position = 'absolute';
            parent.appendChild(copy);
            this.ref = copy;
        }

        cleanWrap() {
            const parent = this.ref.parentElement;
            parent.removeChild(this.ref);
            parent.appendChild(this.orignal_ref);
            this.ref = this.orignal_ref;
        }

        cleanCopy() {
            const parent = this.ref.parentElement;
            parent.removeChild(this.ref);
            parent.appendChild(this.orignal_ref);
            this.ref = this.orignal_ref;
        }

        cancel() {
            if (this.render_process) {
                cancelAnimationFrame(this.render_process);
                this.render_process = undefined;
            }
            this.busy = false;
            this.busy_with = null;
            this.schedule = [];
            return this
        }

        act(config) {
            this.schedule.push(new Act(Object.assign({ ...this.default }, config)));
            if (this[REC]) this.record_schedule.push(new Act(Object.assign({ ...this.default }, config)));
            return this.start()
        }

        start() {
            if (!this.busy) window.queueMicrotask(() => this.run());
            return this
        }

        then(func) {
            this.schedule.push(new Act({ duration: 0, callback: func }));
            return this
        }

        setDefault(config) {
            this.default = {
                ...this.default,
                ...config
            };
        }

        record() {
            this[REC] = true;
            return this
        }

        reverse() {
            while (this.record_schedule.length) {
                const new_act = this.record_schedule.pop();
                new_act.reverse = !new_act.reverse;
                this.schedule.push(new_act);
            }
            return this.start()
        }
    }

    const actors = new Map();

    const register_actor = function (el) {
        if (el.r_id) {
            r_warn(`"${ el.tagName }.${ el.className }" is already registered`);
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
        });
        actors.set(el, res);
        return res
    };

    const r = function () {
        let actor_list = [];
        for (let el_index in arguments) {
            actor_list.push(register_actor(arguments[el_index]));
        }
        if (actor_list.length === 1) {
            return actor_list[0]
        } else {
            return new Proxy(actor_list, {
                get: function (target, p) {
                    if (target.every(o => _.isFunction(o[p]))) {
                        return function () {
                            const _argus = arguments;
                            target.forEach(function (actor) {
                                actor[p](..._argus);
                            });
                            return this
                        }
                    } else {
                        return new Map(target.map(o => [o, o[p]]))
                    }
                }
            })
        }
    };

    exports.acts = acts;
    exports.r = r;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
