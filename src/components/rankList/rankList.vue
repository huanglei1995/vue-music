<template>
  <div class="rank">
    <scroll :data="rankList" ref="ranklist" class="rank-wrapper">
      <ul>
        <li @click="selectItem(list)" v-for="(list, index) in rankList" class="rank-item">
          <div class="icon">
            <img :src="list.picUrl">
          </div>
          <ul class="song">
            <li class="song-list">
              <h3>{{list.topTitle}} </h3>
            </li>
            <li v-for="(item, key) in list.songList" class="song-list">
              <span>{{key + 1}}</span>
              <span>{{item.songname}} - {{item.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../scroll/scroll.vue'
  import {getRankList} from '../../api/rankList'
  import {mapMutations} from 'vuex'
  export default {
    data () {
      return {
        rankList: []
      }
    },
    components: {
      Scroll
    },
    props: {},
    mounted () {
      this.getRankList()
    },
    methods: {
      ...mapMutations({
        setRankList: 'SET_RANK_LIST'
      }),
      selectItem (item) {
        this.setRankList(item)
        this.$router.push({path: `/rankList/${item.id}`})
      },
      getRankList () {
        getRankList().then((res) => {
          if (res.code === 0) {
            this.rankList = res.data.topList
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .rank
    position fixed
    top 15rem
    bottom 10rem
    left 0
    width 100%
    background-color rgba(0, 0, 0, 0.05)
    .rank-wrapper
      height 100%
      overflow hidden
      .rank-item
        display flex
        margin 2%
        height 300px
        background-color white
        .icon
          flex 1
          img
            width 300px
            height 300px
        .song
          flex 2
          display flex
          flex-direction column
          justify-content center
          .song-list
            list-style none
            font-size 2rem
            padding 2% 0
            overflow hidden
            white-space nowrap
            text-overflow ellipsis


</style>
