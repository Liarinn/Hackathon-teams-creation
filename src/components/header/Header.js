import "./style.css"

const Header = () => {
    return (  
        <header className="header">
        <div className="header__wrapper">
            <h1 className="header__title">
                <strong>Neque porro quisquam est qui dolorem ipsum,<em> adipisci velit...</em></strong>
                No hay nadie que ame el dolor mismo, que lo busque.
            </h1>
            <div className="header__text">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
        </div>
    </header>
    );
}
 
export default Header;