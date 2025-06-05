import { Link, useNavigate } from "react-router-dom"
import "../../css/NavBar.css"
function NavBar(){
    const navigate = useNavigate();
    return <nav className="navbar">
  <Link to="/" className="nav-link">Movie App</Link>
  <div className="navbar-links">
    <Link to="/favorite" className="nav-link">Favourites</Link>
    <Link to="/" className="nav-link">Home</Link>
    <Link to="/movieSelector" className="nav-link">Movie Selector</Link>
    <button className="eu-button" onClick={() => navigate("/eu")}>Explore into the unknown</button>
  </div>
</nav>
}
export default NavBar