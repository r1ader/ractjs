<template>
  <div id="app">
    <div ref="circle" class="circle"></div>
  </div>
</template>

<script>
import { r } from 'ractjs';

export default {
  name: 'App',
  mounted() {
    const { circle } = this.$refs;

    r(circle)
        .act({
          transform: 'scale([1~2])',
        })
        .act({
          transform: 'scale([2~1])',
        });
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
  margin: 100px;
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: blue;
}
</style>
