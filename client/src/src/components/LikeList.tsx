import { Avatar, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Button, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import goose from '../../assets/goose.jpg'
import instance from "../api/Instance"
import { LikeModel } from "./models/LikeModel"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ProfileViewer from "./ProfileViewer"
import CloseIcon from '@mui/icons-material/Close';
import { StatusListModel } from "../pages/models/StatusListModel"
import nobodyGoose from '../../assets/nobody_goose.png'

interface LikeListProps {
    setSuccessAlert: (message: string) => void
    likesOrViews: "likes" | "views"
    refresh: boolean
    statusList: StatusListModel
}

const LikeList = ({ setSuccessAlert, likesOrViews, refresh, statusList }: LikeListProps) => {

    const [likes, setLikes] = useState<LikeModel[]>([])
    const [images, setImages] = useState<HTMLImageElement[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [profileId, setProfileId] = useState<string | null>(null)
    const [isHandlingInteraction, setIsHandlingInteraction] = useState(false)

    const preloadImages = (images: string[]) => {
        const imgArray: HTMLImageElement[] = []
        images.forEach((image) => {
            const img = new Image()
            img.src = image
            imgArray.push(img)
        })
        setImages(imgArray)
    }

    const getLikes = async () => {
        setIsLoading(true)
        await instance.get<LikeModel[]>(likesOrViews === "likes" ? '/user/likes' : '/user/views').then((res) => {
            if (res.data.length)
                preloadImages(res.data.map(like => like.image))
            setLikes(res.data)
        }).catch(() => {
            setLikes([])
        }).finally(() => {
            setIsLoading(false)
            setProfileId(null)
        })
    }

    const likeProfile = async (profileId: string) => {
        setIsHandlingInteraction(true)
        await instance.post(`/user/${profileId}/like`).then(() => {
        }).catch(() => {
        }).finally(() => {
            setIsHandlingInteraction(false)
        })
    }

    const skipProfile = async (profileId: string) => {
        setIsHandlingInteraction(true)
        await instance.post(`/user/${profileId}/skip`).then(() => {
        }).catch(() => {
            setProfileId(null)
        }).finally(() => {
            setIsHandlingInteraction(false)
        })
    }

    const reportProfile = async (profileId: string, message: string) => {
        setIsHandlingInteraction(true)
        await instance.post(`/user/${profileId}/report`, {
            message: message
        }).then(() => {
            getLikes()
            setSuccessAlert('Profile reported')
        }).catch(() => {
        }).finally(() => {
            setIsHandlingInteraction(false)
        })
    }

    const blockProfile = async (profileId: string) => {
        setIsHandlingInteraction(true)
        await instance.post(`/user/${profileId}/block`).then(() => {
            getLikes()
            setSuccessAlert('Profile blocked')
        }).catch(() => {
        }).finally(() => {
            setIsHandlingInteraction(false)
        })
    }

    const unblockProfile = async (profileId: string) => {
        setIsHandlingInteraction(true)
        await instance.delete(`/user/${profileId}/block`).then(() => {
        }).catch(() => {
        }).finally(() => {
            setIsHandlingInteraction(false)
        })
    }

    const unlikeProfile = async (profileId: string) => {
        setIsHandlingInteraction(true)
        await instance.delete(`/user/${profileId}/like`).then(() => {
            getLikes()
        }).catch(() => {
        }).finally(() => {
            setIsHandlingInteraction(false)
        })
    }

    useEffect(() => {
        getLikes()
    }, [refresh])

    return (
        <div className="likeListParent w-100 h-100">
            {
                profileId ?
                    <>
                        <Button className="closeButton" onClick={() => { setProfileId(null) }} title="Close">
                            <CloseIcon color="primary" />
                        </Button>
                        <ProfileViewer
                            profileToGetId={profileId}
                            likeProfile={likeProfile}
                            skipProfile={skipProfile}
                            reportProfile={reportProfile}
                            blockProfile={blockProfile}
                            unblockProfile={unblockProfile}
                            unlikeProfile={unlikeProfile}
                            statusList={statusList}
                            isHandlingInteraction={isHandlingInteraction}
                        />
                    </>
                    :

                    isLoading ?
                        <div className="skeletonHeight">
                            <CircularProgress color="secondary" />
                        </div>
                        :
                        likes && likes.length ?
                            <>
                                <Typography alignContent="start" variant="h6" fontWeight="bold">{likesOrViews === "likes" ? "LIKES" : "VIEWS"}</Typography>
                                <List className="likeList">
                                    {likes.map((like: LikeModel, index: number) => {
                                        return (
                                            <div className="likeListItemParent col-12 col-md-6" key={index}>
                                                <ListItem alignItems="center" className="likeListItem w-100" onClick={() => { setProfileId(like.id) }}>
                                                    <ListItemAvatar>
                                                        <Avatar alt={like.firstName || "Avatar"} src={index < images.length && images[index] ? images[index].src : goose} />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={like.firstName || ""}
                                                        secondary={like.age || ""}
                                                    />
                                                    <KeyboardArrowRightIcon />
                                                </ListItem>
                                            </div>
                                        )
                                    })}
                                </List>
                            </>
                            :
                            <div className="skeletonHeight display-flex flex-column position-relative">
                            <Typography className="position-absolute top-0" variant="h6" fontWeight="bold">{likesOrViews === "likes" ? "LIKES" : "VIEWS"}</Typography>
                            <img src={nobodyGoose} alt="nobodyGoose" className="w-100" />
                        </div>
            }
        </div>
    )
}

export default LikeList