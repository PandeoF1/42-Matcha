import { Avatar } from '@mui/material'
import logo from '../../assets/goose_logo.png'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import instance from '../api/Instance';

const Header = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await instance.post('/user/logout').then(() => {
            localStorage.removeItem("token")
            navigate('/login')
        }).catch(() => {
            // TODO: show error
        })
    }

    return (
        <div className="header d-flex p-2 justify-content-between align-items-center">
            <div className='d-flex' role='button' onClick={() => navigate('/')}>
                <div className="headerLogo">
                    <img src={logo} alt="logo" width={50} height={35} />
                </div>
                <div className="headerTitle">
                    <h4>Adopt a goose</h4>
                </div>
            </div>
            <div className='d-flex align-items-center'>
                <AccountCircleIcon className='me-3' fontSize='large' role='button' onClick={() => navigate('/profile')}/>
                <LogoutIcon fontSize='large' className='me-2' role='button' onClick={handleLogout}/>
            </div>
        </div>
    )
}

export default Header