<template>
  <div id="app">
    <div ref="circle" class="circle"></div>
    <div ref="shadow" class="circle"></div>
  </div>
</template>

<script>
import { Director } from 'r_animate';

export default {
  name: 'App',
  mounted() {
    const director = new Director();
    director.take(this);

    const down = (height) => {
      return {
        transform: `translateY([-${ height }~0]px)`,
        duration: height * 2.5,
        ease: 'easeInQuad',
      };
    };
    const up = (height) => {
      return {
        ...down(height),
        reverse: true,
        ease: 'easeOutQuad',
      };
    };
    let height_of_bounce = (times) => {
      return 200 * Math.pow(3 / 4, times);
    };
    this.$refs.circle
        .r_animate(down(height_of_bounce(0)))
        // Although seems not elegant, but it's functional programing :)
        // Maybe replace the follow code with `while` if you like
        .r_animate(up(height_of_bounce(1)))
        .r_animate(down(height_of_bounce(1)))
        .r_animate(up(height_of_bounce(2)))
        .r_animate(down(height_of_bounce(2)))
        .r_animate(up(height_of_bounce(3)))
        .r_animate(down(height_of_bounce(3)))
        .r_animate(up(height_of_bounce(4)))
        .r_animate(down(height_of_bounce(4)))
        .r_animate(up(height_of_bounce(5)))
        .r_animate(down(height_of_bounce(5)))
        .r_animate(up(height_of_bounce(6)))
        .r_animate(down(height_of_bounce(6)))
        .r_animate(up(height_of_bounce(7)))
        .r_animate(down(height_of_bounce(7)))
        .r_animate(up(height_of_bounce(8)))
        .r_animate(down(height_of_bounce(8)))
        .r_animate(up(height_of_bounce(9)))
        .r_animate(down(height_of_bounce(9)))
        .r_animate(up(height_of_bounce(10)))
        .r_animate(down(height_of_bounce(10)));

    /*
      let times = 1
      while(times<=10){
        this.$refs.circle
          .r_animate(up(height_of_bounce(times)))
          .r_animate(down(height_of_bounce(times)))
        times++
      }
    */

    const shadow_swell = (ratio) => {
      return {
        opacity: `[${ ratio }~1]`,
        transform: `translateY(-50px) scale([${ ratio }~1]) scaleY(0.1)`,
        duration: (1 - ratio) * 500,
        ease: 'easeInQuad',
      };
    };

    const shadow_Shrink = (ratio) => {
      return {
        ...shadow_swell(ratio),
        reverse: true,
        ease: 'easeOutQuad',
      };
    };
    let ratio_of_shaow = (times) => {
      return 1 - Math.pow(3 / 4, times);
    };
    this.$refs.shadow
        .r_animate(shadow_swell(ratio_of_shaow(0)))
        .r_animate(shadow_Shrink(ratio_of_shaow(1)))
        .r_animate(shadow_swell(ratio_of_shaow(1)))
        .r_animate(shadow_Shrink(ratio_of_shaow(2)))
        .r_animate(shadow_swell(ratio_of_shaow(2)))
        .r_animate(shadow_Shrink(ratio_of_shaow(3)))
        .r_animate(shadow_swell(ratio_of_shaow(3)))
        .r_animate(shadow_Shrink(ratio_of_shaow(4)))
        .r_animate(shadow_swell(ratio_of_shaow(4)))
        .r_animate(shadow_Shrink(ratio_of_shaow(5)))
        .r_animate(shadow_swell(ratio_of_shaow(5)))
        .r_animate(shadow_Shrink(ratio_of_shaow(6)))
        .r_animate(shadow_swell(ratio_of_shaow(6)))
        .r_animate(shadow_Shrink(ratio_of_shaow(7)))
        .r_animate(shadow_swell(ratio_of_shaow(7)))
        .r_animate(shadow_Shrink(ratio_of_shaow(8)))
        .r_animate(shadow_swell(ratio_of_shaow(8)))
        .r_animate(shadow_Shrink(ratio_of_shaow(9)))
        .r_animate(shadow_swell(ratio_of_shaow(9)))
        .r_animate(shadow_Shrink(ratio_of_shaow(10)))
        .r_animate(shadow_swell(ratio_of_shaow(10)));
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
  margin: 200px 0 0 50px;
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: rgba(0, 0, 255, 0.47);
}
</style>
