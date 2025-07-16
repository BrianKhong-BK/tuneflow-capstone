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
  const [lastVolume, setLastVolume] = useState(0);

  useEffect(() => {
    async function playSong() {
      try {
        const encodedQuery = encodeURIComponent(nowPlaying);
        const response = await axios.get(
          `http://localhost:3001/api/youtube-search?q=${encodedQuery}`
        );

        const song = response.data.results[0];

        setSongId(song.videoId);
        setSongCover(song.thumbnails[1].url.toString());
        setSongTitle(song.name);
        setArtist(
          Array.isArray(song.artist)
            ? song.artist.map((a) => a.name).toString()
            : song.artist.name
        );
        setState((prevState) => ({ ...prevState, playing: true }));
      } catch (error) {
        console.error("Error playing song", error);
      }
    }

    if (nowPlaying) {
      playSong();
    }
  }, [nowPlaying]);

  const convertDuration = (duration) => {
    const s = duration,
      min = String(Math.floor((s / 60) << 0)),
      sec = String(Math.floor(s % 60)).padStart(2, "0");

    return min + ":" + sec;
  };

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    // We only want to update time slider if we are not currently seeking
    if (!player || state.seeking) return;

    if (!player.duration) return;

    setState((prevState) => ({
      ...prevState,
      playedSeconds: player.currentTime,
      played: player.currentTime / player.duration,
    }));
  };

  const handlePause = () => {
    setState((prevState) => ({ ...prevState, playing: false }));
  };

  const handlePlay = () => {
    setState((prevState) => ({ ...prevState, playing: true }));
  };

  const handleVolumeChange = (event) => {
    const inputTarget = event.target;
    setState((prev) => ({
      ...prev,
      volume: Number.parseFloat(inputTarget.value),
    }));
  };

  const handleProgress = () => {
    const player = playerRef.current;
    // We only want to update time slider if we are not currently seeking
    if (!player || state.seeking || !player.buffered?.length) return;

    setState((prevState) => ({
      ...prevState,
      loadedSeconds: player.buffered?.end(player.buffered?.length - 1),
      loaded:
        player.buffered?.end(player.buffered?.length - 1) / player.duration,
    }));
  };

  const handleDurationChange = () => {
    const player = playerRef.current;
    if (!player) return;

    setState((prevState) => ({ ...prevState, duration: player.duration }));
  };

  const handleEnded = () => {
    setState((prevState) => ({ ...prevState, playing: prevState.loop }));
  };

  const handleSeekChange = (event) => {
    const inputTarget = event.target;
    setState((prevState) => ({
      ...prevState,
      played: parseFloat(inputTarget.value),
    }));
  };

  const handleSeekMouseDown = () => {
    setState((prevState) => ({ ...prevState, seeking: true }));
  };

  const handleSeekMouseUp = (event) => {
    const inputTarget = event.target;
    setState((prevState) => ({ ...prevState, seeking: false }));
    if (playerRef.current) {
      playerRef.current.currentTime =
        Number.parseFloat(inputTarget.value) * playerRef.current.duration;
    }
  };

  const handleToggleMuted = () => {
    if (volume > 0 && !muted) {
      setLastVolume(volume);
      setState((prevState) => ({ ...prevState, muted: true, volume: 0 }));
    } else {
      setState((prevState) => ({
        ...prevState,
        muted: false,
        volume: lastVolume,
      }));
      setLastVolume(0);
    }
  };

  const handleToggleLoop = () => {
    setState((prevState) => ({ ...prevState, loop: !prevState.loop }));
  };

  const { playing, volume, muted, loop, played, duration } = state;

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
                muted={muted}
                controls={false}
                width="0"
                height="0"
                onTimeUpdate={handleTimeUpdate}
                onProgress={handleProgress}
                onDurationChange={handleDurationChange}
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
                max={0.999999}
                step="any"
                style={{ width: "100%" }}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
              />
              {duration && (
                <div>
                  {convertDuration(parseInt(played * duration))}/
                  {convertDuration(duration)}
                </div>
              )}
            </div>
          </Col>

          {/* Right: Volume */}
          <Col
            md={4}
            className="d-flex align-items-center justify-content-end gap-2"
          >
            <div>
              <i className="bi bi-repeat me-2" onClick={handleToggleLoop} />
              {loop ? "LOOP" : "NO LOOP"}
            </div>
            <div onClick={handleToggleMuted}>
              {volume === 0 ? (
                <i className="bi bi-volume-mute-fill text-light" />
              ) : volume < 0.5 ? (
                <i className="bi bi-volume-down-fill text-light" />
              ) : (
                <i className="bi bi-volume-up-fill text-light" />
              )}
            </div>
            <Form.Range
              value={volume}
              min={0}
              max={1}
              step="any"
              style={{ width: "100px" }}
              onChange={handleVolumeChange}
            />
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}
