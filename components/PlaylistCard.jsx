import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Card, Col, Button, Modal, Form } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";

export default function PlaylistCard() {
  const { token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [playlists, setPlaylists] = useState([]);

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

      setShowModal(false);
      setPlaylistName("");
      setPlaylistDescription("");
      setIsPublic(false);
      fetchPlaylists();
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
        <Card.Header className="border-bottom border-secondary d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Your Playlists</h5>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setShowModal(true)}
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
                className="mb-3 p-2 bg-dark rounded border border-secondary"
              >
                <h6 className="mb-1">{playlist.name}</h6>
                {playlist.description && (
                  <p className="mb-1 text-muted" style={{ fontSize: "0.9rem" }}>
                    {playlist.description}
                  </p>
                )}
                <small className="text-muted">
                  {playlist.is_public ? "Public" : "Private"}
                </small>
              </div>
            ))
          )}
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
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
    </Col>
  );
}
