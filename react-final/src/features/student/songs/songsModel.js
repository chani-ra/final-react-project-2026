/** Resolve selection against fresh server data, falling back to the first song. */
export function resolveActiveSong(songs, selectedSongId) {
  if (!Array.isArray(songs) || songs.length === 0) return null;
  return songs.find((song) => song._id === selectedSongId) || songs[0];
}
