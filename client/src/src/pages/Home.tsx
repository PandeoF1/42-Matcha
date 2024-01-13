import { useEffect, useState } from "react"
import instance from "../api/Instance"
import { useNavigate } from "react-router-dom"
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Card, CircularProgress } from "@mui/material"
import forgeron from '../../assets/forgeron.jpg'
import ProfileViewer from "../components/ProfileViewer";
import { ProfileModel } from "../components/models/ProfileModel";

interface HomePageProps {
    setErrorAlert: (message: string) => void
}

const HomePage = ({ setErrorAlert }: HomePageProps) => {
    const [menuValue, setMenuValue] = useState('discover');
    const [profiles, setProfiles] = useState<ProfileModel[]>([])
    const [isPageLoading, setIsPageLoading] = useState(true)
    const navigate = useNavigate()

    const handleMenuChange = (event: React.SyntheticEvent, newValue: string) => {
        setMenuValue(newValue);
    };

    const getProfiles = async () => {
        await instance.get('/profiles').then((res) => {
            setProfiles(res.data.profiles)
        }).catch((err) => {
            setErrorAlert(err.response.data.message)
        })
    }

    useEffect(() => {
        const checkLoggedIn = async () => {
            await instance.get('/user/session').then(() => {
                getProfiles()
                setIsPageLoading(false)
            }
            ).catch(() => {
                localStorage.removeItem("token")
                navigate('/login')
            })
        }

        if (localStorage.getItem("token")) {
            checkLoggedIn()
        }
        else {
            navigate('/login')
        }
    }, [navigate])


    return (
        <div className="homePage container">
            {isPageLoading ? <CircularProgress color="secondary" className="mt-4" /> :
                <div className="row justify-content-center p-4 w-100">
                    <Card className="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 col-xxl-5 p-4 position-relative" elevation={6}>
                        {
                            menuValue === 'discover' && profiles.length ?
                                <ProfileViewer profile={profiles[0]} /> :
                                <>
                                    <h1 className="text-center">Moi qui bat ma bite pour la 9eme fois aujd</h1>
                                    <img src={forgeron} alt="forgeron" className="w-100" />
                                </>
                        }
                        <BottomNavigation sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} value={menuValue} onChange={handleMenuChange} showLabels={false}>
                            <BottomNavigationAction
                                value="discover"
                                icon={<HomeIcon color={menuValue === 'discover' ? 'secondary' : 'primary'} />}
                            />
                            <BottomNavigationAction
                                value="search"
                                icon={<SearchIcon color={menuValue === 'search' ? 'secondary' : 'primary'} />}
                            />
                            <BottomNavigationAction
                                value="favorites"
                                icon={<FavoriteIcon color={menuValue === 'favorites' ? 'secondary' : 'primary'} />}
                            />
                            <BottomNavigationAction
                                value="visits"
                                icon={<VisibilityIcon color={menuValue === 'visits' ? 'secondary' : 'primary'} />}
                            />
                            <BottomNavigationAction
                                value="chat"
                                icon={<ChatRoundedIcon color={menuValue === 'chat' ? 'secondary' : 'primary'} />}
                            />
                        </BottomNavigation>
                    </Card>
                </div>
            }
        </div>
    )
}

export default HomePage