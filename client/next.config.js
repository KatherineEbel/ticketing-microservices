// fix nextjs problems automatically restarting in kubernetes
module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300
    return config
  }
}
