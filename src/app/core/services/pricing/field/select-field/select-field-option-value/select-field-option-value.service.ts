import {catchError, map, Observable, of, ReplaySubject, tap} from "rxjs";
import {environment} from "@env/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {
  SelectFieldOptionValue
} from "@core/services/pricing/field/select-field/select-field-option-value/select-field-option-value.model";

@Injectable()
export class SelectFieldOptionValueService {

  private baseUrl = environment.pricing_url + '/select-field-option-values';
  private _selectFieldOptionValue: ReplaySubject<SelectFieldOptionValue> = new ReplaySubject<SelectFieldOptionValue>(1);
  private _selectFieldOptionValues: ReplaySubject<SelectFieldOptionValue[]> = new ReplaySubject<SelectFieldOptionValue[]>(1);

  set selectFieldOptionValue(value: SelectFieldOptionValue) {
    this._selectFieldOptionValue.next(value);
  }

  get selectFieldOptionValue$() {
    return this._selectFieldOptionValue.asObservable();
  }

  set selectFieldOptionValues(value: SelectFieldOptionValue[]) {
    this._selectFieldOptionValues.next(value);
  }

  get selectFieldOptionValues$() {
    return this._selectFieldOptionValues.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  create(selectFieldOptionValue: SelectFieldOptionValue): Observable<SelectFieldOptionValue> {
    return this._httpClient.post<SelectFieldOptionValue>(`${this.baseUrl}`, selectFieldOptionValue)
      .pipe(
        tap((response: SelectFieldOptionValue) => {
          this.selectFieldOptionValue = response;
          return response;
        }),
        catchError(() => of({} as SelectFieldOptionValue))
      );
  }

  getAll(): Observable<SelectFieldOptionValue[]> {
    return this._httpClient.get<SelectFieldOptionValue[]>(`${this.baseUrl}`)
      .pipe(
        tap((response: any) => {
          this.selectFieldOptionValues = response?.content.map((item: SelectFieldOptionValue) => item);
          return response;
        }),
        catchError(() => of([]))
      );
  }

  update(selectFieldOptionValue: SelectFieldOptionValue, uuid: string): Observable<SelectFieldOptionValue> {
    return this._httpClient.put<SelectFieldOptionValue>(`${this.baseUrl}/${uuid}`, selectFieldOptionValue)
      .pipe(
        tap((response: SelectFieldOptionValue) => {
          this.selectFieldOptionValue = response;
          return response;
        }),
        catchError(() => of({} as SelectFieldOptionValue))
      );
  }

  delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => {
          this.selectFieldOptionValues$.pipe(
            map(selectFieldOptionValues => selectFieldOptionValues.filter(selectFieldOptionValue => selectFieldOptionValue.id !== id))
          ).subscribe(updatedSelectFieldOptionValues => this.selectFieldOptionValues = updatedSelectFieldOptionValues);
        }),
        catchError(() => of())
      );
  }

}
