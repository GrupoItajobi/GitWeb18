import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Producao } from '../../models/producao/producao';

@Injectable({
  providedIn: 'root'
})
export class ProducaoService {

  url: string;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.apiUrl + 'GIt-api/producao';
  }


  async listarProducao(data: Date | null=null):Promise<Producao[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    let params = new HttpParams();


    console.log('antes buscar na API')
    return await firstValueFrom(
      this.http.get<Producao[]>(`${this.url}/dia`, { headers }))
      .then(data => {
        return data;
      })
      .catch(erro => {
        return erro;
      });
  }
}
