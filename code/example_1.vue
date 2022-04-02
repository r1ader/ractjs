<template>
  <div id="app">
    <div ref="circle" class="circle"></div>
  </div>
</template>

<script>
import { r, acts } from 'ractjs';

export default {
  name: 'App',
  mounted() {
    const { circle } = this.$refs;

    r(circle).act(acts.OUT.OPACITY).act(acts.IN.OPACITY);

    // or you can have a try with the follow code and use more configurations

    // r(circle).act({
    //   opacity: '[0~1]',
    //   ease: 'Linear',
    //   duration: 1000,
    //   loop: 6,
    //   loop_mode: 'alternate',
    // });
    //
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px;
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: blue;
}
</style>
