<template>
    <div class="bg_music">
      <div class="music_ioc">
          <div class="bgmusic" id="bgmusic" :class="{ stopped: isClass }" @click="onStart">
              <div class="control">
                  <div class="control-after">
                  </div>
              </div>
          </div>
      </div>
      <audio controls ref="bg_audio" id="bg_audio" style="display: none;" autoplay="autoplay" loop>
        <source :src=" require(`@/assets/audio/${src}`)" type="audio/mpeg">
      </audio>
    </div>
</template>

<script>
export { default } from './Music.component.ts';
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import url('./Music.component.less');
</style>
