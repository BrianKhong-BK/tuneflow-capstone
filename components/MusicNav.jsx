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

export default function MusicNav({
  nowPlaying,
  songCover,
  setSongCover,
  playPlaylist,
  currentIndex,
  setCurrentIndex,
  setNowPlaying,
}) {
  //Initial state for react-player
  const initialState = {
    src: undefined,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 0.7,
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
  const [currentSongInfo, setCurrentSongInfo] = useState({
    cover: "",
    title: "",
    artist: "",
  });
  const [state, setState] = useState(initialState);
  const [lastVolume, setLastVolume] = useState(0);
  const [lastSong, setLastSong] = useState(false);
  const playerRef = useRef();

  //Get songs info from youtube-music-api
  useEffect(() => {
    async function playSong() {
      try {
        const encodedQuery = encodeURIComponent(nowPlaying);
        const response = await axios.get(
          `http://localhost:3000/api/youtube-search?q=${encodedQuery}`
        );

        const song = response.data.results[0];

        setSongId(song.videoId);
        setState((prevState) => ({ ...prevState, playing: true }));
        setCurrentSongInfo({
          cover: songCover,
          title: song.name,
          artist: song.artist,
        });
      } catch (error) {
        console.error("Error playing song", error);
      }
    }

    if (nowPlaying) {
      playSong();
    }
  }, [nowPlaying, songCover]);

  //Convert ms to min + sec
  const convertDuration = (duration) => {
    const s = duration,
      min = String(Math.floor((s / 60) << 0)),
      sec = String(Math.floor(s % 60)).padStart(2, "0");

    return min + ":" + sec;
  };

  //Update time duration as song plays
  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (!player || state.seeking) return;

    if (!player.duration) return;

    setState((prevState) => ({
      ...prevState,
      playedSeconds: player.currentTime,
      played: player.currentTime / player.duration,
    }));
  };

  //Pause songs
  const handlePause = () => {
    setState((prevState) => ({ ...prevState, playing: false }));
  };

  //Play songs
  const handlePlay = () => {
    if (playPlaylist.length > 0) {
      if (currentIndex + 1 >= playPlaylist.length && lastSong) {
        setCurrentIndex(0);
        const firstSong = playPlaylist[0];
        setNowPlaying(`${firstSong.title} : ${firstSong.artist}`);
        setSongCover(firstSong.thumbnail);
        setLastSong(false);
      } else {
        setState((prevState) => ({ ...prevState, playing: true }));
      }
    } else {
      setState((prevState) => ({ ...prevState, playing: true }));
    }
  };

  //Change volume
  const handleVolumeChange = (event) => {
    const inputTarget = event.target;
    setState((prev) => ({
      ...prev,
      volume: Number.parseFloat(inputTarget.value),
    }));
  };

  //Update buffer progress bar
  const handleProgress = () => {
    const player = playerRef.current;
    if (!player || state.seeking || !player.buffered?.length) return;

    setState((prevState) => ({
      ...prevState,
      loadedSeconds: player.buffered?.end(player.buffered?.length - 1),
      loaded:
        player.buffered?.end(player.buffered?.length - 1) / player.duration,
    }));
  };

  //
  const handleDurationChange = () => {
    const player = playerRef.current;
    if (!player) return;

    setState((prevState) => ({ ...prevState, duration: player.duration }));
  };

  //Handle event after player ended
  const handleEnded = () => {
    if (playPlaylist.length > 0 && !state.loop) {
      setState((prevState) => ({ ...prevState, playing: false }));
      const isLastSong = currentIndex + 1 >= playPlaylist.length;
      if (isLastSong) {
        setLastSong(true);
        setState((prevState) => ({ ...prevState, playing: false }));
      } else {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        const nextSong = playPlaylist[nextIndex];
        setNowPlaying(`${nextSong.title} : ${nextSong.artist}`);
        setSongCover(nextSong.thumbnail);
        setState((prevState) => ({ ...prevState, playing: false }));
      }
    } else {
      setState((prevState) => ({ ...prevState, playing: false }));
    }

    if (state.loop) {
      setState((prevState) => ({ ...prevState, playing: true }));
    }
  };

  //Change played timestamp when seeking
  const handleSeekChange = (event) => {
    const inputTarget = event.target;
    setState((prevState) => ({
      ...prevState,
      played: parseFloat(inputTarget.value),
    }));
  };

  //Handle event when mouse is hold
  const handleSeekMouseDown = () => {
    setState((prevState) => ({ ...prevState, seeking: true }));
  };

  //Handle event when mouse is release
  const handleSeekMouseUp = (event) => {
    const inputTarget = event.target;
    setState((prevState) => ({ ...prevState, seeking: false }));
    if (playerRef.current) {
      playerRef.current.currentTime =
        Number.parseFloat(inputTarget.value) * playerRef.current.duration;
    }
  };

  //Toggle mute
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

  //Toggle loop
  const handleToggleLoop = () => {
    setState((prevState) => ({ ...prevState, loop: !prevState.loop }));
  };

  //Play next song in playlist
  const handleNext = () => {
    if (playPlaylist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playPlaylist.length;
    setCurrentIndex(nextIndex);
    const nextSong = playPlaylist[nextIndex];
    setNowPlaying(`${nextSong.title} : ${nextSong.artist}`);
    setSongCover(nextSong.thumbnail);
  };

  //Play previous song in playlist
  const handlePrevious = () => {
    if (playPlaylist.length === 0) return;
    const prevIndex =
      (currentIndex - 1 + playPlaylist.length) % playPlaylist.length;
    setCurrentIndex(prevIndex);
    const prevSong = playPlaylist[prevIndex];
    setNowPlaying(`${prevSong.title} : ${prevSong.artist}`);
    setSongCover(prevSong.thumbnail);
  };

  const { playing, volume, muted, loop, played, duration } = state;

  //Update progress bar style
  useEffect(() => {
    const percentage = played * 100;
    const slider = document.querySelector(".progress-range");
    if (slider) {
      slider.style.background = `linear-gradient(to right, #FF6B00 0%, #FF6B00 ${percentage}%, #ffffff ${percentage}%, #ffffff 100%)`;
    }
  }, [played]);

  useEffect(() => {
    const percentage = volume * 100;
    const slider = document.querySelector(".volume-range");
    if (slider) {
      slider.style.background = `linear-gradient(to right, #FF6B00 0%, #FF6B00 ${percentage}%, #ffffff ${percentage}%, #ffffff 100%)`;
    }
  }, [volume]);

  return (
    <div>
      <Container fluid>
        <Form.Range
          className="progress-range"
          value={played}
          min={0}
          max={0.999999}
          step="any"
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
        />
      </Container>

      <Container fluid className="pt-2">
        <Row className="align-items-center">
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
          <Col xs={12} md={4}>
            {currentSongInfo.cover && (
              <div className="d-flex align-items-center">
                <Image
                  src={currentSongInfo.cover}
                  rounded
                  className="me-3"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
                <div className="song-info">
                  <div className="title">{currentSongInfo.title}</div>
                  <div className="artist">{currentSongInfo.artist}</div>
                </div>
              </div>
            )}
          </Col>

          {/* Center: Controls + Progress */}
          <Col xs={12} md={4}>
            <div className="d-flex align-items-center justify-content-center gap-3 play-controls">
              <Button
                onClick={handlePrevious}
                disabled={!nowPlaying ? true : false}
              >
                <i className="bi bi-skip-start-fill" />
              </Button>

              <Button
                onClick={playing ? handlePause : handlePlay}
                disabled={!nowPlaying ? true : false}
              >
                {playing ? (
                  <i className="bi bi-pause-fill" />
                ) : (
                  <i className="bi bi-play-fill" />
                )}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!nowPlaying ? true : false}
              >
                <i className="bi bi-skip-end-fill" />
              </Button>

              {duration !== 0 && (
                <div className="time-display">
                  {convertDuration(parseInt(played * duration))}/
                  {convertDuration(duration)}
                </div>
              )}
            </div>
          </Col>

          {/* Right: Volume & Loop */}
          <Col xs={12} md={4}>
            <div className="d-flex align-items-center justify-content-end gap-3 volume-controls">
              <div className="repeat-toggle " onClick={handleToggleLoop}>
                <i
                  className="bi bi-repeat me-1"
                  style={loop ? { color: "#FF6B00" } : { color: "white" }}
                />
              </div>
              <div onClick={handleToggleMuted}>
                {volume === 0 ? (
                  <i className="bi bi-volume-mute-fill" />
                ) : volume < 0.5 ? (
                  <i className="bi bi-volume-down-fill" />
                ) : (
                  <i className="bi bi-volume-up-fill" />
                )}
              </div>
              <Form.Range
                className="volume-range"
                value={volume}
                min={0}
                max={1}
                step="any"
                style={{ width: "100px" }}
                onChange={handleVolumeChange}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
