import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">TN Predictor</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/predict">Predict</Link></li>
        <li><Link to="/colleges">Colleges</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
