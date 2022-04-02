import { isAnimationValid } from './src/util'

const true_array = [
    // only css
    '90px', '20px', '10', '0', '1', '123.2345', '6524',
    // transform
    'scale(1)','scale(1,3)', 'scale(1.21)', 'scaleX(1)', 'scaleY(1.12)', 'scale(9)', 'scale([1~1.5])',
    'translate(-10px,10px)', 'rotate(0)',
    'translate([300~-80]px, [300~-30]px) rotateZ(20deg)',
    'translate(-20px,100px) scale(0.7) perspective(500px) rotateY(-40deg) rotateX(20deg) rotateZ(-50deg)',
    'rotateY([0~90]deg) perspective(100px) rotateX([110~110]deg) rotateZ([45~45]deg)',
    'rotate([0~0.25]turn)',
    // color
    'rgb(47, 29, 253)',
    'rgba(47, 29, 253)',

    // animation
    '[1~20]px',
    '[~20]px',
    '[0~578]px',
    '[0~1]',
    '[0~0]',
    '[0~888.5]px',
]
true_array.forEach(input => {

    test(`${ input } should be true`, () => {
        expect(isAnimationValid(input)).toBe(true);
    })
})
const false_array = [
    '90p',
    '20x',
    '[1~]px',
    '[-20]px',
    '[~20px]',
    '[20]px',
    'scale', 'scale[1]', 'scale(9-1)', 'scalex(12)',
]
false_array.forEach(input => {
    test(`${ input } should be false`, () => {
        expect(isAnimationValid(input)).toBe(false);
    })
})

