import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { dateToString } from '../../../../core/util/gitweb-util';
import { FolhaEventoPonto } from '../../../../models/rh/folha/eventos-pontos/folha-evento-divergencia';
import { FilterDivergencia } from '../../../../models/rh/folha/eventos-pontos/filter-divergencia';

@Injectable({
  providedIn: 'root'
})
export class FolhaEventosService {
  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'GIt-api/folha-eventos';
  }


  async listarDivergencias(dataInicio: Date, dataFim: Date, funcionarioCodigo: number, tagAcesso: string = "teste"): Promise<FolhaEventoPonto[]> {
    let headers = new HttpHeaders().append(
      'Content-Type', 'application/json'
    );
    // headers = headers.append(
    //   'tagApplication',tagAcesso
    // )

    let params = new HttpParams()
      .set('dataDe', dateToString(dataInicio, false))
      .set('dataAte', dateToString(dataFim, false))
      .set('listarEventosFolha', 'S')
      .set('listarEventosAprovacao', 'S')
      .set('listarPontos', 'N')

    if (funcionarioCodigo) {
      params = params.append('funcionarioCodigo', funcionarioCodigo)
    }

    const body: string = JSON.stringify("TESTE")
    return await firstValueFrom(
      this.http.get<FolhaEventoPonto[]>(
        `${this.url}/dp/divergencia`, { params, headers }
      )
    )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }


  async gerarDivergencias(filter: FilterDivergencia): Promise<any> {
    let headers = new HttpHeaders().append(
      'Content-Type', 'application/json'
    );

    const body = JSON.stringify(filter);

    console.log(body);


    return await firstValueFrom(
      this.http.post<any[]>(
        `${this.url}/dp/gerarDivergencias`, body, { headers })
    )
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}
