import { Card, TextField } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from "react"
import { RegisterForm } from "./models/RegisterForm"
import validator from 'validator'
import instance from "../api/Instance"
import { useNavigate } from "react-router-dom"


const RegisterPage = () => {
    const [form, setForm] = useState<RegisterForm>({ firstName: '', lastName: '', username: '', password: '', email: '' })
    const [isLoading, setIsLoading] = useState(false)
    const emailError = !!form.email.length && (validator.isEmail(form.email) ? false : true)
    const passwordError = !!form.password.length && !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,30}$/).test(form.password)
    const usernameError = !!form.username.length && !(/^[a-zA-Z0-9]{3,16}$/).test(form.username)
    const firstnameError = !!form.firstName.length && !(/^[a-zA-Z]{3,16}$/).test(form.firstName)
    const lastnameError = !!form.lastName.length && !(/^[a-zA-Z]{3,16}$/).test(form.lastName)

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
            setIsLoading(true)
            instance.post('/user', form).then(() => {
                navigate('/login')
                // Todo : show notif to ask email confirmation
            }
            ).catch(() => {
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    return (
        <div className="RegisterPage container">
            <div className="row justify-content-center p-4">
                <Card className="col-xs-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 col-xxl-3 p-4">
                    <div className="row justify-content-center">
                        <div className="col-6">
                            <TextField
                                error={firstnameError}
                                value={form.firstName}
                                disabled={isLoading}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                id="firstName"
                                label="first name"
                                helperText={usernameError ? 'Invalid first name' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' } }}
                            />
                        </div>
                        <div className="col-6">
                            <TextField
                                error={lastnameError}
                                value={form.lastName}
                                disabled={isLoading}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                id="lastName"
                                label="last name"
                                helperText={usernameError ? 'Invalid last name' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' } }}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center pt-3">
                        <div className="col-12">
                            <TextField
                                error={usernameError}
                                value={form.username}
                                disabled={isLoading}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                id="username"
                                label="username"
                                helperText={usernameError ? 'Invalid username' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' } }}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center pt-3">
                        <div className="col-12">
                            <TextField
                                error={emailError}
                                value={form.email}
                                disabled={isLoading}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                id="email"
                                label="email"
                                helperText={emailError ? 'Invalid email address' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' } }}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center pt-3">
                        <div className="col-12">
                            <TextField
                                error={passwordError}
                                value={form.password}
                                disabled={isLoading}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                type="password"
                                autoComplete="current-password"
                                id="password"
                                label="password"
                                helperText={passwordError ? 'Invalid password , must contain beween 8 and 30 characters, 1 uppercase letter, lowercase letter, number and special character' : ''}
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
                        <LoadingButton
                            variant="contained"
                            color="primary"
                            loading={isLoading}
                            size="large"
                            onClick={() => handleSubmit()}
                        >
                            Register
                        </LoadingButton>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default RegisterPage