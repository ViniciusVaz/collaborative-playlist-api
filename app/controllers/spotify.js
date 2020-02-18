const request = require('request')
const slugify = require('slugify')
const baseApiUrl = 'https://api.spotify.com/v1'

const defaultRequest = token => {
  return {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
};

module.exports = {
  getPlayList: (app, req, res) => {
    const { token } = req.query
    const options = defaultRequest(token)

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
          image: item.images && item.images[0] && item.images[0].url
        }

        return data
      })

      res.send(mapperValue)
    })
  },
  getTracks: (res, params) => {
    const { playlistId, token } = params

     defaultRequest(token)
    
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      request({url: `${baseApiUrl}/playlists/${playlistId}/tracks`, ...options}, (err, resp, body) => {
        const bodyJson = JSON.parse(body)

        if (bodyJson.error && bodyJson.error.status === 401) {
          res.status(401).send({
            error: 401,
            message: 'Token expired!'
          })

          return
        } 

        const mapperValue = bodyJson.items.map( item => {
          // console.log(item)
          const data = {
            name: item.track.name,
            artist: item.track.artists[0].name
          }

          return data
        })
        
        resolve(mapperValue)
      })
    })
  },
  searchTracks: (res, params) => {
    const { music, token } = params
    const musicName = music.name.replace(/\s/gm, '%20')
    
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }

      console.log(musicName, music.artist)
      request({url: `${baseApiUrl}/search?q=track:${music.name}type=track`, ...options}, (err, resp, body) => {
        const bodyJson = JSON.parse(body)
        console.log(body)
        resolve(bodyJson.tracks.items[0].uri)
      })
    })
  },
  addMusic: (res, params) => {
    const { ids, playlistId, token } = params

    const musics = ids.reduce((acc, item, key, el) => {
      
      if(key == (el.length - 1)) {
        return `${acc}${item}`
      } else {
        return `${acc}${item},`
      }
    }, '')
    
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      console.log({musics, playlistId, token})
      request({url: `${baseApiUrl}/playlists/${playlistId}/tracks?uris=${musics}`, ...options}, (err, resp, body) => {
        const bodyJson = JSON.parse(body)
        console.log(bodyJson)
        resolve(bodyJson)
      })
    })
  },
}