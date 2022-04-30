export const regex_standard_act_style_value = /\[(-|\d|\.)+?~(-|\d|\.)+?]/

export const support_parse_props = {
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

export const class_prop = {
    act: [
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
}

export const act_default = {
    callback: undefined,
    duration: 1000,
    ease: 'easeOutExpo',
    delay: 0,
    loop: 0,
    loop_mode: undefined,
    name: undefined,
    parallel: undefined,
    reverse: false,
    target: 'self'
}
