<template>
  <div class="search">
    <div class="search-wrapper">
      <search-input ref="searchinput" @query="onQueryChange"></search-input>
    </div>
    <div class="search-detail-wrapper" v-show="!query">
      <scroll ref="hotsearch" class="hot-search">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="hot in hotKey" @click="addQuery(hot.k)" class="item">
                <span>{{hot.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="showConform" class="clear"><icon name="trash-o" scale="3"></icon></span>
            </h1>
            <search-history @select="addQuery" @delSearchOne="delSearchOne" :searches="searchHistory"></search-history>
          </div>
        </div>
        <conform @conform="clear" ref="conform"></conform>
      </scroll>
    </div>
    <div class="search-result" v-show="query">
      <search-result @select="savahistory" :query="query"></search-result>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getHotkey} from '../../api/search'
  import searchInput from '../inputsearch/searchInput.vue'
  import Scroll from '../scroll/scroll.vue'
  import SearchHistory from '../search-history/search-history.vue'
  import searchResult from '../search-result/search-result.vue'
  import {mapActions, mapGetters} from 'vuex'
  import Conform from '../conform/conform.vue'

  export default {
    components: {
      searchInput, Scroll, searchResult, SearchHistory, Conform
    },
    props: {},
    data () {
      return {
        hotKey: [],
        query: ''
      }
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    created () {
      this.getInitData()
    },
    watch: {
      query (newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.hotsearch.refresh()
          })
        }
      }
    },
    methods: {
      ...mapActions([
        'saveHistory', 'delHistoryOne', 'clearSearchHistory'
      ]),
      savahistory () {
        console.log('ddd')
        this.saveHistory(this.query)
      },
      delSearchOne (item) {
        this.delHistoryOne(item)
      },
      onQueryChange (query) {
        this.query = query
      },
      addQuery (query) {
        this.$refs.searchinput.setQuery(query)
      },
      showConform () {
        this.$refs.conform.show()
      },
      clear () {
        this.clearSearchHistory()
      },
      getInitData () {
        getHotkey().then((res) => {
          if (res.code === 0) {
            this.hotKey = res.data.hotkey.splice(0, 10)
          }
        })
      }
//      normalizeAnchor (list) {
//      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .search
    .search-wrapper
      background-color white
    .search-detail-wrapper
      position fixed
      top 24rem
      bottom 0
      width 100%
      .hot-search
        height 100%
        overflow hidden
        .hot-key
          margin 2%
          .title
            margin 2%
            padding 2%
            font-size 3rem
            color black
          .item
            display inline-block
            margin 25px
            padding 1.3rem
            /*color blue*/
            border 1px solid black
            border-radius 1rem
            list-style none
            font-size 2rem
        .search-history
          position relative
          margin 0 1rem
          .title
            display flex
            align-items center
            margin 2%
            padding 2%
            border-bottom 1px solid #878787
            height 100%
            font-size 3rem
            color: black
            .text
              flex 9
            .clear
              flex 1
              display block
              font-size 3rem
</style>
