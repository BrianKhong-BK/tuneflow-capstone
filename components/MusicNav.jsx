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
  const playerRef = useRef();

  const initialState = {
    src: undefined,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 1,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    seeking: false,
    loadedSeconds: 0,
    playedSeconds: 0,
  };

  const [songId, setSongId] = useState(null);
  const [songCover, setSongCover] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [state, setState] = useState(initialState);

  useEffect(() => {
    async function playSong() {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/youtube-search?q=${nowPlaying}`
        );
        const song = response.data.results[0];

        setSongId(song.videoId);
        setSongCover(song.thumbnails[1].url);
        setSongTitle(song.name);
        setArtist(song.artist);
        setState((prevState) => ({ ...prevState, playing: true }));
      } catch (error) {
        console.error("Error playing song", error);
      }
    }

    if (nowPlaying) {
      playSong();
    }
  }, [nowPlaying]);

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    // We only want to update time slider if we are not currently seeking
    if (!player || state.seeking) return;

    console.log("onTimeUpdate", player.currentTime);

    if (!player.duration) return;

    setState((prevState) => ({
      ...prevState,
      playedSeconds: player.currentTime,
      played: player.currentTime / player.duration,
    }));
  };

  const handlePause = () => {
    console.log("onPause");
    setState((prevState) => ({ ...prevState, playing: false }));
  };

  const handlePlay = () => {
    console.log("onPlay");
    setState((prevState) => ({ ...prevState, playing: true }));
  };

  const handleVolumeChange = (event) => {
    const inputTarget = event.target;
    setState((prev) => ({ ...prev, volume: inputTarget.value }));
  };

  const {
    src,
    playing,
    controls,
    light,
    volume,
    muted,
    loop,
    played,
    loaded,
    duration,
    playbackRate,
    pip,
  } = state;

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
                onTimeUpdate={handleTimeUpdate}
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
              <Button
                variant="outline-light"
                onClick={playing ? handlePause : handlePlay}
              >
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
        </Row>
      </Container>
    </Navbar>
  );
}
