const { addonBuilder } = require("stremio-addon-sdk");
const hanime = require("hanime-extractor");
const { getCatalog } = require("./lib/getCatalog");
const { getStream } = require("./lib/getStream");
const { getMeta } = require("./lib/getMeta");
const { getGenre } = require("./lib/getGenres");
const { getSearch } = require("./lib/getSearch");
const logo = "https://i.imgur.com/sZ7Fmbl.png";

const manifest = {
  id: "hanime-tv-addon",
  version: "0.0.2",
  behaviorHints: {
    adult: true,
  },
  catalogs: [
    {
      type: "movie",
      id: "top",
      extra: [
        {
          name: "search",
          isRequired: false,
        },
        {
          name: "skip",
          isRequired: false,
        },
        {
          name: "genre",
          options: [
            "3d",
            "ahegao",
            "anal",
            "bdsm",
            "big boobs",
            "blow job",
            "bondage",
            "boob job",
            "censored",
            "comedy",
            "cosplay",
            "creampie",
            "dark skin",
            "facial",
            "fantasy",
            "filmed",
            "foot job",
            "futanari",
            "gangbang",
            "glasses",
            "hand job",
            "harem",
            "hd",
            "horror",
            "incest",
            "inflation",
            "lactation",
            "loli",
            "maid",
            "masturbation",
            "milf",
            "mind break",
            "mind control",
            "monster",
            "nekomimi",
            "ntr",
            "nurse",
            "orgy",
            "plot",
            "pov",
            "pregnant",
            "public sex",
            "rape",
            "reverse rape",
            "rimjob",
            "scat",
            "school girl",
            "shota",
            "softcore",
            "swimsuit",
            "teacher",
            "tentacle",
            "threesome",
            "toys",
            "trap",
            "tsundere",
            "ugly bastard",
            "uncensored",
            "vanilla",
            "virgin",
            "watersports",
            "x-ray",
            "yaoi",
            "yuri",
          ],
          isRequired: false,
        },
      ],
    },
  ],
  resources: ["catalog", "stream", "meta"],
  types: ["movie"],
  name: "Hanime.TV",
  icon: "https://img.android-apk.org/imgs/3/9/6/3963a4a6ae1e14f9824fc89f57bc5a17.png",
  description:
    "Watch hentai online free download HD on mobile phone tablet laptop desktop. Stream online, regularly released uncensored, subbed, in 720p and 1080p!",
};
const builder = new addonBuilder(manifest);

function titleize(string, separator = " ") {
  return string
    .split(separator)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(separator);
}

builder.defineCatalogHandler(async (args) => {
  function format(obj) {
    var genres = obj.tags.map(
      (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
    );
    return {
      id: obj.slug,
      name: obj.name,
      poster: obj.cover_url,
      logo: logo,
      genre: genres,
      description: obj.description.replace(/([</p>\n])/g, "").trim(),
      posterShape: "poster",
      type: "movie",
    };
  }
  if (args.extra.search) {
    const query = args.extra.search;
    const resp = await getSearch(query);
    const metas = resp.map(format);
    return Promise.resolve({ metas });
  } else if (args.extra.genre) {
    const genre = args.extra.genre;
    const page = args.extra.skip / 48 + 1;
    const resp = await getGenre(genre, page);
    const metas = resp.map(format);
    return Promise.resolve({ metas });
  } else if (args.extra.skip) {
    const page = args.extra.skip / 48 + 1;
    const query = "";
    const resp = await getCatalog(query, page);
    const metas = resp.map(format);
    return Promise.resolve({ metas });
  } else {
    const page = args.extra.skip / 48 + 1;
    const query = "";
    const resp = await getCatalog(query, page);
    const metas = resp.map(format);
    return Promise.resolve({ metas });
  }
});

builder.defineMetaHandler(async (args) => {
  const id = args.id;
  const resp = await getMeta(id);
  const genres = resp.hentai_tags.map((el) => {
    return el.text;
  });
  const new_gen = genres.map(
    (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
  );
  const metas = {
    id: resp.slug,
    name: resp.name,
    logo: logo,
    background: resp.poster_url,
    genre: new_gen,
    description: resp.description.replace(/([</p>\n])/g, "").trim(),
    posterShape: "landscape",
    type: "movie",
  };
  return Promise.resolve({ meta: metas });
});

builder.defineStreamHandler(async (args) => {
  const id = args.id;
  const resp = await getStream(id);
  const streams = resp.map((obj) => {
    const name = titleize(obj.video_stream_group_id.replace(/-/g, " "));
    return {
      name: `Hanime.TV\n${obj.height}p`,
      title: `${name.slice(0, -3)}\n 💾 ${obj.filesize_mbs} MB ⌚ ${(
        obj.duration_in_ms / 60000
      ).toFixed()} min`,
      url: obj.url || "",
      behaviorHints: {
        proxyHeaders: {
          request: {
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
            "origin": "https://player.hanime.tv",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "Windows",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
          },
        },
      },
    };
  });
  return Promise.resolve({streams});
});

module.exports = builder.getInterface();
