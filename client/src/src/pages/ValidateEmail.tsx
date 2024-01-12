import { useEffect, useState } from "react"
import instance from "../api/Instance"
import { useNavigate, useParams } from "react-router-dom"
import { CircularProgress } from "@mui/material"


const ValidateEmailPage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [count, setCount] = useState(5)
    const [status, setStatus] = useState(false)

    useEffect(() => {
        if (!navigate || !params) return;
        let intervalId : number = 0;
        const checkToken = async (token: string) => {
            await instance.post('/email/confirm', {token: token}).then(() => {
                // Todo : show success notif
                setStatus(true)
                setTimeout(() => {
                    navigate('/login')
                }, 5000)
                intervalId = setInterval(() => {
                    setCount((prevCount : number) => prevCount - 1)
                }, 1000);
            }
            ).catch(() => {
                // TODO: show error
                if (localStorage.getItem("token")) {
                    navigate('/')
                }
                else
                    navigate('/login')
            })
        }

        checkToken(params.id || '')

        return () => {
            clearInterval(intervalId)
        }
    }, [navigate, params])
    return (
        <div className="validateEmailPage container">
            <div className="row justify-content-center p-4">
                <div className="col-12">
                    {status ? <h4>Request confirmed, you will be redirected to login in {count} seconds</h4> : <CircularProgress color="secondary" />}
                </div>
            </div>
        </div>
    )
}

export default ValidateEmailPage