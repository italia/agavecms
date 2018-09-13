import { get } from 'utils/request'
import imageUrl from 'utils/imageUrl'

export default function imageSize(path) {
  return get(imageUrl({ path }, { fm: 'json' }))
    .then(({ PixelHeight, PixelWidth }) => {
      return { height: PixelHeight, width: PixelWidth }
    })
}
