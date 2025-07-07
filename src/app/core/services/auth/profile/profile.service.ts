import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Profile, Permission } from "./profile.interface";


@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    baseUrl = environment.auth_url + '/app/profiles';
    private _profile: ReplaySubject<Profile> = new ReplaySubject<Profile>(1);
    private _profiles: ReplaySubject<Profile[]> = new ReplaySubject<Profile[]>(1);

    private _permissions: ReplaySubject<Permission[]> = new ReplaySubject<Permission[]>(1);

    private _metadata: ReplaySubject<any> = new ReplaySubject<any>(1);

    set profile(value: Profile) {
        this._profile.next(value);
    }

    get profile$() {
        return this._profile.asObservable();
    }

    set profiles(value: Profile[]) {
        this._profiles.next(value);
    }

    get profiles$() {
        return this._profiles.asObservable();
    }

    set permissions(value: Permission[]) {
        this._permissions.next(value);
    }

    get permissions$() {
        return this._permissions.asObservable();
    }

    set metadata(value: any) {
        this._metadata.next(value);
    }

    get metadata$() {
        return this._metadata.asObservable();
    }

    constructor(
        private _httpClient: HttpClient
    ) { }


    create(profile: any): Observable<Profile> {
        return this._httpClient.post<Profile>(`${this.baseUrl}`, 
            {
                name: profile.name,
                description: profile.description,
                level: profile.level,
                permissions: profile.permissions.map((permission: Permission) => permission.id)
            }
        )
            .pipe(
                tap((profile) => {
                    this.profile = profile;
                    return (profile);
                }),
                catchError((error) => {
                    throw error
                })
            );
    }

    update(profile: any): Observable<Profile> {
        return this._httpClient.put<Profile>(`${this.baseUrl}/${profile.id}`, profile)
            .pipe(
                tap((profile) => {
                    this.profile = profile;
                    return (profile);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    get(): Observable<Profile> {
        return this._httpClient.get<Profile>(`${this.baseUrl}/me`)
            .pipe(
                tap((profile) => {
                    this.profile = profile;
                    return profile;
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    getAll(): Observable<Profile[]> {
        return this._httpClient.get<Profile[]>(`${this.baseUrl}`)
            .pipe(
                tap((response: Profile[]) => {
                    this.profiles = response.map((profile: Profile) => {
                        return profile;
                    });
                }),
                catchError(() => of([] as Profile[]))
            );
    }

    getAllPermissions(): Observable<Permission[]>  {
        return this._httpClient.get<Permission[]>(`${this.baseUrl}/permissions`)
            .pipe(
                tap((permissions) => {
                    this.permissions = permissions;
                    return permissions;
                }),
                catchError(() => of([] as Permission[]))
            );
    }
}