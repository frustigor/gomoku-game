export function createArray(count, defaultValue) {
  let arr = []
  for (let i = 0; i < count; i ++) {
    arr[i] = defaultValue
  }
  return arr
}
export function createMatrix(x, y, defaultValue) {
  let arr = []
  for (let i = 0; i < x; i ++) {
    arr[i] = createArray(y, defaultValue)
  }
  return arr
}