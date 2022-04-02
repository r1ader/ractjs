<h1 align="center" style="font-size:60px;font-weight:bolder">r_animate.js</h1>

<h4 align="center">

[![Downloads][npm-downloads-src]][npm-downloads-href]
[![Version][npm-version-src]][npm-version-href]

</h4>

<h3 align="center">produce animation with functional programming</h3>

---

English | [中文](https://r1ader.gitbook.io/r_animate_cn/)

Notice: 

`r_animate.js` is in its infancy.

Welcome your suggestion to me with issue or <a href="mailto:r1ader.v1@gmail.com?">email</a>

[npm-downloads-src]: https://img.shields.io/npm/dt/r_animate.svg?style=flat&color=darkgreen
[npm-downloads-href]: https://www.npmjs.com/package/r_animate

[npm-version-src]: https://img.shields.io/npm/v/r_animate/latest.svg?style=flat&color=darkorange&label=version
[npm-version-href]: https://www.npmjs.com/package/r_animate

---

## Installation

### npm:
```bash
npm install --save r_animate 
```

### Browser:
Mainstream browsers such as chrome and firefox already support import natively

```html
<script type="module">
    import { r, act } from "https://unpkg.com/r_animate/index.js";
</script>
```
how to use r_animate.js in native html and javascript ? 👉
[[code](https://github.com/r1ader/r_animate/blob/main/code/test.html)][[demo](https://r1ader.github.io/r_animate/code/test.html)]



## Document

### [GET START](https://r1ader.gitbook.io/r_animate/get_start)

### [API DOC](https://r1ader.gitbook.io/r_animate/api_doc)



## Example

#### Example1：Fade in and out

![](./image/example_1_cn.gif)

You can check and run [the completed App.vue](https://stackblitz.com/edit/vue-ufvvux) in `Playground`

or , check [the completed App.vue](https://github.com/r1ader/r_animate/blob/main/code/example_1.vue) in `Github` 

```javascript
 r(this.$refs.circle).r_animate(act.FADE_OUT).r_animate(act.FADE_IN);
```

---

#### Example2：Zoom

![](./image/example_2_cn.gif)


You can check and run [the completed App.vue](https://stackblitz.com/edit/vue-zpshvy) in `Playground`

or , check [the completed App.vue](https://github.com/r1ader/r_animate/blob/main/code/example_2.vue) in `Github`

```javascript
// App.vue
// ...
// key code
r(this.$refs.circle)
    .r_animate({
        transform: 'scale([1~2])',
        duration: 2000,
    })
    .r_animate({
        transform: 'scale([2~1])',
        duration: 2000,
    });
//...
```

---

#### Example3：Drop simulation

![](./image/example_3_cn.gif)

You can check and run [the completed App.vue](https://stackblitz.com/edit/vue-fdkv5z) in `Playground`

or , check [the completed App.vue](https://github.com/r1ader/r_animate/blob/main/code/example_3.vue) in `Github`
