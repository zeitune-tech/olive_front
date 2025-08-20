import {catchError, Observable, of, ReplaySubject, tap, forkJoin, map} from "rxjs";
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {SelectField} from "./select-field.model";


@Injectable()
export class SelectSelectFieldService {

  baseUrl = environment.pricing_url + '/select-selectFields';

  private _selectField: ReplaySubject<SelectField> = new ReplaySubject<SelectField>(1);
  private _selectFields: ReplaySubject<SelectField[]> = new ReplaySubject<SelectField[]>(1);

  set selectField(value: SelectField) {
    this._selectField.next(value);
  }

  get selectField$() {
    return this._selectField.asObservable();
  }

  set selectFields(value: SelectField[]) {
    this._selectFields.next(value);
  }

  get selectFields$() {
    return this._selectFields.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  create(selectField: SelectField): Observable<SelectField> {
    return this._httpClient.post<SelectField>(`${this.baseUrl}`, selectField)
      .pipe(
        tap((response: SelectField) => {
          this.selectField = response;
          return response;
        }),
        catchError(() => of({} as SelectField))
      );
  }

  /**
   * Récupère uniquement les champs de sélection
   */
  getSelectSelectFields(): Observable<SelectField[]> {
    return this._httpClient.get<{ content: SelectField[] }>(`${this.baseUrl}`, {})
      .pipe(
        tap((response : any) => {
          this.selectFields = response.content.map((item: SelectField) => {
            return item;
          });
          return response;
        }),
        catchError(() => of([] as SelectField[]))
      );
  }

  //delete
  delete(selectField: SelectField, id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => {
          // Mettre à jour le subject après la suppression
          this.selectFields$.pipe(
            map(selectFields => selectFields.filter(selectField => selectField.id !== id))
          ).subscribe(updatedSelectFields => this.selectFields = updatedSelectFields);
        }),
        catchError(() => of())
      );
  }

}
