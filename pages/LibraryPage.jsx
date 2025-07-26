import { useState, useContext, useEffect, forwardRef } from "react";
import axios from "axios";
import {
  Container,
  Button,
  Modal,
  Form,
  Dropdown,
  Col,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { AppStateContext } from "../contexts/AppStateContext";

export default function LibraryPage() {
  const { token } = useContext(AuthContext);
  const { setSelectedPlaylistId } = useContext(AppStateContext);
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    if (token) {
      fetchPlaylists();
    } else {
      setPlaylists([]);
    }
  }, [token]);

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlaylists(res.data);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    }
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/library/${playlistId}`);
  };

  const handleCreate = async () => {
    // Handle playlist creation logic here
    try {
      await axios.post(
        "http://localhost:3000/api/playlists",
        {
          name: playlistName,
          description: playlistDescription,
          is_public: isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowCreateModal(false);
      setPlaylistName("");
      setPlaylistDescription("");
      setIsPublic(false);
      fetchPlaylists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/playlists/${editingPlaylist.id}`,
        {
          name: editName,
          description: editDescription,
          is_public: editIsPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowEditModal(false);
      setEditingPlaylist(null);
      fetchPlaylists();
    } catch (err) {
      console.error("Error updating playlist:", err);
    }
  };

  const handleDelete = (playlist) => {
    setPlaylistToDelete(playlist);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!playlistToDelete) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/playlists/${playlistToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchPlaylists();
      setShowDeleteModal(false);
      setPlaylistToDelete(null);
      setSelectedPlaylistId("");
    } catch (err) {
      console.error(err);
    }
  };

  const CustomToggle = forwardRef(({ onClick }, ref) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation(); // prevent card click
        onClick(e);
      }}
      className="burger-icon text-white d-flex justify-content-center align-items-center"
      style={{ cursor: "pointer" }}
    >
      <i className="bi bi-three-dots-vertical fs-5"></i>
    </div>
  ));

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
          <h3 className="mb-0">Your Playlists</h3>
          <Button
            className="rounded-pill"
            variant="outline-light"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            + Create
          </Button>
        </div>

        <Row className="py-2">
          {playlists.length === 0 ? (
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
                    {playlist.images.length >= 4 ? (
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

                    {/* Burger Menu (Dropdown) */}
                    <Dropdown
                      className="playlist-dropdown position-absolute top-0 end-0 p-2"
                      show={openDropdownId === playlist.id}
                      onToggle={(isOpen) =>
                        setOpenDropdownId(isOpen ? playlist.id : null)
                      }
                    >
                      <Dropdown.Toggle
                        as={CustomToggle}
                        playlistId={playlist.id}
                      />

                      <Dropdown.Menu align="end">
                        <Dropdown.Item
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPlaylist(playlist);
                            setEditName(playlist.name);
                            setEditDescription(playlist.description);
                            setEditIsPublic(playlist.is_public);
                            setShowEditModal(true);
                            setOpenDropdownId(null); // close dropdown
                          }}
                        >
                          <i className="bi bi-pencil me-2"></i>Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(playlist);
                            setOpenDropdownId(null); // close dropdown
                          }}
                        >
                          <i className="bi bi-trash me-2"></i>Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  {/* Text Overlay */}
                  <div className="playlist-info px-2 py-2">
                    <div className="fw-semibold text-truncate">
                      {playlist.name}
                    </div>
                    <div className="text-white-50 small text-truncate">
                      Playlist • {playlist.is_public ? "Public" : "Private"}
                    </div>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
      </Container>

      {/* Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="playlistName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="playlistDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Optional"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              controlId="isPublic"
              className="mt-4 d-flex align-items-center justify-content-between"
            >
              <Form.Label className="mb-0">Make playlist public</Form.Label>
              <Form.Check
                type="switch"
                id="isPublicSwitch"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={!playlistName.trim()}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {playlistToDelete && (
            <p>
              Are you sure you want to delete{" "}
              <strong>{playlistToDelete.name}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editPlaylistName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="editPlaylistDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group
              controlId="editIsPublic"
              className="mt-4 d-flex align-items-center justify-content-between"
            >
              <Form.Label className="mb-0">Make playlist public</Form.Label>
              <Form.Check
                type="switch"
                checked={editIsPublic}
                onChange={(e) => setEditIsPublic(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleEdit}
            disabled={!editName.trim()}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
