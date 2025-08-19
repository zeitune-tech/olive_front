import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { VehicleUsage } from "./usage.model";

@Injectable()
export class VehicleUsageService {

  baseUrl = environment.settings_url + '/vehicle-usages';
  private _vehicleUsage: ReplaySubject<VehicleUsage> = new ReplaySubject<VehicleUsage>(1);
  private _vehicleUsages: ReplaySubject<VehicleUsage[]> = new ReplaySubject<VehicleUsage[]>(1);

  set vehicleUsage(value: VehicleUsage) {
    this._vehicleUsage.next(value);
  }

  get vehicleUsage$() {
    return this._vehicleUsage.asObservable();
  }

  set vehicleUsages(value: VehicleUsage[]) {
    this._vehicleUsages.next(value);
  }

  get vehicleUsages$() {
    return this._vehicleUsages.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {}

  create(vehicleUsage: VehicleUsage): Observable<VehicleUsage> {
    return this._httpClient.post<VehicleUsage>(`${this.baseUrl}`, vehicleUsage)
      .pipe(
        tap((response: VehicleUsage) => {
          this.vehicleUsage = response;
          return response;
        }),
        catchError(() => of({} as VehicleUsage))
      );
  }

  getAll(): Observable<VehicleUsage[]> {
    return this._httpClient.get<VehicleUsage[]>(`${this.baseUrl}`)
      .pipe(
        tap((response: any) => {
          this.vehicleUsages = response?.content.map((item: VehicleUsage) => item);
          return response;
        }),
        catchError(() => of([]))
      );
  }

  update(vehicleUsage: VehicleUsage, uuid:string): Observable<VehicleUsage> {
    return this._httpClient.put<VehicleUsage>(`${this.baseUrl}/${uuid}`, vehicleUsage)
      .pipe(
        tap((response: VehicleUsage) => {
          this.vehicleUsage = response;
          return response;
        }),
        catchError(() => of({} as VehicleUsage))
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
