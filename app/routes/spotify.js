module.exports = application => {
  application.get('/spotify/playlist', (req, res) => {
    application.app.controllers.spotify.getPlayList(application, req, res)
  })
}