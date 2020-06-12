export const api = {
  baseUrl:
    process.env.VUE_APP_API_BASEURL
    || 'https://primer-git-dev.blacksocialists.now.sh/api',
  endpoints: {
    config:
      process.env.VUE_APP_API_ENDPOINT_CONFIG
      || '/config',
  }
}

export default {
  api
}
