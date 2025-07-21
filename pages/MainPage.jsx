import { Row } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import SearchBar from "../components/SearchBar";
import QueryCard from "../components/QueryCard";
import PlaylistCard from "../components/PlaylistCard";
import MusicNav from "../components/MusicNav";
import PlaylistSongCard from "../components/PlaylistSongCard";
import { AuthContext } from "../contexts/AuthContext";

export default function MainPage() {
  const { token } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [nowPlaying, setNowPlaying] = useState(null);
  const [songCover, setSongCover] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [querySize, setQuerySize] = useState(0);

  useEffect(() => {
    if (token) {
      setQuerySize(9);
    } else {
      setQuerySize(12);
    }
  }, [token]);

  return (
    <div className="bg-black text-white p-2" style={{ minHeight: "100vh" }}>
      <SearchBar
        setQuery={setQuery}
        setSelectedPlaylistId={setSelectedPlaylistId}
      />
      <Row className="g-3">
        {token && (
          <PlaylistCard setSelectedPlaylistId={setSelectedPlaylistId} />
        )}
        {selectedPlaylistId ? (
          <PlaylistSongCard
            selectedPlaylistId={selectedPlaylistId}
            setNowPlaying={setNowPlaying}
            setSongCover={setSongCover}
            songs={songs}
            setSongs={setSongs}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        ) : (
          <QueryCard
            query={query}
            querySize={querySize}
            setNowPlaying={setNowPlaying}
            setSongCover={setSongCover}
            setSongs={setSongs}
          />
        )}
        <MusicNav
          nowPlaying={nowPlaying}
          setNowPlaying={setNowPlaying}
          songCover={songCover}
          setSongCover={setSongCover}
          songs={songs}
          setSongs={setSongs}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </Row>
    </div>
  );
}
