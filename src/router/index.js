import Vue from 'vue'
import Router from 'vue-router'
import home from '../home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: home,
      redirect: '/Recommend',
      children: [{
        path: '/Recommend',
        name: 'Recommend',
        component: (resolve) => require(['../components/recommend/recommend.vue'], resolve),
        children: [{
          path: ':id',
          component: (resolve) => require(['../components/songSheet/songSheet.vue'], resolve)
        }]
      }, {
        path: '/user',
        component: (resolve) => require(['../components/user/user.vue'], resolve)
      }, {
        path: '/singer',
        component: (resolve) => require(['../components/singer/singer.vue'], resolve),
        children: [{
          path: ':id',
          component: (resolve) => require(['../components/song-detail/songDetails.vue'], resolve)
        }]
      },
      {
        path: '/search',
        component: (resolve) => require(['../components/search/search.vue'], resolve),
        children: [{
          path: ':id',
          component: (resolve) => require(['../components/song-detail/songDetails.vue'], resolve)
        }]
      },
      {
        path: '/rankList',
        component: (resolve) => require(['../components/rankList/rankList.vue'], resolve),
        children: [{
          path: ':id',
          component: (resolve) => require(['../components/rankDetails/rankDetails.vue'], resolve)
        }]
      }]
    }
  ]
})
