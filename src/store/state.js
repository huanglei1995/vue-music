import {playMode} from '../api/common/store'
import {getSearch, getLoveList} from '../api/common/cache'

const state = {
  singer: {},
  songSheet: {},
  ranklist: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  isplay: true,
  mode: playMode.sequence,
  currentIndex: -1,
  searchHistory: getSearch(),
  loveList: getLoveList()
}
export default state
