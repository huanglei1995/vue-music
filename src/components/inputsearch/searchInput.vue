<template>
  <div class="search_input">
    <icon class="search-icon" name="search" scale="3"></icon>
    <input ref="query" class="search" v-model="query" :placeholder="placeholder"/>
    <icon v-show="query" @click.native="clear" class="search-icon close" name="close" scale="3"></icon>
    <i v-show="!query" class="search-icon close"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {bounce} from '../../api/common/utils'
  export default {
    data () {
      return {
        query: ''
      }
    },
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲·歌手'
      }
    },
    methods: {
      clear () {
        this.query = ''
      },
      setQuery (query) {
        this.query = query
      }
    },
    created () {
      this.$watch('query', bounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200))
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .search_input
    display flex
    align-items center
    padding 2rem 0
    width 100%
    height 100%
    border-radius 1rem
    .search-icon
      flex 1
      display block
      font-size 6rem
      color rgba(0, 0, 0, 0.33)
    .search
      flex 9
      line-height 100%
      font-size 3rem
      padding 2%
      color #707070
      background:no-repeat 0 0 scroll white
      border:none
      border-bottom 1px solid #595959
      outline:medium
      &::placeholder
        color: #707070
</style>
