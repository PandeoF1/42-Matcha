import { UserModel } from "../../pages/models/UserModel";

export interface ProfilesModel {
    id : string
    age : number
    image : string
    distance: number
    elo : number
    commonTags: string[]
}