<template>
  <div class="mysic-list" >
    <div class="icon" @click="back">
      <a class="goback">返回</a>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="image" ref="bgImg" :style="bgStyle">
      <div class="bgImg">
        <div v-show="songs.length>0" ref="play" class="play" @click="random">
          <h2>随机播放全部</h2>
        </div>
      </div>
    </div>
    <div class="middle" ref="middle"></div>
    <scroll @scroll="scroll" ref="list" class="song" :data="songs" :listen-scroll="true" :probe-type="3">
      <song-list  @playOrPause="playOrPause" :songs="songs" @select="selectItem" ref="list"></song-list>
      <div class="loading" v-show="songs.length<1">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../scroll/scroll.vue'
  import songList from '../song-list/song-list.vue'
  import {profixStyle} from '../../api/common/dom'
  import {mapActions, mapMutations} from 'vuex'
  import Loading from '../loading/loading.vue'
  const transform = profixStyle('transform')
  const backdrop = profixStyle('backdrop-filter')
  export default {
    data () {
      return {
        scrollY: 0
      }
    },
    methods: {
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ]),
      ...mapMutations([
        'SET_IS_PLAY'
      ]),
      playOrPause (list, index) {
        this.SET_IS_PLAY(!this.$store.state.isplay)
      },
      selectItem (list, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      random () {
        this.randomPlay({
          list: this.songs
        })
      },
      back () {
        this.$router.back()
      },
      scroll (pos) {
        this.scrollY = pos.y
      }
    },
    mounted () {
      this.imageHeight = this.$refs.bgImg.clientHeight
      this.minTranslateY = -this.imageHeight + 130
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    watch: {
      scrollY (newY) {
        let translateY = Math.max(this.minTranslateY, newY)
        let zIndex = 0
        let scale = 1
        let blur = 0
        const percent = Math.abs(newY / this.imageHeight)
        if (newY > 0) {
          scale = scale + percent
          zIndex = 10
        } else {
          blur = Math.min(20, percent * 20)
        }
        this.$refs.middle.style[transform] = `translate3d(0, ${translateY}px, 0)`
        this.$refs.bgImg.style[transform] = `scale(${scale})`
        this.$refs.bgImg.style[backdrop] = `blur(${blur}px)`
        if (newY < this.minTranslateY) {
          zIndex = 53
          this.$refs.bgImg.style.paddingTop = 0
          this.$refs.bgImg.style.height = `130px`
          this.$refs.play.style.display = 'none'
        } else {
          this.$refs.bgImg.style.paddingTop = '70%'
          this.$refs.bgImg.style.height = `0px`
          this.$refs.play.style.display = ''
        }
        this.$refs.bgImg.style.zIndex = zIndex
      }
    },
    components: {
      Scroll, songList, Loading
    },
    props: {
      songs: {
        type: Array,
        default: []
      },
      bgImg: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    computed: {
      bgStyle () {
        return `background-image: url(${this.bgImg})`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .mysic-list
    position fixed
    top 0
    left 0
    right 0
    bottom: 0
    overflow: hidden
    background white
    .icon
      position absolute
      top 0
      left 1rem
      z-index 100
      transform translate(0, 30%)
      .goback
        display block
        color white
        font-size 3rem
    .title
      position absolute
      top 1rem
      left 0
      right 0
      width 80%
      margin 0 auto
      z-index 54
      color white
      font-size 5rem
      text-align center
    .image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .bgImg
        position absolute
        left 0
        right 0
        bottom 2rem
        width 100%
        color yellow
        font-size 1.5rem
        .play
          padding 0 1rem
          display block
          width 30%
          margin: 0 auto
          text-align: center
          box-sizing: border-box
          border: 0.5rem solid #ffcd32
          border-radius 6rem
    .song
      position: fixed
      top: 0
      bottom: 10rem
      width: 100%
      .loading
        position absolute
        top 50%
        width 100%
        transform: translateY(-50%)
    .middle
      position relative
      height 100%
      background white
</style>
