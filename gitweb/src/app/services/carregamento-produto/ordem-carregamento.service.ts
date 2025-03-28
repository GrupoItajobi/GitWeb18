import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';


import { OrdemDeCarregamento } from '../../models/carregamento-produto/OrdemCarregamento';

@Injectable({
  providedIn: 'root'
})
export class OrdemCarregamentoService {


  url: string;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.apiUrl + 'GIt-api/carregamento-produto-industria';
  }

  async buscarOrdemRetirada(nrOrdemRetirada: Number): Promise<OrdemDeCarregamento[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('nrOrdemRetirada', nrOrdemRetirada.toString());

    return await firstValueFrom(
      this.http.get<OrdemDeCarregamento[]>(`${this.url}`, { headers, params }))
      .then(response => {
        console.log(response);
        let data: OrdemDeCarregamento[] = response;
        return data;
      })
      .catch(error => {
        console.log(error);
        let data: OrdemDeCarregamento[] = [];
        return Promise.reject(error);
      });
  }

  async salvar(ordemCarregamento: OrdemDeCarregamento): Promise<OrdemDeCarregamento> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    let ordem: any = ({
      checkListCarregamentoId: ordemCarregamento.checkListCarregamentoId,
      especificacaoId: ordemCarregamento.especificacaoId,
      dataInicio: ordemCarregamento.dataInicio,
      datafim: ordemCarregamento.dataFim,
      quantidadeEquipamento: ordemCarregamento.quantidadeEquipamento
    });

    const body = JSON.stringify(ordem);
    console.log(body)

    return await firstValueFrom(
      this.http.put<OrdemDeCarregamento>(`${this.url}/carregamento/${ordem.checkListCarregamentoId}`, body, { headers }))
      .then(response => {
        let data: OrdemDeCarregamento = response;
        return data;
      })
      .catch(error => {
        let data: OrdemDeCarregamento = {};
        return Promise.reject(error);
      });
  }
}
