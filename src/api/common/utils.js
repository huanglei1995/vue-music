export function shuffle (list) {
  let randomSong = list.slice()
  for (let i = 0; i < randomSong.length; i++) {
    let j = getRandomIndex(0, i)
    let t = randomSong[i]
    randomSong[i] = randomSong[j]
    randomSong[j] = t
  }
  return randomSong
}

function getRandomIndex (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function bounce (func, deley) {
  let time
  return function (...args) {
    if (time) {
      clearTimeout(time)
    }
    time = setTimeout(() => {
      func.apply(this, args)
    }, deley)
  }
}
