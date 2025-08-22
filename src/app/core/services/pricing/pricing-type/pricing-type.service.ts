import {catchError, Observable, of, ReplaySubject, tap, take, map} from "rxjs";
import {PricingType} from "./pricing-type.model";
import {environment} from "@env/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {PricingTypeDetailed} from "@core/services/pricing/pricing-type/pricing-type-detailed.model";
import {Constant} from "@core/services/pricing/constant/constant.model";

@Injectable()
export class PricingTypeService {
  baseUrl = environment.pricing_url + '/pricing-types';
  private _pricingType: ReplaySubject<PricingType> = new ReplaySubject<PricingType>(1);
  private _pricingTypeDetailed: ReplaySubject<PricingTypeDetailed> = new ReplaySubject<PricingTypeDetailed>(1);
  private _pricingTypes: ReplaySubject<PricingType[]> = new ReplaySubject<PricingType[]>(1);

  set pricingTypeDetailed(value: PricingTypeDetailed) {
    this._pricingTypeDetailed.next(value);
  }

  get pricingTypeDetailed$() {
    return this._pricingTypeDetailed.asObservable();
  }

  set pricingType(value: PricingType) {
    this._pricingType.next(value);
  }

  get pricingType$() {
    return this._pricingType.asObservable();
  }

  set pricingTypes(value: PricingType[]) {
    this._pricingTypes.next(value);
  }

  get pricingTypes$() {
    return this._pricingTypes.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {
  }

  create(pricingType: PricingType): Observable<PricingType> {
    return this._httpClient.post<PricingType>(`${this.baseUrl}`, pricingType)
      .pipe(
        tap((response: PricingType) => {
          this.pricingType = response;
          return response;
        }),
        catchError(() => of({} as PricingType))
      );
  }

  getDetailedById(id: string): Observable<PricingTypeDetailed> {
    return this._httpClient.get<PricingTypeDetailed>(`${this.baseUrl}/${id}?withDetailed=true`, {})
      .pipe(
        tap((response: PricingTypeDetailed) => {
          this.pricingTypeDetailed = new PricingTypeDetailed(response);
          return this.pricingTypeDetailed;
        }),
        catchError(() => of({} as PricingTypeDetailed))
      );
  }

  getAll(): Observable<PricingType[]> {
    return this._httpClient.get<PricingType[]>(`${this.baseUrl}`)
      .pipe(
        tap((response: any) => {
          this.pricingTypes = response?.content.map((item: PricingType) => item);
          return response;
        }),
        catchError(() => of([]))
      );
  }

  update(pricingType: PricingType, uuid: string): Observable<PricingType> {
    return this._httpClient.put<PricingType>(`${this.baseUrl}/${uuid}`, pricingType)
      .pipe(
        tap((response: PricingType) => {
          this.pricingType = response;
          return response;
        }),
        catchError(() => of({} as PricingType))
      );
  }

  delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => {
          this.pricingTypes$.pipe(
            map(pricingTypes => pricingTypes.filter(pricingType => pricingType.id !== id))
          ).subscribe(updatedPricingTypes => this.pricingTypes = updatedPricingTypes);
        }),
        catchError(() => of())
      );
  }

  getByProduct(id: string) {
    return this._httpClient.get<PricingType[]>(`${this.baseUrl}/product/${id}`)
      .pipe(
        tap((response: any) => {
          this.pricingTypes = response?.map((item: PricingType) => item);
          return response;
        }),
        catchError(() => of([]))
      );
  }
}
