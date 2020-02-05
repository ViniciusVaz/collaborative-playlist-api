module.exports = application => {
  application.get('/playlist', (req, res) => {
    application.app.controllers.playlist.getPlayList(application, req, res)
  })
}