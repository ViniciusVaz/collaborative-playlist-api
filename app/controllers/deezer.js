const request = require('request')
const slugify = require('slugify')
const baseApiUrl = `https://api.deezer.com`

module.exports = {
  auth: ( app, req, res ) => { //Returns de accessToken and the userId
    const clientIdDeezer = '392864';
    const secretIdDeezer = '108ca360887281b929d6b1d01c39c49c'; //not so secret :)
    const { token } = req.body
    
    request(`https://connect.deezer.com/oauth/access_token.php?app_id=${clientIdDeezer}&secret=${secretIdDeezer}&code=${token}`, (err, resp, body) => {
      const accessToken = body.match(/(?<=access_token=).*(?=&token_type|&expires)/gm)

      if(!!accessToken) {
          res.send({
            accessToken: accessToken[0]
          })
      } else {
        res.err('token')
      }
    })
  },

  getPlaylist: ( app, req, res ) => {
    const { token } = req.query

    request(`${baseApiUrl}/user/me/playlists?access_token=${token}`, (err, resp, body) => {
      const bodyJson = JSON.parse(body)

      const mapperValue = bodyJson.data.map(item => {
        const data = {
          id: item.id.toString(),
          name: item.title,
          image: item.picture_big
        }

        return data
      })
      
      res.send(mapperValue)
    })
  },
  getTracks: (res, params) => {
    const { playlistId, token } = params

    return new Promise((resolve, reject) => {
      request(`${baseApiUrl}/playlist/${playlistId}?access_token=${token}`, (err, resp, body) => {
        const bodyJson = JSON.parse(body)
        const mapperValue = bodyJson.tracks.data.map(item => {
          const data = {
            name: item.title,
            artist: item.artist.name
          }

          return data
        })
        
        resolve(mapperValue)
      })
    })
  },
  searchTracks: (res, params) => {
    const { music } = params
    const searchBy = `- ${music.artist}`
    
    return new Promise((resolve, reject) => {
      request(`${baseApiUrl}/search?q=artist:"${music.artist}" track:"${music.name}"`, (err, resp, body) => {
        const bodyJson = JSON.parse(body)
        
        resolve(bodyJson.data[0].id)
      })
    })
  },
  addMusic: (res, params) => {
    const { ids, idPlaylist, token } = params

    const listIds = ids.filter((item, i) => ids.indexOf(item) === i)

    const musics = listIds.reduce((acc, item, key, el) => {
      if(key == (el.length - 1)) {
        return `${acc}${item}`
      } else {
        return `${acc}${item},`
      }
    }, '')
    return new Promise((resolve, reject) => {
      request({url: `${baseApiUrl}/playlist/${idPlaylist}/tracks?songs=${musics}&access_token=${token}`, method: 'POST'}, (err, resp, body) => {
        const bodyJson = JSON.parse(body)
        resolve({bodyJson, musics})
      })
    })
  }
}