import {catchError, map, Observable, of, ReplaySubject, tap} from "rxjs";
import {environment} from "@env/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {VariableCondition} from "./variable-condition.model";

@Injectable()
export class VariableConditionService {

  baseUrl = environment.pricing_url + '/variable-conditions';
  private _variableCondition: ReplaySubject<VariableCondition> = new ReplaySubject<VariableCondition>(1);
  private _variableConditions: ReplaySubject<VariableCondition[]> = new ReplaySubject<VariableCondition[]>(1);

  set variableCondition(value: VariableCondition) {
    this._variableCondition.next(value);
  }

  get variableCondition$() {
    return this._variableCondition.asObservable();
  }

  set variableConditions(value: VariableCondition[]) {
    this._variableConditions.next(value);
  }

  get variableConditions$() {
    return this._variableConditions.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  mapToRequestPayload (variableCondition: VariableCondition) {
    return {
      ...variableCondition,
    };
  }

  create(variableCondition: VariableCondition): Observable<VariableCondition> {
    return this._httpClient.post<VariableCondition>(`${this.baseUrl}`, variableCondition)
      .pipe(
        map((response: VariableCondition) => {
          const content = new VariableCondition(response);
          this.variableCondition = content;
          return content;
        }),
        catchError(() => of({} as VariableCondition))
      );
  }

  getAll(): Observable<VariableCondition[]> {
    return this._httpClient.get<VariableCondition[]>(`${this.baseUrl}`)
      .pipe(
        map((response: any) => {
          const content = response?.content.map((item: VariableCondition) => new VariableCondition(item));
          this.variableConditions = content;
          return content;
        }),
        catchError(() => of([]))
      );
  }

  update(id: string, variableCondition: VariableCondition): Observable<VariableCondition> {
    return this._httpClient.put<VariableCondition>(`${this.baseUrl}/${id}`, variableCondition)
      .pipe(
        map((response: VariableCondition) => {
          const content = new VariableCondition(response);
          this.variableCondition = content;
          return content;
        }),
        catchError(() => of({} as VariableCondition))
      );
  }

  delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => {
          this.variableConditions$
            .pipe(
              map(variableConditions => variableConditions.filter(variableCondition => variableCondition.id !== id))
            ).subscribe(updatedVariableConditions => this.variableConditions = updatedVariableConditions);
        }),
        catchError(() => of())
      );
  }

}
