import { Card, TextField } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from "react"
import validator from 'validator'
import instance from "../api/Instance"
import { useNavigate, useParams } from "react-router-dom"

interface ResetPasswordPageProps {
    setErrorAlert: (message: string) => void
    setSuccessAlert: (message: string) => void
}

const ResetPasswordPage = ({ setErrorAlert, setSuccessAlert }: ResetPasswordPageProps) => {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const emailError = !!email.length && (validator.isEmail(email) ? false : true)
    const passwordError = !!password.length && !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,30}$/).test(password)

    const navigate = useNavigate()

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

    const handleResetRequest = () => {
        if (!localStorage.getItem("token")) {
            setIsLoading(true)
            instance.post('/email/password/new', { email }).then(() => {
                navigate('/login')
                setSuccessAlert('If the email exists, a reset link will be sent')
            }).catch(() => {
                setErrorAlert('An error occured, please try again later')
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    const handleReset = () => {
        if (!localStorage.getItem("token")) {
            setIsLoading(true)
            instance.post(`/email/password`, { token : params.id , password }).then(() => {
                navigate('/login')
                setSuccessAlert('Password reset, you can now login')
            }
            ).catch(() => {
                setErrorAlert('An error occured, please try again later')
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    return (
        <div className="registerPage container">
            <div className="row justify-content-center p-4 w-100">
                <Card className="col-xs-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 col-xxl-3 p-4" elevation={6}>
                    {params.id ?
                        <>
                            <div className="row justify-content-center pt-3">
                                <div className="col-12">
                                    <TextField
                                        error={passwordError}
                                        value={password}
                                        disabled={isLoading}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-100"
                                        required
                                        type="password"
                                        autoComplete="new-password"
                                        id="password"
                                        label="Password"
                                        helperText={passwordError ? 'Invalid password , must contain beween 8 and 30 characters, 1 uppercase letter, lowercase letter, number and special character' : ''}
                                        variant="outlined"
                                        color="primary"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                handleReset()
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
                                        disabled={passwordError || !password.length}
                                        loading={isLoading}
                                        size="large"
                                        onClick={() => handleReset()}
                                    >
                                        Save
                                    </LoadingButton>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="row justify-content-center pt-3">
                                <div className="col-12">
                                    <TextField
                                        error={emailError}
                                        value={email}
                                        disabled={isLoading}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                    <LoadingButton
                                        variant="contained"
                                        color="primary"
                                        className="w-100"
                                        disabled={emailError || !email.length}
                                        loading={isLoading}
                                        size="large"
                                        onClick={() => handleResetRequest()}
                                    >
                                        Reset
                                    </LoadingButton>
                                </div>
                            </div>
                            <div className="row justify-content-center pt-3">
                                New here ? <p onClick={() => navigate("/register")} style={{ width: "fit-content", paddingLeft: "4px", cursor: "pointer", color: "#ff6e00", marginBottom: "0px" }}>Register</p>
                            </div>
                        </>
                    }
                </Card>
            </div>
        </div>
    )
}

export default ResetPasswordPage