import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Moenda } from '../../models/industria/rotacao-moenda/moenda';

@Injectable({
  providedIn: 'root'
})
export class MoendaService {
  url: string;
  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.apiUrl + 'GIt-api/coi-moenda';
  }

  async listarMoendas(unidade: string): Promise<Moenda[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('ue', unidade);


    return await firstValueFrom(
      this.http.get<Moenda[]>(`${this.url}`, { headers, params }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}
