const appConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      nodeApiLink: '/',
    }
  }

  return {
    /* default testnet api */
    nodeApiLink: 'http://0.0.0.0:9052/',
  }
}

export default {
  ...appConfig(),
}
