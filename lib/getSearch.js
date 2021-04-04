const hanime = require('hanime-extractor')

async function getSearch(query, page) {
    const output = await hanime.search(query, '', 'title_sortable', 'asc', page)
    const remove_bars = JSON.parse(output)
	const resp = JSON.parse(remove_bars.hits)
    return resp
}

module.exports = { getSearch } 