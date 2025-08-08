import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, ReplaySubject, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Contributor, ContributorType } from "./contributor.interface";
import { environment } from "@env/environment";
import { RequestMetadata } from "../../common.interface";
import { User } from "@core/services/auth/user/user.interface";

@Injectable({
    providedIn: 'root'
})
export class ContributorService {

    private baseUrl = environment.administration_url + '/contributors';
    private userUrl = environment.auth_url + '/app/contributors';

    private _contributor: ReplaySubject<Contributor> = new ReplaySubject<Contributor>(1);
    private _contributors: ReplaySubject<Contributor[]> = new ReplaySubject<Contributor[]>(1);
    private _metadata: ReplaySubject<RequestMetadata> = new ReplaySubject<RequestMetadata>(1);


    private _contributorTypes: ReplaySubject<ContributorType[]> = new ReplaySubject<ContributorType[]>(1);

    get contributorTypes$() {
        return this._contributorTypes.asObservable();
    }

    set contributorTypes(value: ContributorType[]) {
        this._contributorTypes.next(value);
    }

    set contributor(value: Contributor) {
        this._contributor.next(value);
    }

    get contributor$() {
        return this._contributor.asObservable();
    }

    set contributors(value: Contributor[]) {
        this._contributors.next(value);
    }

    get contributors$() {
        return this._contributors.asObservable();
    }

    get metadata$() {
        return this._metadata.asObservable();
    }

    set metadata(value: RequestMetadata) {
        this._metadata.next(value);
    }

    constructor(private _httpClient: HttpClient) {}

    create(contributor: any): Observable<Contributor> {
        return this._httpClient.post<Contributor>(`${this.baseUrl}`, contributor).pipe(
            tap((created) => this.contributor = created),
            catchError(error => of(error.error))
        );
    }

    createContributorType(type: any): Observable<ContributorType> {
        return this._httpClient.post<ContributorType>(`${this.baseUrl}/types`, type).pipe(
            tap((createdType) => {
                this.contributorTypes = [...this.contributorTypes, createdType];
            }),
            catchError(() => of({} as ContributorType))
        );
    }

    get(id: string): Observable<Contributor> {
        return this._httpClient.get<Contributor>(`${this.baseUrl}/${id}`).pipe(
            tap((data) => this.contributor = data),
            catchError(() => of({} as Contributor))
        );
    }

    getAccount(id: string): Observable<User> {
        return this._httpClient.get<User>(`${this.userUrl}/${id}`).pipe(
            tap((data) => data),
            catchError(() => of({} as User))
        );
    }

    updateAccount(user: User): Observable<User> {
        return this._httpClient.put<User>(`${this.userUrl}/${user.id}`, user).pipe(
            tap((updatedUser) => updatedUser),
            catchError(() => of({} as User))
        );
    }

    getContributorTypes(): Observable<ContributorType[]> {
        return this._httpClient.get<ContributorType[]>(`${this.baseUrl}/types`).pipe(
            tap((response: ContributorType[]) => {
                this.contributorTypes = response;
            }),
            catchError(() => of([] as ContributorType[]))
        );
    }

    getAll(): Observable<Contributor[]> {
        return this._httpClient.get<Contributor[]>(`${this.baseUrl}`).pipe(
            tap((response: Contributor[]) => {
                this.contributors = response;
            }),
            catchError(() => of([] as Contributor[]))
        );
    }



    // update(contributor: Contributor): Observable<Contributor> {
    //     return this._httpClient.put<Contributor>(`${this.baseUrl}/${contributor.id}`, contributor).pipe(
    //         tap((updated) => updated),
    //         catchError(() => of({} as Contributor))
    //     );
    // }

    update(id: string, contributor: Contributor): Observable<Contributor> {
        return this._httpClient.put<Contributor>(`${this.baseUrl}/${id}`, contributor).pipe(
            tap((updated) => updated),
            catchError(() => of({} as Contributor))
        );
    }

    updateContributorType(id: string, type: ContributorType): Observable<ContributorType> {
        return this._httpClient.put<ContributorType>(`${this.baseUrl}/types/${id}`, type).pipe(
            tap((updatedType) => {
                const currentTypes = this.contributorTypes;
                const index = currentTypes.findIndex(t => t.id === id);
                if (index !== -1) {
                    currentTypes[index] = updatedType;
                    this.contributorTypes = [...currentTypes];
                }
            }),
            catchError(() => of({} as ContributorType))
        );
    }

}
