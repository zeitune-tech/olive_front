import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Profile, Permission } from "./profile.interface";


@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    baseUrl = environment.base_url;
    private _profile: ReplaySubject<Profile> = new ReplaySubject<Profile>(1);
    private _profiles: ReplaySubject<Profile[]> = new ReplaySubject<Profile[]>(1);

    private _permissions: ReplaySubject<Permission[]> = new ReplaySubject<Permission[]>(1);

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

    constructor(
        private _httpClient: HttpClient
    ) { }

}