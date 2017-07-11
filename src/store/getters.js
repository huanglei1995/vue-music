export const singer = state => state.singer
export const songSheet = state => state.songSheet
export const ranklist = state => state.ranklist
export const playing = state => state.playing
export const playList = state => state.playList
export const fullScreen = state => state.fullScreen
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
export const searchHistory = state => state.searchHistory

export const loveList = state => state.loveList
export const isplay = state => state.isplay
