import { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Button,
  Modal,
  Form,
  Dropdown,
  Col,
  Row,
  Spinner,
} from "react-bootstrap";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { AppStateContext } from "../contexts/AppStateContext";

export default function LibraryPage() {
  const { token } = useContext(AuthContext);
  const { url } = useContext(AppStateContext);
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchPlaylists();
    } else {
      setPlaylists([]);
    }
  }, [token]);

  const fetchCoverFromFirebase = async (playlistId) => {
    try {
      const storageRef = ref(storage, `playlist_covers/${playlistId}.jpg`);
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.error(err);
      return null; // If not found
    }
  };

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get(`${url}/api/playlists-public`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Attach firebaseCover to each playlist
      const enriched = await Promise.all(
        res.data.map(async (playlist) => {
          const firebaseCover = await fetchCoverFromFirebase(playlist.id);
          return { ...playlist, firebaseCover };
        })
      );

      setPlaylists(enriched);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/library/${playlistId}`);
  };

  return (
    <div
      className="bg-card-dark text-white pt-2"
      style={{
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Container>
        <div className="d-flex align-items-center gap-3 py-2">
          <h3 className="mb-0">Explore</h3>
        </div>

        <Row className="py-2">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="light" />
            </div>
          ) : playlists.length === 0 ? (
            <p className="text-muted">No playlists yet.</p>
          ) : (
            playlists.map((playlist) => (
              <Col
                key={playlist.id}
                xl={2}
                lg={3}
                md={4}
                sm={6}
                xs={6}
                className="mb-4"
              >
                <div
                  className="playlist-box position-relative p-2 text-white overflow-hidden rounded cursor-pointer"
                  onClick={() => handlePlaylistClick(playlist.id)}
                  role="button"
                >
                  {/* Square Image */}
                  <div className="playlist-img-container position-relative">
                    {playlist.firebaseCover ? (
                      <img
                        src={playlist.firebaseCover}
                        alt="firebase-cover"
                        className="playlist-img w-100 h-100 position-absolute top-0 start-0 object-fit-cover"
                      />
                    ) : playlist.images.length >= 4 ? (
                      <div className="square-grid-fixed">
                        {playlist.images.slice(0, 4).map((img, index) => (
                          <img key={index} src={img} alt={`img-${index}`} />
                        ))}
                      </div>
                    ) : playlist.images.length > 0 ? (
                      <img
                        src={playlist.images[0]}
                        alt="playlist-cover"
                        className="playlist-img w-100 h-100 position-absolute top-0 start-0 object-fit-cover"
                      />
                    ) : (
                      <div className="fallback-icon d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100 text-white-50">
                        <i className="bi bi-music-note-beamed fs-1"></i>
                      </div>
                    )}
                  </div>
                  {/* Text Overlay */}
                  <div className="playlist-info px-2 py-2">
                    <div className="fw-semibold text-truncate">
                      {playlist.name}
                    </div>
                    <div className="text-white-50 small text-truncate">
                      By {playlist.username}
                    </div>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
}
