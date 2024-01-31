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
import { ProfilesModel } from "../components/models/ProfilesModel";
import _ from "lodash";

interface HomePageProps {
    setErrorAlert: (message: string) => void
    setSuccessAlert: (message: string) => void
}

const HomePage = ({ setErrorAlert, setSuccessAlert }: HomePageProps) => {
    const [menuValue, setMenuValue] = useState('discover');
    const [profiles, setProfiles] = useState<ProfilesModel[]>([])
    const [isPageLoading, setIsPageLoading] = useState(true)
    const [areProfilesLoading, setAreProfilesLoading] = useState(true)
    const [profileIndex, setProfileIndex] = useState(0)
    const [isHandlingLikeOrSkip, setIsHandlingLikeOrSkip] = useState(false)
    const defaultFilterParams = {
        minAge: 18,
        maxAge: 99,
        minElo: 0,
        maxElo: 1000,
        distance: 50,
        minTags: 1,
    }
    const navigate = useNavigate()

    const handleMenuChange = (event: React.SyntheticEvent, newValue: string) => {
        setMenuValue(newValue);
    };

    const getProfiles = async () => {
        checkFilterParams()
        setProfiles([])
        setProfileIndex(0)
        setAreProfilesLoading(true)
        let filterParams = defaultFilterParams
        // try {
        //     filterParams = JSON.parse(localStorage.getItem("filterParams") || "{}")
        // }
        // catch (err) {
        //     localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
        // }
        await instance.post('/profiles/queries',
            {
                min_age: filterParams.minAge,
                max_age: filterParams.maxAge,
                min_elo: filterParams.minElo,
                // max_elo: filterParams.maxElo,
                // distance: filterParams.distance,
                // min_tags: filterParams.minTags,
            }
        ).then((res) => {
            setProfiles(res.data.profiles)
        }).catch((err) => {
            if (err.response?.data.message)
            {
                if (String(err.response?.data.message).includes('Missing key(s)'))
                    checkFilterParams()
                else
                    setErrorAlert(err.response?.data.message)
            }
                setErrorAlert(err.response?.data.message)
        }).finally(() => {
            setAreProfilesLoading(false)
        })
    }

    const likeProfile = async (profileId: string) => {
        setIsHandlingLikeOrSkip(true)
        await instance.post(`/user/${profileId}/like`).then(() => {
            if (profileIndex === profiles.length - 1)
                getProfiles()
            else
                setProfileIndex(prev => prev + 1)
        }).catch((err) => {
            setErrorAlert(err.response?.data.message || 'Could not like profile')
        }).finally(() => {
            setIsHandlingLikeOrSkip(false)
        })
    }

    const skipProfile = async (profileId: string) => {
        setIsHandlingLikeOrSkip(true)
        await instance.post(`/user/${profileId}/skip`).then(() => {
            if (profileIndex === profiles.length - 1)
                getProfiles()
            else
                setProfileIndex(prev => prev + 1)
        }).catch((err) => {
            setErrorAlert(err.response?.data.message || 'Could not skip profile')
        }).finally(() => {
            setIsHandlingLikeOrSkip(false)
        })
    }

    const reportProfile = async (profileId: string) => {
        setIsHandlingLikeOrSkip(true)
        await instance.post(`/user/${profileId}/report`).then(() => {
            if (profileIndex === profiles.length - 1)
                getProfiles()
            else
                setProfileIndex(prev => prev + 1)
        }).catch((err) => {
            setErrorAlert(err.response?.data.message || 'Could not report profile')
        }).finally(() => {
            setSuccessAlert('Profile reported')
            setIsHandlingLikeOrSkip(false)
        })
    }

    const checkFilterParams = () => {
        if (localStorage.getItem("filterParams")) {
            try {
                // const filterParams = JSON.parse(localStorage.getItem("filterParams") || "")


                // const filterParamsKeys = Object.keys(filterParams)
                // const defaultFilterParamsKeys = Object.keys(defaultFilterParams)

                // // i need something else than isEqual because if one of the object has more keys than the other, it will return true

                // console.log(filterParamsKeys)
                // console.log(defaultFilterParamsKeys)
                // console.log(_.isEqual(filterParamsKeys, defaultFilterParamsKeys))

                // if (_.isEqual(filterParamsKeys, defaultFilterParamsKeys) && filterParamsKeys.every((key) => typeof filterParams[key] === 'number'))
                //     if (filterParams.minAge < 18 || filterParams.minAge > 99 || filterParams.maxAge < 18 || filterParams.maxAge > 99 || filterParams.minAge > filterParams.maxAge)
                //         localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                //     else if (filterParams.minElo < 0 || filterParams.minElo > 1000 || filterParams.maxElo < 0 || filterParams.maxElo > 1000 || filterParams.minElo > filterParams.maxElo)
                //         localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                //     else if (filterParams.distance < 0 || filterParams.distance > 200)
                //         localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                //     else if (filterParams.minTags < 1 || filterParams.minTags > 20)
                //         localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                // else
                // {
                //     console.log('here')
                //     localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                // }

            }
            catch (err) {
                console.log(err)
                localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
            }
        }
        else {
            localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
        }

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
                <div className="row justify-content-center p-2 w-100">
                    <Card className="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 col-xxl-5 pt-3 position-relative d-flex" elevation={6} style={{ minHeight: "647px" }}>
                        {
                            menuValue === 'discover' ?
                                areProfilesLoading ? <CircularProgress color="secondary" className="mt-4" /> :
                                    profiles.length > 0 && profileIndex < profiles.length ?
                                        <ProfileViewer profile={profiles[profileIndex]} likeProfile={likeProfile} skipProfile={skipProfile} reportProfile={reportProfile} isHandlingLikeOrSkip={isHandlingLikeOrSkip} />
                                        :
                                        <>
                                            <h1 className="text-center">On forge dur ici</h1>
                                            <img src={forgeron} alt="forgeron" className="w-100" />
                                        </>
                                :
                                <>
                                    <h1 className="text-center">On forge dur ici</h1>
                                    <img src={forgeron} alt="forgeron" className="w-100" />
                                </>
                        }
                        <BottomNavigation sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: "flex" }} value={menuValue} onChange={handleMenuChange} showLabels={false}>
                            <BottomNavigationAction
                                value="discover"
                                icon={<HomeIcon color={menuValue === 'discover' ? 'secondary' : 'primary'} />}
                                style={{ minWidth: 0 }}
                            />
                            <BottomNavigationAction
                                value="search"
                                icon={<SearchIcon color={menuValue === 'search' ? 'secondary' : 'primary'} />}
                                style={{ minWidth: 0 }}
                            />
                            <BottomNavigationAction
                                value="favorites"
                                icon={<FavoriteIcon color={menuValue === 'favorites' ? 'secondary' : 'primary'} />}
                                style={{ minWidth: 0 }}
                            />
                            <BottomNavigationAction
                                value="visits"
                                icon={<VisibilityIcon color={menuValue === 'visits' ? 'secondary' : 'primary'} />}
                                style={{ minWidth: 0 }}
                            />
                            <BottomNavigationAction
                                value="chat"
                                icon={<ChatRoundedIcon color={menuValue === 'chat' ? 'secondary' : 'primary'} />}
                                style={{ minWidth: 0 }}
                            />
                        </BottomNavigation>
                    </Card>
                </div>
            }
        </div>
    )
}

export default HomePage