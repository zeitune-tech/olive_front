import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {VehicleDTTReferential} from "@core/services/settings/vehicle/referential/dtt/vehicle-dtt-referential.model";

@Injectable()
export class VehicleDTTReferentialService {

  baseUrl = environment.settings_url + '/vehicle-dtt-referential';
  private _vehicleDttReferential: ReplaySubject<VehicleDTTReferential> = new ReplaySubject<VehicleDTTReferential>(1);
  private _vehicleDttReferentials: ReplaySubject<VehicleDTTReferential[]> = new ReplaySubject<VehicleDTTReferential[]>(1);

  set vehicleDttReferential(value: VehicleDTTReferential) {
    this._vehicleDttReferential.next(value);
  }

  get vehicleDttReferential$() {
    return this._vehicleDttReferential.asObservable();
  }

  set vehicleDttReferentials(value: VehicleDTTReferential[]) {
    this._vehicleDttReferentials.next(value);
  }

  get vehicleDttReferentials$() {
    return this._vehicleDttReferentials.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {}

  create(vehicleDttReferential: VehicleDTTReferential): Observable<VehicleDTTReferential> {
    return this._httpClient.post<VehicleDTTReferential>(`${this.baseUrl}`, vehicleDttReferential)
      .pipe(
        tap((response: VehicleDTTReferential) => {
          this.vehicleDttReferential = response;
          return response;
        }),
        catchError(() => of({} as VehicleDTTReferential))
      );
  }

  getAll(): Observable<VehicleDTTReferential[]> {
    return this._httpClient.get<VehicleDTTReferential[]>(`${this.baseUrl}`)
      .pipe(
        tap((response: any) => {
          this.vehicleDttReferentials = response?.content.map((item: VehicleDTTReferential) => item);
          return response;
        }),
        catchError(() => of([]))
      );
  }

  update(vehicleDttReferential: VehicleDTTReferential, uuid:string): Observable<VehicleDTTReferential> {
    return this._httpClient.put<VehicleDTTReferential>(`${this.baseUrl}/${uuid}`, vehicleDttReferential)
      .pipe(
        tap((response: VehicleDTTReferential) => {
          this.vehicleDttReferential = response;
          return response;
        }),
        catchError(() => of({} as VehicleDTTReferential))
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
