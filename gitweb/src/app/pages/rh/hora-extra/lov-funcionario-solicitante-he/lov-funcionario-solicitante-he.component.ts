import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FuncionarioPorSolicitanteHe } from '../../../../models/rh/hora-extra/funcionario-por-solicitante-he';
import { HoraExtraService } from '../../../../services/rh/hora-extra/hora-extra.service';
import { ErrorHandleService } from '../../../../services/error-handle/error-handle.service';
import { DialogModule } from 'primeng/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lov-funcionario-solicitante-he',
  standalone: true,
  imports: [TableModule, DialogModule],
  templateUrl: './lov-funcionario-solicitante-he.component.html',
  styleUrl: './lov-funcionario-solicitante-he.component.scss',
})
export class LovFuncionarioSolicitanteHeComponent implements OnInit {
  @Input() modalSolicita: boolean = false;
  @Output() modalSolicitaChange = new EventEmitter<boolean>();

  @Output() selecionouEvento = new EventEmitter();

  form!: FormGroup;
  solicitante: any[] = [];
  funcionarios: FuncionarioPorSolicitanteHe[] = [];

  funcionarioSelecionado: FuncionarioPorSolicitanteHe = {};

  constructor(
    private horaExtraService: HoraExtraService,
    private errorHandleService: ErrorHandleService
  ) {}

  ngOnInit() {
    this.init();
  }

  async init() {
    await this.horaExtraService
      .listarFuncionarioSolicitante()
      .then((response) => {
        this.funcionarios = response;
      })
      .catch((error) => {
        this.errorHandleService.handle(error);
      });
  }

  onRowSelect(event: any) {
    this.selecionouEvento.emit(this.funcionarioSelecionado);
  }

  // toggleDialog() {
  //   this.modalSolicita = !this.modalSolicita;
  //   this.modalSolicitaChange.emit(this.modalSolicita);
  // }

  onHideDialog() {
    this.modalSolicita = false;
    this.selecionouEvento.emit(null);
  }
}
