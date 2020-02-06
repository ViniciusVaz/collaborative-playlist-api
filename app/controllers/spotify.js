const request = require('request')
const baseApiUrl = 'https://api.spotify.com/v1'

module.exports = {
  getPlayList: (app, req, res) => {
    const { token } = req.body

    var options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    request({url: `${baseApiUrl}/me/playlists`, ...options }, (err, resp, body) => {
      const bodyJson = JSON.parse(body)

      if (bodyJson.error && bodyJson.error.status === 401) {
        res.status(401).send({
          error: 401,
          message: 'Token expired!'
        })

        return
      } 
      const mapperValue = bodyJson.items.map(item => {
        const data = {
          id: item.id,
          name: item.name,
          image: item.images[0].url
        }

        return data
      })

      res.send(mapperValue)
    })
  }
}