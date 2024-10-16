import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { RotacaoMoenda } from '../../models/industria/rotacao-moenda/rotacaoMoenda';
import { RotacaoMoendaCrud } from '../../models/industria/rotacao-moenda/rotacaoMoendaCrud';

@Injectable({
  providedIn: 'root'
})
export class RotacaoMoendaService implements OnInit {


  url: string;
  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.apiUrl + 'GIt-api/coi-moenda-rotacao';
  }

  ngOnInit(): void {

  }

  async incluir(rotacaoMoenda: RotacaoMoendaCrud): Promise<RotacaoMoenda> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(rotacaoMoenda);
    return await firstValueFrom(
      this.http.post<RotacaoMoenda>(`${this.url}`, body, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
  async alterar(rotacaoMoenda: RotacaoMoendaCrud): Promise<RotacaoMoenda> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(rotacaoMoenda);
    return await firstValueFrom(
      this.http.put<RotacaoMoenda>(`${this.url}/${rotacaoMoenda.id}`, body, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async listarMoendas(ueId: string, moendaId: string): Promise<RotacaoMoenda[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('ueId', ueId)
      .set('moendaId', moendaId);


    return await firstValueFrom(
      this.http.get<RotacaoMoenda[]>(`${this.url}`, { headers, params }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}
