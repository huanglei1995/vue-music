<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImg="bgImg"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import musicList from '../music-list/music-list.vue'
  import {mapGetters} from 'vuex'
  import {getSongSheet} from '../../api/singer'
  import {createSong} from '../../api/common/song'
  export default {
    components: {
      musicList
    },
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.songSheet.dissname
      },
      bgImg () {
        return this.songSheet.imgurl
      },
      ...mapGetters([
        'songSheet'
      ])
    },
    created () {
      this.getSingerDetail()
    },
    props: {},
    methods: {
      getSingerDetail () {
        if (!this.songSheet.dissid) {
          this.$router.go(-1)
          return
        }
        getSongSheet(this.songSheet.dissid).then((res) => {
          this.songs = this.normalizeSongs(res.cdlist[0].songlist)
        })
      },
      normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          if (item.songid && item.albummid) {
            let createSongs = createSong(item)
            ret.push(createSongs)
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition all 0.4s

  .slide-enter, .slide-leave
    transform translate3d(100%, 0, 0)
</style>
