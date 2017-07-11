<template>
  <div>
    <my-header></my-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <my-player></my-player>
  </div>
</template>

<script type="text/ecmascript-6">
  import myHeader from './components/header/header.vue'
  import myPlayer from './components/player/player.vue'
  export default {
    components: {
      myHeader, myPlayer
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
div,body,html{
  margin 0
  padding 0
}
</style>
