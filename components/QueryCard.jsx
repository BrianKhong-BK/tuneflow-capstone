import { useEffect, useState, useContext } from "react";
import {
  Card,
  Col,
  Row,
  Image,
  Container,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function QueryCard({ query, setNowPlaying, setSongCover }) {
  const { user, token } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  useEffect(() => {
    async function getSongs() {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/spotify-search?q=${query}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    }

    if (query) getSongs();
  }, [query]);

  async function addSong(track) {
    try {
      const res = await axios.get("http://localhost:3000/api/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylists(res.data);
      setSelectedTrack(track);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to fetch playlists", err);
    }
  }

  async function handleConfirmAdd() {
    if (!selectedPlaylistId || !selectedTrack) return;

    try {
      await axios.post(
        `http://localhost:3000/api/playlists/${selectedPlaylistId}/songs`,
        {
          title: selectedTrack.title,
          artist: selectedTrack.artist,
          youtubeId: selectedTrack.id,
          thumbnail: selectedTrack.cover,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowModal(false);
      setSelectedTrack(null);
      setSelectedPlaylistId(null);
    } catch (err) {
      console.error("Failed to add song to playlist", err);
    }
  }

  const TrackList = () => {
    if (!searchResults.length) {
      return (
        <div className="text-muted text-center py-5">No results found.</div>
      );
    }

    return (
      <div className="d-flex flex-column gap-3">
        {searchResults.map((result, index) => {
          function playSong() {
            setNowPlaying(`${result.title} : ${result.artist}`);
            setSongCover(result.cover);
          }

          return (
            <div
              key={index}
              className="d-flex align-items-center px-3 py-2 rounded hover-bg-dark border-bottom border-secondary"
              style={{ cursor: "pointer", transition: "background 0.2s" }}
            >
              <div className="text-white me-3" style={{ width: "30px" }}>
                {index + 1}
              </div>

              <Image
                src={result.cover}
                alt={result.title}
                rounded
                className="me-3"
                style={{
                  width: "56px",
                  height: "56px",
                  objectFit: "cover",
                }}
              />

              <div className="flex-grow-1">
                <div className="fw-semibold text-white">{result.title}</div>
                <div className="text-white-50 small">{result.artist}</div>
              </div>

              <div className="d-flex gap-2">
                {user && (
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={() => addSong(result)}
                  >
                    <i className="bi bi-download"></i>
                  </Button>
                )}
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
    <>
      <Col md={9}>
        <Card
          className="bg-card-dark text-white shadow rounded-3"
          style={{ height: "80vh" }}
        >
          <Card.Header className="border-bottom border-secondary">
            <h5 className="mb-0">Search Results</h5>
          </Card.Header>
          <Card.Body style={{ overflowY: "auto" }}>
            <Container fluid>
              <TrackList />
            </Container>
          </Card.Body>
        </Card>
      </Col>

      {/* Playlist Selection Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {playlists.length === 0 ? (
            <p className="text-muted">No playlists found.</p>
          ) : (
            <Form>
              {playlists.map((playlist) => (
                <Form.Check
                  key={playlist.id}
                  type="radio"
                  name="playlistSelect"
                  label={playlist.name}
                  checked={selectedPlaylistId === playlist.id}
                  onChange={() => setSelectedPlaylistId(playlist.id)}
                />
              ))}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmAdd}
            disabled={!selectedPlaylistId}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
