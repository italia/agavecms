export default process.env.NODE_ENV === 'production' ?
  {
    apiBaseUrl: process.env.API_BASE_URL,
    appVersion: process.env.APP_VERSION,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    iubendaCookiePolicyId: process.env.IUBENDA_POLICY_ID
  }
  :
  {
    apiBaseUrl: 'http://agave.lvh.me:3000/api',
    appVersion: 'development',
    googleMapsApiKey: '',
    iubendaCookiePolicyId: ''
  }
