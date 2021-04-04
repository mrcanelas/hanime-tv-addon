const hanime = require('hanime-extractor')

async function getStream(slug) {
    const videoInfo = await hanime.getVideoMedia(slug)
    return videoInfo
}

module.exports = { getStream } 