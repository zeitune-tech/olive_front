import { Injectable } from "@angular/core";
import { UserService } from "../services/auth/user/user.service";
import { map, Observable, of} from "rxjs";
import { User } from "../services/auth/user/user.interface";


@Injectable({
    providedIn: 'root'
})
export class PermissionsService {

    private _permissions: string[] = [];
    private _profile: string[] = [];

    constructor(
        private _userService: UserService,
    ) {
        this._userService.user$.subscribe(user => {
            if (user) {
                this.getUserPermissions(user);
            }
        })
    }
   

    public hasPermission (requiredPermission: string): boolean {
        // Check if the user has the required role
        const hasRole = this._permissions.includes(requiredPermission);
        return hasRole;
    }


    public checkDirectly(permission: string): boolean {
        // Check if the user has the required role
        const hasRole = this._permissions.includes(permission);
        return hasRole;
    }
    /**
     * Check permissions
     * 
     * @param permission - The permission to check
     * @param userIds - The user IDs to check
     * @returns Observable<boolean>
     */
    check(permission: string): Observable<boolean> {
       return of(this._permissions.includes(permission));
    }

    checkMany(permissions: string[]): Observable<boolean> {
        return of(permissions.every(permission => this._permissions.includes(permission)));
    }

    getUserPermissions(user: User) {
        this._permissions = [];
        // Check if the user has profiles and permissions
        if (user && user.profiles && user.profiles) {
            user.profiles.forEach((profile: any) => {
                if (profile.permissions) {
                    this._permissions = this._permissions.concat(profile.permissions.map((permission: any) => {
                        return permission.name;
                    }));
                    this._permissions = [...new Set(this._permissions)];
                }
            });
        } else {
            this._permissions = [];
        }
        return this._permissions;
    }
}