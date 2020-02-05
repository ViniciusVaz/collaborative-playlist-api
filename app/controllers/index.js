const request = require('request')

module.exports = {
  helloWorld: ( app, req, res ) => {
    request('http://www.google.com', (err, resp, body) => {
      res.send(`teste ${req.body.name}`)
    })
  },
  authDeezer: ( app, req, res ) => {
    const clientIdDeezer = '392864';
    const secretIdDeezer = '108ca360887281b929d6b1d01c39c49c'; //not so secret :)
    const { token } = req.body
    
    request(`https://connect.deezer.com/oauth/access_token.php?app_id=${clientIdDeezer}&secret=${secretIdDeezer}&code=${token}`, (err, resp, body) => {
      res.send(body)
    })
  },
}