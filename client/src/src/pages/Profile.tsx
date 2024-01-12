import { Card, Chip, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material"
import { UpdateForm } from "./models/UpdateForm"
import { useEffect, useState } from "react"
import _ from "lodash"
import validator from "validator"
import addImage from "../../assets/add-image2.png"
import goose from "../../assets/goose.jpg"
import instance from "../api/Instance"
import { useNavigate } from "react-router-dom"


const ProfilePage = () => {
    const [formBackup, setFormBackup] = useState<UpdateForm>({
        firstName: '', lastName: '', email: '', gender: '', orientation: '', bio: '', birthdate: '', tags: {}, images: []
    })
    const [form, setForm] = useState<UpdateForm>({
        firstName: '', lastName: '', email: '', gender: '', orientation: '', bio: '', birthdate: '', tags: {}, images: []
    })
    const emailError = !form.email.length || (validator.isEmail(form.email) ? false : true)
    const firstnameError = !form.firstName.length || !(/^[a-zA-Z]{3,16}$/).test(form.firstName)
    const lastnameError = !form.lastName.length || !(/^[a-zA-Z]{3,16}$/).test(form.lastName)

    const [isLoading, setIsLoading] = useState(true)
    const [imgAreLoading, setImgAreLoading] = useState(0)

    const navigate = useNavigate();

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

    const handleImgUpload = async (file: File) => {
        const formData = new FormData()
        formData.append('image', file)
        await instance.post('/image/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(() => {
        }).catch(() => {
        })
    }

    useEffect(() => {
        console.log(form)
    }, [form])

    const onChangeImg = async (files: FileList | null) => {

        if (!files) {
            return;
        }

        for (let i = 0; i < files.length && i + form.images.length < 5; i++) {
            await handleImgUpload(files[i])
        }
    }

    useEffect(() => {
        setIsLoading(true)
        const getUser = async () => {
            await instance.get('/user').then((res) => {
                res.data.images = ["https://picsum.photos/200/280", "https://picsum.photos/200/300", "https://picsum.photos/200/290", "https://picsum.photos/200/240", "https://picsum.photos/200/200"]
                res.data.tags = { "tag1": true, "tag2": false, "tag3": true, "tag4": false, "tag5": true, "tag6": false, "tag7": true, "tag8": false, "tag9": true, "tag10": false, "tag11": true, "tag12": false, "tag13": true, "tag14": false, "tag15": true, "tag16": false, "tag17": true, "tag18": false, "tag19": true, "tag20": false, "tag21": true, "tag22": false, "tag23": true, "tag24": false, "tag25": true, "tag26": false, "tag27": true, "tag28": false, "tag29": true, "tag30": false, "tag31": true, "tag32": false, "tag33": true, "tag34": false, "tag35": true, "tag36": false, "tag37": true, "tag38": false, "tag39": true, "tag40": false, "tag41": true, "tag42": false, "tag43": true, "tag44": false, "tag45": true, "tag46": false, "tag47": true, "tag48": false, "tag49": true, "tag50": false }
                setImgAreLoading(res.data.images.length)
                setFormBackup(res.data)
                setForm(res.data)
                setIsLoading(false)
            }).catch(() => {
                localStorage.removeItem("token")
                navigate('/login')
            })
        }

        if (localStorage.getItem("token")) {
            getUser()
        }
        else {
            navigate('/login')
        }
    }, [navigate])


    return (
        <div className="RegisterPage container">
            <div className="row justify-content-center p-4">
                {isLoading ? <CircularProgress color="secondary" /> :
                    <Card className="col-xs-12 col-sm-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4 p-4">
                        <div className="row justify-content-center">
                            <Grid container spacing={2} className="flex-wrap p-0">
                                {form.images.map((image, index) => {
                                    return (
                                        <Grid item xs={6} sm={4} className="mt-2" key={index}>
                                            <img src={image} alt="profile" className="imgMosaic" onError={(e) => { e.currentTarget.src = goose}} onLoad={() => {setImgAreLoading(prev => prev - 1)}} loading="lazy" onLoadStart={}/>
                                        </Grid>
                                    )
                                })}
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
                                        <MenuItem value={"male"}>Male</MenuItem>
                                        <MenuItem value={"female"}>Female</MenuItem>
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
                                        <MenuItem value={"heterosexual"}>Heterosexual</MenuItem>
                                        <MenuItem value={"homosexual"}>{form.gender === "male" ? "Homosexual" : "Lesbian"}</MenuItem>
                                        <MenuItem value={"bisexual"}>Bisexual</MenuItem>
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
                            <div className="col-12 overflow-y-scroll tagsContainer" style={{ height: "86px" }}>
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
                    </Card>}
            </div>
        </div>
    )
}

export default ProfilePage