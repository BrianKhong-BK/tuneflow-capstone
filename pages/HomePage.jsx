import { Container } from "react-bootstrap";

export default function HomePage() {
  return (
    <Container
      className="bg-card-dark text-white"
      style={{
        height: "100%",
        overflowY: "auto",
      }}
      fluid
    >
      <h1>Home page</h1>
    </Container>
  );
}
