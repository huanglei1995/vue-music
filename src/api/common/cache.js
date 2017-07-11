import storage from 'good-storage'
const SEARCH_KEY = 'search'
const SEARCH_MAX_LENGTH = 15
export function saveSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}
function insertArray (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  } else if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function getSearch () {
  return storage.get(SEARCH_KEY, [])
}

export function delOne (query) {
  let search = storage.get(SEARCH_KEY, [])
  delSearchOne(search, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, search)
  return search
}

function delSearchOne (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function delSearchAll () {
  storage.remove(SEARCH_KEY)
  let search = storage.get(SEARCH_KEY, [])
  return search
}

const LOVELIST = 'love'
const ADD_TO_LOVE = 100

export function getLoveList () {
  return storage.get(LOVELIST, [])
}

export function insertLove (query) {
  const love = storage.get(LOVELIST, [])
  insertArray(love, query, (item) => {
    return item === query
  }, ADD_TO_LOVE)
  storage.set(LOVELIST, love)
  return love
}

export function delLoveOne (query) {
  const love = storage.get(LOVELIST, [])
  delSearchOne(love, (item) => {
    return item.id === query.id
  })
  storage.set(LOVELIST, love)
  return love
}
