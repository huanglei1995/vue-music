<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="recommendList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img @load="loadImage" class="needsclick" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <h1 style="text-align: center">热门歌单推荐</h1>
        <div class="recommend-item">
          <ul>
            <li @click="selectItem(item)" v-for="item in recommendList" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2>{{item.creator.name}}</h2>
                <h4>{{item.dissname}}</h4>
                <p>{{item.introduction}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="showLoading" v-show="!recommendList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getRecommendList} from '../../api/recommend.js'
  import Slider from '../slider/slider.vue'
  import Scroll from '../scroll/scroll.vue'
  import Loading from '../loading/loading.vue'
  import {mapMutations} from 'vuex'

  export default {
    data () {
      return {
        recommends: [],
        recommendList: []
      }
    },
    created () {
      this._getRecommend()

      this._getDiscList()
    },
    methods: {
      ...mapMutations({
        setSongSheet: 'SET_SONG_SHEET'
      }),
      selectItem (item) {
        this.setSongSheet(item)
        this.$router.push({
          path: `/Recommend/${item.dissid}`
        })
      },
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === 0) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList () {
        getRecommendList().then((res) => {
          if (res.code === 0) {
            this.recommendList = res.data.list
          }
        })
      },
      loadImage () {
        if (this.checkLoading) {
          this.$refs.scroll.refresh()
        }
        this.checkLoading = true
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .recommend
    position: fixed
    width: 100%
    top: 15rem
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: flexd
        width: 100%
        overflow: hidden
      .recommend-item
        display flex
        ul
          width 100%
          margin-bottom 10rem
          .item
            display block
            float left
            width 32%
            margin 0 0.6%
            list-style: none
            .icon
              img
                width 100%
                height 100%
            .text
              display block
              h2, h4, p
                white-space nowrap
                overflow hidden
      .showLoading
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
