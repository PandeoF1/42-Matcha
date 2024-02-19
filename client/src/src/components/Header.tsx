import logo from '../../assets/goose_logo.png'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import instance from '../api/Instance';
import { useEffect, useState } from 'react';


interface HeaderProps {
    setErrorAlert: (error: string) => void
    setSuccessAlert: (success: string) => void
}

const Header = ({ setErrorAlert, setSuccessAlert }: HeaderProps) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [socketNotifications, setSocketNotifications] = useState<WebSocket>()
    const [socketStatus, setSocketStatus] = useState<WebSocket>()

    useEffect(() => {
        if (!localStorage.getItem("token"))
          return

        if (socketNotifications)
          socketNotifications.close()
        if (socketStatus)
            socketStatus.close()
        const _socketNotifications = new WebSocket("wss://back-matcha.pandeo.fr/notifications?token=" + localStorage.getItem("token")!)
        const _socketStatus = new WebSocket("wss://back-matcha.pandeo.fr/status?token=" + localStorage.getItem("token")!)
        
        setSocketNotifications(_socketNotifications)
        setSocketStatus(_socketStatus)

        _socketNotifications ? _socketNotifications.onmessage = (event) => {
          console.log(event.data)
          const data = JSON.parse(event.data)
          setSuccessAlert(data.message)
        }
        : null
      
        _socketStatus ? _socketStatus.onmessage = (event) => {
          console.log(event.data)
          const data = JSON.parse(event.data)
          setErrorAlert(data.message)
        }
        : null

        return () => {
          socketNotifications?.close()
          socketStatus?.close()
        }
      },  [navigate])

    const handleLogout = async () => {
        await instance.post('/user/logout').then(() => {
            localStorage.removeItem("token")
            navigate('/login')
        }).catch(() => {
            setErrorAlert('Could not log out the user')
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
            {!location || !(location.pathname == '/' || location.pathname === '/profile' || location.pathname === 'geolocall') ? null :
                <div className='d-flex align-items-center'>
                    <AccountCircleIcon className='me-3' fontSize='large' role='button' onClick={() => navigate('/profile')} />
                    <LogoutIcon fontSize='large' className='me-2' role='button' onClick={handleLogout} />
                </div>}
        </div>
    )
}

export default Header