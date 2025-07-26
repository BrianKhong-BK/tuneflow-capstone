import { useEffect, useState, useContext } from "react";
import {
  Row,
  Col,
  Container,
  Image,
  Button,
  Spinner,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { AppStateContext } from "../contexts/AppStateContext";
import { useParams } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

export default function LibrarySongsPage() {
  const { token } = useContext(AuthContext);
  const { setPlayPlaylist, setNowPlaying, setSongCover, setCurrentIndex } =
    useContext(AppStateContext);
  const playlistId = useParams().id;
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlistStatus, setPlaylistStatus] = useState(false);
  const [playlistImage, setPlaylistImage] = useState([]);
  const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const playlist = res.data;
        setPlaylistName(playlist.name);
        setPlaylistImage(playlist.images);
        setPlaylistDescription(playlist.description);
        setPlaylistStatus(playlist.is_public);

        // Try to get Firebase image
        const imageRef = ref(storage, `playlist_covers/${playlistId}.jpg`);
        const firebaseUrl = await getDownloadURL(imageRef);
        setFirebaseImageUrl(firebaseUrl);
      } catch (error) {
        console.error("Failed to load playlist", error);
      }
    }

    async function fetchPlaylistSongs() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/playlists/${playlistId}/songs`,
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

    if (playlistId) {
      setLoading(true);
      fetchPlaylists();
      fetchPlaylistSongs();
    }
  }, [playlistId]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setPlayPlaylist(songs);
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
        `http://localhost:3000/api/playlists/${playlistId}/songs/${selectedSong.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedSongs = songs.filter((s) => s.id !== selectedSong.id);
      setSongs(updatedSongs);
      setPlayPlaylist(updatedSongs);
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
            setPlayPlaylist(songs);
            setNowPlaying(`${song.title} : ${song.artist}`);
            setSongCover(song.thumbnail);
            setCurrentIndex(index);
          };

          return (
            <div
              key={song.id}
              className="track-item d-flex align-items-center px-3 py-2 rounded track-hover"
            >
              <div
                className="track-index me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "30px", position: "relative" }}
              >
                <span className="index-number text-white">{index + 1}</span>
                <i
                  className="bi bi-play-fill index-play icon-dark position-absolute"
                  style={{ cursor: "pointer", left: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSong();
                  }}
                ></i>
              </div>

              <Image
                src={song.thumbnail}
                alt={song.title}
                rounded
                className="me-3 flex-shrink-0"
                style={{
                  width: "56px",
                  height: "56px",
                  objectFit: "cover",
                }}
              />

              <div className="flex-grow-1 overflow-hidden">
                <div
                  className="fw-semibold text-white text-truncate"
                  style={{ maxWidth: "100%" }}
                  title={song.title}
                >
                  {song.title}
                </div>
                <div
                  className="text-white-50 small text-truncate"
                  style={{ maxWidth: "100%" }}
                  title={song.artist}
                >
                  {song.artist}
                </div>
              </div>

              <div className="track-actions d-flex gap-4 align-items-center ms-3 flex-shrink-0">
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="rounded-circle remove-btn"
                  onClick={() => handleRemove(song)}
                >
                  <i className="bi bi-x"></i>
                </Button>
                <div className="fw-semibold text-white">{song.duration}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-card-dark" style={{ height: "100%", overflowY: "auto" }}>
      <Container>
        <Container fluid className="text-white py-4 px-3">
          <Row className="bg-dark align-items-center p-3 rounded text-center text-md-start">
            <Col
              xs={12}
              md="auto"
              className="mb-3 mb-md-0 d-flex justify-content-center justify-content-md-start"
            >
              <div
                className="playlist-img-container position-relative"
                style={{ height: "20vh", width: "20vh" }}
              >
                {firebaseImageUrl ? (
                  <img
                    src={firebaseImageUrl}
                    alt="firebase-cover"
                    className="playlist-img img-fluid object-fit-cover"
                  />
                ) : playlistImage.length >= 4 ? (
                  <div className="square-grid-fixed">
                    {playlistImage.slice(0, 4).map((img, index) => (
                      <img key={index} src={img} alt={`img-${index}`} />
                    ))}
                  </div>
                ) : playlistImage.length > 0 ? (
                  <img
                    src={playlistImage[0]}
                    alt="playlist-cover"
                    className="playlist-img img-fluid object-fit-cover"
                  />
                ) : (
                  <div className="fallback-icon d-flex justify-content-center align-items-center text-white-50">
                    <i className="bi bi-music-note-beamed fs-1"></i>
                  </div>
                )}
              </div>
            </Col>

            <Col
              xs={12}
              md="auto"
              className="d-flex flex-column align-items-center align-items-md-start"
            >
              <h5 className="text-uppercase text-white-50 mb-1">
                Playlist • {playlistStatus ? "public" : "private"}
              </h5>
              <h1 className="display-5 fw-bold">{playlistName}</h1>
              <p className="text-white-50 mb-1">{playlistDescription}</p>
              <Button variant="success" size="md" onClick={handlePlayAll}>
                <i className="bi bi-play-fill"></i> Play All
              </Button>
            </Col>
          </Row>
        </Container>

        <SongList />
      </Container>

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
    </div>
  );
}
