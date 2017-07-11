<template>
  <div class="playlist" v-show="showFlag">
    <div class="list-wrapper">
      <div class="list-header">
        <h1 class="title">
          <icon class="mode" name="exchange" scale="3"></icon>
          <span class="text">顺序播放</span>
          <span class="icon">
            <icon @click.native="showConform" name="trash-o" scale="3"></icon>
          </span>
        </h1>
      </div>
      <scroll ref="scroll" class="list-content" :data="sequenceList" :listen-scroll="true" :probe-type="3">
        <!--{{sequenceList}}-->
        <song-list ref="songList" @playOrPause="playOrPause" @select="selectItem" :songs="sequenceList"
                   isplay="isplay"></song-list>
      </scroll>
      <conform ref="showConform" @conform="clearSongList" v-show="showConforms" content="是否清空播放列表" conformText="清空"></conform>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SongList from '../song-list/song-list.vue'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import Scroll from '../scroll/scroll.vue'
  import Conform from '../conform/conform.vue'
  export default {
    components: {
      SongList, Scroll, Conform
    },
    data () {
      return {
        isplay: true,
        showConforms: false,
        showFlag: false
      }
    },
    computed: {
      ...mapGetters([
        'sequenceList', 'currentSong', 'playList'
      ])
    },
    props: {},
    methods: {
      ...mapMutations([
        'SET_CURRENT_INDEX', 'SET_PLAYING_STATE'
      ]),
      ...mapActions([
        'deleteAllSong'
      ]),
      showConform () {
        this.$refs.showConform.show()
      },
      clearSongList () {
        this.deleteAllSong()
      },
      playOrPause (list, index) {
        if (list.id === this.currentSong.id) {
          this.$emit('pause')
        } else {
          this.selectItem(list, index)
        }
      },
      selectItem (list, index) {
        this.SET_CURRENT_INDEX(index)
        this.SET_PLAYING_STATE(true)
      },
      show () {
        this.showFlag = !this.showFlag
        this.scrollToCurrent(this.currentSong)
      },
      scrollToCurrent (current) {
        const index = this.sequenceList.findIndex((item) => {
          return item.id === current.id
        })
        this.$refs.scroll.scrollToElement(this.$refs.songList.$el.children[index], 300)
      }
    },
    watch: {
      sequenceList (newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        setTimeout(() => {
          this.scrollToCurrent(newSong)
        })
      },
      showFlag (newFlag) {
        if (newFlag) {
          setTimeout(() => {
            this.$refs.scroll.refresh()
          }, 200)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .playlist
    position fixed
    top 0
    left 0
    right 0
    bottom 10%
    width 100%
    background-color rgba(0, 0, 0, 0.21)
    .list-wrapper
      position absolute
      left 0
      bottom 0
      width 100%
      background-color white
      .list-header
        position relative
        padding 2%
        .title
          display flex
          .mode
            margin-right 1rem
          .text
            flex 6
            vertical-align middle
          .icon
            flex 1
            text-align right
      .list-content
        max-height 55rem
        overflow hidden
</style>
