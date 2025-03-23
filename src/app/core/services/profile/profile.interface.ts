


export class Permission {
    id: string = '';
    name: string = '';
    description: string = '';

    constructor(permissions?: Partial<Permission>) {
        Object.assign(this, permissions);
    }
}

export class Profile {
    id: string = '';
    name: string = '';
    description: string = '';
    permissions: Permission[] = [];

    constructor(profile?: Partial<Profile>) {
        Object.assign(this, profile);
    }
}