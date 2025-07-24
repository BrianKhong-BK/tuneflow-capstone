import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useState, useContext } from "react";
import {
  Navbar,
  Container,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Offcanvas,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function SearchBar({ setQuery, setSelectedPlaylistId }) {
  const navigate = useNavigate();
  const { user, setLoading } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setQuery(search.trim());
    }
    setSelectedPlaylistId("");
  };

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoading(true);
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
              <Navbar.Brand className="fw-bold fs-4">🎵 TuneFlow</Navbar.Brand>
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
        className="bg-card-dark text-white"
        backdrop
      >
        <Offcanvas.Header closeVariant="white" closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {!user ? (
            <>
              <Button
                variant="outline-light"
                className="w-100 mb-2"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button variant="light" className="w-100" onClick={handleSignup}>
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              variant="outline-light"
              className="w-100"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
