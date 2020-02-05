const request = require('request')
const baseApiUrl = `https://api.deezer.com`

module.exports = {
  auth: ( app, req, res ) => { //Returns de accessToken and the userId
    const clientIdDeezer = '392864';
    const secretIdDeezer = '108ca360887281b929d6b1d01c39c49c'; //not so secret :)
    const { token } = req.body
    
    request(`https://connect.deezer.com/oauth/access_token.php?app_id=${clientIdDeezer}&secret=${secretIdDeezer}&code=${token}`, (err, resp, body) => {
      const accessToken = body.match(/(?<=access_token=).*(?=&token_type|&expires)/gm)

      if(!!accessToken) {
        request(`${baseApiUrl}/user/me?access_token=${accessToken[0]}`, (err, resp, body) => {
          const bodyJson = JSON.parse(body)
          const { id: userId } = bodyJson
  
          res.send({
            userId,
            accessToken: accessToken[0]
          })
  
        })
      } else {
        res.err('token')
      }
    })
  },

  getPlaylist: ( app, req, res ) => {
    const { token } = req.body

    request(`${baseApiUrl}/user/me/playlists?access_token=${token}`, (err, resp, body) => {
      const data = JSON.parse(body).data
      
      res.send(data)
    })
  }
}