export const request = (url, options = {}) => {
  return fetch(url, options)
    .then(res => {
      if (res.status !== 204) {
        return res.json().then(body => [res, body])
      }
      return Promise.resolve([res, null])
    })
    .then(([res, body]) => {
      if (res.status >= 200 && res.status < 300) {
        return Promise.resolve(body)
      }
      return Promise.reject(body)
    })
}

export const get = (url, options = {}) => {
  return request(url, options)
}

export const post = (url, body, options = {}) => {
  return request(
    url,
    Object.assign(
      {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(body)
      },
      options
    )
  )
}

export const put = (url, body, options = {}) => {
  return request(
    url,
    Object.assign(
      {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(body)
      },
      options
    )
  )
}

export const destroy = (url, options = {}) => {
  return request(
    url,
    Object.assign(
      {
        method: 'DELETE',
        mode: 'cors'
      },
      options
    )
  )
}
