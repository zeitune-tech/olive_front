import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {VehicleBrand} from "@core/services/settings/vehicle/referential/brand/vehicle-brand.model";

@Injectable()
export class VehicleBrandService {

  baseUrl = environment.settings_url + '/vehicle-referential';
  private _vehicleBrand: ReplaySubject<VehicleBrand> = new ReplaySubject<VehicleBrand>(1);
  private _vehicleBrands: ReplaySubject<VehicleBrand[]> = new ReplaySubject<VehicleBrand[]>(1);

  set vehicleBrand(value: VehicleBrand) {
    this._vehicleBrand.next(value);
  }

  get vehicleBrand$() {
    return this._vehicleBrand.asObservable();
  }

  set vehicleBrands(value: VehicleBrand[]) {
    this._vehicleBrands.next(value);
  }

  get vehicleBrands$() {
    return this._vehicleBrands.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {}

  create(vehicleBrand: VehicleBrand): Observable<VehicleBrand> {
    return this._httpClient.post<VehicleBrand>(`${this.baseUrl}`, vehicleBrand)
      .pipe(
        tap((response: VehicleBrand) => {
          this.vehicleBrand = response;
          return response;
        }),
        catchError(() => of({} as VehicleBrand))
      );
  }

  getAll(): Observable<VehicleBrand[]> {
    return this._httpClient.get<VehicleBrand[]>(`${this.baseUrl}`)
      .pipe(
        tap((response: any) => {
          this.vehicleBrands = response?.content.map((item: VehicleBrand) => item);
          return response;
        }),
        catchError(() => of([]))
      );
  }

  update(vehicleBrand: VehicleBrand, uuid:string): Observable<VehicleBrand> {
    return this._httpClient.put<VehicleBrand>(`${this.baseUrl}/${uuid}`, vehicleBrand)
      .pipe(
        tap((response: VehicleBrand) => {
          this.vehicleBrand = response;
          return response;
        }),
        catchError(() => of({} as VehicleBrand))
      );
  }

  delete(id: string): Observable<String> {
    return this._httpClient.delete<String>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          error.message
        )
      );
  }

}
