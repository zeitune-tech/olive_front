import {
  catchError,
  Observable,
  of,
  BehaviorSubject,
  tap,
  map,
  forkJoin,
  switchMap,
  take,
} from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SelectField } from "./select-field.model";
import {
  SelectFieldOptionsService,
} from "@core/services/pricing/field/select-field/select-field-options/select-field-options.service";
import {
  SelectFieldOptionValueService,
} from "@core/services/pricing/field/select-field/select-field-option-value/select-field-option-value.service";

@Injectable()
export class SelectFieldService {
  baseUrl = environment.pricing_url + "/select-fields";

  // ✅ BehaviorSubject avec valeurs par défaut pour éviter undefined
  private _selectField = new BehaviorSubject<SelectField | null>(null);
  private _selectFields = new BehaviorSubject<SelectField[]>([]);

  set selectField(value: SelectField) {
    this._selectField.next(value);
  }

  get selectField$(): Observable<SelectField | null> {
    return this._selectField.asObservable();
  }

  set selectFields(value: SelectField[]) {
    this._selectFields.next(value);
  }

  get selectFields$(): Observable<SelectField[]> {
    return this._selectFields.asObservable();
  }

  constructor(
    private _httpClient: HttpClient,
    private _selectFieldOptionsService: SelectFieldOptionsService,
    private _selectFieldOptionValueService: SelectFieldOptionValueService
  ) {}

  create(selectField: any): Observable<SelectField> {
    return forkJoin(
      selectField.options.possibilities.map((option: any) =>
        this._selectFieldOptionValueService.create(option)
      )
    ).pipe(
      switchMap((createdSelectFieldOptionValue) => {
        // Assigner les valeurs créées aux possibilités
        selectField.options.possibilities = createdSelectFieldOptionValue;
        // Ensuite créer le SelectFieldOptions
        return this._selectFieldOptionsService.create(selectField.options);
      }),
      switchMap((createdOptions) => {
        // Assigner les options créées au champ de sélection
        selectField.options = createdOptions.id;
        // Enfin créer le SelectField
        return this._httpClient.post<SelectField>(`${this.baseUrl}`, selectField);
      }),
      tap((response: SelectField) => {
        this.selectField = response;
      }),
      catchError(() => of({} as SelectField))
    );
  }

  getAll(): Observable<SelectField[]> {
    return this._httpClient
      .get<{ content: SelectField[] }>(`${this.baseUrl}`, {})
      .pipe(
        map((response: any) => {
          const content = response.content.map(
            (item: SelectField) => new SelectField(item)
          );
          this._selectFields.next(content);
          return content;
        }),
        catchError(() => of([] as SelectField[]))
      );
  }

  update(selectField: SelectField, uuid: string): Observable<SelectField> {
    return this._httpClient
      .put<SelectField>(`${this.baseUrl}/${uuid}`, selectField)
      .pipe(
        tap((response: SelectField) => {
          this.selectField = response;
          return response;
        }),
        catchError(() => of({} as SelectField))
      );
  }

  delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.selectFields$
          .pipe(
            take(1),
            map((selectFields) =>
              selectFields.filter((selectField) => selectField.id !== id)
            )
          )
          .subscribe((updatedSelectFields) => {
            this.selectFields = updatedSelectFields;
          });
      }),
      catchError(() => of())
    );
  }
}
