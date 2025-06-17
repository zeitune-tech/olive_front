import { Injectable } from "@angular/core";
import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Branch } from "./branch.interface";


@Injectable({
    providedIn: "root"
})
export class BranchService {

    baseUrl = environment.settings_url + "/branches";
    private _branch: ReplaySubject<Branch> = new ReplaySubject<Branch>(1);
    private _branches: ReplaySubject<Branch[]> = new ReplaySubject<Branch[]>(1);

    private _metadata: ReplaySubject<any> = new ReplaySubject<any>(1);

    set branch(value: Branch) {
        this._branch.next(value);
    }

    get branch$() {
        return this._branch.asObservable();
    }

    set branches(value: Branch[]) {
        this._branches.next(value);
    }

    get branches$() {
        return this._branches.asObservable();
    }

    set metadata(value: any) {
        this._metadata.next(value);
    }

    get metadata$() {
        return this._metadata.asObservable();
    }
            
    constructor(
        private _httpClient: HttpClient
    ) {
    }

    create(branch: Branch): Observable<Branch> {
        return this._httpClient.post<Branch>(`${this.baseUrl}`, branch)
            .pipe(
                tap((branch) => {
                    this.branch = branch;
                    return (branch);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    update(branch: Branch): Observable<Branch> {
        return this._httpClient.put<Branch>(`${this.baseUrl}/${branch.id}`, branch)
            .pipe(
                tap((branch) => {
                    this.branch = branch;
                    return (branch);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    delete(id: number): Observable<any> {
        return this._httpClient.delete(`${this.baseUrl}/${id}`)
            .pipe(
                tap(() => {
                    return (id);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    get(id: string): Observable<Branch> {
        return this._httpClient.get<Branch>(`${this.baseUrl}/${id}`)
            .pipe(
                tap((branch) => {
                    this.branch = branch;
                    return (branch);
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }

    getAll(): Observable<Branch[]> {
        return this._httpClient.get<Branch[]>(`${this.baseUrl}`)
            .pipe(
                tap((response: any) => {
                    this.branches = response;
                    return response;
                }),
                catchError((error) => {
                    return of(error);
                })
            );
    }
}