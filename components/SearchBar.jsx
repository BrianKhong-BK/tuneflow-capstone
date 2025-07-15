import { useState } from "react";
import { Navbar, Container, Button, Form } from "react-bootstrap";

export default function SearchBar({ setQuery }) {
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setQuery(search.trim());
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

        {/* Logout Button */}
        <Button variant="outline-light" className="rounded-pill px-4">
          Logout
        </Button>
      </Container>
    </Navbar>
  );
}
