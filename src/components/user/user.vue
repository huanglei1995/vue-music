<template>
  <div class="user">
    <div class="header">
      <div class="bgImg">
        <div class="headPortrait">
          <img src="../../assets/logo.png"/>
          <p class="userName">黄磊</p>
        </div>
      </div>
    </div>
    <icon @click.native="back" class="close" name="angle-left" scale="5"></icon>
    <div class="content">
      <div class="title">
        <icon class="icon" name="heart" scale="3"></icon><span>我喜欢</span>
      </div>
      <scroll class="song" @touchstart="touch" ref="scroll" :data="getLoveSong">
        <song-list :isplay="true" :songs="getLoveSong"></song-list>
      </scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SongList from '../song-list/song-list.vue'
  import Scroll from '../scroll/scroll.vue'
  import {mapGetters} from 'vuex'
  export default {
    components: {
      SongList, Scroll
    },
    computed: {
      ...mapGetters([
        'loveList'
      ]),
      getLoveSong () {
        this.love = this.loveList
        return this.loveList
      }
    },
    data () {
      return {
        love: []
      }
    },
    methods: {
      back () {
        this.$router.back()
      },
      touch () {
        this.$scroll.refresh()
      }
    },
    props: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .user
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    width 100%
    overflow hidden
    background-color white
    .header
      position relative
      top 0
      left 0
      bottom 70%
      width 100%
      .bgImg
        height 100%
        background-color #7f7f7f
        .headPortrait
          text-align center
          padding: 5% 0
          img
            border-radius 50%
          .userName
            margin-top 0
            color #ffb506
            font-size 4rem
    .content
      width 100%
      .song
        position: fixed
        top: 40%
        bottom: 0
        width: 100%
        overflow hidden
      .title
        span
          font-size 3rem
        .icon
          color red
          transform translate(0, 30%)
          padding 2%
    .close
      position absolute
      top 1%
      color white
      left 3%
</style>
