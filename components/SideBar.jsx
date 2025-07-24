import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Library", path: "/library" },
  ];

  return (
    <div
      className="d-none d-md-flex flex-column bg-black text-white p-3"
      style={{
        width: "200px",
        height: "100vh",
        position: "fixed",
      }}
    >
      <Nav className="flex-column">
        {navItems.map((item) => (
          <Nav.Link
            key={item.name}
            as={Link}
            to={item.path}
            className={`text-white mb-2 ${
              location.pathname === item.path ? "fw-bold" : ""
            }`}
          >
            {item.name}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
}
