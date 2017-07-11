<template>
  <div class="songDetail">
    <music-list :songs="songs" :bgImg="bgImg" :title="title"></music-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import musicList from '../music-list/music-list.vue'
  import {getSongDetail} from '../../api/singer'
  import {mapGetters} from 'vuex'
  import {createSong} from '../../api/common/song'
  export default {
    created () {
      this.getSingerDetail()
    },
    components: {
      musicList
    },
    data () {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title () {
        return this.singer.name
      },
      bgImg () {
        return this.singer.avatar
      }
    },
    methods: {
      getSingerDetail () {
        if (!this.singer.id) {
          this.$router.go(-1)
          return
        }
        getSongDetail(this.singer.id).then((response) => {
          if (response.code === 0) {
            this.songs = this.normalizeSongs(response.data.list)
          }
        })
      },
      normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            let createSongs = createSong(musicData)
            ret.push(createSongs)
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
