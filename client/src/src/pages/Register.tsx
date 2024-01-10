import { Card, TextField } from "@mui/material"
import { useState } from "react"
import { RegisterForm } from "./models/RegisterForm"
import validator from 'validator'


const RegisterPage = () => {
    const [form, setForm] = useState<RegisterForm>({ firstName: '', lastName: '', username: '', password: '', email: '' })
    const emailError = !!form.email.length && (validator.isEmail(form.email) ? false : true)
    const passwordError = !!form.password.length && !(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).test(form.password)

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.id]: event.target.value })
    }

    return (
        <div className="RegisterPage container">
            <div className="row justify-content-center p-4">
                <Card className="col-xs-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 col-xxl-3 p-4">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <TextField
                                error={emailError}
                                value={form.email}
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
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                type="password"
                                autoComplete="current-password"
                                id="password"
                                label="password"
                                helperText={passwordError ? 'Invalid password , must contain at least 8 characters, 1 uppercase letter, lowercase letter, number and special character' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' } }}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default RegisterPage