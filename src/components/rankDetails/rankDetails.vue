<template>
  <transition name="slide" class="rankdetails">
    <music-list :title="title" :bgImg="bgImg" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import musicList from '../music-list/music-list.vue'
  import {mapGetters} from 'vuex'
  import {getRankListDetails} from '../../api/rankList'
  import {createSong} from '../../api/common/song'
  export default {
    data () {
      return {
        songs: []
      }
    },
    computed: {
      title () {
        return this.ranklist.topTitle
      },
      bgImg () {
        return this.ranklist.picUrl
      },
      ...mapGetters([
        'ranklist'
      ])
    },
    components: {
      musicList
    },
    created () {
      this.getRankListDetails()
    },
    methods: {
      getRankListDetails () {
        if (!this.ranklist.id) {
          this.$router.go(-1)
          return
        }
        getRankListDetails(this.ranklist.id).then((res) => {
          if (res.code === 0) {
            this.songs = this.normalizeSongs(res.songlist)
          }
        })
      },
      normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          if (item.data.songid && item.data.albumid) {
            ret.push(createSong(item.data))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave
    transform translate3d(100%, 0, 0)
  .rankdetails
    position fixed
    top 15rem
    bottom 10rem
    left 0
    width 100%
    background-color rgba(0, 0, 0, 0.05)
</style>
