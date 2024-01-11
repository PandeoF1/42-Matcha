import { useEffect } from "react"
import instance from "../api/Instance"
import { useNavigate } from "react-router-dom"

const HomePage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const checkLoggedIn = async () => {
            await instance.get('/user/session').then(() => {
                navigate('/')
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
        <div>
            <h1>Home Page</h1>
        </div>
    )
}

export default HomePage