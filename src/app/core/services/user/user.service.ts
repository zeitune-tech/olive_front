import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, ReplaySubject, tap } from 'rxjs';
import { User } from './user.interface';
import { environment } from '@env/environment';

@Injectable()
export class UserService{

    baseUrl = environment.base_url + '/users';

    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _hasEntity: boolean = false;

    private _users: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
    private _metadata: ReplaySubject<any> = new ReplaySubject<any>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    set users(value: User[]) {
        this._users.next(value);
    }

    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }

    set metadata(value: any) {
        this._metadata.next(value);
    }

    get metadata$(): Observable<any> {
        return this._metadata.asObservable();
    }

    hasEntity(): Observable<boolean> {
        return of(this._hasEntity)
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        // First try to get from the subject
      
        return this._httpClient.get<User>(`${environment.base_url}/users/me`).pipe(
            tap((user) => {
                this.user = user;
                if (user.managementEntity)
                    this._hasEntity = true;
            }),
            catchError(() => of({} as User))
        );
    }

    getAll(): Observable<User[]> {
        return this._httpClient.get<User[]>(`${this.baseUrl}`)
            .pipe(
                tap((response: any) => {
                    this.users = response.content?.map((user: User) => {
                        return user;
                    });
                    this.metadata = response;
                    return response;
                }),
                catchError(() => of([] as User[]))
            );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.put<User>(`${environment.base_url}/users/update`, {user}).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }
}
