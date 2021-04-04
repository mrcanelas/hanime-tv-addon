const axios = require("axios");

async function getMeta(id) {
    try {
      const { data: meta } = await axios.get(
        `https://hw.hanime.tv/api/v8/video?id=${id}&`
      );
  
      return meta.hentai_video;
    } catch (error) {
      console.error(error)
    }
  }
  
  module.exports = { getMeta };