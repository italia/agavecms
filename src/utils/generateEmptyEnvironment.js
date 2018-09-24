export default function generateEmptyEnvironment() {
  return {
    type: 'environment',
    attributes: {
      name: '',
      git_repo_url: '',
      frontend_url: ''
    },
  }
}
