import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RotacaoMoendaPainelProducao } from '../../models/industria/painel/painel-producao/rotacaoMoendaPainelproducao';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RotacaoMoendaPainelProducaoService implements OnInit {


  url: string;
  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.apiUrl + 'GIt-api/painel/painel-producao';
  }


  ngOnInit(): void {

  }


  async listarRotacaoPainel(): Promise<RotacaoMoendaPainelProducao[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<RotacaoMoendaPainelProducao[]>(`${this.url}`, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

}
