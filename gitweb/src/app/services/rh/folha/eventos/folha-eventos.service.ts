import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { dateToString } from '../../../../core/util/gitweb-util';
import { FolhaEventoPonto } from '../../../../models/rh/folha/eventos-pontos/folha-evento-divergencia';

@Injectable({
  providedIn: 'root'
})
export class FolhaEventosService {
  url: string;

  constructor(private http: HttpClient) {
    this.url = environment.apiUrl + 'GIt-api/folha-eventos';
  }


  async listarDivergencias(dataInicio: Date, dataFim: Date, funcionarioCodigo: number): Promise<FolhaEventoPonto[]> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );

    let params = new HttpParams()
      .set('dataInicio', dateToString(dataInicio,false))
      .set('dataFim', dateToString(dataFim,false));

    if (funcionarioCodigo) {
      params = params.append('funcionarioCodigo', funcionarioCodigo)
    }

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

}
