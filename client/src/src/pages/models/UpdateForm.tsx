export interface UpdateForm {
    firstName: string
    lastName: string
    email: string
    gender: string
    orientation: string
    bio: string
    age : number
    tags: {[key: string]: boolean}
    images: string[]
    geoloc : string
    elo : number
}