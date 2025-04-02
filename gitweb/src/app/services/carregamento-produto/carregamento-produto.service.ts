import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { CarregamentoFila } from '../../models/carregamento-produto/CarregamentoFila';
import { CarregamentoSaida } from '../../models/carregamento-produto/CarregamentoSaida';
import { CarregamentoESaldo } from '../../models/carregamento-produto/CarregamentoESaldo';
import { CarregamentoAlterarOrdem } from '../../models/carregamento-produto/CarregamentoAlterarOrdem';
import { ChamaParaPesar } from '../../models/carregamento-produto/ChamaParaPesar';

@Injectable({
  providedIn: 'root'
})
export class CarregamentoProdutoService {

  url: string;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.apiUrl + 'GIt-api/carreg-produto';
  }

  async listarTodosAbertos(unidade: string): Promise<CarregamentoESaldo> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const params = new HttpParams()
      .set('ue', unidade);


    return await firstValueFrom(
      this.http.get<CarregamentoESaldo>(`${this.url}`, { headers, params }))
      .then(response => {
        let data:CarregamentoESaldo = response;
        return data;
      })
      .catch(error => {
        let data: CarregamentoFila[] = [];
        return Promise.reject(error);
      });
  }


  async incluir(carregamento: CarregamentoFila): Promise<CarregamentoFila> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(carregamento);

    return await firstValueFrom(
      this.http.post<CarregamentoFila>(`${this.url}/portaria`, body, { headers }))
      .then(data => {
        return data;
      })
      .catch(erro => {
        return Promise.reject(erro)
      });
  }


  async alterar(carregamento: CarregamentoFila) :Promise<CarregamentoFila>{
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(carregamento);

    return await firstValueFrom(
      this.http.put<CarregamentoFila>(`${this.url}`, body, { headers }))
      .then(data => {
        return data;
      })
      .catch(erro => {
        return Promise.reject(erro)
      });
  }

  async saida(saida: CarregamentoSaida) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(saida);

    return await firstValueFrom(
      this.http.post<CarregamentoFila>(`${this.url}/saida`, body, { headers }))
      .then(data => {
        return data;
      })
      .catch(erro => {
        return erro;
      });
  }

  async alterarOrdem(ordem: CarregamentoAlterarOrdem) :Promise<CarregamentoFila>{
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(ordem);

    return await firstValueFrom(
      this.http.put<CarregamentoFila>(`${this.url}/alterarOrdem`, body, { headers }))
      .then(data => {
        return data;
      })
      .catch(erro => {
        return Promise.reject(erro)
      });
  }

  async recarregamento(saida: CarregamentoSaida) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(saida);

    return await firstValueFrom(
      this.http.post<CarregamentoFila>(`${this.url}/recarregar`, body, { headers }))
      .then(data => {
        return data;
      })
      .catch(erro => {
        return erro;
      });
  }

  //TESTE PARA CHAMAR O CAMINHÃO PARA PESAR
  
  async chamarParaBalanca(dadosEnvioMsg: ChamaParaPesar) {
    const headers = new HttpHeaders({
      'apikey': '1tIbUV7K3Y6DhWFbgw', 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    // a1u6O3bepZfwyQH
    // 1tIbUV7K3Y6DhWFbgw 

    try {
      const response = await firstValueFrom(
        this.http.post<CarregamentoFila>(
          // 'http://apiwhatsapp.usinaitajobi.com.br:8080/message/sendText/ITAJOBI',
          //'https://192.168.100.50:8080/message/sendText/EvoItajobi',
          'https://evolution.centroalcool.com.br/message/sendText/EvoItajobi',
          dadosEnvioMsg,
          { headers }
        )
      );
      console.log("✅ API respondeu com sucesso:", response);
      return response;
    } catch (error: any) {
      console.error("❌ Erro ao enviar requisição:", error);
      throw new Error(error?.message || 'Erro desconhecido');
    }
  }

  

}

