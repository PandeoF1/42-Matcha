import goose from '../../assets/goose.jpg'
import { Profiler, useEffect, useState } from "react"
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarIcon from '@mui/icons-material/Star';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Button, Card, Chip, CircularProgress, Divider, Modal, Stack, TextField, Typography } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReportIcon from '@mui/icons-material/Report';
import CloseIcon from '@mui/icons-material/Close';
import BlockIcon from '@mui/icons-material/Block';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import instance from "../api/Instance";
import { ProfileModel } from "./models/ProfileModel";
import CircleIcon from '@mui/icons-material/Circle';
import { StatusListModel } from '../pages/models/StatusListModel';
import { lastActivity } from '../utils/timeUtils';

interface ProfileViewerProps {
	profileToGetId: string
	likeProfile?: (profileId: string) => Promise<void>
	skipProfile?: (profileId: string) => Promise<void>
	reportProfile?: (profileId: string, message: string) => Promise<void>
	blockProfile?: (profileId: string) => Promise<void>
	unblockProfile?: (profileId: string) => Promise<void>
	unlikeProfile?: (profileId: string) => Promise<void>
	statusList: StatusListModel
	isHandlingInteraction?: boolean
}

const ProfileViewer = ({ profileToGetId, likeProfile, skipProfile, reportProfile, blockProfile, unblockProfile, unlikeProfile, statusList, isHandlingInteraction }: ProfileViewerProps) => {

	const [imageIndex, setImageIndex] = useState(0)
	const [isReportModalOpened, setIsReportModalOpened] = useState(false)
	const [reportReason, setReportReason] = useState('')
	const [profile, setProfile] = useState<ProfileModel | null>(null)
	const [images, setImages] = useState<HTMLImageElement[]>([])

	const getProfileWithId = async (id: string) => {
		await instance.get<ProfileModel>('/user/' + id).then((res) => {
			preloadImages(res.data.images)
			setProfile(res.data)
		}).catch(() => {
			setProfile(null)
		})
	}

	const reset = () => {
		setImageIndex(0)
		getProfileWithId(profileToGetId)
	}

	const preloadImages = (images: string[]) => {
		const imgArray: HTMLImageElement[] = []
		images.forEach((image) => {
			const img = new Image()
			img.src = import.meta.env.VITE_URL_API + "/image/" + image
			imgArray.push(img)
		})
		setImages(imgArray)
	}

	const resetAndCallFunction = (func: () => Promise<void>) => {
		func().then(() => {
			reset()
		})
	}

	useEffect(() => {
		reset()
	}, [profileToGetId])


	const eloToStars = (elo: number) => {
		if (elo < 20)
			return <StarBorderIcon style={{ color: "#FFD700" }} />
		else if (elo < 100)
			return <StarHalfIcon style={{ color: "#FFD700" }} />
		else if (elo < 500)
			return <StarIcon style={{ color: "#FFD700" }} />
		else
			return <MilitaryTechIcon style={{ color: "#FFD700" }} />
	}

	return (
		<div className="profileViewer">
			{profile ?
				<>
					<Modal
						open={isReportModalOpened}
						onClose={() => { setIsReportModalOpened(false); setReportReason('') }}
					>
						<div className="row justify-content-center p-0 p-2 filtersModal">
							<Card className="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 col-xxl-5 pt-2 d-flex w-100 flex-column" elevation={6}>
								<div className="d-flex justify-content-end align-items-center w-100">
									<Button className="mb-2" style={{ minWidth: 0, padding: 0 }} onClick={() => { setIsReportModalOpened(false); setReportReason('') }}>
										<CloseIcon color="primary" />
									</Button>
								</div>
								<div style={{ width: "300px" }} className="d-flex align-items-center justify-content-center flex-column">
									<Button className="my-2 w-100" onClick={() => { if (blockProfile) { blockProfile(profile.id); setIsReportModalOpened(false); setReportReason("") } }} variant="outlined" color="primary">
										Block
									</Button>
									<Divider sx={{ width: "100%", fontWeight: "bold" }}>REPORT</Divider>
									<div className="position-relative w-100">
										<TextField
											type="text"
											label="Report reason"
											id="reportReason"
											variant="outlined"
											className="w-100 pt-2"
											multiline
											value={reportReason}
											inputProps={{ maxLength: 200, minLength: 1 }}
											style={{ maxHeight: "500px", overflowY: "scroll" }}
											InputLabelProps={{ shrink: true, className: 'mt-2' }}
											onChange={(e) => setReportReason(e.target.value)}
										/>
										<Typography
											className={'d-sm-block position-absolute bottom-0 end-0 me-3'}
										>
											{reportReason.length}/{200}
										</Typography>
									</div>
									<Button className="my-2 w-100" disabled={reportReason.length < 1} onClick={() => { if (reportProfile) { reportProfile(profile.id, reportReason); setIsReportModalOpened(false); setReportReason("") } }} variant="contained" color="primary">
										Send
									</Button>
								</div>
							</Card>
						</div>
					</Modal>
					<div className="position-relative">
						<img src={imageIndex < images.length && images[imageIndex].src ? images[imageIndex].src : goose} alt="imgProfile" className="imgProfile" loading="lazy" onError={(e) => { e.currentTarget.src = goose }} />
						{statusList && statusList.users && statusList.users.includes(profile.id) ?
							<Chip label="Online" className="status" icon={<CircleIcon style={{ color: "#4CAF50" }} sx={{ height: "12px", width: "12px" }} />} />
							:
							<Chip label={lastActivity(profile.last_login)} className="status" icon={<CircleIcon style={{ color: "#FF0000" }} sx={{ height: "12px", width: "12px" }} />} />
						}
						{reportProfile &&
							<Button className="reportButton" title="Report this profile" onClick={() => { setIsReportModalOpened(true) }}>
								<ReportIcon fontSize="large" />
							</Button>}
						<Button className="beforePhotoButton" onClick={() => setImageIndex((imageIndex - 1) < 0 ? profile.images.length - 1 : imageIndex - 1)} title="Previous photo">
							<NavigateBeforeIcon className="me-2" fontSize="large" />
						</Button>
						<Button className="nextPhotoButton" onClick={() => setImageIndex((imageIndex + 1) % profile.images.length)} title="Next photo">
							<NavigateNextIcon className="ms-2" fontSize="large" />
						</Button>
						{likeProfile && skipProfile && unblockProfile && unlikeProfile &&
							(profile.blocked ?
								<div className="oneInteractionButton">
									<Button className="unblockButton" disabled={isHandlingInteraction} onClick={() => resetAndCallFunction(() => unblockProfile(profile.id))} title="Unblock">
										<BlockIcon fontSize="large" />
									</Button>
								</div>
								:
								profile.liked && profile.matched ?
									<div className="oneInteractionButton">
										<Button className="unblockButton" disabled={isHandlingInteraction} onClick={() => resetAndCallFunction(() => unlikeProfile(profile.id))} title="Unlike">
											<HeartBrokenIcon fontSize="large" />
										</Button>
									</div>
									:
									profile.liked ?
										<div className="oneInteractionButton">
											<Button className="unblockButton" disabled={isHandlingInteraction} onClick={() => resetAndCallFunction(() => unlikeProfile(profile.id))} title="Unlike">
												<ScheduleSendIcon fontSize="large" />
											</Button>
										</div>
										:
										profile.skipped ?
											<div className="oneInteractionButton">
												<Button className="likeButton" disabled={isHandlingInteraction} onClick={() => resetAndCallFunction(() => likeProfile(profile.id))} title="Like">
													<FavoriteIcon fontSize="large" />
												</Button>
											</div>
											:
											<div className="skipLikeButtons">
												<Button className="skipButton" disabled={isHandlingInteraction} onClick={() => resetAndCallFunction(() => skipProfile(profile.id))} title="Skip">
													<ClearIcon fontSize="large" />
												</Button>
												<Button className="likeButton" disabled={isHandlingInteraction} onClick={() => resetAndCallFunction(() => likeProfile(profile.id))} title="Like">
													<FavoriteIcon fontSize="large" />
												</Button>
											</div>
							)
						}
					</div>
					<div style={{ padding: "8px 14px 0px 14px" }}>
						<div className="d-flex justify-content-between flex-wrap">
							<div className="d-flex align-items-end flex-wrap">
								<h2 className="fw-bold mb-0" style={{ wordWrap: "break-word", maxWidth: "230px" }} >{profile.firstName}</h2>
								<>
									<h4 className="ms-2 mb-0" style={{ paddingBottom: "2px" }}>{profile.age}</h4>
									{profile.gender === "female" ?
										<FemaleIcon style={{ color: "#c90076" }} fontSize="large" className="py-1" /> :
										<MaleIcon style={{ color: "#2986CC" }} fontSize="large" className="py-1" />}
								</>
							</div>
							<div className="d-flex align-items-end mb-1">
								{eloToStars(profile.elo)}
								<h5 className="ms-1 mb-0 fw-bold">{profile.elo}</h5>
							</div>
						</div>
						<p className="font-size-12 mb-0 d-flex">  {profile.distance == 1 ? "Less than a" : Math.round(profile.distance + Number.EPSILON) || "?"} kilometer from you</p>
						<hr className="w-100 mt-2" />
						<p className="text-start text-break">
							{profile.bio}
						</p>
						<hr className="w-100 mt-2" />
						<div className="col-12 overflow-y-scroll tagsContainer d-flex">
							<Stack direction="row" spacing={1} className="flex-wrap">
								{profile.tags && Object.entries(profile.tags).map(([key, value], index) => {
									return value ?
										profile.commonTags && profile.commonTags.includes(key) ?

											<Chip key={index} label={key} variant="filled" color="primary" className="fw-bold m-0 me-1 mb-1" />
											:
											<Chip key={index} label={key} variant="outlined" color="primary" className="fw-bold m-0 me-1 mb-1" />
										:
										null
								})}
							</Stack>
						</div>
					</div>
				</>

				:

				<div className="skeletonHeight">
					<CircularProgress color="secondary" />
				</div>
			}
		</div>

	)

}

export default ProfileViewer