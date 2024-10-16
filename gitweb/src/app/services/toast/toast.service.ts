import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private messageService: MessageService
  ) { }

  showSuccessMsg(mensagem: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: mensagem });
  }
  showInfoMsg(mensagem: string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: mensagem });
  }
  showWarnMsg(mensagem: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: mensagem });
  }
  showErrorMsg(mensagem: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensagem });
  }

  showSuccessResumoMsg(resumo: string, mensagem: string) {
    this.messageService.add({ severity: 'success', summary: resumo, detail: mensagem });
  }
  showInfoResumoMsg(resumo: string, mensagem: string) {
    this.messageService.add({ severity: 'info', summary: resumo, detail: mensagem });
  }
  showWarnResumoMsg(resumo: string, mensagem: string) {
    this.messageService.add({ severity: 'warn', summary: resumo, detail: mensagem });
  }
  showErrorResumoMsg(resumo: string, mensagem: string) {
    this.messageService.add({ severity: 'error', summary: resumo, detail: mensagem });
  }
}
