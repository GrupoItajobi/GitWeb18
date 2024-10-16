import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UE } from '../../models/empresa/ue';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadeEmpresaService {

  url: string;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.apiUrl + 'GIt-api/ue';
  }

  async listarTodas(): Promise<UE[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<UE[]>(`${this.url}`, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}
