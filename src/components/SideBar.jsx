import { useContext } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: "house-door" },
    { name: "Explore", path: user ? "/explore" : "/login", icon: "compass" },
    { name: "Library", path: user ? "/library" : "/login", icon: "collection" },
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
            <i className={`bi bi-${item.icon} me-2`} /> {item.name}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
}
