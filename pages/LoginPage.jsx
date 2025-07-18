import { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Adjust this path as needed
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // redirect on success
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <Container
      fluid
      className="bg-black text-white d-flex align-items-center justify-content-center vh-100"
    >
      <Card
        className="p-4 shadow"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "1rem" }}
      >
        <h2 className="text-center mb-4" style={{ color: "#1DB954" }}>
          Log in to Tuneflow
        </h2>

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              className="rounded-pill"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              className="rounded-pill"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {error && <div className="text-danger text-center mb-2">{error}</div>}

          <Button
            type="submit"
            variant="success"
            className="w-100 rounded-pill mt-3"
          >
            Log In
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small>
            Don't have an account?{" "}
            <a href="/signup" className="text-success">
              Sign up
            </a>
          </small>
        </div>
      </Card>
    </Container>
  );
}
