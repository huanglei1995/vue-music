<template>
  <div>
    <scroll ref="listview" :data="singer" class="singer"
            :probeType="probeType"
            @scroll="scroll"
            :listenScroll="listenScroll">
      <ul>
        <li v-for="(list, index) in singer" ref="listGroup" class="singer-list">
          <h3 class="title">{{list.title}}</h3>
          <ul>
            <li v-for="item in list.items" @click="selectItem(item)" class="singer-item">
              <img class="img" width="150" height="150" v-lazy="item.avatar">
              <div class="desc">
                <span>{{item.name}}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <div class="list-shortcut" @touchstart.stop.prevent="TouchStart" @touchmove.stop.prevent="TouchMove">
        <ul>
          <li v-for="(item, index) in shortcut" :data-index="index" class="item"
              :class="{'current': currentIndex === index}">{{item}}
          </li>
        </ul>
      </div>
      <div class="fixed-title" ref="fixedTitle">
        <h3 class="fixed-title-message">{{fixedTitle}}</h3>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../scroll/scroll.vue'
  import Singers from '../../api/common/singer'
  import {getData} from '../../api/common/dom'
  import {getSingerList} from '../../api/singer.js'
  import {mapMutations} from 'vuex'
  export default {
    components: {
      Scroll
    },
    computed: {
      fixedTitle () {
        if (this.scrollY > 0) {
          return
        }
        return this.singer[this.currentIndex] ? this.singer[this.currentIndex].title : ''
      }
    },
    data () {
      return {
        scrollY: -1,
        currentIndex: 0,
        singer: [],
        shortcut: [],
        differ: -1
      }
    },
    created () {
      this.touch = {}
      this.listHeight = []
      this.listenScroll = true
      this.probeType = 3
    },
    mounted () {
      this.getSingerList()
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      selectItem (item) {
        this.setSinger(item)
        this.$router.push({path: `/singer/${item.id}`})
      },
      TouchStart (e) {
        let anchIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchIndex
        this.scrollTo(anchIndex)
      },
      TouchMove (e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let offset = (this.touch.y2 - this.touch.y1) / 50 | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + offset
        this.scrollTo(anchorIndex)
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      scrollTo (index) {
        this.scrollY = -this.listHeight[index]
//        this.currentIndex = index
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      getSingerList () {
        getSingerList().then((response) => {
          if (response.code === 0) {
            this.singer = this.transformation(response.data.list)
          }
        })
      },
      transformation (list) {
        let map = {
          hot: {
            title: '热门',
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < 10) {
            map.hot.items.push(new Singers({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singers({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(map[key])
          } else if (val.title === '热门') {
            hot.push(map[key])
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        let singer = hot.concat((ret))
        this.shortcut = singer.map((group) => {
          return group.title.substr(0, 1)
        })
        return singer
      },
      calculateHeight () {
        this.listHeight = []
        const list = this.$refs.listGroup
        let hight = 0
        this.listHeight.push(hight)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          hight += item.clientHeight
          this.listHeight.push(hight)
        }
      }
    },
    watch: {
      singer () {
        setTimeout(() => {
          this.calculateHeight()
        }, 20)
      },
      scrollY (newY) {
        const listHeight = this.listHeight
        if (newY > 0) {
          this.currentIndex = 0
        }
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.differ = height2 + newY
            return
          }
          this.currentIndex = listHeight.length - 2
        }
      },
      differ (newVal) {
        let flexTop = (newVal > 0 && newVal < 64) ? newVal - 64 : 0
        if (this.flexTop === flexTop) {
          return
        }
        this.flexTop = flexTop
        this.$refs.fixedTitle.style.transform = `translate3d(0,,${flexTop}px,0)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position fixed
    top 15rem
    bottom 10rem
    width 100%
    padding-bottom 15rem
    overflow: hidden
    .fixed-title
      position absolute
      display block
      left: 0
      top: 0
      width 100%
      background: white
      .fixed-title-message
        font-size 2rem
        margin 2% 5%
        height: 4rem
        line-height: 4rem
        background: white
    .list-shortcut
      position: absolute
      z-index: 30
      right: 1rem
      top: 50%
      transform: translateY(-50%)
      width: 4rem
      border-radius: 20px
      text-align: center
      font-family: Helvetica
      .item
        padding: 1rem
        list-style none
        line-height: 1.3rem
        font-size 2.3rem
      .current
        color: green
        transform scale(1.1)
    .singer-list
      list-style none
      .title
        font-size 2rem
        margin 2% 5%
      .singer-item
        display flex
        list-style none
        margin 2% 3%
        .img
          flex 1
          border-radius 50%
        .desc
          flex 5
          padding-left 2rem
          font-size 2rem
          margin auto

</style>
