import {catchError, Observable, of, ReplaySubject, tap, forkJoin, map} from "rxjs";
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {NumericField} from "@core/services/pricing/field/numeric-field/numeric-field.model";


@Injectable()
export class NumericFieldService {
  private baseUrl = environment.pricing_url + '/numeric-fields';
  private _numericField: ReplaySubject<NumericField> = new ReplaySubject<NumericField>(1);
  private _numericFields: ReplaySubject<NumericField[]> = new ReplaySubject<NumericField[]>(1);

  set numericField(value: NumericField) {
    this._numericField.next(value);
  }

  get numericField$() {
    return this._numericField.asObservable();
  }

  set numericFields(value: NumericField[]) {
    this._numericFields.next(value);
  }

  get numericFields$() {
    return this._numericFields.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  create(numericField: NumericField): Observable<NumericField> {
    return this._httpClient.post<NumericField>(`${this.baseUrl}`, numericField)
      .pipe(
        tap((response: NumericField) => {
          this.numericField = new NumericField(response);
          return new NumericField(response);
        }),
        catchError(() => of({} as NumericField))
      );
  }

  /**
   * Récupère uniquement les champs de sélection
   */
  getAll(): Observable<NumericField[]> {
    return this._httpClient.get<{ content: NumericField[] }>(`${this.baseUrl}`, {})
      .pipe(
        map((response) => {
          const content = response.content.map((item: NumericField) => new NumericField(item));
          this.numericFields = content;
          return content;
        }),
        catchError(() => of([] as NumericField[]))
      );
  }

  update(numericField: NumericField, uuid: string): Observable<NumericField> {
    return this._httpClient.put<NumericField>(`${this.baseUrl}/${uuid}`, numericField)
      .pipe(
        tap((response: NumericField) => {
          this.numericField = new NumericField(response);
          return new NumericField(response);
        }),
        catchError(() => of({} as NumericField))
      );
  }

  delete(numericField: NumericField, id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => {
          // Mettre à jour le subject après la suppression
          this.numericFields$.pipe(
            map(numericFields => numericFields.filter(numericField => numericField.id !== id))
          ).subscribe(updatedNumericFields => this.numericFields = updatedNumericFields);
        }),
        catchError(() => of())
      );
  }

}
