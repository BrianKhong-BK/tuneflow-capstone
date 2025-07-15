import { Row } from "react-bootstrap";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import QueryCard from "../components/QueryCard";
import PlaylistCard from "../components/PlaylistCard";
import NowPlayingCard from "../components/NowPlayingCard";
import MusicNav from "../components/MusicNav";

export default function MainPage() {
  const [query, setQuery] = useState("");
  const [nowPlaying, setNowPlaying] = useState(null);

  return (
    <div className="bg-black text-white p-2" style={{ minHeight: "100vh" }}>
      <SearchBar setQuery={setQuery} />
      <Row className="g-3">
        <QueryCard query={query} setNowPlaying={setNowPlaying} />
        <MusicNav nowPlaying={nowPlaying} />
      </Row>
    </div>
  );
}
