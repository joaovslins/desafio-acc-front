import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Enterprise } from '../shared/enterprise.model';

@Injectable({
  providedIn: 'root'
})
export class EntepriseService {

  private apiPath: string = 'http://localhost:8080/enterprise';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Enterprise[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDatatoEnterprises)
      );
  }

  create(enterprise: Enterprise): Observable<Enterprise> {
    return this.http.post(this.apiPath, enterprise).pipe(
      catchError(this.handleError),
      map(this.jsonDatatoEnterprise)
    );
  }

  update(enterprise: Enterprise): Observable<Enterprise> {
    const url = `${this.apiPath}/${enterprise.id}`;
    return this.http.put(url, enterprise).pipe(
      catchError(this.handleError),
      map(() => enterprise)
    );
  }

  getOne(id: number): Observable<Enterprise> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDatatoEnterprise)
    );
  }

  delete(id: number): Observable<any>{
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private jsonDatatoEnterprises(jsonData: any[]): Enterprise[] {
    const enterprise: Enterprise[] = [];

    jsonData.forEach(element => {
      enterprise.push(element as Enterprise);
    });

    return enterprise;
  }

  private handleError(error: any): Observable<any> {
    console.log('Ocorreu um erro: ', error);
    return throwError(error);
  }

  private jsonDatatoEnterprise(jsonData: any): Enterprise {
    return jsonData as Enterprise;
  }
}
