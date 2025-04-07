import { ManagementEntity } from "../../administration/management-entity/management-entity.interface";
import { Profile } from "../profile/profile.interface";

export class User {

    id: string;
    avatar?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    entityAccessLevel: string;
    managementEntity: string;
    profiles: Profile[];

    constructor(user: any) {
        this.id = user?.id || '';
        this.avatar = user?.avatar || '';
        this.firstName = user?.firstName || '';
        this.lastName = user?.lastnNme || '';
        this.email = user?.email || '';
        this.password = user?.password || '';
        this.entityAccessLevel = user?.entityAccessLevel || '';
        this.profiles = user?.profiles || [];
        this.managementEntity = user?.managementEntity || null;
    }
}