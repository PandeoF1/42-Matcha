import logo from '../../assets/goose_logo.png'

const Header = () => {
    return (
        <div className="header d-flex p-2">
            <div className="headerLogo">
                <img src={logo} alt="logo" width={50} height={35} />
            </div>
            <div className="headerTitle">
                <h4>Adopt a goose</h4>
            </div>
        </div>
    )
}

export default Header