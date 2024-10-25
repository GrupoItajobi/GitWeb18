import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SolicitacaoHoraExtra } from '../../../models/rh/hora-extra/solicitacao-he';
import { firstValueFrom } from 'rxjs';
import { FuncionarioPorSolicitanteHe } from '../../../models/rh/hora-extra/funcionario-por-solicitante-he';
import { SolicitacaoHoraExtraIncluir } from '../../../models/rh/hora-extra/solicitacao-he-incluir';

@Injectable({
  providedIn: 'root'
})

export class HoraExtraService implements OnInit {

  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'GIt-api/solicitacao-he';
  }

  ngOnInit(): void {

  }

  async listarHoraExtra(): Promise<SolicitacaoHoraExtra[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    // const params = new HttpParams()
    //   .set('ueId', ueId)
    //   .set('moendaId', moendaId);


    return await firstValueFrom(
      this.http.get<SolicitacaoHoraExtra[]>(`${this.url}/solicitacoes-por-solicitante`, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async listarFuncionarioSolicitante(): Promise<FuncionarioPorSolicitanteHe[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<FuncionarioPorSolicitanteHe[]>(`${this.url}/funcionarios-por-solicitante`, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async solicitacaoPorAprovador(): Promise<FuncionarioPorSolicitanteHe[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<FuncionarioPorSolicitanteHe[]>(`${this.url}/por-aprovador`, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async countSolicitacaoPorAprovador(): Promise<number> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<number>(`${this.url}/por-aprovador/count`, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async incluir(solicitaHoraExtra: SolicitacaoHoraExtraIncluir): Promise<SolicitacaoHoraExtra> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(solicitaHoraExtra);
    return await firstValueFrom(
      this.http.post<SolicitacaoHoraExtra>(`${this.url}`, body, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async alterar(solicitaHoraExtra: SolicitacaoHoraExtra): Promise<SolicitacaoHoraExtra> {
    console.log(solicitaHoraExtra);
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(solicitaHoraExtra);
    return await firstValueFrom(
      this.http.put<SolicitacaoHoraExtra>(`${this.url}/${solicitaHoraExtra.id}`, body, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  // async listarSolicitacoes(ueId: string, solicitacoesId: string): Promise<SolicitacaoHoraExtra[]> {
  //   const headers = new HttpHeaders()
  //     .append('Content-Type', 'application/json');

  //   const params = new HttpParams()
  //     .set('ueId', ueId)
  //     .set('moendaId', solicitacoesId);


  //   return await firstValueFrom(
  //     this.http.get<SolicitacaoHoraExtra[]>(`${this.url}`, { headers, params }))
  //     .then(response => {
  //       return response;
  //     })
  //     .catch(error => {
  //       return Promise.reject(error);
  //     });
  // }

}
