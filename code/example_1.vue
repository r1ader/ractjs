<template>
  <div id="app">
    <div ref="circle" class="circle"></div>
  </div>
</template>

<script>
import { r_register, act } from 'r_animate';

export default {
  name: 'App',
  mounted() {
    r_register(this.$refs.circle);

    this.$refs.circle.r_animate(act.FADE_OUT).r_animate(act.FADE_IN);

    // or you can have a try with the follow code and use more configurations

    // this.$refs.circle
    //   .r_animate({
    //     opacity: '[0~1]',
    //     ease: 'Linear',
    //     duration: 1000,
    //     loop: 6,
    //     loop_mode: 'alternate'
    //   })
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
