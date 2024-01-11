import { Box, Card, Chip, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material"
import { UpdateForm } from "./models/UpdateForm"
import { useEffect, useState } from "react"
import _ from "lodash"
import validator from "validator"
import addImage from "../../assets/add-image2.png"


const ProfilePage = () => {
    const [form, setForm] = useState<UpdateForm>({
        firstName: '', lastName: '', email: '', gender: 'M', orientation: 'Homosexual', bio: '', birthdate: '', tags: {
            "#vegan": true,
            "#vegetarian": false,
            "#pescetarian": false,
            "#kosher": false,
            "#halal": false,
            "#gluten-free": false,
            "#lactose-free": true,
            "#nut-free": false,
            "#soy-free": false,
            "#egg-free": true,
        }, images: []
    })
    const emailError = !!form.email.length && (validator.isEmail(form.email) ? false : true)
    const firstnameError = !!form.firstName.length && !(/^[a-zA-Z]{3,16}$/).test(form.firstName)
    const lastnameError = !!form.lastName.length && !(/^[a-zA-Z]{3,16}$/).test(form.lastName)

    const [isLoading, setIsLoading] = useState(false)

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.id]: event.target.value })
    }

    const handleSelectChange = (event: SelectChangeEvent) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const handleTagChange = (key: string, value: boolean) => {
        const tags = _.cloneDeep(form.tags)
        if (Object.keys(tags).includes(key)) {
            tags[key] = value
            setForm({ ...form, tags })
        }
    }

    const fileToDataUri = (file : File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (!event.target) {
                reject()
                return
            }
            resolve(event.target.result)
        };
        reader.readAsDataURL(file);
    })

    useEffect(() => {
        console.log(form)
    }, [form])

    const onChangeImg = (files: FileList | null) => {

        if (!files) {
            return;
        }

        const images = [...form.images]

        for (let i = 0; i < files.length && i + form.images.length < 5; i++) {
            fileToDataUri(files[i])
                .then(dataUri => {                 
                    images.push(dataUri as string)
                })
                .catch()
        }

        setForm({ ...form, images })

    }

    return (
        <div className="RegisterPage container">
            <div className="row justify-content-center p-4">
                <Card className="col-xs-12 col-sm-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4 p-4">
                    <div className="row justify-content-center">
                        <Grid container spacing={2} className="flex-wrap">
                            <Grid item xs={6} sm={4} className="mt-2">
                                <img src="https://picsum.photos/200" alt="profile" className="imgMosaic" />
                            </Grid>
                            <Grid item xs={6} sm={4} className="mt-2">
                                <img src="https://picsum.photos/200" alt="profile" className="imgMosaic" />
                            </Grid>
                            <Grid item xs={6} sm={4} className="mt-2">
                                <img src="https://picsum.photos/200" alt="profile" className="imgMosaic" />
                            </Grid>
                            <Grid item xs={6} sm={4} className="mt-2">
                                <img src={addImage} alt="Click to upload" className="imgMosaic" onClick={() => document.getElementById("imgInput")?.click()} />
                                <input multiple id="imgInput" type="file" accept=".jpg, .jpeg, .png" onChange={(event) => onChangeImg(event.target.files)} style={{ display: "none" }} />
                            </Grid>
                        </Grid>
                    </div>
                    <hr className="w-100" />
                    <div className="row justify-content-center pt-1">
                        <div className="col-6">
                            <FormControl className="w-100">
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    className="w-100"
                                    id="gender-select"
                                    name="gender"
                                    label="Gender"
                                    value={form.gender}
                                    onChange={handleSelectChange}
                                >
                                    <MenuItem value={"M"}>Male</MenuItem>
                                    <MenuItem value={"F"}>Female</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-6">
                            <FormControl className="w-100">
                                <InputLabel id="orientation-label">Orientation</InputLabel>
                                <Select
                                    labelId="orientation-label"
                                    className="w-100"
                                    id="orientation-select"
                                    name="orientation"
                                    value={form.orientation}
                                    label="Orientation"
                                    onChange={handleSelectChange}
                                >
                                    <MenuItem value={"Heterosexual"}>Heterosexual</MenuItem>
                                    <MenuItem value={"Homosexual"}>{form.gender === "M" ? "Homosexual" : "Lesbian"}</MenuItem>
                                    <MenuItem value={"Bisexual"}>Bisexual</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className="justify-content-center align-items-center pt-2 d-flex flex-colum">
                        <hr className="w-100" />
                        <p className="fw-bold px-2 m-0">TAGS</p>
                        <hr className="w-100" />
                    </div>
                    <div className="row justify-content-center pt-1">
                        <div className="col-12 overflow-y-scroll" style={{ height: "86px" }}>
                            <Stack direction="row" spacing={1} className="flex-wrap">
                                {Object.entries(form.tags).map(([key, value], index) => {
                                    return value ?
                                        <Chip key={index} label={key} variant="filled" color="primary" className="fw-bold m-0 me-1 mb-1" onClick={() => { }} onDelete={() => handleTagChange(key, false)} />
                                        :
                                        <Chip key={index} label={key} variant="outlined" color="primary" className="fw-bold m-0 me-1 mb-1" onClick={() => { handleTagChange(key, true) }} />
                                })}
                            </Stack>
                        </div>
                    </div>
                    <hr className="w-100" />
                    <div className="row justify-content-center">
                        <div className="col-12 p-0">
                            <div className="position-relative">
                                <TextField
                                    type="text"
                                    label="Bio"
                                    id="bio"
                                    variant="outlined"
                                    className="w-100 px-2"
                                    multiline
                                    value={form.bio}
                                    inputProps={{ maxLength: 200 }}
                                    InputLabelProps={{ shrink: true, className: 'mx-2' }}
                                    onChange={handleFieldChange}
                                />
                                <Typography
                                    className={'d-sm-block position-absolute bottom-0 end-0 me-3'}
                                >
                                    {form.bio.length}/{200}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <div className="justify-content-center align-items-center pt-2 d-flex flex-colum">
                        <hr className="w-100" />
                        <p className="fw-bold px-2 m-0">INFORMATIONS</p>
                        <hr className="w-100" />
                    </div>
                    <div className="row justify-content-center pt-2">
                        <div className="col-12 ">
                            <TextField
                                error={firstnameError}
                                value={form.firstName}
                                disabled={isLoading}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                id="firstName"
                                label="First name"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                helperText={firstnameError ? 'firstname must be between 3 and 16 characters long and contain only letters' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' }, maxLength: 16 }}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center pt-3">
                        <div className="col-12 ">
                            <TextField
                                error={lastnameError}
                                value={form.lastName}
                                disabled={isLoading}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                id="lastName"
                                label="Last name"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                helperText={lastnameError ? 'last name must be between 3 and 16 characters long and contain only letters' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' }, maxLength: 16 }}
                            />
                        </div>
                    </div>
                    <div className="row justify-content-center pt-3">
                        <div className="col-12 ">
                            <TextField
                                error={emailError}
                                value={form.email}
                                disabled={isLoading}
                                onChange={handleFieldChange}
                                className="w-100"
                                required
                                id="email"
                                label="Email"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                helperText={emailError ? 'Invalid email' : ''}
                                variant="outlined"
                                color="primary"
                                inputProps={{ style: { color: 'black' }, maxLength: 320 }}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default ProfilePage