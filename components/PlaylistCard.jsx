import { Card, Col } from "react-bootstrap";

export default function PlaylistCard() {
  return (
    <Col md={3}>
      <Card
        className="bg-dark text-white shadow rounded-3"
        style={{ height: "80vh" }}
      >
        <Card.Header className="bg-dark border-bottom border-secondary">
          <h5 className="mb-0">Your Playlists</h5>
        </Card.Header>
        <Card.Body style={{ overflowY: "auto" }}>
          {/* Replace with real content */}
          <p className="text-muted">No playlists yet.</p>
        </Card.Body>
      </Card>
    </Col>
  );
}
