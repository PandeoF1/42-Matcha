import { TextField } from "@mui/material"
import { useState } from "react"
import { RegisterForm } from "./Models/RegisterForm"


const RegisterPage = () => {
    const [form , setForm] = useState<RegisterForm>({firstName: '', lastName: '', username: '', password: '', email: ''})

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value)
        console.log(event.target.id)
        console.log({...form, [event.target.id]: event.target.value})
        setForm({...form, [event.target.id]: event.target.value})
    }
    return (
        <div>
            <h1>Register</h1>
            <TextField
                error={true}
                value={form.email}
                onChange={handleFieldChange}
                required
                id="email"
                label="email"
                helperText="Invalid email address"
                variant="outlined"
                color="primary"
                inputProps={{style: {color: 'white'}}}
            />
        </div>
    )
}

export default RegisterPage