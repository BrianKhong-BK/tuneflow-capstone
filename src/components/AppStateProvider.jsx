import { useState } from "react";
import { AppStateContext } from "../contexts/AppStateContext";

export function AppStateProvider({ children }) {
  const [query, setQuery] = useState("");
  const [nowPlaying, setNowPlaying] = useState(null);
  const [songCover, setSongCover] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [playPlaylist, setPlayPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const url = "https://tuneflow-capstone-jn2b.vercel.app";

  return (
    <AppStateContext.Provider
      value={{
        query,
        setQuery,
        nowPlaying,
        setNowPlaying,
        songCover,
        setSongCover,
        selectedPlaylistId,
        setSelectedPlaylistId,
        playPlaylist,
        setPlayPlaylist,
        currentIndex,
        setCurrentIndex,
        url,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
