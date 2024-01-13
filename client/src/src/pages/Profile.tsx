import { Badge, Button, Card, Chip, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material"
import { UpdateForm } from "./models/UpdateForm"
import { useEffect, useState } from "react"
import _ from "lodash"
import validator from "validator"
import addImage from "../../assets/add-image2.png"
import goose from "../../assets/goose.jpg"
import instance from "../api/Instance"
import { useNavigate } from "react-router-dom"
import { LoadingButton } from "@mui/lab"
import { UserModel } from "./models/UserModel"

interface ProfilePageProps {
    setErrorAlert: (message: string) => void
    setSuccessAlert: (message: string) => void
}

const ProfilePage = ({ setErrorAlert, setSuccessAlert }: ProfilePageProps) => {
    const [formBackup, setFormBackup] = useState<UpdateForm>({
        firstName: '', lastName: '', email: '', gender: '', orientation: '', bio: '', age: 18, tags: {}, images: []
    })
    const [form, setForm] = useState<UpdateForm>({
        firstName: '', lastName: '', email: '', gender: '', orientation: '', bio: '', age: 18, tags: {}, images: []
    })
    const emailError = !form.email.length || (validator.isEmail(form.email) ? false : true)
    const firstnameError = !form.firstName.length || !(/^[a-zA-Z]{3,16}$/).test(form.firstName)
    const lastnameError = !form.lastName.length || !(/^[a-zA-Z]{3,16}$/).test(form.lastName)

    const [isPageLoading, setIsPageLoading] = useState(true)
    const [imgAreLoading, setImgAreLoading] = useState<number[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate();

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [event.target.id]: event.target.value })
    }

    const handleSelectChange = (event: SelectChangeEvent) => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const handleSelectNumberChange = (event: SelectChangeEvent) => {
        setForm({ ...form, [event.target.name]: parseInt(event.target.value) })
    }

    const handleDeleteImg = (index: number) => {
        const images = _.cloneDeep(form.images)
        images.splice(index, 1)
        setForm({ ...form, images })
    }

    const handleTagChange = (key: string, value: boolean) => {
        const tags = _.cloneDeep(form.tags)
        if (Object.keys(tags).includes(key)) {
            tags[key] = value
            setForm({ ...form, tags })
        }
    }

    const getUser = async () => {
        await instance.get<UserModel>('/user').then((res) => {
            const imgLoadingArray = []
            for (let i = 0; i < res.data.images.length; i++) {
                imgLoadingArray.push(i)
            }
            const { id, username, geoloc, completion, ...filteredData } = res.data
            setFormBackup(filteredData)
            setForm(filteredData)
            setIsPageLoading(false)
        }).catch(() => {
            localStorage.removeItem("token")
            navigate('/login')
        })
    }

    const handleImgUpload = async (file: File) => {
        const formData = new FormData()
        formData.append('image', file)
        await instance.post('/image/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then((res) => {
            setForm(prev => ({ ...prev, images: [...prev.images].concat(res.data.url) }))
        }).catch(() => {
            setErrorAlert("Could not upload image")
        })
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        const formToSend = _.cloneDeep(form)
        if (!formToSend.bio) {
            formToSend.bio = " "
        }
        await instance.put('/user', formToSend).then(() => {
            setFormBackup(form)
            setSuccessAlert("Profile updated")
            getUser()
        }).catch((err) => {
            setErrorAlert(err.response.data.message)
        }).finally(() => {
            setIsSubmitting(false)
        })
    }

    const onChangeImg = async (files: FileList | null) => {

        if (!files) {
            return;
        }

        for (let i = 0; i < files.length && i + form.images.length < 5; i++) {
            await handleImgUpload(files[i])
        }
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getUser()
        }
        else {
            navigate('/login')
        }
    }, [navigate])


    return (
        <div className="RegisterPage container">
            {isPageLoading ? <CircularProgress color="secondary" className="mt-4" /> :
                <div className="row justify-content-center p-4">
                    <Card className="col-xs-12 col-sm-11 col-md-8 col-lg-6 col-xl-5 col-xxl-4 p-4">
                        <div className="row justify-content-center">
                            <h5 className="fw-bold">PROFILE</h5>
                        </div>
                        <div className="row justify-content-center">
                            <Grid container spacing={2} className="flex-wrap p-0">
                                {form.images.map((image, index) => {
                                    return (
                                        <Grid item xs={6} sm={4} className="mt-3 imgMosaicContainer" key={index}>
                                            {imgAreLoading.includes(index) && <CircularProgress color="secondary" />}
                                            <Badge color="error" badgeContent={<p className="badgeCross">x</p>} role="button" className="cursor-pointer" style={{ display: isSubmitting || imgAreLoading.includes(index) ? "none" : "block" }} onClick={() => handleDeleteImg(index)}>
                                                <img src={image} alt="profile" className="imgMosaic" onError={(e) => { e.currentTarget.src = goose }} onLoad={() => { setImgAreLoading(prev => prev.filter((value) => value !== index)) }} loading="lazy" />
                                            </Badge>
                                        </Grid>
                                    )
                                })}
                                {form.images.length < 5 &&
                                    <Grid item xs={6} sm={4} className="mt-3 imgMosaicContainer">
                                        <img src={addImage} alt="Click to upload" className="imgMosaic" onClick={() => document.getElementById("imgInput")?.click()} />
                                        <input multiple id="imgInput" type="file" accept=".jpg, .jpeg, .png" onChange={(event) => onChangeImg(event.target.files)} style={{ display: "none" }} disabled={isSubmitting} />
                                    </Grid>}
                            </Grid>
                        </div>
                        <hr className="w-100 mt-4" />
                        <div className="row justify-content-center pt-1">
                            <div className="col-12 d-flex">
                                <div className="col-5 pe-1">
                                    <FormControl className="w-100">
                                        <InputLabel id="gender-label">Gender</InputLabel>
                                        <Select
                                            labelId="gender-label"
                                            className="w-100"
                                            id="gender-select"
                                            name="gender"
                                            label="Gender"
                                            disabled={isSubmitting}
                                            value={form.gender}
                                            onChange={handleSelectChange}
                                        >
                                            <MenuItem value={"male"}>Male</MenuItem>
                                            <MenuItem value={"female"}>Female</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-5 px-1">
                                    <FormControl className="w-100">
                                        <InputLabel id="orientation-label">Orientation</InputLabel>
                                        <Select
                                            labelId="orientation-label"
                                            className="w-100"
                                            id="orientation-select"
                                            name="orientation"
                                            value={form.orientation}
                                            disabled={isSubmitting}
                                            label="Orientation"
                                            onChange={handleSelectChange}
                                        >
                                            <MenuItem value={"heterosexual"}>Heterosexual</MenuItem>
                                            <MenuItem value={"homosexual"}>{form.gender === "male" ? "Homosexual" : "Lesbian"}</MenuItem>
                                            <MenuItem value={"bisexual"}>Bisexual</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="col-2 ps-1">
                                    <FormControl>
                                        <InputLabel id="age-label">Age</InputLabel>
                                        <Select
                                            labelId="age-label"
                                            id="age-select"
                                            value={form.age.toString()}
                                            label="Age"
                                            name="age"
                                            onChange={handleSelectNumberChange}
                                        >
                                            {Array.from(Array(82).keys()).map((value, index) => {
                                                return (
                                                    <MenuItem key={index} value={(value + 18).toString()}>{value + 18}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </div>
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
                                            <Chip key={index} label={key} variant="filled" color="primary" className="fw-bold m-0 me-1 mb-1" onClick={() => { }} onDelete={() => handleTagChange(key, false)} disabled={isSubmitting} />
                                            :
                                            <Chip key={index} label={key} variant="outlined" color="primary" className="fw-bold m-0 me-1 mb-1" onClick={() => { handleTagChange(key, true) }} disabled={isSubmitting} />
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
                                        disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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
                        <div className="d-flex justify-content-between pt-3">
                            <Button
                                variant="outlined"
                                color="primary"
                                size="medium"
                                style={{ width: "fit-content" }}
                                onClick={() => navigate('/')}
                            >
                                Close
                            </Button>
                            <LoadingButton
                                variant="contained"
                                color="primary"
                                disabled={_.isEqual(form, formBackup) || emailError || firstnameError || lastnameError || form.images.length < 1}
                                loading={isSubmitting}
                                size="medium"
                                style={{ width: "fit-content" }}
                                onClick={() => handleSubmit()}
                            >
                                Save
                            </LoadingButton>
                        </div>
                    </Card>
                </div>}
        </div>
    )
}

export default ProfilePage