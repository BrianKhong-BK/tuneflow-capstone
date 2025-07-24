import SearchBar from "../components/SearchBar";
import MusicNav from "../components/MusicNav";
import Sidebar from "../components/SideBar";
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

      <div style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Scrollable Content - On Small Screen */}
      <div
        className="d-md-none"
        style={{
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <Outlet />
      </div>

      {/* Scrollable Content - On Large Screen */}
      <div
        className="d-none d-md-block"
        style={{
          flexGrow: 1,
          overflowY: "auto",
          marginLeft: "200px",
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
