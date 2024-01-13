import { ProfileModel } from "./models/ProfileModel"
import goose from '../../assets/goose.jpg'
import { useState } from "react"

interface ProfileViewerProps {
	profile: ProfileModel
}

const ProfileViewer = ({ profile }: ProfileViewerProps) => {

	const [imageIndex, setImageIndex] = useState(0)

	console.log(profile)

	return (
		<div className="profileViewer">
			<img src={profile.images[imageIndex] ? profile.images[imageIndex] : goose} alt="profile" className="imgProfile" />
		</div>

	)

}

export default ProfileViewer