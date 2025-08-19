import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {VehicleCategory} from "@core/services/settings/vehicle/category/category.model";

@Injectable()
export class VehicleCategoryService {

  baseUrl = environment.settings_url + '/vehicle-categories';
  private _vehicleCategory: ReplaySubject<VehicleCategory> = new ReplaySubject<VehicleCategory>(1);
  private _vehicleCategories: ReplaySubject<VehicleCategory[]> = new ReplaySubject<VehicleCategory[]>(1);

  set vehicleCategory(value: VehicleCategory) {
    this._vehicleCategory.next(value);
  }

  get vehicleCategory$() {
    return this._vehicleCategory.asObservable();
  }

  set vehicleCategories(value: VehicleCategory[]) {
    this._vehicleCategories.next(value);
  }

  get vehicleCategories$() {
    return this._vehicleCategories.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {}

  create(vehicleCategory: VehicleCategory): Observable<VehicleCategory> {
    return this._httpClient.post<VehicleCategory>(`${this.baseUrl}`, vehicleCategory)
      .pipe(
        tap((response: VehicleCategory) => {
          this.vehicleCategory = response;
          return response;
        }),
        catchError(() => of({} as VehicleCategory))
      );
  }

  getAll(): Observable<VehicleCategory[]> {
    return this._httpClient.get<VehicleCategory[]>(`${this.baseUrl}`)
      .pipe(
        tap((response: any) => {
          this.vehicleCategories = response?.content.map((item: VehicleCategory) => item);
          return response;
        }),
        catchError(() => of([]))
      );
  }

  update(vehicleCategory: VehicleCategory, uuid:string): Observable<VehicleCategory> {
    return this._httpClient.put<VehicleCategory>(`${this.baseUrl}/${uuid}`, vehicleCategory)
      .pipe(
        tap((response: VehicleCategory) => {
          this.vehicleCategory = response;
          return response;
        }),
        catchError(() => of({} as VehicleCategory))
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
