const getImageDimensions = (filename) => {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => {
      const size = { width: image.width, height: image.height }
      resolve(size)
    }
    image.src = filename
  })
}

export default getImageDimensions
