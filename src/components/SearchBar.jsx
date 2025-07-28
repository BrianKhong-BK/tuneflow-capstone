import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useState, useContext } from "react";
import {
  Nav,
  Navbar,
  Container,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Offcanvas,
  Image,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { AppStateContext } from "../contexts/AppStateContext";
import logo from "../assets/logo.png";

export default function SearchBar() {
  const navigate = useNavigate();
  const { user, setLoading } = useContext(AuthContext);
  const { setSelectedPlaylistId } = useContext(AppStateContext);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSearch(false);
    navigate(`/search/${search}`);
    setSelectedPlaylistId("");
  };

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <Navbar bg="black" variant="dark" className="py-3 shadow-sm sticky-top">
        <Container fluid>
          <Row className="w-100 align-items-center">
            {/* Brand */}
            <Col xs={6} md={4} className="text-start">
              <Navbar.Brand className="d-flex fw-bold fs-4 align-items-center">
                <Image
                  src={logo}
                  style={{ width: "40px", height: "40px" }}
                  fluid
                />
                TuneFlow
              </Navbar.Brand>
            </Col>

            {/* Search Bar (md and up) */}
            <Col md={4} className="d-none d-md-block">
              <Form
                onSubmit={handleSubmit}
                className="w-100"
                style={{ maxWidth: "600px" }}
              >
                <InputGroup>
                  <InputGroup.Text className="bg-light border-0 rounded-start-pill">
                    <i className="bi bi-search text-secondary" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for songs or artists..."
                    className="border-0 rounded-end-pill px-3"
                    style={{ fontSize: "1rem", boxShadow: "none" }}
                  />
                </InputGroup>
              </Form>
            </Col>

            <Col xs={6} className="d-md-none d-flex justify-content-end gap-3">
              {/* Search Icon (small screens) */}
              <Button
                variant="outline-light"
                onClick={() => setShowSearch(!showSearch)}
                className="rounded-circle"
              >
                <i className="bi bi-search" />
              </Button>

              {/* Burger Menu (small screens) */}
              <Button
                variant="outline-light"
                onClick={() => setShowAuthMenu(true)}
                className="rounded-circle"
              >
                <i className="bi bi-list" />
              </Button>
            </Col>

            {/* Auth Buttons (md and up) */}
            <Col md={4} className="d-none d-md-flex justify-content-end">
              {!user ? (
                <>
                  <Button
                    variant="outline-light"
                    className="rounded-pill px-4 mx-1"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <Button
                    variant="light"
                    className="rounded-pill px-4 mx-1"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline-light"
                  className="rounded-pill px-4 mx-1"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </Navbar>

      {/* Collapsible Search (for small screens) */}
      {showSearch && (
        <div className="bg-black py-3 px-3 d-md-none">
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-0 rounded-start-pill">
                <i className="bi bi-search text-secondary" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for songs or artists..."
                className="border-0 rounded-end-pill px-3"
              />
            </InputGroup>
          </Form>
        </div>
      )}

      {/* Offcanvas Auth Menu */}
      <Offcanvas
        show={showAuthMenu}
        onHide={() => setShowAuthMenu(false)}
        placement="end"
        className="bg-dark text-white"
        backdrop
      >
        <Offcanvas.Header closeVariant="white" closeButton>
          <Offcanvas.Title className="fw-bold">Menu</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {/* Navigation */}
          <Nav className="flex-column mb-4">
            <Nav.Link
              as={Link}
              to="/"
              className="text-white mb-2"
              onClick={() => setShowAuthMenu(false)}
            >
              <i className="bi bi-house-door me-2" /> Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to={user ? "/explore" : "/login"}
              className="text-white mb-2"
              onClick={() => setShowAuthMenu(false)}
            >
              <i className="bi bi-compass me-2" /> Explore
            </Nav.Link>
            <Nav.Link
              as={Link}
              to={user ? "/library" : "/login"}
              className="text-white"
              onClick={() => setShowAuthMenu(false)}
            >
              <i className="bi bi-collection me-2" /> Library
            </Nav.Link>
          </Nav>

          <hr className="border-secondary" />

          {/* Auth Buttons */}
          {!user ? (
            <>
              <Button
                variant="outline-light"
                className="w-100 mb-2 rounded-pill"
                onClick={handleLogin}
              >
                Log In
              </Button>
              <Button
                variant="light"
                className="w-100 rounded-pill"
                onClick={handleSignup}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              variant="outline-light"
              className="w-100 rounded-pill"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
