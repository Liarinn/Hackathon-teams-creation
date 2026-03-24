import "./style.css"
import github from "./../../img/icons/gitHub.svg"

const Footer = () => {
    return (  
        <footer className="footer">
        <div className="container">
            <div className="footer__wrapper">
                <ul className="social">
                    <li className="social__item"><a href="#!"><img src={github} alt="Link"></img></a></li>
                </ul>
                <div className="copyright">
                    <p>© 2025</p>
                </div>
            </div>
        </div>
    </footer>
    );
}
 
export default Footer;