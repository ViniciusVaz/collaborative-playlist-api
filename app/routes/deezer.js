module.exports = application => {
  application.post('/deezer/auth', (req, res) => {
    application.app.controllers.deezer.auth(application, req, res)
  })
  application.get('/deezer/playlist', (req, res) => {
    application.app.controllers.deezer.getPlaylist(application, req, res)
  })
}