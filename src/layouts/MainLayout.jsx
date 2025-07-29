import SearchBar from "../components/SearchBar";
import MusicNav from "../components/MusicNav";
import Sidebar from "../components/SideBar";
import { AppStateContext } from "../contexts/AppStateContext";
import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const { nowPlaying } = useContext(AppStateContext);
  const [isSmall, setIsSmall] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth >= 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

      {/* Sidebar only for large screens */}
      {isSmall && (
        <div
          style={{
            flexShrink: 0,
            width: "200px",
            position: "absolute",
            top: 56 /* adjust height of SearchBar */,
            bottom: nowPlaying ? 56 : 0,
          }}
        >
          <Sidebar />
        </div>
      )}

      {/* Scrollable Content */}
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          marginLeft: isSmall ? "200px" : "0",
          marginBottom: nowPlaying ? "56px" : "0",
        }}
      >
        <Outlet />
      </div>

      {/* Fixed Bottom Music Player */}
      {nowPlaying && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1050, // Bootstrap modals use 1050, use 1100 to be safe
          }}
        >
          <MusicNav />
        </div>
      )}
    </div>
  );
}
