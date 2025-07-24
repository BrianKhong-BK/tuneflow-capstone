import SearchBar from "../components/SearchBar";
import MusicNav from "../components/MusicNav";
import { AppStateContext } from "../contexts/AppStateContext";
import { useContext } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const { nowPlaying } = useContext(AppStateContext);

  return (
    <div
      className="d-flex flex-column"
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Fixed Top Search Bar */}
      <div style={{ flexShrink: 0 }}>
        <SearchBar />
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <Outlet />
      </div>

      {/* Fixed Bottom Music Player */}
      {nowPlaying && (
        <div style={{ flexShrink: 0 }}>
          <MusicNav />
        </div>
      )}
    </div>
  );
}
