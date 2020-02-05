module.exports = (application) => {
  application.get('/', (req, res) => {
    application.app.controllers.index.helloWorld(application, req, res)
  })
  application.post('/authDeezer', (req, res) => {
    application.app.controllers.index.authDeezer(application, req, res)
  })
}