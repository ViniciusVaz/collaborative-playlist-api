module.exports = (application) => {
  application.get('/', (req, res) => {
    application.app.controllers.index.helloWorld(application, req, res)
  })
}