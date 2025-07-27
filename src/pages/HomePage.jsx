import { Container, Button } from "react-bootstrap";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Container
      className="bg-card-dark text-white"
      style={{
        height: "100%",
        overflowY: "auto",
      }}
      fluid
    >
      {!user ? (
        <div
          className="d-flex flex-column text-center align-items-center justify-content-center"
          style={{ marginTop: "30vh" }}
        >
          <h1 className="display-4 fw-bold mb-3" style={{ color: "#ff6b00" }}>
            Welcome to TuneFlow
          </h1>
          <p className="lead mb-5">
            Stream your favorite music anytime, anywhere.
          </p>
          <div className="d-flex gap-3">
            <Button
              variant="outline-light"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
            <Button
              variant="light"
              size="lg"
              onClick={() => navigate("/Signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      ) : (
        <h1>Home page</h1>
      )}
    </Container>
  );
}
