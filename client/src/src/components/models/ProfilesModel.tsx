import { UserModel } from "../../pages/models/UserModel";

export interface ProfilesModel {
    id : string
    age : number
    distance: number
    elo : number
    commonTags: string[]
}