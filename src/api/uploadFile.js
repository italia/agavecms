import config from 'config'

const attachmentsUploadUrl = `${config.apiBaseUrl}/attachments/uploads`

const uploadFile = (file, progress) => {
  const xhr = new XMLHttpRequest()
  const cancel = () => {
    xhr.onreadystatechange = null
    xhr.abort()
  }

  const promise = new Promise((resolve, reject) => {
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const done = typeof e.loaded !== 'undefined' ? e.loaded : e.position
        const total = typeof e.total !== 'undefined' ? e.total : e.totalSize
        progress(parseInt((done / total) * 100, 10))
      }
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.response)
        } else {
          reject()
        }
      }
    }

    xhr.addEventListener('error', reject, false)

    xhr.open('POST', attachmentsUploadUrl)
    xhr.setRequestHeader('x-amz-acl', 'public-read')
    const fileParam = new FormData()
    fileParam.append('file', file)
    xhr.send(fileParam)
  })

  return { promise, cancel }
}

export { attachmentsUploadUrl }
export default uploadFile
