import { catchError, Observable, of, ReplaySubject, tap } from "rxjs";
import { environment } from "@env/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {VehicleModel} from "@core/services/settings/vehicle/referential/model/vehicle-model.model";

@Injectable()
export class VehicleModelService {

  baseUrl = environment.settings_url + '/vehicle-referential/models';
  private _vehicleModel: ReplaySubject<VehicleModel> = new ReplaySubject<VehicleModel>(1);
  private _vehicleModels: ReplaySubject<VehicleModel[]> = new ReplaySubject<VehicleModel[]>(1);

  set vehicleModel(value: VehicleModel) {
    this._vehicleModel.next(value);
  }

  get vehicleModel$() {
    return this._vehicleModel.asObservable();
  }

  set vehicleModels(value: VehicleModel[]) {
    this._vehicleModels.next(value);
  }

  get vehicleModels$() {
    return this._vehicleModels.asObservable();
  }

  constructor(
    private _httpClient: HttpClient
  ) {}

  create(vehicleModel: VehicleModel): Observable<VehicleModel> {
    return this._httpClient.post<VehicleModel>(`${this.baseUrl}`, vehicleModel)
      .pipe(
        tap((response: VehicleModel) => {
          this.vehicleModel = response;
          return response;
        }),
        catchError(() => of({} as VehicleModel))
      );
  }

  getAll(): Observable<VehicleModel[]> {
    return this._httpClient.get<VehicleModel[]>(`${this.baseUrl}`)
      .pipe(
        tap((response: any) => {
          this.vehicleModels = response?.content.map((item: VehicleModel) => item);
          return response;
        }),
        catchError(() => of([]))
      );
  }

  update(vehicleModel: VehicleModel, uuid:string): Observable<VehicleModel> {
    return this._httpClient.put<VehicleModel>(`${this.baseUrl}/${uuid}`, vehicleModel)
      .pipe(
        tap((response: VehicleModel) => {
          this.vehicleModel = response;
          return response;
        }),
        catchError(() => of({} as VehicleModel))
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
