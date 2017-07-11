import vue from 'vue'
import vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import state from './state'
import createLog from 'vuex/dist/logger'

vue.use(vuex)
const DEBUG = process.env.NODE_ENV !== 'production'

export default new vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: DEBUG,
  plugins: DEBUG ? [createLog] : []
})
