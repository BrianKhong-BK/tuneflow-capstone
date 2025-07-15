import ReactPlayer from "react-player";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Navbar,
  Container,
  Button,
  Form,
  Row,
  Col,
  Image,
} from "react-bootstrap";

export default function MusicNav({ nowPlaying }) {
  const [songId, setSongId] = useState(null);
  const [songCover, setSongCover] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(null);
  const [state, setState] = useState(null);

  const playerRef = useRef();

  useEffect(() => {
    async function playSong() {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/youtube-search?q=${nowPlaying}`
        );
        const song = response.data.results[0];

        setDuration(song.duration);

        setSongId(song.videoId);
        setSongCover(song.thumbnails[1].url);
        setSongTitle(song.name);
        setArtist(song.artist);
        setPlaying(true);
      } catch (error) {
        console.error("Error playing song", error);
      }
    }

    if (nowPlaying) {
      playSong();
    }
  }, [nowPlaying]);

  const convertDuration = (duration) => {
    const ms = duration,
      min = String(Math.floor((ms / 1000 / 60) << 0)),
      sec = String(Math.floor((ms / 1000) % 60)).padStart(2, "0");

    return min + ":" + sec;
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handlePause = () => {
    setPlaying(!playing);
  };

  const handleEnded = () => {
    setPlaying(false);
  };

  return (
    <Navbar bg="black" variant="dark">
      <Container fluid>
        <Row className="w-100 align-items-center">
          {songId && (
            <div
              style={{
                width: 0,
                height: 0,
                overflow: "hidden",
                position: "absolute",
              }}
            >
              <ReactPlayer
                ref={playerRef}
                src={`https://www.youtube.com/watch?v=${songId}`}
                playing={playing}
                volume={volume}
                width="0"
                height="0"
                onEnded={handleEnded}
              />
            </div>
          )}
          <Col md={4}>
            {songCover && (
              <div className="d-flex align-items-center">
                <Image
                  src={songCover}
                  rounded
                  className="me-3"
                  style={{
                    width: "56px",
                    height: "56px",
                    objectFit: "cover",
                  }}
                  onDoubleClick={() => console.log(duration)}
                />
                <div className="flex-grow-1">
                  <div className="fw-semibold text-white">{songTitle}</div>
                  <div className="text-white-50 small">{artist}</div>
                </div>
              </div>
            )}
          </Col>

          {/* Center: Play + Time Slider */}
          <Col md={4}>
            <div className="d-flex align-items-center justify-content-center gap-3">
              <Button variant="outline-light" onClick={handlePause}>
                {playing ? (
                  <i className="bi bi-pause-fill" />
                ) : (
                  <i className="bi bi-play-fill" />
                )}
              </Button>
              <Form.Range
                value={played}
                min={0}
                max={duration}
                step={1000}
                style={{ width: "100%" }}
              />
              {duration && (
                <div>
                  {played}/{duration}
                </div>
              )}
            </div>
          </Col>

          {/* Right: Volume */}
          <Col
            md={4}
            className="d-flex align-items-center justify-content-end gap-2"
          >
            <i className="bi bi-volume-down-fill text-light" />
            <Form.Range
              value={volume}
              min={0}
              max={1}
              step={0.01}
              style={{ width: "100px" }}
              onChange={handleVolumeChange}
            />
          </Col>
          <Button onClick={() => console.log(songId)}></Button>
        </Row>
      </Container>
    </Navbar>
  );
}
