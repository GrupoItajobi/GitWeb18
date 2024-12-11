import { Injectable } from '@angular/core';
import { EnviarDados, PlanejamentoMetaMoagemDia } from '../../../models/agricola/planejamento/safra/moagem-safra';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoagemSafraService {
  url: string;
  url2: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'GIt-api/agr/plan/safra/corrigirTonelada';
    this.url2 = environment.apiUrl + 'GIt-api/agr/plan/safra';
  }

  async alterar(
    id: string, tonelada: number
  ): Promise<PlanejamentoMetaMoagemDia> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );

    const body = JSON.stringify(id);

    return await firstValueFrom(
      this.http.put<PlanejamentoMetaMoagemDia>(
        `${this.url}/${id}`,
        tonelada,
        { headers }
      )
    )
      .then((data) => {
        return data;
      })
      .catch((erro) => {
        return Promise.reject(erro);
      });
  } 

  async busca(enviaDados: any): Promise<PlanejamentoMetaMoagemDia[]> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );

    return await firstValueFrom(
      this.http.get<PlanejamentoMetaMoagemDia[]>(`${this.url2}`, {
        headers,
        params: {
          grupoEmpresaCodigo: enviaDados.codGrupo,
          empresaCodigo: enviaDados.codEmpresa,
          filialCodigo: enviaDados.codFilial,
          de: enviaDados.dataInicio,
          ate: enviaDados.dataFim        
        },
      })     
    )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  // GIt-api/agr/plan/safra?grupoEmpresaCodigo=1&empresaCodigo=1&filialCodigo=1&de=2024-10-01&ate=2024-10-31
}
