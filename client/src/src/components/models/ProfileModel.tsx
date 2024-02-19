import { UserModel } from "../../pages/models/UserModel";

export interface ProfileModel extends Omit<UserModel, "email" | "completion" | "geoloc" | "username" | "lastName"> {
    distance: number
    elo : number
    commonTags: string[]
    liked: boolean
    skipped: boolean
    blocked: boolean
    matched: boolean
}