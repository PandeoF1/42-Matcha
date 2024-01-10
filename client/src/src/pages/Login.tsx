import { Button, Card, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { LoginForm } from "./models/LoginForm"
import instance from "../api/Instance"
import { useNavigate } from "react-router-dom"


const LoginPage = () => {
    const [form, setForm] = useState<LoginForm>({ username: '', password: '' })

    const navigate = useNavigate()

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.id]: event.target.value })
    }

    useEffect(() => {
        const checkLoggedIn = async () => {
            await instance.get('/session').then(() => {
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
            instance.post('/session', form).then((res) => {
                localStorage.setItem("token", res.data.token)
                navigate('/')
            }
            ).catch(() => {
                // TODO: show error
            })
        }
    }

    return (
        <div className="LoginPage container">
            <div className="row justify-content-center p-4">
                <Card className="col-xs-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 col-xxl-3 p-4">
                    <div className="row justify-content-center">
                        <div className="col-6">
                            <TextField
                                value={form.username}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                id="username"
                                label="username"
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' } }}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <TextField
                                value={form.password}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                id="password"
                                type="password"
                                label="password"
                                variant="outlined"
                                color="primary"
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        handleSubmit()
                                    }
                                }}
                                inputProps={{ style: { color: 'black' } }}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center pt-3">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => handleSubmit()}
                        >
                            Login
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default LoginPage