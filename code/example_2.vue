<template>
  <div id="app">
    <div ref="circle" class="circle"></div>
  </div>
</template>

<script>
import { r_register } from 'r_animate';

export default {
  name: 'App',
  mounted() {
    r_register(this.$refs.circle);

    this.$refs.circle
        .r_animate({
          transform: 'scale([1~2])',
        })
        .r_animate({
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
