import { Container, Card, Form, Button } from "react-bootstrap";

export default function LoginPage() {
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

        <Form>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              className="rounded-pill"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
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
