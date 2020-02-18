const request = require('request')

const comparer = otherArray => {
  return function(current){
    return otherArray.filter(function(other){
      return other.name == current.name && other.artist == current.artist
    }).length == 0;
  }
}

module.exports = {
  helloWorld: (app, req, res) => {
    res.send('HelloWorld')
  },
  mergePlaylists: (application, req, res) => {
    const { tokens, playlistIds } = req.body

    const players = Object.keys(tokens)

    const getTracks = players.map(playerName => {
      return application.app.controllers[playerName].getTracks(res, {
        playlistId: playlistIds[playerName],
        token: tokens[playerName]
      }).then(r => {
        return {
          [playerName]: r
        }
      })
    })

    Promise.all(getTracks).then((r) => {
      const data = {
        ...r[0], ...r[1]
      }
      
      const arrays = Object.values(data).map(players => players)
      const playlist = {}

      playlist.onlyIn1 = arrays[0].filter(comparer(arrays[1]))
      playlist.onlyIn0 = arrays[1].filter(comparer(arrays[0]))
      
      const playlistMusicSpotify = playlist.onlyIn0.map(music => {
        return application.app.controllers.spotify.searchTracks(res, {token: tokens.spotify, music})
      })
      const playlistMusicDeezer = playlist.onlyIn1.map(music => {
        return application.app.controllers.deezer.searchTracks(res, {music})
      })

      Promise.all([...playlistMusicSpotify, ...playlistMusicDeezer]).then((r) => {
        const sizePlaylistSpotify  = playlistMusicSpotify.length
        const idsDeezer = r.splice(sizePlaylistSpotify)

        const addToDeezerPromise = new Promise((resolve, reject ) => {
          idsDeezer.length > 0 ?
          application.app.controllers.deezer.addMusic(res, {ids: idsDeezer, idPlaylist: playlistIds['deezer'], token: tokens['deezer']}).then(a => {
            resolve(a)
          })
          :
          resolve()
        })

        
        const addtoSpotifyPromise = new Promise((resolve, reject) => {
          r.length > 0 ?
          application.app.controllers.spotify.addMusic(res, {ids: r, playlistId: playlistIds['spotify'], token: tokens['spotify']}).then(a => {
            resolve(a)
          })
          :
          resolve()
        })
        Promise.all([addToDeezerPromise]).then((r )=>res.send(r))
      })
    })
  }
}