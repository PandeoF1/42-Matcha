import { Card, TextField } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from "react"
import { LoginForm } from "./models/LoginForm"
import instance from "../api/Instance"
import { useNavigate } from "react-router-dom"

interface LoginPageProps {
    setErrorAlert: (message: string) => void    
}

const LoginPage = ({setErrorAlert} : LoginPageProps) => {
    const [form, setForm] = useState<LoginForm>({ username: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.id]: event.target.value })
    }

    useEffect(() => {
        const checkLoggedIn = async () => {
            await instance.get('/user/session').then(() => {
                navigate('/')
            }
            ).catch(() => {
                localStorage.removeItem("token")
            })
        }

        if (localStorage.getItem("token")) {
            checkLoggedIn()
        }
    }, [navigate])

    const handleSubmit = () => {
        if (!localStorage.getItem("token")) {
            setIsLoading(true)
            instance.post('/user/login', form).then((res) => {
                localStorage.setItem("token", res.data.token)
                navigate('/')
            }
            ).catch(() => {
                // TODO: show error
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    return (
        <div className="loginPage container">
            <div className="row justify-content-center p-4 w-100">
                <Card className="col-xs-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 col-xxl-3 p-4">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <TextField
                                value={form.username}
                                onChange={handleFieldChange}
                                disabled={isLoading}
                                className="w-100"
                                required
                                id="username"
                                label="Username"
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' }, maxLength: 16 }}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center pt-3">
                        <div className="col-12">
                            <TextField
                                value={form.password}
                                onChange={handleFieldChange}
                                disabled={isLoading}
                                className="w-100"
                                required
                                id="password"
                                type="password"
                                label="Password"
                                variant="outlined"
                                color="primary"
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        handleSubmit()
                                    }
                                }}
                                inputProps={{ style: { color: 'black' }, maxLength: 30 }}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center pt-3">
                        <div className="col-12">
                            <LoadingButton
                                variant="contained"
                                // disabled={isLoading}
                                loading={isLoading}
                                className="w-100"
                                color="primary"
                                size="large"
                                onClick={() => handleSubmit()}
                            >
                                Login
                            </LoadingButton>
                        </div>
                    </div>
                    <div className="row justify-content-center pt-3">
                        New here ? <p onClick={() => navigate("/register")}  style={{width : "fit-content", paddingLeft : "4px", cursor : "pointer", color : "#ff6e00", marginBottom : "0px"}}>Register</p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage