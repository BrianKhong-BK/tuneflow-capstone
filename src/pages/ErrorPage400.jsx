import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ErrorPage400() {
  const navigate = useNavigate();

  function toHome() {
    navigate("/");
  }

  return (
    <div
      className="bg-black d-flex justify-content-center align-items-center text-white"
      style={{
        minHeight: "100vh",
        overflowX: "hidden",
        padding: 0,
        margin: 0,
      }}
    >
      <Container className="text-center">
        <h1 className="display-1 fw-bold" style={{ color: "#ff6b00" }}>
          404
        </h1>
        <h2 className="mb-3">Oops! Page Not Found</h2>
        <p className="text-white mb-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button className="register-button" onClick={toHome}>
          <i className="bi bi-house me-2" />
          Back to Home
        </Button>
      </Container>
    </div>
  );
}
