const appConfig = () => {
  if (window.appConfig) {
    return {
      ...window.appConfig,
    }
  }

  return {
    nodeApiLink: 'http://0.0.0.0:9053/',
  }
}

export default {
  ...appConfig(),
}
