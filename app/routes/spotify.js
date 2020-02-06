module.exports = application => {
  application.post('/spotify/playlist', (req, res) => {
    application.app.controllers.spotify.getPlayList(application, req, res)
  })
}