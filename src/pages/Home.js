import Header from "./../components/header/Header"


const Home = () => {
    return ( 
        <>
        <Header/>  

    <main className="section">
        <div className="container">

                <ul className="content-list">
                    <li className="content-list__item">
                        <h2 className="title-2">Mauris velit neque</h2>
                        <p>Praesent dignissim convallis elit sit amet dapibus. Proin ac interdum lectus, eget tincidunt tellus. Fusce porta tincidunt nisl. In molestie, neque ut congue tincidunt, ex lacus hendrerit lorem, at tempus felis massa ut lectus. </p>
                    </li>
                    <li className="content-list__item">
                        <h2 className="title-2"> Vivamus semper porttitor molestie.</h2>
                        <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Phasellus sagittis iaculis leo ut vehicula. </p>
                    </li>
                </ul>

        </div>
    </main>
        </>
     );
}
 
export default Home
;