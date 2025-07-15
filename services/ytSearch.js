import YoutubeMusicApi from "youtube-music-api";

const api = new YoutubeMusicApi();

// Utility to normalize strings for better comparison
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/gi, "")
    .trim();
}

export async function searchMusic(query) {
  await api.initalize();

  const response = await api.search(query, "song");

  const results = (response.content || []).map((item) => {
    const title = normalize(item.name || "");
    const artist = normalize(item.artist?.name || "");
    let score = 0;

    const input = query.split(" ");
    const inputArtist = input[0];
    const inputTitle = input[1];

    // Full title/artist match boosts score
    if (title === normalize(inputTitle)) score += 20;
    if (artist === normalize(inputArtist)) score += 15;

    if (title.includes(inputTitle)) score += 5;
    if (artist.includes(inputArtist)) score += 8;

    // Optional: boost score based on item duration or popularity if available
    // score += item.durationMs ? Math.min(item.durationMs / 60000, 5) : 0;

    return {
      videoId: item.videoId,
      name: item.name,
      artist: item.artist?.name,
      score,
    };
  });

  const sorted = results.sort((a, b) => b.score - a.score);
  console.log(sorted);

  return sorted;
}
