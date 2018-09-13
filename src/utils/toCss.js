export default function toCss({ red, green, blue }) {
  return `rgb(${parseInt(red, 10)}, ${parseInt(green, 10)}, ${parseInt(blue, 10)})`
}

