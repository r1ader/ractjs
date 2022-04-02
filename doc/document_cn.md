<h1 align="center">r_animate.js</h1>


<h4 align="center">

[![Downloads][npm-downloads-src]][npm-downloads-href]
[![Version][npm-version-src]][npm-version-href]

[npm-downloads-src]: https://img.shields.io/npm/dt/r_animate.svg?style=flat&color=darkgreen

[npm-downloads-href]: https://www.npmjs.com/package/r_animate

[npm-version-src]: https://img.shields.io/npm/v/r_animate/latest.svg?style=flat&color=darkorange&label=version

[npm-version-href]: https://www.npmjs.com/package/r_animate



</h4>

<h3 align="center">以函数式编程的方式制作动画</h3>

---

[English](https://github.com/r1ader/r_animate/blob/main/doc/document.md) | 中文

请悉知： 本文档正在编写中...

---

# 介绍

`r_animate.js` 使得我们可以以函数式编程的方式制作动画。

`r_animate.js` 中的绝大多数方法，都采用下图这种 `Things`.`do`(`something`) 的形式

<img src="..\image\functionalprogramming.gif" width="300px"/>

以最基本的透明度渐出动画为例： 

若 `element` 为动画的主体 , 则实际代码为

```javascript
    import { r_register, act } from 'r_animate'
    const element = document.getElementById('element_id')
    r_register(element)

    // 动画代码
    element.r_animate(act.FADE_OUT)
```
让我们来着重看最后一行代码，

这里存在三个对象 `element`, `r_animate`, `act.FADE_OUT`， 以下，将分别解释这三个对象。

- [element](#element)
- [r_animate](#r_animate)
- [act.FADE_OUT](#actfade_out)

## element

在 `r_animate.js` 中， 只有`注册过的`DOM `Element` 对象，才能开始动画。

DOM `Element` 对象很好理解，即

 - 原生的 `doument.getElementById`,
 - vue中的 `this.$refs`
 - ...
 
 等方法获取到的对象，

那么`注册过的`又是什么呢？

### r_register

请想象一下，在一个演艺片场中，存在很多人员: `演员`，`导演`，`助理`等等，但能上场演出的，只有`演员`。

所以相应的，一个普通的 `Element` 对象，也需要注册为`Actor`，才能开始动画。

注册代码如下：


```javascript
import { r_register } from 'r_animate'

const element = document.getElementById('element_id')

r_register(element)
```

或者，在 **`vue`** 中，您可以注册一个导演类，在 **`mounted`** 使用它的 `take` 方法，就可以自动注册 **`$refs`** 中的所有 `Element` 对象了


```javascript
import { Director } from 'r_animate'

export default {
    // ...
    mounted(){
        new Director().take(this)
    }
}
```

在注册之后，`Element` 对象便可以开始动画。

您可以调用 `Element` 对象的 `r_animate` 方法开始动画。

> Notice：`Element` 对象被注册过后，便成为了拥有 `r_animate` 的 `Actor` 对象，但您仍然可以调用它原来作为 `Element` 对象的所有属性与方法

关于 `r_animate` 的详情，可以继续查看 👇


## r_animate

`r_animate` 是我们最常用的方法。


对于每个 `Actor` 对象（即注册过的 `Element` 对象），我们都可以调用它的`r_animate` 方法，以使他开始动画 

```javascript
    element.r_animate(something_1)
```
上述代码，会使 `actor` 开始 `something_1` 动画

> Notice：关于 `something_1` 的详情，后续在第三部分会详细讲解，当前可以把它直接理解为一个比如放大，缩小的动画。

继续调用，可以使对象在 `something_1` 结束后开始 `something_2` 动画

```javascript
    element.r_animate(something_1).r_animate(something_2)
```

如此可以一直持续下去

```javascript
    element.r_animate(something_1)
        .r_animate(something_2)
        .r_animate(something_3)
        .r_animate(something_4)
        .r_animate(something_5)
        .r_animate(something_6)
        // ...
```

以渐入渐出动画为例，假如我们需要这样一段动画：

小球透明度先变为 0 ，再变回 1 

![](../image/example_1_cn.gif)

那么对应的代码是这样的

```javascript
    circle.r_animate(act.FADE_OUT)
        .r_animate(act.FADE_IN);
```
> 您可以在 `Playground` 中 [查看并运行全部代码](https://stackblitz.com/edit/vue-ufvvux)
> 
> 或者（ 由于网络原因无法访问 Playground ）
>
> 也可以在 `Github` 中 [查看全部代码](https://github.com/r1ader/r_animate/blob/main/code/example_1.vue)

关于 `r_animate` 方法接受的参数，可以继续查看 👇

## act.FADE_OUT

`act.FADE_OUT` 是一个 `r_animate` 方法可以接受的参数。

`act` 库中，预定义了许多动画，供开发者们直接调用。

如 

- act.FADE_IN
- act.FADE_OUT
- act.BLUR_IN
- act.BLUR_OUT
- act.SHAKE
- ...

等等

当然，大部分情况需要自定义动画。所以接下来我们以 `act.FADE_OUT` 的真实结构为例，来看看如何自定义动画。



```
    console.log(act.FADE_IN)
    // { opacity: '[1~0]' }
```

是的，定义一个动画实际上就这么简单。

```
{ 
    act_key: act_value 
}
```
这就是一个 act 的基本结构

`act_key` 是需要变化的 css 属性值，如 `opacity`, `width`, `top`等等

`act_value` 则是 初始值 `start` 和 结束值 `end` 以 `[` `start` `~` `end` `]` 的形式组合成的字符串。

> Notice: start 和 end 只能是数字，px，em，deg等单位需要接在中括号 `]` 的后面

下面是一些 `act` 示例：

```javascript
{ width: '[100~200]px' } // 宽度从 100px 增长至 200px
```

```javascript
{ transform: 'translate([0~100]px, [0~100]px)' }
// 从 0，0 位移至 100px，100px 
```

```javascript
{ 
    width: '[100~200]px',
    transform: 'translate([0~100]px, [0~100]px)'
}
// 从 0，0 位移至 100px，100px 的同时，宽度从 100px 增长至 200px
```


```javascript
{ 
    transform: 'translate([0~100]px, [0~100]px) scale([1~2])' 
}
// 从 0，0 位移至 100px，100px 的同时，尺寸增大一倍
```

```javascript
{ 
    transform: 'translate([0~100]px, [0~100]px) scale([1~2]) rotateZ([0~90]deg)' 
}
// 从 0，0 位移至 100px，100px 的同时，尺寸增大一倍, 旋转90度
```

当然，如果您无需考虑初始值，`act_value` 也支持更为简洁的写法:


```javascript
{ width: '200px' } // 宽度从 element当前width值 变化至 200px
```

```javascript
{ 
    transform: 'translate(100px, 100px)'
} // element 从 当前位置 位移至 100px，100px
```

除了 `act_key` 和 `act_value` 外，

您可能还需配置动画的时长 `duration`

```javascript
{ 
    width: '[100~200]px' ,
    duration: 3000
} // 3秒 内，宽度从 100px 增长至 200px
```

以及 补间动画 的插值形式 `ease`

```javascript
{ 
    width: '[100~200]px' ,
    duration: 3000,
    ease: 'easeOutExpo'
} // 3秒 内，宽度从 100px 增长至 200px，先快后慢
```
> 关于 ease function ，您可以查看 <https://easings.net>
 
除此以外 ease 也支持贝塞尔模式

```javascript
{ 
    width: '[100~200]px' ,
    duration: 3000,
    ease: 'cubic-bezier(.09,.77,.89,.3)'
} // 3秒 内，宽度从 100px 增长至 200px，先快后慢再快
```

> 关于 贝塞尔曲线，您可以查看 <https://cubic-bezier.com/>


更多配置项，您可以在 [api 文档](https://github.com/r1ader/r_animate/blob/main/doc/api.md) 中查看。
