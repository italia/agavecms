export default function switchElements(arr, fromIndex, toIndex) {
  const newArr = arr.slice()
  const element = newArr[fromIndex]

  if (!element) {
    return arr
  }

  newArr.splice(fromIndex, 1)
  newArr.splice(toIndex, 0, element)

  return newArr
}
