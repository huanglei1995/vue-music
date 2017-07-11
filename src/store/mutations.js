import * as types from './mutations-type'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_SONG_SHEET] (state, songSheet) {
    state.songSheet = songSheet
  },
  [types.SET_IS_PLAY] (state, isplay) {
    state.isplay = isplay
  },
  [types.SET_RANK_LIST] (state, ranklist) {
    state.ranklist = ranklist
  },
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history
  },
  [types.SET_LOVE_LIST] (state, love) {
    state.loveList = love
  }
}
export default mutations
