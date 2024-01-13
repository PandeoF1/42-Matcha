import { UserModel } from "../../pages/models/UserModel";

export interface ProfileModel extends Omit<UserModel, "email" | "completion"> { }