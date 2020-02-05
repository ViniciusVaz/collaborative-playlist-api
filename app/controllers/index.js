const request = require('request')

module.exports = {
  helloWorld: ( app, req, res ) => {
    request('http://www.google.com', (err, resp, body) => {
      res.send(`teste ${req.body.name}`)
    })
  },
}