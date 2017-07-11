<template>
  <div class="progress-bar" ref="progressbar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           @touchstart.prevent="progressTouchStart"
           @touchend.prevent="progressTouchEnd"
           @touchmove="progressTouchMove"
           ref="progressbtn">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {profixStyle} from '../../api/common/dom'
  const transform = profixStyle('transform')
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {}
    },
    methods: {
      progressClick (e) {
        const reac = this.$refs.progressbar.getBoundingClientRect()
        const offset = e.pageX - reac.left
        this.offset(offset - 26)
        this.fastForward()
      },
      progressTouchStart (e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        let offsetleft = e.touches[0].pageX - this.touch.startX
        let offsetwidth = Math.min(this.$refs.progressbar.clientWidth - 32, Math.max(0, this.touch.left + offsetleft))
        this.offset(offsetwidth)
      },
      progressTouchEnd (e) {
        this.touch.initiated = false
        this.fastForward()
      },
      fastForward () {
        let barwidth = this.$refs.progressbar.clientWidth - 32
        let percent = this.$refs.progress.clientWidth / barwidth
        this.$emit('percentChange', percent)
      },
      offset (offsetwidth) {
        this.$refs.progress.style.width = `${offsetwidth}px`
        this.$refs.progressbtn.style[transform] = `translate3d(${offsetwidth}px,0,0)`
      }
    },
    watch: {
      percent (newPercent) {
        if (newPercent > 0) {
          const barwidth = this.$refs.progressbar.clientWidth - 32
          const offsetwidth = newPercent * barwidth
          this.offset(offsetwidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .progress-bar
    height 40px
    .bar-inner
      position relative
      top: 16px
      height 8px
      background: #5c6463
      .progress
        position absolute
        height 100%
        background: green
      .progress-btn-wrapper
        position absolute
        left 0px
        top -18px
        width 12px
        height 12px
        .progress-btn
          position: relative
          top: 7px
          left: 0
          box-sizing: border-box
          width: 32px
          height: 32px
          border: 3px solid green
          border-radius: 50%
          background: green

  /*.progress-btn*/
</style>
