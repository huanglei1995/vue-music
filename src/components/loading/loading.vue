<template>
  <div class="loading">
    <img width="60" height="60" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在加载'
      }
    },
    methods: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  .loading{
    width 100%
    text-align center
    .desc{
      line-height 2rem
      font-size 2rem
      color: black
    }
  }
</style>
