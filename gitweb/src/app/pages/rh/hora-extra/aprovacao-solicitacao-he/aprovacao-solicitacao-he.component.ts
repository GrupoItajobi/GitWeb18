import { ErrorHandleService } from './../../../../services/error-handle/error-handle.service';
import { SolicitacaoHoraExtraPorAprovador } from './../../../../models/rh/hora-extra/solicitacao-he-por-aprovador';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { HoraExtraService } from '../../../../services/rh/hora-extra/hora-extra.service';
import { minutosEmHorasStr } from '../../../../core/util/gitweb-util';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-aprovacao-solicitacao-he',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './aprovacao-solicitacao-he.component.html',
  styleUrl: './aprovacao-solicitacao-he.component.scss'
})
export class AprovacaoSolicitacaoHeComponent implements OnInit {

  solicitacoes: SolicitacaoHoraExtraPorAprovador[] = [];
  solicitacaoSelecionada: SolicitacaoHoraExtraPorAprovador = {};

  constructor(
    private horaExtraService: HoraExtraService,
    private errorHandleService: ErrorHandleService,
  ) {

  }


  ngOnInit(): void {
    this.init();
  }

  async init() {
    await this.horaExtraService.solicitacaoPorAprovador()
      .then(response => {
        this.solicitacoes = response;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })

  }

  minutosEmHoras(minutos:number=0):string {
    return minutosEmHorasStr(minutos)
  }
}
