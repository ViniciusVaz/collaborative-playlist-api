module.exports = application => {
  application.get('/playlist', (req, res) => {
    application.app.controllers.spotify.getPlayList(application, req, res)
  })
}