import {catchError, Observable, of, ReplaySubject, tap, take} from "rxjs";
import {PricingType} from "./pricing-type.model";
import {environment} from "@env/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class PricingTypeService {
    baseUrl = environment.pricing_url + '/pricing-types';
    private _pricingType: ReplaySubject<PricingType> = new ReplaySubject<PricingType>(1);
    private _pricingTypes: ReplaySubject<PricingType[]> = new ReplaySubject<PricingType[]>(1);

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
    ) {}

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

  delete(id: string): Observable<string> {
    return this._httpClient.delete<string>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        // Utiliser take(1) pour éviter les souscriptions multiples
        this._pricingTypes.pipe(take(1)).subscribe(currentList => {
          if (currentList) {
            // Mettre à jour directement le ReplaySubject sans utiliser le setter
            this._pricingTypes.next(currentList.filter(item => item.id !== id));
          }
        });
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la suppression', error);
        return of('Erreur de suppression');
      })
    );
  }

  // /product/{productId}
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
