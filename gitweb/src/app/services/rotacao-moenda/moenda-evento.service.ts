import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { MoendaEvento } from '../../models/industria/rotacao-moenda/moendaEvento';

@Injectable({
  providedIn: 'root'
})
export class MoendaEventoService {

  url: string;
  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.apiUrl + 'GIt-api/coi-moenda-evento';
  }

  async listarEventos(): Promise<MoendaEvento[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    // const params = new HttpParams()
    //   .set('ue', unidade);


    return await firstValueFrom(
      this.http.get<MoendaEvento[]>(`${this.url}`, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}
