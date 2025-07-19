import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useState, useContext } from "react";
import { Navbar, Container, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function SearchBar({ setQuery }) {
  const { user, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setQuery(search.trim());
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoading(true);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Navbar bg="black" variant="dark" className="py-3">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        {/* Brand */}
        <Navbar.Brand className="fw-bold">Test</Navbar.Brand>

        {/* Search Input */}
        <Form
          onSubmit={handleSubmit}
          className="d-flex align-items-center gap-2 flex-grow-1 mx-4 justify-content-center"
        >
          <Form.Control
            id="queryInput"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='e.g. "Aimer - Brave Shine" or just "Unravel"'
            className="border-secondary rounded-pill px-3 custom-placeholder"
            style={{ maxWidth: "500px", flexGrow: 1 }}
          />

          <Button
            variant="outline-light"
            type="submit"
            disabled={!search.trim()}
            className="rounded-pill"
          >
            <i className="bi bi-search" />
          </Button>
        </Form>
        <div>
          {!user ? (
            <>
              <Button
                variant="outline-light"
                className="rounded-pill px-4 mx-2"
                onClick={handleLogin}
              >
                Login
              </Button>

              <Button
                variant="outline-light"
                className="rounded-pill px-4 mx-2"
                onClick={handleSignup}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <Button
              variant="outline-light"
              className="rounded-pill px-4 mx-2"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
}
