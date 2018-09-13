import jsonp from 'browser-jsonp'

export default function oembed(url) {
  return new Promise((resolve, reject) => {
    jsonp({
      url: 'https://noembed.com/embed',
      data: { url },
      success(data) {
        if (data.error) {
          reject()
        } else {
          resolve(data)
        }
      },
    })
  })
}
