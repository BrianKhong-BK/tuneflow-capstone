import { Button, Row } from "react-bootstrap";
import { useState, useContext } from "react";
import SearchBar from "../components/SearchBar";
import QueryCard from "../components/QueryCard";
import PlaylistCard from "../components/PlaylistCard";
import NowPlayingCard from "../components/NowPlayingCard";
import MusicNav from "../components/MusicNav";
import { AuthContext } from "../contexts/AuthContext";

export default function MainPage() {
  const { user, token, loading } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [nowPlaying, setNowPlaying] = useState(null);
  const [songCover, setSongCover] = useState("");

  return (
    <div className="bg-black text-white p-2" style={{ minHeight: "100vh" }}>
      <SearchBar setQuery={setQuery} />
      <Row className="g-3">
        <PlaylistCard />
        <QueryCard
          query={query}
          setNowPlaying={setNowPlaying}
          setSongCover={setSongCover}
        />
        <MusicNav nowPlaying={nowPlaying} image={songCover} />
      </Row>
    </div>
  );
}
