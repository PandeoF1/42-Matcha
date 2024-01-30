import { UserModel } from "../../pages/models/UserModel";

export interface ProfilesModel extends Omit<UserModel, "email" | "completion" | "geoloc" | "username" | "lastName"> {
    distance: number
    elo : number
}