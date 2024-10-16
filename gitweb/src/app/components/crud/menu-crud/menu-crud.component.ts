import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-menu-crud',
  standalone: true,
  imports: [ConfirmDialogModule],
  templateUrl: './menu-crud.component.html',
  styleUrl: './menu-crud.component.scss'
})
export class MenuCrudComponent {

  @Output() clickSalvar = new EventEmitter();
  @Output() clickAdicionar = new EventEmitter();
  @Output() clickExcluir = new EventEmitter();
  @Output() clickUpload = new EventEmitter();

  @Input() habilitarBotaoSalvar: boolean = false;
  @Input() habilitarBotaoAdicionar: boolean = true;
  @Input() habilitarBotaoExcluir: boolean = false;
  @Input() habilitarBotaoUpload: boolean = false;

  buttonExcluirDisable: boolean = false;
  buttonSalvarDisable: boolean = false;


  constructor(
    private confirmationService: ConfirmationService
  ) { }


  salvar() {
    this.clickSalvar.emit(true);
  }
  adicionar() {
    this.clickAdicionar.emit(true);
  }

  excluir() {
    this.clickExcluir.emit(true);
  }

  upload() {
    this.clickUpload.emit(true);
  }
  dialogUploadOpenClose() {

  }

  // confirmDelete(event: Event) {
  //   this.confirmationService.confirm({
  //     target: event.target as EventTarget,
  //     message: 'Prosseguir com a Exclusão ?',
  //     rejectLabel: 'Não',
  //     acceptLabel: 'Sim',
  //     defaultFocus: 'reject', // undefined|'accept'|'reject'
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => { this.excluir(); },
  //     reject: () => { },
  //   });
  // }
  confirmDelete(event: Event) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Quer realmente Excluir este Registo?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass: "p-button-success p-button-text",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      defaultFocus: "reject",
      acceptIcon: "none",
      rejectIcon: "none",
      reject: () => {
      },
      accept: () => {
        this.excluir();
      },

    });
  }
}
