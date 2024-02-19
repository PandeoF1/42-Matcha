import { Avatar, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Button } from "@mui/material"
import { useEffect, useState } from "react"
import goose from '../../assets/goose.jpg'
import instance from "../api/Instance"
import { LikeModel } from "./models/LikeModel"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ProfileViewer from "./ProfileViewer"
import CloseIcon from '@mui/icons-material/Close';


interface LikeListProps {
    setSuccessAlert: (message: string) => void
    likesOrViews : "likes" | "views"
    refresh: boolean
}

const LikeList = ({ setSuccessAlert, likesOrViews, refresh }: LikeListProps) => {

    const [likes, setLikes] = useState<LikeModel[]>([])
    const [images, setImages] = useState<HTMLImageElement[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [profileId, setProfileId] = useState<string | null>(null)
    const [isHandlingInteraction, setIsHandlingInteraction] = useState(false)

    const preloadImages = (images: string[]) => {
		const imgArray : HTMLImageElement[] = []
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
            // console.log(res.data)
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
        }).catch(() => {
        }).finally(() => {
            setSuccessAlert('Profile reported')
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
                            unblockProfile={unblockProfile}
                            unlikeProfile={unlikeProfile}
                            isHandlingInteraction={isHandlingInteraction}
                        />
                    </>
                    :

                        isLoading ?
                            <div className="skeletonHeight">
                                <CircularProgress color="secondary"/>
                            </div>
                        :
                            <List className="likeList">
                                {likes && likes.map((like: LikeModel, index: number) => {
                                    return (
                                        <div className="likeListItemParent" key={index}>
                                            <ListItem alignItems="center" className="likeListItem" onClick={() => { setProfileId(like.id) }}>
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
                        
            }
        </div>
    )
}

export default LikeList