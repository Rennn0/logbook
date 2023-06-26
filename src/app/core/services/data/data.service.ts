import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient, private storeService: StoreService) { }

  httpParamsCostume(params: any): HttpParams {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('key', environment.APIKEY);

    if (params) {
      Object.keys(params).forEach(function (key) {
        // console.log(key, params[key], params[key].length, typeof params[key]);

        if (
          (typeof params[key] === 'string' && params[key] !== '') ||
          params[key].length !== 0
        ) {
          if (
            Object.prototype.toString.call(params[key]) === '[object Array]'
          ) {
            params[key].forEach((item: any) => {
              httpParams = httpParams.append(key, item);
            });
          } else {
            httpParams = httpParams.append(key, params[key]);
          }
        }
      });
    }

    return httpParams;
  }

  getData(url: string, prams?: any, headerParam?: any): Observable<any> {
    //
    let headers: HttpHeaders = this.getHeaders();
    let httpParams = this.httpParamsCostume(prams);

    if (headerParam) {
      headers = headers.append('If-Modified-Since', headerParam);
    }

    return this.http.get(url, {
      headers: headers,
      observe: 'response',
      params: httpParams,
      withCredentials: true,
    });
  }

  getDefData(url: string, token?: string): Observable<any> {
    // let headers: HttpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${token}`,
    // });

    return this.http.get(url);
  }

  //
  putRequest(url: string, body: any, prams?: any): Observable<any> {
    //
    let headers: HttpHeaders = this.getHeaders();
    let httpParams = this.httpParamsCostume(prams);

    return this.http.put(url, body, {
      headers: headers,
      observe: 'response',
      params: httpParams,
      withCredentials: true,
    });
  }

  getBlobData(url: string, prams?: any): Observable<any> {
    //
    let headers: HttpHeaders = this.getHeaders();
    //
    headers = headers.append('Content-Type', 'application/json');
    let httpParams = this.httpParamsCostume(prams);

    return this.http.get(url, {
      headers: headers,
      observe: 'response',
      params: httpParams,
      withCredentials: true,
      responseType: 'blob',
    });
  }

  //
  postRequest(url: string, body?: any, prams?: any): Observable<any> {
    //
    let headers: HttpHeaders = this.getHeaders();
    let httpParams = this.httpParamsCostume(prams);

    return this.http.post(url, body, {
      headers: headers,
      observe: 'response',
      params: httpParams,
      withCredentials: true,
    });
  }

  uploadData(url: string, formData: any): Observable<any> {
    //
    let headers: HttpHeaders = this.getHeaders();

    //
    // headers = headers.append('Content-Type', 'multipart/form-data');
    headers = headers.append('ngsw-bypass', '');

    return this.http.post(url, formData, {
      headers: headers,
      reportProgress: true,
      observe: 'events',
      withCredentials: true,
    });
  }

  getHeaders() {
    if (this.storeService.authInstance) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.storeService.authInstance.credential}`,
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
}
