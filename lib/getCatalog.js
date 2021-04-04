const hanime = require('hanime-extractor')

async function getCatalog(query, page) {
    const output = await hanime.search(query, '', 'likes', 'desc', page)
    const remove_bars = JSON.parse(output)
	const resp = JSON.parse(remove_bars.hits)
    return resp
}

module.exports = { getCatalog } 