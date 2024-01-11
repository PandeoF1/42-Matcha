export interface UpdateForm {
    firstName: string
    lastName: string
    email: string
    gender: string
    orientation: string
    bio: string
    birthdate: string
    tags: {[key: string]: boolean}
    images: string[]
}