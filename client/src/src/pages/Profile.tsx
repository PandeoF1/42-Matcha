import { Card, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { UpdateForm } from "./models/UpdateForm"
import { useState } from "react"


const ProfilePage = () => {
    const [form, setForm] = useState<UpdateForm>({ firstName: '', lastName: '', email: '', gender: 'M', orientation: 'Bi', bio: '', birthdate: '', tags: [], images: [] })

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.id]: event.target.value })
    }

    const handleSelectChange = (event: SelectChangeEvent) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    return (
        <div className="RegisterPage container">
            <div className="row justify-content-center p-4">
                <Card className="col-xs-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 col-xxl-3 p-4">
                    <div className="row justify-content-center">
                        <div className="col-6">
                            <Select
                                labelId="demo-simple-select-helper-label"
                                className="w-100"
                                id="gender-select"
                                name="gender"
                                value={form.gender}
                                label="gender"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value={"M"}>Male</MenuItem>
                                <MenuItem value={"F"}>Female</MenuItem>
                            </Select>
                        </div>
                        <div className="col-6">
                            <Select
                                labelId="demo-simple-select-helper-label"
                                className="w-100"
                                id="orientation-select"
                                name="orientation"
                                value={form.orientation}
                                label="orientation"
                                onChange={handleSelectChange}
                            >
                                <MenuItem value={"Hetero"}>Heterosexual</MenuItem>
                                <MenuItem value={"Homo"}>Homosexual/Lesbian</MenuItem>
                                <MenuItem value={"Bi"}>Bisexual</MenuItem>
                            </Select>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default ProfilePage