import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyApiService {
  private apiUrl = 'https://6270328d6a36d4d62c16327c.mockapi.io/';

  constructor(private http: HttpClient) {}

  getFixedIncomeClassData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getFixedIncomeClassData`);
  }
}
