<h1 align="center">r_animate.js</h1>


<h4 align="center">

[![Downloads][npm-downloads-src]][npm-downloads-href]
[![Version][npm-version-src]][npm-version-href]

</h4>

<h3 align="center">以函数式编程的方式制作动画</h3>

---

[English](https://github.com/r1ader/r_animate/blob/main/README.md) | 中文


请悉知:

`r_animate.js` 项目正在起步阶段 ，目前暂只支持 `vue` 和 `浏览器`。

更多的支持正在开发中。

[npm-downloads-src]: https://img.shields.io/npm/dt/r_animate.svg?style=flat&color=darkgreen

[npm-downloads-href]: https://www.npmjs.com/package/r_animate

[npm-version-src]: https://img.shields.io/npm/v/r_animate/latest.svg?style=flat&color=darkorange&label=version

[npm-version-href]: https://www.npmjs.com/package/r_animate

---

## 安装

### npm:
```bash
npm install --save r_animate 
```

### 浏览器:
chrome, firefox 等主流浏览器已原生支持 import
```html
<script type="module">
    import { r_register, act } from "https://unpkg.com/r_animate/index.js";
</script>
```
如何在原生html与javascript中使用r_animate.js ？👉
[[code](https://github.com/r1ader/r_animate/blob/main/code/test.html)][[demo](https://r1ader.github.io/r_animate/code/test.html)]


## 文档

### [GET START](https://r1ader.gitbook.io/r_animate_cn/get_start)

### [API DOC](https://r1ader.gitbook.io/r_animate_cn/api-wen-dang)


## 范例

#### 范例1：渐入渐出

![](./image/example_1_cn.gif)

您可以在 `Playground` 中 [查看并运行全部代码](https://stackblitz.com/edit/vue-ufvvux)

或者（ 由于网络原因无法访问 Playground ）

也可以在 `Github` 中 [查看全部代码](https://github.com/r1ader/r_animate/blob/main/code/example_1.vue)

```javascript
    circle.r_animate(act.FADE_OUT).r_animate(act.FADE_IN);
```

---

#### 范例2：缩放

![](./image/example_2_cn.gif)


您可以在 `Playground` 中 [查看并运行全部代码](https://stackblitz.com/edit/vue-zpshvy)

或者（ 由于网络原因无法访问 Playground ）

也可以在 `Github` 中 [查看全部代码](https://github.com/r1ader/r_animate/blob/main/code/example_2.vue)

```javascript
//...
// 关键代码
this.$refs.circle
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

#### 范例3：掉落模拟

![](./image/example_3_cn.gif)


您可以在 `Playground` 中 [查看并运行全部代码](https://stackblitz.com/edit/vue-fdkv5z)

或者（ 由于网络原因无法访问 Playground ）

也可以在 `Github` 中 [查看全部代码](https://github.com/r1ader/r_animate/blob/main/code/example_3.vue)
