const isImage = filename => {
  const extension = filename.split('.').pop().toLowerCase()
  return ['gif', 'img', 'jpeg', 'jpg', 'png'].includes(extension)
}

export default isImage

