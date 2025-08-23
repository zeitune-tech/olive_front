import {catchError, map, Observable, of, ReplaySubject, tap} from "rxjs";
import {Formula} from "./formula.interface";
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {VariableCondition} from "@core/services/pricing/variable-condition/variable-condition.model";

@Injectable()
export class FormulaService {

  baseUrl = environment.pricing_url + '/formulas';
  private _formula: ReplaySubject<Formula> = new ReplaySubject<Formula>(1);
  private _formulas: ReplaySubject<Formula[]> = new ReplaySubject<Formula[]>(1);

  set formula(value: Formula) {
    this._formula.next(value);
  }

  get formula$() {
    return this._formula.asObservable();
  }

  set formulas(value: Formula[]) {
    this._formulas.next(value);
  }

  get formulas$() {
    return this._formulas.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  mapToRequestPayload (formula: Formula) {
    return {
      ...formula,
      variables: formula.variables.map(variable => variable.id),
    };
  }

  create(formula: Formula): Observable<Formula> {
    return this._httpClient.post<Formula>(`${this.baseUrl}`, this.mapToRequestPayload(formula))
      .pipe(
        map((response: Formula) => {
          const content = new Formula(response);
          this._formula.next(content);
          return content;
        }),
        catchError(() => of({} as Formula))
      );
  }

  getAll(): Observable<Formula[]> {
    return this._httpClient.get<Formula[]>(`${this.baseUrl}`)
      .pipe(
        map((response: any) => {
          const content = response?.content.map((item: Formula) => new Formula(item));
          this.formulas = content;
          return content;
        }),
        catchError(() => of([]))
      );
  }

  update(formula: Formula, uuid: string): Observable<Formula> {
    return this._httpClient.put<Formula>(`${this.baseUrl}/${uuid}`, formula)
      .pipe(
        tap((response: Formula) => {
          this.formula = response;
          return response;
        }),
        catchError(() => of({} as Formula))
      );
  }

  delete(uuid: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/${uuid}`)
      .pipe(
        tap(() => {
          this.formula = {} as Formula; // Reset the current formula
          return;
        }),
        catchError(() => of())
      );
  }

}
