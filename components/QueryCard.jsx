import { useEffect, useState } from "react";
import { Card, Col, Row, Image, Container, Button } from "react-bootstrap";
import axios from "axios";

export default function QueryCard({ query, setNowPlaying }) {
  const [searchResults, setSearchResults] = useState([]);

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
          }

          return (
            <div
              key={index}
              className="d-flex align-items-center px-3 py-2 rounded hover-bg-dark border-bottom border-secondary"
              style={{ cursor: "pointer", transition: "background 0.2s" }}
            >
              {/* Index */}
              <div className="text-white me-3" style={{ width: "30px" }}>
                {index + 1}
              </div>

              {/* Album Art */}
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
                onClick={() => console.log(searchResults)}
              />

              {/* Title and Artist */}
              <div className="flex-grow-1">
                <div className="fw-semibold text-white">{result.title}</div>
                <div className="text-white-50 small">{result.artist}</div>
              </div>

              {/* Optional: Play or Add button */}
              <Button
                variant="outline-light"
                size="sm"
                className="rounded-pill px-3 d-none d-md-block"
                onClick={playSong}
              >
                <i className="bi bi-play-fill"></i>
              </Button>
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
          <h5 className="mb-0">Search Results</h5>
        </Card.Header>
        <Card.Body style={{ overflowY: "auto" }}>
          <Container fluid>
            <TrackList />
          </Container>
        </Card.Body>
      </Card>
    </Col>
  );
}
