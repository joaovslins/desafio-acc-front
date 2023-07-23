import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Provider } from './provider.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private apiPath: string = 'http://localhost:8080/provider';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Provider[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDatatoCategories)
      );
  }

  create(provider: Provider): Observable<Provider> {
    return this.http.post(this.apiPath, provider).pipe(
      catchError(this.handleError),
      map(this.jsonDatatoCategory)
    );
  }

  update(provider: Provider): Observable<Provider> {
    const url = `${this.apiPath}/${provider.id}`;
    return this.http.put(url, provider).pipe(
      catchError(this.handleError),
      map(() => provider)
    );
  }

  getOne(id: number): Observable<Provider> {
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDatatoCategory)
    );
  }

  delete(id: number): Observable<any>{
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private jsonDatatoCategories(jsonData: any[]): Provider[] {
    const provider: Provider[] = [];

    jsonData.forEach(element => {
      provider.push(element as Provider);
    });

    return provider;
  }

  private handleError(error: any): Observable<any> {
    console.log('Ocorreu um erro: ', error);
    return throwError(error);
  }

  private jsonDatatoCategory(jsonData: any): Provider {
    return jsonData as Provider;
  }
}
