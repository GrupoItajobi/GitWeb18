import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandleService {

  constructor(
    private messageService: MessageService
  ) { }

  handle(errorResponse: any) {
    let msg: string;
    let summary: string = "Erro"

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
      // } else if (errorResponse instanceof NotAuthenticatedError) {
      //  console.log('erro refresh');

      //  msg = 'Sua sessão expirou!';
      //  this.router.navigate(['/login']);

    } else if (errorResponse instanceof HttpErrorResponse
      && errorResponse.status >= 400 && errorResponse.status <= 499) {
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (errorResponse.status === 403) {
        msg = 'Você não tem permissão para executar esta ação';
      }

      try {
        msg = errorResponse.error.userMessage;
        summary = errorResponse.error.title;
        if (errorResponse.error.objects) {
          errorResponse.error.objects.forEach((t: any) => {
            console.log(t.name + '  -  ' + t.userMessage);

            this.messageService.add({ severity: 'error', summary: t.name, detail: t.userMessage });
          });
        }

      } catch (e) { }
      if (errorResponse) {
        console.error('ErrorHandleService', errorResponse.error);
      } else {
        console.error('Ocorreu um erro', "errorResponse");
      }
    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      if (errorResponse) {
        console.error('Ocorreu um erro', errorResponse);
      } else {
        console.error('Ocorreu um erro', "errorResponse");
      }

    }

    this.messageService.add({ severity: 'error', summary: summary, detail: msg });
  }

}

