import { ProfilesModel } from "./models/ProfilesModel"
import goose from '../../assets/goose.jpg'
import { useState } from "react"
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarIcon from '@mui/icons-material/Star';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Button, Chip, Stack } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReportIcon from '@mui/icons-material/Report';

interface ProfileViewerProps {
	profile: ProfilesModel
	likeProfile: (profileId: string) => Promise<void> | null
	skipProfile: (profileId: string) => Promise<void> | null
	reportProfile?: (profileId: string) => Promise<void> | null
	isHandlingLikeOrSkip?: boolean
}

const ProfileViewer = ({ profile, likeProfile, skipProfile, reportProfile, isHandlingLikeOrSkip }: ProfileViewerProps) => {

	const [imageIndex, setImageIndex] = useState(0)

	console.log(profile)

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
			<div className="position-relative">
				<img src={profile.images[imageIndex] ? profile.images[imageIndex] : goose} alt="imgProfile" className="imgProfile" loading="lazy" />
				{reportProfile &&
					<Button className="reportButton" title="Report this profile" onClick={() => reportProfile(profile.id)}>
						<ReportIcon fontSize="large" />
					</Button>}
				<Button className="beforePhotoButton" onClick={() => setImageIndex((imageIndex - 1) < 0 ? profile.images.length - 1 : imageIndex - 1)} title="Previous photo">
					<NavigateBeforeIcon className="me-2" fontSize="large" />
				</Button>
				<Button className="nextPhotoButton" onClick={() => setImageIndex((imageIndex + 1) % profile.images.length)} title="Next photo">
					<NavigateNextIcon className="ms-2" fontSize="large" />
				</Button>
				{likeProfile && skipProfile &&
					<div className="skipLikeButtons">
						<Button className="skipButton" disabled={isHandlingLikeOrSkip} onClick={() => skipProfile(profile.id)} title="Skip this profile">
							<ClearIcon fontSize="large" />
						</Button>
						<Button className="likeButton" disabled={isHandlingLikeOrSkip} onClick={() => likeProfile(profile.id)} title="Like this profile">
							<FavoriteIcon fontSize="large" />
						</Button>
					</div>
				}
			</div>
			<div style={{ padding: "8px 14px 0px 14px" }}>
				<div className="d-flex justify-content-between">
					<div className="d-flex align-items-end">
						<h2 className="fw-bold mb-0">{profile.firstName}</h2>
						<h4 className="ms-2 mb-0" style={{ paddingBottom: "2px" }}>{profile.age}</h4>
						{profile.gender === "female" ?
							<FemaleIcon style={{ color: "#c90076" }} fontSize="large" className="py-1" /> :
							<MaleIcon style={{ color: "#2986CC" }} fontSize="large" className="py-1" />}
					</div>
					<div className="d-flex align-items-center mt-2">
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
				<div className="col-12 overflow-y-scroll tagsContainer d-flex" style={{ marginBottom: "56px" }}>
					<Stack direction="row" spacing={1} className="flex-wrap">
						{Object.entries(profile.tags).map(([key, value], index) => {
							return value ?
								<Chip key={index} label={key} variant="filled" color="primary" className="fw-bold m-0 me-1 mb-1" />
								:
								null
						})}
					</Stack>
				</div>
			</div>
		</div>

	)

}

export default ProfileViewer