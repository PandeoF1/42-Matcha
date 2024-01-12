export interface UserModel {
    id : string
    username: string
    firstName: string
    lastName: string
    email: string
    gender: string
    orientation: string
    bio: string
    age : number
    tags: {[key: string]: boolean}
    images: string[]
    completion : number
    geoloc : string
}