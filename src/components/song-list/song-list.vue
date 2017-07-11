<template>
    <ul class="song-list">
      <li @click="selectItem(list, index)" v-for="(list, index) in songs" class="item">
        <div class="message">
          <h3>{{list.name}}</h3>
          <p>{{list.singer}}.{{list.album}}</p>
        </div>
        <icon @click.native.stop="play(list, index)" :class="getIsPlayClass(index)" :name="getIsPlay(index)" scale="3"></icon>
        <icon @click.native.stop="love(list)" :class="getIsLove(list)" :name="getIsLoveName(list)" scale="3"></icon>
        <icon @click.native.stop="deleteSong(list)" v-show="isplay" class="times" name="times" scale="3"></icon>
      </li>
    </ul>
</template>

<script type="text/ecmascript-6">
  import {mapActions} from 'vuex'
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      isplay: {
        type: Boolean,
        default: false
      }
    },
//    computed: {
//
//    },
    methods: {
      ...mapActions([
        'delSong', 'addToLove', 'removeLoveOne'
      ]),
      love (item) {
        let list = this.$store.state.loveList
        let index = this.getFindIndex(list, item)
        if (index > -1) {
          this.removeLoveOne(item)
        } else {
          this.addToLove(item)
        }
      },
      play (item, index) {
        let list = this.$store.state.playList
        let curren = this.getFindIndex(list, item)
        if (curren === this.$store.state.currentIndex) {
          this.$emit('playOrPause', list, index)
        } else {
          this.selectItem(item, index)
        }
      },
      deleteSong (item) {
        this.delSong(item)
      },
      selectItem (list, index) {
        this.$emit('select', list, index)
      },
      getIsPlay (index) {
        if (this.$store.state.currentIndex === index) {
          if (this.$store.state.playing) {
            return 'pause-circle-o'
          } else {
            return 'play-circle-o'
          }
        } else {
          return 'play-circle-o'
        }
      },
      getIsPlayClass (index) {
        if (this.$store.state.currentIndex === index) {
          return 'icon'
        } else {
          return 'times'
        }
      },
      getIsLove (item) {
        let list = this.$store.state.loveList
        let index = this.getFindIndex(list, item)
        if (index > -1) {
          return 'icon'
        } else {
          return 'times'
        }
      },
      getIsLoveName (item) {
        let list = this.$store.state.loveList
        let index = this.getFindIndex(list, item)
        if (index > -1) {
          return 'heart'
        } else {
          return 'heart-o'
        }
      },
      getFindIndex (list, items) {
        let index = list.findIndex((item) => {
          return item.id === items.id
        })
        return index
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .song-list
    padding: 20px 30px
    .item
      display flex
      padding 0
      margin 2% 0 2% 4%
      font-size 2rem
      border-bottom solid 0.0001px rgba(26, 20, 22, 0.3)
      .message
        flex 9
        display block
        box-sizing border-box
      .icon
        margin 2%
        color red
        flex 1
      .times
        margin 2%
        flex 1

</style>
