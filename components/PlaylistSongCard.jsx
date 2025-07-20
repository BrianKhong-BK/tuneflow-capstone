import { useEffect, useState, useContext } from "react";
import {
  Card,
  Col,
  Container,
  Image,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function PlaylistSongCard({
  selectedPlaylistId,
  setNowPlaying,
  setSongCover,
  songs,
  setSongs,
  setCurrentIndex,
}) {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    async function fetchPlaylistSongs() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/playlists/${selectedPlaylistId}/songs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSongs(res.data);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Failed to load playlist songs", error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedPlaylistId) {
      setLoading(true);
      fetchPlaylistSongs();
    }
  }, [selectedPlaylistId]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      const current = songs[0];
      setCurrentIndex(0);
      setNowPlaying(`${current.title} : ${current.artist}`);
      setSongCover(current.thumbnail);
    }
  };

  const handleRemove = (song) => {
    setSelectedSong(song);
    setShowModal(true);
  };

  const confirmRemove = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/playlists/${selectedPlaylistId}/songs/${selectedSong.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSongs((prev) => prev.filter((s) => s.id !== selectedSong.id));
      setShowModal(false);
      setSelectedSong(null);
    } catch (error) {
      console.error("Failed to remove song", error);
    }
  };

  const SongList = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="light" />
        </div>
      );
    }

    if (!songs.length) {
      return (
        <div className="text-muted text-center py-5">
          This playlist is empty.
        </div>
      );
    }

    return (
      <div className="d-flex flex-column gap-3">
        {songs.map((song, index) => {
          const playSong = () => {
            setNowPlaying(`${song.title} : ${song.artist}`);
            setSongCover(song.thumbnail);
            setCurrentIndex(index);
          };

          return (
            <div
              key={song.id}
              className="d-flex align-items-center px-3 py-2 rounded hover-bg-dark border-bottom border-secondary"
              style={{ cursor: "pointer", transition: "background 0.2s" }}
            >
              <div className="text-white me-3" style={{ width: "30px" }}>
                {index + 1}
              </div>

              <Image
                src={song.thumbnail}
                alt={song.title}
                rounded
                className="me-3"
                style={{
                  width: "56px",
                  height: "56px",
                  objectFit: "cover",
                }}
              />

              <div className="flex-grow-1">
                <div className="fw-semibold text-white">{song.title}</div>
                <div className="text-white-50 small">{song.artist}</div>
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="rounded-pill px-3"
                  onClick={() => handleRemove(song)}
                >
                  <i className="bi bi-x"></i>
                </Button>

                <Button
                  variant="outline-light"
                  size="sm"
                  className="rounded-pill px-3"
                  onClick={playSong}
                >
                  <i className="bi bi-play-fill"></i>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Col md={9}>
      <Card
        className="bg-card-dark text-white shadow rounded-3"
        style={{ height: "80vh" }}
      >
        <Card.Header className="border-bottom border-secondary">
          <h5 className="mb-0">Playlist Songs</h5>
        </Card.Header>
        <Card.Body style={{ overflowY: "auto" }}>
          {songs.length > 0 && (
            <Card className="bg-dark text-light mb-3">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Playlist Player</h5>
                <Button
                  variant="success"
                  size="sm"
                  className="rounded-pill px-4"
                  onClick={handlePlayAll}
                >
                  Play All
                </Button>
              </Card.Body>
            </Card>
          )}
          <Container fluid>
            <SongList />
          </Container>
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove Song</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove <strong>{selectedSong?.title}</strong>{" "}
          from this playlist?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemove}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
}
