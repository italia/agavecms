import queryString from 'query-string'
import oembed from 'api/oembed'
import parseUrl from 'utils/parseUrl'
import pick from 'object.pick'

function youTubeVideoID(url) {
  const { search } = parseUrl(url)
  const params = queryString.parse(search)
  return params.v
}

export function fetchVideoMetadata(url) {
  return oembed(url)
    .then((data) => {
      const isVideo = data.type === 'video'
      const providerIsAllowed = data.provider_name === 'YouTube' ||
          data.provider_name === 'Vimeo'

      if (!isVideo || !providerIsAllowed) {
        return Promise.reject()
      }

      let extras = null

      if (data.provider_name === 'YouTube') {
        extras = {
          provider: 'youtube',
          provider_uid: String(youTubeVideoID(url)),
        }
      } else if (data.provider_name === 'Vimeo') {
        extras = {
          provider: 'vimeo',
          provider_uid: String(data.video_id),
        }
      }

      return Object.assign(
        extras,
        pick(data, ['url', 'height', 'width', 'thumbnail_url', 'title'])
      )
    })
}

export function videoIFrameUrl(video, opts = {}) {
  switch (video.provider) {
    case 'youtube': {
      const query = queryString.stringify(Object.assign(
        {
          modestbranding: 1,
          hd: 1,
          fs: 1,
          iv_load_policy: 3,
          autohide: 1,
          controls: 2,
          rel: 0,
          autoplay: 1,
          showinfo: 0,
        },
        opts
      ))
      return `//www.youtube.com/embed/${video.provider_uid}?${query}`
    }
    case 'vimeo': {
      const query = queryString.stringify(Object.assign(
        {
          api: 1,
          js_api: 1,
          title: 0,
          byline: 0,
          portrait: 0,
          playbar: 0,
          autoplay: 1,
          badge: 0,
        },
        opts
      ))
      return `//player.vimeo.com/video/${video.provider_uid}?${query}`
    }
    default:
      throw new Error(`cannot handle ${video.provider} provider!`)
  }
}
