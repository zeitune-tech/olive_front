import { catchError, Observable, of, ReplaySubject, tap, forkJoin, map } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Condition, NumericalCondition, SelectFieldCondition } from "./condition.interface";


@Injectable()
export class ConditionService {

  selectBaseUrl = environment.pricing_url + '/select-field-conditions';
  numericBaseUrl = environment.pricing_url + '/numerical-conditions';

  private _condition: ReplaySubject<Condition> = new ReplaySubject<Condition>(1);
  private _conditionList: ReplaySubject<Condition[]> = new ReplaySubject<Condition[]>(1);

  set condition(value: Condition) {
    this._condition.next(value);
  }

  get condition$() {
    return this._condition.asObservable();
  }

  set conditionList(value: Condition[]) {
    this._conditionList.next(value);
  }

  get conditionList$() {
    return this._conditionList.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {}

  create(condition: Condition): Observable<Condition> {
    const baseUrl = condition.type === 'NUMBER' ? this.numericBaseUrl : this.selectBaseUrl;
    return this._httpClient.post<Condition>(`${baseUrl}`, condition)
      .pipe(
        tap((response: Condition) => {
          this.condition = response;
          return response;
        }),
        catchError(() => of({} as Condition))
      );
  }

  /**
   * Récupère tous les champs depuis les deux endpoints
   * Combine les numerical-conditions et select-field-conditions en une seule liste
   */
  getAll(): Observable<Condition[]> {
    // Faire des requêtes parallèles sur les deux endpoints
    const numericalConditions$ = this._httpClient.get<{content: NumericalCondition[]}>(`${this.numericBaseUrl}`)
      .pipe(
        map(response => response?.content || []),
        catchError(() => of([]))
      );

    const selectFieldConditions$ = this._httpClient.get<{content: SelectFieldCondition[]}>(`${this.selectBaseUrl}`)
      .pipe(
        map(response => response?.content || []),
        catchError(() => of([]))
      );

    return forkJoin({
      numericalConditions: numericalConditions$,
      selectFieldConditions: selectFieldConditions$
    }).pipe(
      map(({ numericalConditions, selectFieldConditions }) => {
        // Mapper les champs numériques
        const mappedNumericConditions = numericalConditions.map(numericalCondition =>
          new Condition({
            ...numericalCondition,
            type: 'NUMBER',
            value: numericalCondition.value,
            field: numericalCondition.numericField,
          })
        );

        // Mapper les champs de sélection
        const mappedSelectFieldConditions = selectFieldConditions.map(selectFieldCondition =>
          new Condition({
            ...selectFieldCondition,
            type: 'SELECT',
            value: selectFieldCondition.value,
            field: selectFieldCondition.selectField
          })
        );

        // Combiner les deux listes
        const allConditions = [...mappedNumericConditions, ...mappedSelectFieldConditions];

        // Mettre à jour le subject
        this.conditionList = allConditions;

        return allConditions;
      }),
      catchError(() => {
        console.error('Erreur lors de la récupération des champs');
        return of([]);
      })
    );
  }

  /**
   * Récupère uniquement les champs numériques
   */
  // getNumericFields(): Observable<Field[]> {
  //   return this._httpClient.get<{content: NumericField[]}>(`${this.numericBaseUrl}`)
  //     .pipe(
  //       map(response => {
  //         const fields = (response?.content || []).map(numericField =>
  //           new Field({
  //             ...numericField,
  //             type: 'NUMBER',
  //             options: null
  //           })
  //         );
  //         return fields;
  //       }),
  //       catchError(() => of([]))
  //     );
  // }

  /**
   * Récupère uniquement les champs de sélection
   */
  // getSelectFields(): Observable<Field[]> {
  //   return this._httpClient.get<{content: SelectField[]}>(`${this.selectBaseUrl}`)
  //     .pipe(
  //       map(response => {
  //         const fields = (response?.content || []).map(selectField =>
  //           new Field({
  //             ...selectField,
  //             type: 'SELECT',
  //             options: selectField.options
  //           })
  //         );
  //         return fields;
  //       }),
  //       catchError(() => of([]))
  //     );
  // }
}
