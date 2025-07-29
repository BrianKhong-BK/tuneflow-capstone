import { Container, Button, Col, Spinner } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppStateContext } from "../contexts/AppStateContext";
import axios from "axios";

export default function HomePage() {
  const { user, token } = useContext(AuthContext);
  const { url, setNowPlaying, setSongCover } = useContext(AppStateContext);
  const navigate = useNavigate();
  const [recentAdd, setRecentAdd] = useState([]);
  const [recentPlay, setRecentPlay] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentlyAdded();
      fetchRecentlyPlayed();
    }
  }, [user]);

  const fetchRecentlyAdded = async () => {
    try {
      const res = await axios.get(`${url}/api/recent-song`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecentAdd(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecentlyPlayed = async () => {
    try {
      const res = await axios.get(`${url}/api/recent-played`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecentPlay(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const RecentlyAddedGroup = () => {
    return (
      <div className="recently-played-section">
        <h4 className="text-white mb-3">Recently Added</h4>
        {recentAdd.length != 0 ? (
          <div className="d-flex overflow-auto gap-3 pb-2 scroll-container">
            {recentAdd.map((song, index) => (
              <Col
                key={index}
                xl={2}
                lg={3}
                md={4}
                sm={6}
                xs={6}
                className="mb-4"
              >
                <div className="playlist-box position-relative p-2 text-white overflow-hidden rounded cursor-pointer">
                  {/* Square Image */}
                  <div className="playlist-img-container position-relative">
                    <img
                      src={song.thumbnail}
                      alt="playlist-cover"
                      className="playlist-img w-100 h-100 position-absolute top-0 start-0 object-fit-cover"
                    />
                    {/* Play Button in Bottom Right */}
                    <Button
                      className="play-btn position-absolute bottom-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                      onClick={() => {
                        setNowPlaying(`${song.title} : ${song.artist}`);
                        setSongCover(song.thumbnail);
                      }}
                    >
                      <i className="bi bi-play-fill text-dark"></i>{" "}
                      {/* Bootstrap Icons */}
                    </Button>
                  </div>

                  {/* Text Overlay */}
                  <div className="playlist-info px-2 py-2">
                    <div className="fw-semibold text-truncate">
                      {song.title}
                    </div>
                    <div className="text-white-50 small text-truncate">
                      {song.artist}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </div>
        ) : (
          <p className="text-muted">No songs added recently.</p>
        )}
      </div>
    );
  };

  const RecentlyPlayedGroup = () => {
    return (
      <div className="recently-played-section">
        <h4 className="text-white mb-3">Recently Played</h4>
        {recentPlay.length != 0 ? (
          <div className="d-flex overflow-auto gap-3 pb-2 scroll-container">
            {recentPlay.map((song, index) => (
              <Col
                key={index}
                xl={2}
                lg={3}
                md={4}
                sm={6}
                xs={6}
                className="mb-4"
              >
                <div className="playlist-box position-relative p-2 text-white overflow-hidden rounded cursor-pointer">
                  {/* Square Image */}
                  <div className="playlist-img-container position-relative">
                    <img
                      src={song.thumbnail}
                      alt="playlist-cover"
                      className="playlist-img w-100 h-100 position-absolute top-0 start-0 object-fit-cover"
                    />
                    {/* Play Button in Bottom Right */}
                    <Button
                      className="play-btn position-absolute bottom-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                      onClick={() => {
                        setNowPlaying(`${song.title} : ${song.artist}`);
                        setSongCover(song.thumbnail);
                      }}
                    >
                      <i className="bi bi-play-fill text-dark"></i>{" "}
                      {/* Bootstrap Icons */}
                    </Button>
                  </div>

                  {/* Text Overlay */}
                  <div className="playlist-info px-2 py-2">
                    <div className="fw-semibold text-truncate">
                      {song.title}
                    </div>
                    <div className="text-white-50 small text-truncate">
                      {song.artist}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </div>
        ) : (
          <p className="text-muted">No songs played recently.</p>
        )}
      </div>
    );
  };

  return (
    <Container
      className="bg-card-dark text-white"
      style={{
        height: "100%",
        overflowY: "auto",
      }}
      fluid
    >
      {!user ? (
        <div
          className="d-flex flex-column text-center align-items-center justify-content-center"
          style={{ marginTop: "30vh" }}
        >
          <h1 className="display-4 fw-bold mb-3" style={{ color: "#ff6b00" }}>
            Welcome to TuneFlow
          </h1>
          <p className="lead mb-5">
            Stream your favorite music anytime, anywhere.
          </p>
          <div className="d-flex gap-3">
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
            <Button
              variant="light"
              size="lg"
              onClick={() => navigate("/Signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      ) : (
        <Container>
          <div className="d-flex align-items-center gap-3 py-2">
            <h3 className="mb-0">Home</h3>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="light" />
            </div>
          ) : (
            <div>
              <div className="d-flex flex-column gap-3 py-3">
                <RecentlyPlayedGroup />
              </div>

              <div className="d-flex flex-column gap-3 py-3">
                <RecentlyAddedGroup />
              </div>
            </div>
          )}
        </Container>
      )}
    </Container>
  );
}
