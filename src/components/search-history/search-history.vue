<template>
  <div class="searchList" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li @click="selectItem(list)" :key="list" class="search-item" v-for="list in searches">
        <span class="text">{{list}}</span>
        <span @click.stop="clear(list)" class="clear"><icon name="close" scale="3"></icon></span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem (list) {
        this.$emit('select', list)
      },
      clear (list) {
        this.$emit('delSearchOne', list)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .search-item
    display flex
    align-items center
    height 100%
    font-size 3rem
    padding 2%
    margin 2%
    border-bottom 1px solid #878787
    color: black
    .text
      flex 9
    .clear
      flex 1
      display block
      font-size 3rem
</style>
