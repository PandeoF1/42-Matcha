import { Card, TextField } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from "react"
import { RegisterForm } from "./models/RegisterForm"
import validator from 'validator'
import instance from "../api/Instance"
import { useNavigate } from "react-router-dom"

interface RegisterPageProps {
    setErrorAlert: (message: string) => void
    setSuccessAlert: (message: string) => void
}

const RegisterPage = ({ setErrorAlert, setSuccessAlert }: RegisterPageProps) => {
    const [form, setForm] = useState<RegisterForm>({ firstName: '', lastName: '', username: '', password: '', email: '' })
    const [isLoading, setIsLoading] = useState(false)
    const emailError = !!form.email.length && (validator.isEmail(form.email) ? false : true)
    const passwordError = !!form.password.length && !(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,30}$/).test(form.password)
    const usernameError = !!form.username.length && !(/^[a-zA-Z0-9]{3,16}$/).test(form.username)
    const firstnameError = !!form.firstName.length && !(/^[a-zA-Z\u00C0-\u00FF]{3,16}$/).test(form.firstName)
    const lastnameError = !!form.lastName.length && !(/^[a-zA-Z\u00C0-\u00FF]{3,16}$/).test(form.lastName)

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
            instance.post('/user', form).then(() => {
                navigate('/login')
                setSuccessAlert('User registered, please check your email to confirm your account')
            }
            ).catch((err) => {
                setErrorAlert(err.response.data.message)
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    return (
        <div className="registerPage container">
            <div className="row justify-content-center p-4 w-100">
                <Card className="col-xs-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 col-xxl-3 p-4" elevation={6}>
                    <div className="row justify-content-center ">
                        <div className="col-12">
                            <TextField
                                error={firstnameError}
                                value={form.firstName}
                                disabled={isLoading}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                id="firstName"
                                label="First name"
                                helperText={firstnameError ? 'Firstname must be between 3 and 16 characters long and contain only letters' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' }, maxLength: 16 }}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center pt-3">
                        <div className="col-12">
                            <TextField
                                error={lastnameError}
                                value={form.lastName}
                                disabled={isLoading}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                id="lastName"
                                label="Last name"
                                helperText={lastnameError ? 'Last name must be between 3 and 16 characters long and contain only letters' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' }, maxLength: 16 }}
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
                                label="Username"
                                helperText={usernameError ? 'Username must be between 3 and 16 characters long and contain only letters and numbers' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' }, maxLength: 16 }}
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
                                label="Email"
                                helperText={emailError ? 'Invalid email' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' }, maxLength: 320 }}
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
                                label="Password"
                                helperText={passwordError ? 'Invalid password , must contain beween 8 and 30 characters, 1 uppercase letter, lowercase letter, number and special character' : ''}
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
                                color="primary"
                                className="w-100"
                                disabled={emailError || passwordError || usernameError || firstnameError || lastnameError || !form.email.length || !form.password.length || !form.username.length || !form.firstName.length || !form.lastName.length}
                                loading={isLoading}
                                size="large"
                                onClick={() => handleSubmit()}
                            >
                                Register
                            </LoadingButton>
                        </div>
                    </div>
                    <div className="row justify-content-center pt-3">
                        Already registered ? <p onClick={() => navigate("/login")} style={{ width: "fit-content", paddingLeft: "4px", cursor: "pointer", color: "#ff6e00", marginBottom: "0px" }}>Login</p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default RegisterPage