import {catchError, map, Observable, of, ReplaySubject, tap} from "rxjs";
import {environment} from "@env/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {
  SelectFieldOptions
} from "@core/services/pricing/field/select-field/select-field-options/select-field-options.model";

@Injectable()
export class SelectFieldOptionsService {

  private baseUrl = environment.pricing_url + '/select-field-options';
  private _selectFieldOptions: ReplaySubject<SelectFieldOptions> = new ReplaySubject<SelectFieldOptions>(1);
  private _selectFieldOptionsList: ReplaySubject<SelectFieldOptions[]> = new ReplaySubject<SelectFieldOptions[]>(1);

  set selectFieldOptions(value: SelectFieldOptions) {
    this._selectFieldOptions.next(value);
  }

  get selectFieldOptions$() {
    return this._selectFieldOptions.asObservable();
  }

  set selectFieldOptionsList(value: SelectFieldOptions[]) {
    this._selectFieldOptionsList.next(value);
  }

  get selectFieldOptionsList$() {
    return this._selectFieldOptionsList.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  create(selectFieldOptions: any): Observable<SelectFieldOptions> {
    selectFieldOptions.possibilities = selectFieldOptions.possibilities.map((item:any) => item.id)
    return this._httpClient.post<SelectFieldOptions>(`${this.baseUrl}`, selectFieldOptions)
      .pipe(
        tap((response: SelectFieldOptions) => {
          this.selectFieldOptions = response;
          return response;
        }),
        catchError(() => of({} as SelectFieldOptions))
      );
  }

  getAll(): Observable<SelectFieldOptions[]> {
    return this._httpClient.get<SelectFieldOptions[]>(`${this.baseUrl}`)
      .pipe(
        tap((response: any) => {
          this.selectFieldOptionsList = response?.content.map((item: SelectFieldOptions) => item);
          return response;
        }),
        catchError(() => of([]))
      );
  }

  update(selectFieldOptions: SelectFieldOptions, uuid: string): Observable<SelectFieldOptions> {
    return this._httpClient.put<SelectFieldOptions>(`${this.baseUrl}/${uuid}`, selectFieldOptions)
      .pipe(
        tap((response: SelectFieldOptions) => {
          this.selectFieldOptions = response;
          return response;
        }),
        catchError(() => of({} as SelectFieldOptions))
      );
  }

  delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => {
          this.selectFieldOptionsList$.pipe(
            map(selectFieldOptionsList => selectFieldOptionsList.filter(selectFieldOptions => selectFieldOptions.id !== id))
          ).subscribe(updatedSelectFieldOptionsList => this.selectFieldOptionsList = updatedSelectFieldOptionsList);
        }),
        catchError(() => of())
      );
  }

}
