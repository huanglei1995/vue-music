<template>
  <scroll :data="result" ref="result"
          @scrollToEnd="searchMore"
          :pullup="pullup" class="result">
    <ul class="result-list">
      <li v-for="list in result" @click="selectItem(list)" class="result-item">
        <div v-if="list.type === 'singer'" class="icon">
          <img width="200" height="200"
               :src="'https://y.gtimg.cn/music/photo_new/T001R68x68M000'+list.singermid + '.jpg?max_age=2592000'">
        </div>
        <div v-if="list.type === 'singer'" class="name">
          <p class="text" v-html="list.singername"></p>
          <p class="text" v-html="'专辑' + list.songnum"></p>
        </div>
        <div v-if="list.type !== 'singer'" class="icon">
          <icon class="music" name="music" scale="5"></icon>
        </div>
        <div v-if="list.type !== 'singer'" class="name">
          <p class="text" v-html="list.name"></p>
          <p class="text" v-html="list.singer"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result">
      <no-result :title="'没有查到'+query+'的信息'"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../scroll/scroll.vue'
  import {searchResult} from '../../api/search'
  import {createSong} from '../../api/common/song'
  import Loading from '../loading/loading.vue'
  import Singers from '../../api/common/singer'
  import {mapMutations, mapActions} from 'vuex'
  import noResult from '../no-result/no-result.vue'
  const perpage = 20
  const TYPE_SINGER = 'singer'

  export default {
    components: {
      Scroll, Loading, noResult
    },
    data () {
      return {
        page: 1,
        hasMore: true,
        result: [],
        pullup: true
      }
    },
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    watch: {
      query (newQuery) {
        this.hasMore = true
        this.search()
      }
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ]),
      selectItem (item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singers({
            id: item.singermid,
            name: item.singername
          })
          this.setSinger(singer)
          this.$router.push({path: `/search/${singer.id}`})
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      searchMore () {
        this.page++
        searchResult(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === 0) {
            this.result = this.result.concat(this.getResult(res.data))
            this.checkMore(res.data)
          }
        })
        this.$refs.result.refresh()
      },
      search () {
        if (!this.hasMore) {
          return
        }
        this.page = 1
        this.hasMore = true
        this.$refs.result.scrollTo(0, 0)
        searchResult(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === 0) {
            this.result = this.getResult(res.data)
            this.checkMore(res.data)
          }
        })
        this.$refs.result.refresh()
      },
      checkMore (data) {
        const song = data.song
        if (!song.list.length || (song.curNum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      getResult (list) {
        let ret = []
        if (list.zhida && list.zhida.singerid) {
          ret.push({...list.zhida, ...{type: TYPE_SINGER}})
        }
        if (list.song) {
          ret = ret.concat(this.normalizeSongs(list.song.list))
        }
        return ret
      },
      normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          if (item.songid && item.albummid) {
            ret.push(createSong(item))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .result
    position fixed
    width 100%
    top 24rem
    bottom 0
    overflow hidden
    .result-item
      display flex
      .icon
        position relative
        flex 1
        display flex
        img
          border-radius 50%
        .music
          position absolute
          top 25%
          left 25%
          color #9e9e9e
      .name
        flex 3
        font-size 2rem

</style>
