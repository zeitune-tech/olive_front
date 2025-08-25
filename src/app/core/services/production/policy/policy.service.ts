import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { BehaviorSubject, Observable, ReplaySubject, catchError, of, tap } from "rxjs";
import { PoliceCreateRequest, PoliceResponse } from "./policy.interface";

@Injectable({ providedIn: 'root' })
export class PolicyService {
  // Reuse the app gateway base; endpoints are under `/app/policies` according to the spec
  private baseUrl = environment.insured_url + '/policies';

  private _current = new ReplaySubject<PoliceResponse | null>(1);
  private _list = new BehaviorSubject<PoliceResponse[] | null>(null);

  constructor(private http: HttpClient) {}

  // Observables
  get current$() { return this._current.asObservable(); }
  get list$() { return this._list.asObservable(); }

  // State setters
  set current(value: PoliceResponse | null) { this._current.next(value); }
  set list(value: PoliceResponse[] | null) { this._list.next(value ?? []); }

  // CRUD
  create(payload: PoliceCreateRequest): Observable<PoliceResponse> {
    return this.http.post<PoliceResponse>(`${this.baseUrl}`, payload).pipe(
      tap((res) => { this.current = res; }),
      catchError((err) => { throw err; })
    );
  }

  getOne(uuid: string): Observable<PoliceResponse> {
    return this.http.get<PoliceResponse>(`${this.baseUrl}/${uuid}`).pipe(
      tap((res) => { this.current = res; }),
      catchError(() => of({} as PoliceResponse))
    );
  }

  getAll(): Observable<PoliceResponse[]> {
    return this.http.get<PoliceResponse[]>(`${this.baseUrl}`).pipe(
      tap((res) => { this.list = res; }),
      catchError(() => of([] as PoliceResponse[]))
    );
  }

  update(uuid: string, payload: Partial<PoliceCreateRequest>): Observable<PoliceResponse> {
    return this.http.put<PoliceResponse>(`${this.baseUrl}/${uuid}`, payload).pipe(
      tap((res) => { this.current = res; }),
      catchError((err) => { throw err; })
    );
  }

  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`).pipe(
      tap(() => { this.current = null; }),
      catchError((err) => { throw err; })
    );
  }

  // Refetch helpers
  refreshCurrent(uuid: string): Observable<PoliceResponse> {
    return this.getOne(uuid);
  }

  refreshList(): Observable<PoliceResponse[]> {
    return this.getAll();
  }
}

