export default function generateEmptyAccessToken() {
  return {
    type: 'access_token',
    attributes: {
      name: '',
    },
    relationships: {
      role: {
        data: null,
      },
    },
  }
}
