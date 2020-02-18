module.exports = (application) => {
  application.get('/', (req, res) => {
    application.app.controllers.index.helloWorld(application, req, res)
  })
  application.post('/merge/playlists', (req, res) => {
    application.app.controllers.index.mergePlaylists(application, req, res)
  })
}