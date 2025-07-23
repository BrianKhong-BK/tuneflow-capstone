import { useEffect, useState, useContext, useRef } from "react";
import {
  Card,
  Col,
  Image,
  Container,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function QueryCard({
  query,
  querySize,
  setNowPlaying,
  setSongCover,
  setPlayPlaylist,
}) {
  const { user, token } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  //Search on spotify API
  useEffect(() => {
    setSearchResults([]);
    setOffset(0);
    setHasMore(true);
    setLoading(false);

    async function initialLoad() {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/spotify-search?q=${query}&offset=0`
        );
        setSearchResults(res.data.items);
        setHasMore(res.data.hasNextPage);
        setOffset(30);
      } catch (err) {
        console.error("Initial load failed", err);
      } finally {
        setLoading(false);
      }
    }

    if (query) initialLoad();
  }, [query]);

  //Detects if scroll page reach the bottom
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el || loading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadNextPage();
      }
    };

    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", handleScroll);

    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loading]);

  //Load next page
  async function loadNextPage() {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/spotify-search?q=${query}&offset=${offset}`
      );
      setSearchResults((prev) => [...prev, ...res.data.items]);
      setHasMore(res.data.hasNextPage);
      setOffset((prev) => prev + 30);
    } catch (err) {
      console.error("Failed to load next page", err);
    } finally {
      setLoading(false);
    }
  }

  //Add song to playlist call out modal
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

  //Confirm add song to playlist
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

  //Tracklist group
  const TrackList = () => {
    if (!searchResults.length) {
      return (
        <div className="text-muted text-center py-5">No results found.</div>
      );
    }

    return (
      <div className="d-flex flex-column gap-2">
        {searchResults.map((result, index) => {
          //Play songs
          function playSong() {
            setNowPlaying(`${result.title} : ${result.artist}`);
            setSongCover(result.cover);
            setPlayPlaylist([]);
          }

          return (
            <div
              key={index}
              className="track-item d-flex align-items-center px-3 py-2 rounded track-hover"
            >
              <div
                className="track-index me-3 d-flex align-items-center justify-content-center"
                style={{ width: "30px" }}
              >
                {/* Index */}
                <span className="index-number text-white">{index + 1}</span>

                {/* Play button */}
                <i
                  className="bi bi-play-fill index-play icon-dark"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSong();
                  }}
                ></i>
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

              {/* Song info */}
              <div className="flex-grow-1">
                <div className="fw-semibold text-white">{result.title}</div>
                <div className="text-white-50 small">{result.artist}</div>
              </div>

              <div className="track-actions d-flex gap-4">
                {/* Add songs to playlist button */}
                {user && (
                  <i
                    className="bi bi-plus-circle icon-dark add-btn"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addSong(result);
                    }}
                  ></i>
                )}

                {/* Duration */}
                <div className="fw-semibold text-white">{result.duration}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Col md={querySize}>
        <Card
          className="bg-card-dark text-white shadow rounded-3"
          style={{ height: "80vh" }}
        >
          <Card.Body style={{ overflowY: "auto" }} ref={scrollRef}>
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
