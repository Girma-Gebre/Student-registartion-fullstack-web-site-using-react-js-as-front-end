import {FaReact} from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Student Registration System | Built with <FaReact color="rgba(18, 162, 230, 1)" size={20} style={{backgroundColor:"#292626ff", position: "relative", top: "6px", borderRadius: "5px"}} /> React
      </p>
    </footer>
  );
}

export default Footer;
