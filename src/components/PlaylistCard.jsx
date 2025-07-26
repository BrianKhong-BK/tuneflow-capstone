import { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Col,
  Button,
  Modal,
  Form,
  Badge,
  Container,
} from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";

export default function PlaylistCard({ setSelectedPlaylistId }) {
  const { token } = useContext(AuthContext);
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

  return (
    <Col md={3}>
      <Card
        className="bg-card-dark text-white shadow rounded-3"
        style={{ height: "80vh" }}
      >
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Your Playlists</h5>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            + Create
          </Button>
        </Card.Header>

        <Card.Body style={{ overflowY: "auto" }}>
          {playlists.length === 0 ? (
            <p className="text-muted">No playlists yet.</p>
          ) : (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                className=" track-item d-flex align-items-center gap-3 p-2 mb-2 rounded cursor-pointer track-hover"
                onClick={() => setSelectedPlaylistId(playlist.id)}
                role="button"
              >
                {/* Thumbnail */}
                {playlist.images.length >= 4 ? (
                  <div className="square-grid-sm">
                    <div className="square-grid-inner">
                      {playlist.images.slice(0, 4).map((img, index) => (
                        <img key={index} src={img} alt={`img-${index}`} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <img
                    src={playlist.images[0]}
                    alt="playlist-cover"
                    className="single-image-sm"
                  />
                )}

                {/* Playlist Info */}
                <div className="flex-grow-1">
                  <div className="fw-semibold">{playlist.name}</div>
                  <div className="text-white-50 small">
                    Playlist • {playlist.is_public ? "Public" : "Private"}
                  </div>
                </div>

                <div className="track-actions d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-circle edit-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent triggering playlist selection
                      setEditingPlaylist(playlist);
                      setEditName(playlist.name);
                      setEditDescription(playlist.description);
                      setEditIsPublic(playlist.is_public);
                      setShowEditModal(true);
                      console.log(editingPlaylist);
                    }}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="rounded-circle remove-btn"
                    onClick={() => handleDelete(playlist)}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </Button>
                </div>
              </div>
            ))
          )}
        </Card.Body>
      </Card>

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
    </Col>
  );
}
