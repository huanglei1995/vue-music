'<template>
  <transition name="conform" @click.stop>
    <div class="conform" v-show="showConform">
      <div class="conform-wrapper">
        <div class="conform-content">
          <p class="text">{{content}}</p>
          <div class="conform-button">
            <div @click="hide" class="cancel-txt">取消</div>
            <div @click="conform" class="conform-txt">{{conformText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        showConform: false
      }
    },
    props: {
      content: {
        type: String,
        default: '是否清空历史记录'
      },
      conformText: {
        type: String,
        default: '确认'
      }
    },
    methods: {
      show () {
        this.showConform = true
      },
      hide () {
        this.showConform = false
      },
      conform () {
        this.$emit('conform')
        this.hide()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .conform
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 20
    background rgba(2, 2, 2, 0.3)
    .conform-wrapper
      position absolute
      left 25%
      top 30%
      width 100%
      z-index 25
      .conform-content
        width 60%
        height 50%
        box-sizing border-box
        background-color white
        .text
          text-align center
          padding 5%
          margin 0
          font-size 3rem
        .conform-button
          display flex
          align-items center
          text-align center
          font-size 2rem
          border-top 1px solid #878787
          .cancel-txt
            flex 1
            padding 5%
            border-right 1px solid #878787
          .conform-txt
            flex 1
            padding 5%
</style>
