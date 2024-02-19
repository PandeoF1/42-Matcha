import { CircularProgress, Button,Card, Modal, Slider, Typography } from "@mui/material"
import ProfileViewer from "../components/ProfileViewer";
import { useEffect, useState } from "react"
import instance from "../api/Instance"
import CloseIcon from '@mui/icons-material/Close';
import { ProfilesModel } from "../components/models/ProfilesModel";
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import forgeron from '../../assets/forgeron.jpg'
import { defaultFilterParams } from "../utils/filtersUtils";
import { checkFilterParams } from "../utils/filtersUtils";
import SortProfilesComponent from "./sortProfiles";

interface BrowsingProps {
    setErrorAlert: (message: string) => void
    setSuccessAlert: (message: string) => void
}

const Browsing = ({ setErrorAlert, setSuccessAlert }: BrowsingProps) => {

    const [areProfilesLoading, setAreProfilesLoading] = useState(true)
    const [profileIndex, setProfileIndex] = useState(0)
    const [isHandlingInteraction, setIsHandlingInteraction] = useState(false)
    const [profiles, setProfiles] = useState<ProfilesModel[]>([])
    const [isFiltersModalOpened, setIsFiltersModalOpened] = useState(false)
    const [ageSliderValue, setAgeSliderValue] = useState<number[]>([18, 99])
    const [eloSliderValue, setEloSliderValue] = useState<number[]>([20, 1000])
    const [distanceSliderValue, setDistanceSliderValue] = useState<number>(50)
    const [minTagsSliderValue, setMinTagsSliderValue] = useState<number>(1)

    const likeProfile = async (profileId: string) => {
        setIsHandlingInteraction(true)
        await instance.post(`/user/${profileId}/like`).then(() => {
            if (profileIndex === profiles.length - 1)
                getProfiles()
            else
                setProfileIndex(prev => prev + 1)
        }).catch((err) => {
            setErrorAlert(err.response?.data.message || 'Could not like profile')
        }).finally(() => {
            setIsHandlingInteraction(false)
        })
    }

    const skipProfile = async (profileId: string) => {
        setIsHandlingInteraction(true)
        await instance.post(`/user/${profileId}/skip`).then(() => {
            if (profileIndex === profiles.length - 1)
                getProfiles()
            else
                setProfileIndex(prev => prev + 1)
        }).catch((err) => {
            setErrorAlert(err.response?.data.message || 'Could not skip profile')
        }).finally(() => {
            setIsHandlingInteraction(false)
        })
    }

    const reportProfile = async (profileId: string, message: string) => {
        setIsHandlingInteraction(true)
        await instance.post(`/user/${profileId}/report`, {
            message: message
        }).then(() => {
            if (profileIndex === profiles.length - 1)
                getProfiles()
            else
                setProfileIndex(prev => prev + 1)
        }).catch((err) => {
            setErrorAlert(err.response?.data.message || 'Could not report profile')
        }).finally(() => {
            setSuccessAlert('Profile reported')
            setIsHandlingInteraction(false)
        })
    }

    const unblockProfile = async (profileId: string) => {
        setIsHandlingInteraction(true)
        await instance.delete(`/user/${profileId}/block`).then(() => {
            if (profileIndex === profiles.length - 1)
                getProfiles()
            else
                setProfileIndex(prev => prev + 1)
        }).catch((err) => {
            setErrorAlert(err.response?.data.message || 'Could not unblock profile')
        }).finally(() => {
            setIsHandlingInteraction(false)
        })
    }

    const unlikeProfile = async (profileId: string) => {
        setIsHandlingInteraction(true)
        await instance.delete(`/user/${profileId}/like`).then(() => {
            if (profileIndex === profiles.length - 1)
                getProfiles()
            else
                setProfileIndex(prev => prev + 1)
        }).catch((err) => {
            setErrorAlert(err.response?.data.message || 'Could not unlike profile')
        }).finally(() => {
            setIsHandlingInteraction(false)
        })
    }

    const getProfiles = async () => {
        checkFilterParams(setAgeSliderValue, setEloSliderValue, setDistanceSliderValue, setMinTagsSliderValue)
        setProfiles([])
        setProfileIndex(0)
        setAreProfilesLoading(true)
        let filterParams = defaultFilterParams
        try {
            filterParams = JSON.parse(localStorage.getItem("filterParams") || "{}")
        }
        catch (err) {
            localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
        }
        await instance.post('/profiles/queries',
            {
                min_age: filterParams.minAge,
                max_age: filterParams.maxAge,
                min_elo: filterParams.minElo,
                max_elo: filterParams.maxElo,
                distance: filterParams.distance,
                min_tags: filterParams.minTags,
                wanted_tags: []
            }
        ).then((res) => {
            setProfiles(res.data.profiles)
        }).catch((err) => {
            if (err.response?.data.message) {
                if (String(err.response?.data.message).includes('Missing key(s)'))
                    checkFilterParams(setAgeSliderValue, setEloSliderValue, setDistanceSliderValue, setMinTagsSliderValue)
            }
        }).finally(() => {
            setAreProfilesLoading(false)
        })
    }

    useEffect(() => {
        getProfiles()
    }, [])

    return (
        <div className="BrowsingParent w-100 h-100">
            <Modal
                open={isFiltersModalOpened}
                onClose={() => { setIsFiltersModalOpened(false); getProfiles() }}
            >
                <div className="row justify-content-center p-0 p-2 filtersModal">
                    <Card className="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 col-xxl-5 pt-3 d-flex w-100 flex-column" elevation={6}>
                        <div className="d-flex justify-content-end align-items-center w-100">
                            <Button className="mb-4 min-width-0" style={{ minWidth: 0 }} onClick={() => { setIsFiltersModalOpened(false); getProfiles() }}>
                                <CloseIcon color="primary" />
                            </Button>
                        </div>
                        <div className="d-flex align-items-center w-100">
                            <Typography id="age-slider" style={{ marginLeft: "24px", marginRight: "24px" }}>
                                Age range
                            </Typography>
                            <Slider
                                getAriaLabel={() => 'Age range'}
                                min={18}
                                max={99}
                                style={{ width: "210px", margin: "24px" }}
                                value={ageSliderValue}
                                onChange={(event, newValue) => {
                                    if (localStorage.getItem("filterParams")) {
                                        const filterParams = JSON.parse(localStorage.getItem("filterParams") || "{}")
                                        if (typeof newValue === "number")
                                            return
                                        filterParams.minAge = newValue[0] ? newValue[0] : defaultFilterParams.minAge
                                        filterParams.maxAge = newValue[1] ? newValue[1] : defaultFilterParams.maxAge
                                        localStorage.setItem("filterParams", JSON.stringify(filterParams))
                                        setAgeSliderValue(newValue)
                                    }
                                    else
                                        localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                                }
                                }
                                valueLabelDisplay="on"
                                aria-labelledby="age-slider"
                            />
                        </div>
                        <div className="d-flex align-items-center w-100">
                            <Typography id="elo-slider" style={{ marginLeft: "24px", marginRight: "24px" }}>
                                Elo range
                            </Typography>
                            <Slider
                                getAriaLabel={() => 'Fame rating range'}
                                min={0}
                                max={1000}
                                step={10}
                                style={{ width: "210px", margin: "24px" }}
                                value={eloSliderValue}
                                onChange={(event, newValue) => {
                                    if (localStorage.getItem("filterParams")) {
                                        const filterParams = JSON.parse(localStorage.getItem("filterParams") || "{}")
                                        if (typeof newValue === "number")
                                            return
                                        filterParams.minElo = newValue[0] ? newValue[0] : defaultFilterParams.minElo
                                        filterParams.maxElo = newValue[1] ? newValue[1] : defaultFilterParams.maxElo
                                        localStorage.setItem("filterParams", JSON.stringify(filterParams))
                                        setEloSliderValue(newValue)
                                    }
                                    else
                                        localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                                }
                                }
                                valueLabelDisplay="on"
                                aria-labelledby="elo-slider"
                            />
                        </div>
                        <div className="d-flex align-items-center w-100">
                            <Typography id="distance-slider" style={{ marginLeft: "24px", marginRight: "24px" }}>
                                Distance max
                            </Typography>
                            <Slider
                                getAriaLabel={() => 'Distance max'}
                                min={1}
                                max={200}
                                style={{ width: "210px", margin: "24px" }}
                                valueLabelDisplay="on"
                                aria-labelledby="distance-slider"
                                value={distanceSliderValue}
                                onChange={(event, newValue) => {
                                    if (localStorage.getItem("filterParams")) {
                                        const filterParams = JSON.parse(localStorage.getItem("filterParams") || "{}")
                                        if (typeof newValue !== "number")
                                            return
                                        filterParams.distance = newValue ? newValue : defaultFilterParams.distance
                                        localStorage.setItem("filterParams", JSON.stringify(filterParams))
                                        setDistanceSliderValue(newValue)
                                    }
                                    else
                                        localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                                }
                                }
                            />
                        </div>
                        <div className="d-flex align-items-center justify-content-center w-100">
                            <Typography id="min-tags-slider" style={{ margin : "24px" }}>
                                Minimum common tags
                            </Typography>
                            <Slider
                                getAriaLabel={() => 'Minimum common tags'}
                                min={0}
                                max={20}
                                style={{ minWidth: "190px", margin: "24px" }}
                                valueLabelDisplay="on"
                                aria-labelledby="min-tags-slider"
                                value={minTagsSliderValue}
                                onChange={(event, newValue) => {

                                    if (localStorage.getItem("filterParams")) {
                                        const filterParams = JSON.parse(localStorage.getItem("filterParams") || "{}")
                                        if (typeof newValue !== "number")
                                            return
                                        filterParams.minTags = newValue
                                        localStorage.setItem("filterParams", JSON.stringify(filterParams))
                                        setMinTagsSliderValue(newValue)
                                    }
                                    else
                                        localStorage.setItem("filterParams", JSON.stringify(defaultFilterParams))
                                }
                                }
                            />
                        </div>
                    </Card>
                </div>
            </Modal>
            <SortProfilesComponent profiles={profiles} setProfiles={setProfiles} />
            <Button className="filtersButton me-3 mt-3" onClick={() => { checkFilterParams(setAgeSliderValue, setEloSliderValue, setDistanceSliderValue, setMinTagsSliderValue); setIsFiltersModalOpened(true) }} title="Filters">
                <TuneRoundedIcon color="primary" />
            </Button>
            {
                areProfilesLoading ?
                    <div className="skeletonHeight">
                        <CircularProgress color="secondary" />
                    </div>
                    :
                    profiles.length > 0 && profileIndex < profiles.length ?
                        <ProfileViewer profileToGetId={profiles[profileIndex].id}
                            likeProfile={likeProfile} skipProfile={skipProfile}
                            reportProfile={reportProfile}
                            unblockProfile={unblockProfile}
                            unlikeProfile={unlikeProfile}
                            isHandlingInteraction={isHandlingInteraction}
                        />
                        :
                        <>
                            <h1 className="text-center">On forge dur ici</h1>
                            <img src={forgeron} alt="forgeron" className="w-100" />
                        </>
            }
        </div>
    )
}

export default Browsing