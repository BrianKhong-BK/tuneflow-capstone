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
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function SearchBar({ setQuery, setSelectedPlaylistId }) {
  const navigate = useNavigate();
  const { user, setLoading } = useContext(AuthContext);
  const [search, setSearch] = useState("");

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
    <Navbar bg="black" variant="dark" className="py-3 shadow-sm sticky-top">
      <Container fluid>
        <Row className="w-100 align-items-center">
          {/* Brand */}
          <Col
            xs={12}
            md={4}
            className="text-center text-md-start mb-2 mb-md-0"
          >
            <Navbar.Brand className="fw-bold fs-4">🎵 TuneFlow</Navbar.Brand>
          </Col>

          {/* Search Bar */}
          <Col xs={12} md={4} className="mb-2 mb-md-0">
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

          {/* Auth Buttons */}
          <Col
            xs={12}
            md={4}
            className="d-flex justify-content-center justify-content-md-end"
          >
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
  );
}
