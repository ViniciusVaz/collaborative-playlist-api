module.exports = application => {
  application.get('/spotify/playlist', (req, res) => {
    application.app.controllers.spotify.getPlayList(application, req, res)
  })
  application.get('/spotify/playlist/:playlistId/tracks', (req, res) => {
    application.app.controllers.spotify.getTracks(application, req, res)
  })
}