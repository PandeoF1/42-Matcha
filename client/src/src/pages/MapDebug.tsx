import { MapContainer, Marker, TileLayer } from "react-leaflet"
import instance from "../api/Instance"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import L, { LatLngExpression } from "leaflet"
import { Button } from "@mui/material"

const MapDebug = () => {
    const navigate = useNavigate()
    const [allUsers, setAllUsers] = useState([])
    const [hoveredUser, setHoveredUser] = useState<any | null>(null)

    const getAllPosition = async () => {
        await instance.get('/geoloc/all/' + JSON.parse(localStorage.getItem("filterParams") || "").distance).then((res) => {
            setAllUsers(res.data)
        }).catch(() => {
            localStorage.removeItem("token")
            navigate('/login')
        })
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getAllPosition()
        }
    }, [])

    return (
        <div className="mapContainer position-relative">
            <img src={hoveredUser ? hoveredUser.image : ''} style={{ width: "50px", height: "50px" }} loading="lazy" onError={(e) => { e.currentTarget.src = '' }} />
            <p>
                {hoveredUser ? hoveredUser.firstName : ''} {hoveredUser ? hoveredUser.lastName : ''}
            </p>
            <p>
                {hoveredUser ? hoveredUser.id : ''}
            </p>
            <p>
                {hoveredUser ? hoveredUser.geoloc : ''}
            </p>
            <Button color="primary" variant="contained"
            onClick={() => {
                getAllPosition()
            }}>
                Refresh
            </Button>
            <MapContainer center={[0, 0]} zoom={13} style={{ height: '800px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {allUsers.map((user: any, index: number) => {
                    const positionTyped: LatLngExpression = { lat: parseFloat(user.geoloc.split(',')[0]), lng: parseFloat(user.geoloc.split(',')[1]) }
                    return (
                        <Marker
                            key={index}
                            position={positionTyped}
                            icon={L.icon({
                                iconUrl: user.icon,
                                iconSize: [15, 15],
                            })}
                            eventHandlers={
                                {
                                    mouseover: () => {
                                        setHoveredUser(user)
                                    }
                                }
                            }
                        />
                    )
                })}
            </MapContainer>
        </div>
    )
}

export default MapDebug