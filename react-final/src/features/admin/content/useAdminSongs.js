import { useEffect, useMemo, useState } from "react";
import useMessageNotice from "../../../components/ui/useMessageNotice";
import { getAllSongsForAdmin, setWeeklySong } from "../../../services/adminService";
import {
  normalizeAdminSongs, getPreferredSongId, getAdminSongStats, markWeeklySong,
} from "./adminSongsModel.js";

export default function useAdminSongs() {
  const [songs, setSongs] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  useMessageNotice(message);

  // Also used by the manual refresh button in the content-management view.
  const loadSongs = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const data = await getAllSongsForAdmin();
      const list = normalizeAdminSongs(data);

      setSongs(list);

      if (list.length > 0) {
        setSelectedSongId(getPreferredSongId(list));
      }
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    getAllSongsForAdmin()
      .then((data) => {
        if (!active) return;
        const list = normalizeAdminSongs(data);
        setSongs(list);
        if (list.length > 0) {
          setSelectedSongId(getPreferredSongId(list));
        }
      })
      .catch((error) => { if (active) setMessage({ type: "error", text: error.toString() }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const selectedSong = useMemo(() => {
    return songs.find((song) => song._id === selectedSongId) || null;
  }, [songs, selectedSongId]);

  const stats = useMemo(() => {
    return getAdminSongStats(songs);
  }, [songs]);

  const handleSetWeeklySong = async (songId) => {
    try {
      setActionLoadingId(songId);
      setMessage({ type: "", text: "" });

      await setWeeklySong(songId);

      const selectedAt = new Date().toISOString();
      setSongs((prevSongs) => markWeeklySong(prevSongs, songId, selectedAt));

      setSelectedSongId(songId);

      setMessage({
        type: "success",
        text: "שיר השבוע עודכן בהצלחה.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  return {
    songs, selectedSongId, setSelectedSongId, loading,
    actionLoadingId, selectedSong, stats,
    loadSongs, handleSetWeeklySong,
  };
}
