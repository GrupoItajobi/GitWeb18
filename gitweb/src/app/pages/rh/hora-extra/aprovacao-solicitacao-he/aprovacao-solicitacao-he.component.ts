import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TableModule } from 'primeng/table';

import { HoraExtraService } from '../../../../services/rh/hora-extra/hora-extra.service';
import { ErrorHandleService } from './../../../../services/error-handle/error-handle.service';
import { ToastService } from './../../../../services/toast/toast.service';

import { minutosEmHorasStr } from '../../../../core/util/gitweb-util';

import { ButtonCardComponent, ButtonCardOptions } from "../../../../components/button/button-card/button-card.component";
import { SolicitacaoHoraExtraPorAprovador } from './../../../../models/rh/hora-extra/solicitacao-he-por-aprovador';

@Component({
  selector: 'app-aprovacao-solicitacao-he',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonCardComponent],
  templateUrl: './aprovacao-solicitacao-he.component.html',
  styleUrl: './aprovacao-solicitacao-he.component.scss'
})
export class AprovacaoSolicitacaoHeComponent implements OnInit {

  solicitacoes: SolicitacaoHoraExtraPorAprovador[] = [];
  solicitacoesSelecionadas!: SolicitacaoHoraExtraPorAprovador[];

  optionsButtonCard: ButtonCardOptions[] = [];
  constructor(
    private horaExtraService: HoraExtraService,
    private errorHandleService: ErrorHandleService,
    private toastService: ToastService,
  ) {

  }


  ngOnInit(): void {
    this.loadOptionButtonCard();
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
  loadOptionButtonCard() {
    this.optionsButtonCard = [
      {
        img: "/assets/layout/img/sistema/aprovado.png",
        title: "Aprovar",
        returnWhenClicked: "aprovado",
      },
      {
        img: "/assets/layout/img/sistema/reprovado.png",
        title: "Reprovar",
        returnWhenClicked: "reprovado",
      },
    ];
  }
  minutosEmHoras(minutos: number = 0): string {
    return minutosEmHorasStr(minutos)
  }

  clickButtonCard(event: string) {
    if (this.solicitacoesSelecionadas) {
      if (event === 'aprovado') {
        this.horaExtraService.aprovar(this.solicitacoesSelecionadas)
          .then()
          .catch(error => {
            this.errorHandleService.handle(error);
          });
      } else if (event === 'reprovado') {

      }
    } else {
      this.toastService.showWarnMsg("Selecione uma Solicitação!")
    }
  }


}
