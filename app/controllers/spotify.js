const request = require('request')

module.exports = {
  getPlayList: (app, req, res) => {
    const baseApiUrl = 'https://api.spotify.com/v1'
    
    const token = req.headers.authorization

    var options = {
      method: 'GET',
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    request({url: `${baseApiUrl}/me`, ...options}, (err, resp, body) => {
      if (err) {
        console.dir(err)
        return
      }
      const bodyJson = JSON.parse(body)
      const { id } = bodyJson

      request({url: `${baseApiUrl}/users/${id}/playlists`, ...options }, (err, resp, body) => {
        res.send({
          userId: id,
          ...body,
        })
      })
    })
  }
}