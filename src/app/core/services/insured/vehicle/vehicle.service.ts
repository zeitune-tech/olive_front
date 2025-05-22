import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Vehicle } from './vehicle.interface';
import { Observable, ReplaySubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RequestMetadata } from '../../common.interface';

@Injectable({ providedIn: 'root' })
export class VehicleService {

  baseUrl = environment.insured_url + '/vehicles';

  private _vehicle = new ReplaySubject<Vehicle>(1);
  private _vehicles = new ReplaySubject<Vehicle[]>(1);
  private _metadata = new ReplaySubject<RequestMetadata>(1);

  set vehicle(value: Vehicle) {
    this._vehicle.next(value);
  }

  get vehicle$(): Observable<Vehicle> {
    return this._vehicle.asObservable();
  }

  set vehicles(value: Vehicle[]) {
    this._vehicles.next(value);
  }

  get vehicles$(): Observable<Vehicle[]> {
    return this._vehicles.asObservable();
  }

  set metadata(value: RequestMetadata) {
    this._metadata.next(value);
  }

  get metadata$(): Observable<RequestMetadata> {
    return this._metadata.asObservable();
  }

  constructor(private _httpClient: HttpClient) {}

  create(vehicle: Vehicle): Observable<Vehicle> {
    return this._httpClient.post<Vehicle>(`${this.baseUrl}`, vehicle).pipe(
      tap(res => this.vehicle = res),
      catchError(() => of({} as Vehicle))
    );
  }

  get(id: string): Observable<Vehicle> {
    return this._httpClient.get<Vehicle>(`${this.baseUrl}/${id}`).pipe(
      tap(res => this.vehicle = res),
      catchError(() => of({} as Vehicle))
    );
  }

  getAll(): Observable<Vehicle[]> {
    return this._httpClient.get<Vehicle[]>(this.baseUrl).pipe(
      tap(res => {
        this.vehicles = res;
        return res;
      }),
      catchError(() => of([] as Vehicle[]))
    );
  }
}
