import ReactPlayer from "react-player";
import { useEffect, useRef, useState } from "react";
import { Card, Col, Button, Form } from "react-bootstrap";
import axios from "axios";

export default function NowPlayingCard({ nowPlaying, backgroundColor }) {
  const [song, setSong] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const playerRef = useRef(null);

  useEffect(() => {
    async function playSong() {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/youtube-search?q=${nowPlaying}`
        );
        setSong(response.data.results[0]);
        setPlaying(true); // auto play when song loads
        setPlayed(0); // reset progress
      } catch (error) {
        console.error("Error playing song", error);
      }
    }

    if (nowPlaying) {
      playSong();
    }
  }, [nowPlaying]);

  const handleProgress = (state) => {
    setPlayed(state.played); // 0 to 1
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setPlayed(newTime);
    playerRef.current.seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleEnded = () => {
    setPlaying(false);
  };

  return (
    <Col md={3}>
      <Card
        className="text-white shadow rounded-3"
        style={{ backgroundColor: backgroundColor, height: "80vh" }}
      >
        <Card.Header className="border-bottom border-secondary">
          <h5 className="mb-0">Now Playing</h5>
        </Card.Header>

        <Card.Body
          className="d-flex flex-column gap-3"
          style={{ overflowY: "auto" }}
        >
          {song ? (
            <>
              <ReactPlayer
                ref={playerRef}
                src={`https://www.youtube.com/watch?v=${song.videoId}`}
                playing={playing}
                muted={false}
                controls={false}
                volume={volume}
                width="100%"
                height="180px"
                onProgress={handleProgress}
                onEnded={handleEnded}
              />

              {/* Controls */}
              <div className="d-flex justify-content-center gap-3">
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => setPlaying((prev) => !prev)}
                >
                  {playing ? (
                    <i className="bi bi-pause-fill"></i>
                  ) : (
                    <i className="bi bi-play-fill"></i>
                  )}
                </Button>
              </div>

              {/* Timestamp slider */}
              <Form.Range
                value={played}
                min={0}
                max={1}
                step={0.01}
                onChange={handleSeek}
              />

              {/* Volume slider */}
              <div>
                <label className="small">Volume</label>
                <Form.Range
                  value={volume}
                  min={0}
                  max={1}
                  step={0.01}
                  onChange={handleVolumeChange}
                />
              </div>
            </>
          ) : (
            <p className="text-muted">Nothing playing.</p>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
}
