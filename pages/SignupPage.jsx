import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

export default function SignupPage() {
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

        <Form>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              className="rounded-pill"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>What should we call you?</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your name"
              className="rounded-pill"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Create a password</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              className="rounded-pill"
            />
          </Form.Group>

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
