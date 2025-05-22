import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Insured } from './insured.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class InsuredService {

  baseUrl = environment.insured_url + '/insureds';
  private _insured = new ReplaySubject<Insured>(1);
  private _insureds = new ReplaySubject<Insured[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set insured(value: Insured) {
    this._insured.next(value);
  }

  get insured$() {
    return this._insured.asObservable();
  }

  set insureds(value: Insured[]) {
    this._insureds.next(value);
  }

  get insureds$() {
    return this._insureds.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$() {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(insured: Insured): Observable<Insured> {
    return this._httpClient.post<Insured>(`${this.baseUrl}`, insured).pipe(
      tap((res) => this.insured = res),
      catchError(() => of({} as Insured))
    );
  }

  get(id: string): Observable<Insured> {
    return this._httpClient.get<Insured>(`${this.baseUrl}/${id}`).pipe(
      tap((res) => this.insured = res),
      catchError(() => of({} as Insured))
    );
  }

  getAll(): Observable<Insured[]> {
    return this._httpClient.get<Insured[]>(this.baseUrl).pipe(
      tap((response: Insured[]) => {
        this.insureds = response;
        return response;
      }),
      catchError(() => of([] as Insured[]))
    );
  }
}
