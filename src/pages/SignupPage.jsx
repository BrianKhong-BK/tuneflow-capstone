import { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase"; // adjust path if needed
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Set display name
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      // Redirect or show success message
      navigate("/"); // redirect to homepage or dashboard
    } catch (err) {
      setError(err.message);
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
          Sign up for Tuneflow
        </h2>

        <Form onSubmit={handleSubmit}>
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

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>What should we call you?</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your name"
              className="rounded-pill"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Create a password</Form.Label>
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
            Sign Up
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <a href="/login" className="text-success">
              Log in
            </a>
          </small>
        </div>
      </Card>
    </Container>
  );
}
