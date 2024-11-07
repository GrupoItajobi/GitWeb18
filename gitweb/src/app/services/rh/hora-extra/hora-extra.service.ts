import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SolicitacaoHoraExtra } from '../../../models/rh/hora-extra/solicitacao-he';
import { firstValueFrom } from 'rxjs';
import { FuncionarioPorSolicitanteHe } from '../../../models/rh/hora-extra/funcionario-por-solicitante-he';
import { SolicitacaoHoraExtraIncluir } from '../../../models/rh/hora-extra/solicitacao-he-incluir';
import { SolicitacaoHoraExtraPorAprovador } from '../../../models/rh/hora-extra/solicitacao-he-por-aprovador';
import { MotivoHoraExtra } from '../../../models/rh/hora-extra/motivo-hora-extra';

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

  async aprovar(solicitacoes: SolicitacaoHoraExtraPorAprovador[]): Promise<SolicitacaoHoraExtraPorAprovador[] | null> {
    let aprovar: boolean = true;
    return await this.aprovarReprovar(solicitacoes, aprovar)
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      })
  }

  async reprovar(solicitacoes: SolicitacaoHoraExtraPorAprovador[]): Promise<SolicitacaoHoraExtraPorAprovador[] | null> {
    let reprovar: boolean = false;
    return await this.aprovarReprovar(solicitacoes, reprovar)
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      })
  }

  private async aprovarReprovar(solicitacoes: SolicitacaoHoraExtraPorAprovador[], aprovar: boolean): Promise<SolicitacaoHoraExtraPorAprovador[] | null> {

    if (solicitacoes) {
      let lista: any[] = [];
      solicitacoes.forEach(s => {
        let solicitacao: any = {
          idSolicitacao: s.id,
          nivelAprovador: s.nivelAprovar
        }
        lista.push(solicitacao);
      });
      const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

      const body = JSON.stringify(lista);

      let command: string = "reprovar"
      if (aprovar) {
        command = "aprovar"
      }
      return await firstValueFrom(
        this.http.post<any>(`${this.url}/${command}`, body, { headers }))
        .then(response => {
          return response;
        })
        .catch(error => {
          return Promise.reject(error);
        });
    }
    return null;
  }

  async buscaMotivo(): Promise<MotivoHoraExtra[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<MotivoHoraExtra[]>(`${this.url}/motivo`, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }  

  async solicitacoesPorSolicitante(solicitacoes: any): Promise<SolicitacaoHoraExtra[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    try {
      return await firstValueFrom(
        this.http.get<SolicitacaoHoraExtra[]>(
          `${this.url}/solicitacoes-por-solicitante`, 
          { 
            headers, 
            params: {
              dataInicio: solicitacoes.dataInicio,
              dataFim: solicitacoes.dataFim,
              status: solicitacoes.status
            }
          }
        )
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
  

}
