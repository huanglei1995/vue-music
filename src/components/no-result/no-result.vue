<template>
  <div class="noresult">
    <div class="icon"></div>
    <p class="text">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    methods: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .noresult
    text-align center
    .icon
      width 200px
      margin  0 auto
      height 250px
      background 200px 250px
      background url("../../assets/logo.png") no-repeat
    .text
      margin-top 30px
      font-size 2rem
      color: black
</style>
