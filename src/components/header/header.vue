<template>
  <div>
    <div class="header">
      <div class="back"><a @click="back">返回</a></div>
      <h3 class="title">黄磊播放器</h3>
      <router-link tag="div" to="/user" class="back"><icon class="icon" name="user" scale="4"></icon></router-link>
    </div>
    <div class="tab">
      <router-link tag="div" class="tab-item" to="/Recommend">
        <span class="tab-link">个人推荐</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/singer">
        <span class="tab-link">歌单</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/search">
        <span class="tab-link">主播电台</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/rankList">
        <span class="tab-link">排行榜</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
    }
  },
  methods: {
    back () {
      this.$router.back()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
.header{
  display: flex;
  z-index 51;
  text-align: center;
  font-size: 2rem;
  height: 6rem;
  background-color: red;
  color: white
  .back{
    flex: 1;
    line-height: 6rem;
    vertical-align: middle;
    .icon {
      padding 5%
    }
  }
  .title{
    flex: 5;
    margin: auto;
    vertical-align: top
  }
  .more{
    flex: 1;
    vertical-align: top
  }
}
.tab{
  display: flex;
  text-align: center;
  font-size: 2rem;
  height: 8rem;
  line-height: 8rem;
  .tab-item{
    flex: 1;
    vertical-align: middle;
    .tab-link{
      display: block;
    }
    &.router-link-active{
      .tab-link{
        display: block;
        border-bottom: 1px solid red;
        color: red;
      }
    }
  }
}
</style>
