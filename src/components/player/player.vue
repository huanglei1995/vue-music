<template>
  <div class="player" v-show="this.playList.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middlel">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="scrollData">
            <div class="lyric-wrapper" >
              <div v-if="currentLyric">
                <p ref="lyricLine" :class="{'current': currentLyricLine === index}"
                    class="text" v-for="(line, index) in currentLyric.lines">{{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formate(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @percentChange="percentChange" :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{formate(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode()" :class="iconMode"></i>
            </div>
            <div class="icon i-left">
              <i @click="pre" class="icon-prev"></i>
            </div>
            <div @click='playOrPause' class="icon i-center">
              <i :class="playIcon"></i>
            </div>
            <div @click="next" class="icon i-right">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini" >
      <div class="mini-player" v-show="!fullScreen"  @click="open">
        <div class="icon">
          <img :class="cdCls" width="100" height="100" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer">></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="playOrPause" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="interval">
        </div>
        <div @click.stop="showPlayList" class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list @pause="playOrPause" ref="playlist"></play-list>
    <audio ref="audio" :src="currentSong.url" @canplay="ready" @ended="end" @error="error"
           @timeupdate="updataTime"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import {shuffle} from '../../api/common/utils'
  import progressBar from '../progress-bar/progress-bar.vue'
  import animations from 'create-keyframe-animation'
  import {playMode} from '../../api/common/store'
  import Lyric from 'lyric-parser'
  import Scroll from '../scroll/scroll.vue'
  import {profixStyle} from '../../api/common/dom'
  import progressCircle from '../progress-circle/progress-circle.vue'
  import PlayList from '../playlist/playlist.vue'
  const transform = profixStyle('transform')
  const transitionDuration = profixStyle('transitionDuration')
  export default {
    components: {
      progressBar, progressCircle, Scroll, PlayList
    },
    data () {
      return {
        songReady: false,
        radius: 70,
        currentLyric: null,
        currentTime: 0,
        line: 0,
        currentShow: 'cd',
        currentLyricLine: 0,
        playingLyric: ''
      }
    },
    created () {
      this.touch = {}
    },
    computed: {
      isplay () {
        return this.$store.state.isplay
      },
      scrollData () {
        if (this.currentLyric) {
          return this.currentLyric.lines
        } else {
          return this.playList
        }
      },
      iconMode () {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      },
      percent () {
        return this.currentTime / this.currentSong.duration
      },
      cdCls () {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    watch: {
      isplay (newPlay) {
        this.playOrPause()
      },
      currentSong (newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
          this.getlyric()
        })
      },
      playing (newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    methods: {
      showPlayList () {
        this.$refs.playlist.show()
      },
      pause () {
        this.$refs.audio.pause()
        this.SET_PLAYING_STATE(true)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      middleTouchStart (e) {
        this.initiated = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove (e) {
        if (!this.initiated) {
          return
        }
        const touch = e.touches[0]
        const offsetX = touch.pageX - this.touch.startX
        const offsetY = touch.pageY - this.touch.startY
        if (Math.abs(offsetY) > Math.abs(offsetX)) {
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetwidth = Math.min(0, Math.max((-window.innerWidth, left + offsetX)))
        this.touch.percent = Math.abs(offsetwidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px,0,0)`
//        this.$refs.lyticList.$el.style[transitionDuration] = 0
        this.$refs.middlel.style.opacity = 1 - this.touch.percent
        this.$refs.middlel.style[transitionDuration] = 0
      },
      middleTouchEnd () {
        let offsetwidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetwidth = -window.innerWidth
            this.currentShow = 'lyric'
            opacity = 0
          } else {
            offsetwidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetwidth = 0
            opacity = 1
            this.currentShow = 'cd'
          } else {
            offsetwidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px,0,0)`
//        this.$refs.lyticList.style[transitionDuration] = `300ms`
        this.$refs.middlel.style.opacity = opacity
        this.$refs.middlel.style[transitionDuration] = `300ms`
        this.touch.initiated = false
      },
      getlyric () {
        this.currentSong.getlyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handerLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLyricLine = 0
        })
      },
      handerLyric ({lineNum, txt}) {
//        console.log(this.currentLyric)
//        console.log(this.currentLyric.lines)
        this.$refs.lyricList.refresh()
        this.currentLyricLine = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      changeMode () {
        const mode = (this.mode + 1) % 3
        this.SET_PLAY_MODE(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.SET_PLAYLIST(list)
      },
      resetCurrentIndex (list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.SET_CURRENT_INDEX(index)
      },
      percentChange (percent) {
        let current = this.currentSong.duration * percent
        this.$refs.audio.currentTime = current
        if (!this.playing) {
          this.playOrPause()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(current * 1000)
        }
      },
      updataTime (e) {
        this.currentTime = e.target.currentTime
      },
      formate (interval) {
        interval = interval | 0
        let minute = interval / 60 | 0
        let second = interval % 60
        if (minute < 10) {
          minute = '0' + minute
        }
        if (second < 10) {
          second = '0' + second
        }
        return `${minute}:${second}`
      },
      end () {
        if (this.mode === playMode.loop) {
          console.log('ddd')
          this.loop()
        } else {
          this.next()
        }
      },
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      next () {
        if (!this.songReady) {
          return
        }
        let s
        let l = this.playList.length - 1
        if (l === this.currentIndex) {
          s = 0
        } else {
          s = this.currentIndex + 1
        }
        this.SET_CURRENT_INDEX(s)
        if (!this.playing) {
          this.playOrPause()
        }
        this.songReady = false
      },
      error () {
        this.songReady = true
      },
      pre () {
        if (!this.songReady) {
          return
        }
        let s
        if (this.currentIndex === 0) {
          s = this.playList.length - 1
        } else {
          s = this.currentIndex - 1
        }
        this.SET_CURRENT_INDEX(s)
        if (!this.playing) {
          this.playOrPause()
        }
        this.songReady = false
      },
      ready () {
        this.songReady = true
      },
      playOrPause () {
        if (!this.songReady) {
          return
        }
        this.SET_PLAYING_STATE(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      enter (el, done) {
        const {x, y, scale} = this.getPostAndScale()
        let animation = {
          0: {
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0,0,0) scale(1)`
          }
        }
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 1000,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter () {
        this.$refs.cdWrapper.style.animation = ''
        animations.unregisterAnimation('move')
      },
      leave (el, done) {
        this.$refs.cdWrapper.style.transition = 'all 1s'
        const {x, y, scale} = this.getPostAndScale()
        this.$refs.cdWrapper.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave () {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style['transform'] = ''
      },
      getPostAndScale () {
        const targetWidth = window.innerWidth * 0.8
        const paddingleft = 32 + window.innerWidth * 0.1
        const paddingbottom = window.innerHeight * 0.1 * 0.12
        const paddingtop = window.innerHeight * 0.12 * 0.8
        const width = window.innerWidth * 0.6
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingleft)
        const y = window.innerHeight - paddingtop - width / 2 - paddingbottom
        return {x, y, scale}
      },
      back () {
        this.SET_FULL_SCREEN(false)
      },
      open () {
        this.SET_FULL_SCREEN(true)
      },
      ...mapMutations([
        'SET_FULL_SCREEN',
        'SET_PLAYING_STATE',
        'SET_CURRENT_INDEX',
        'SET_PLAY_MODE',
        'SET_PLAYLIST'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../assets/stylus/variable.styl"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 15rem
        .back
          position absolute
          top: 0
          left: 1rem
          z-index: 50
          .icon-back
            display: block
            padding: 2rem
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 5rem
          text-align: center
          text-overflow: ellipsis
          overflow: hidden
          white-space: nowrap
          font-size: 4rem
          color: white
        .subtitle
          line-height: 5rem
          text-align: center
          font-size: 2rem
          color: rgba(255, 255, 255, 0.9)
      .middle
        position: fixed
        width: 100%
        top: 15rem
        bottom: 20%
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            top: 0
            left 10%
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              margin 0 auto
              box-sizing: border-box
              border: 1rem solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 5rem auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 5rem
              line-height: 5rem
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 64px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 64px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 5rem
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 60px
            line-height: 60px
            width: 150px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 4rem
          .i-left
            text-align: right
          .i-center
            padding: 0 40px
            text-align: center
            i
              font-size: 5rem
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -200px, 0)
        .bottom
          transform: translate3d(0, 200px, 0)
    .mini-player
      display: flex
      align-items: center
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 80px
        width: 80px
        padding: 0 20px 0 40px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        margin 2% 0 2% 3%
        line-height: 40px
        overflow: hidden
        .name
          margin-bottom: 4px
          text-overflow: ellipsis
          overflow: hidden
          white-space: nowrap
          font-size: $font-size-medium
          color: $color-text
        .desc
          margin-top 0
          text-overflow: ellipsis
          overflow: hidden
          white-space: nowrap
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 60px
        width: 60px
        padding: 0 20px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 60px
          color: $color-theme-d
        .icon-play-mini, .icon-pause-mini
          padding 2% 5% 0 0
        .icon-mini
          font-size: 64px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
