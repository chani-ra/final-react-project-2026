// Pure selectors and immutable updates for the admin songs screen.
export function normalizeAdminSongs(data) {
  return Array.isArray(data) ? data : [];
}

export function getPreferredSongId(songs) {
  return (songs.find((song) => song.isWeeklySong) || songs[0])?._id || "";
}

export function getAdminSongStats(songs) {
  return {
    total: songs.length,
    publicSongs: songs.filter((song) => song.isPublic).length,
    draftSongs: songs.filter((song) => !song.isPublic).length,
    weeklySongs: songs.filter((song) => song.isWeeklySong).length,
  };
}

export function markWeeklySong(songs, songId, selectedAt) {
  return songs.map((song) => ({
    ...song,
    isWeeklySong: song._id === songId,
    weeklySelectedAt: song._id === songId ? selectedAt : null,
    isPublic: song._id === songId ? true : song.isPublic,
  }));
}
