export default function generateEmptyUser() {
  return {
    type: 'user',
    attributes: {
      email: '',
      first_name: '',
      last_name: '',
    },
    relationships: {
      role: {
        data: null,
      },
    },
  }
}
