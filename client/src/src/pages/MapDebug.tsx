import { MapContainer, Marker, TileLayer } from "react-leaflet"
import instance from "../api/Instance"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import L, { LatLngExpression } from "leaflet"

const MapDebug = () => {
    const navigate = useNavigate()
    const [allPosition, setAllPosition] = useState([])

    const getAllPosition = async () => {
        await instance.get('/geoloc/all').then((res) => {
            console.log(res.data)
            setAllPosition(res.data)
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
            <MapContainer center={[0, 0]} zoom={13} style={{ height: '800px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {allPosition.map((position : string) => {
                    const positionTyped : LatLngExpression = {lat: parseFloat(position.split(',')[0]), lng: parseFloat(position.split(',')[1])}
                    return (
                        <Marker
                            position={positionTyped}
                        />
                    )
                })}
            </MapContainer>
        </div>
    )
}

export default MapDebug