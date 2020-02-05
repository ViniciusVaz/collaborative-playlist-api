module.exports = application => {
  application.get('/deezer/playlist', (req, res) => {
    application.app.controllers.deezer.getPlaylist(application, req, res)
  })
}