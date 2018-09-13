import { get } from 'utils/request'

export default function getQuoteOfDay() {
  return get('/qod.json?category=inspire')
}
