


export class Permission {
    id: string = '';
    name: string = '';
    description: string = '';
    module: string = '';
    level: string = '';
    type: string = '';

    constructor(permissions?: Partial<Permission>) {
        Object.assign(this, permissions);
    }
}

export class Profile {
    id: string = '';
    name: string = '';
    description: string = '';
    permissions: Permission[] = [];
    level: string = '';
    
    constructor(profile?: Partial<Profile>) {
        Object.assign(this, profile);
    }
}