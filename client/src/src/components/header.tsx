import logo from '../../assets/react.svg';

const Header = () => {
    return (
        <div className="header d-flex p-2">
            <div className="headerLogo">
                <img src={logo} alt="logo" />
            </div>
            <div className="headerTitle">
                <h4>Adopt a goose</h4>
            </div>
        </div>
    )
}

export default Header