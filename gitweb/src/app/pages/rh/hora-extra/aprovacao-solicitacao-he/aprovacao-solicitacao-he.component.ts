import { ErrorHandleService } from './../../../../services/error-handle/error-handle.service';
import { SolicitacaoHoraExtraPorAprovador } from './../../../../models/rh/hora-extra/solicitacao-he-por-aprovador';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { HoraExtraService } from '../../../../services/rh/hora-extra/hora-extra.service';
import { minutosEmHorasStr } from '../../../../core/util/gitweb-util';
import { CommonModule } from '@angular/common';
import { ButtonCardComponent, ButtonCardOptions } from "../../../../components/button/button-card/button-card.component";
@Component({
  selector: 'app-aprovacao-solicitacao-he',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonCardComponent],
  templateUrl: './aprovacao-solicitacao-he.component.html',
  styleUrl: './aprovacao-solicitacao-he.component.scss'
})
export class AprovacaoSolicitacaoHeComponent implements OnInit {

  solicitacoes: SolicitacaoHoraExtraPorAprovador[] = [];
  solicitacaoSelecionada: SolicitacaoHoraExtraPorAprovador = {};

  optionsButtonCard: ButtonCardOptions[] = [];
  constructor(
    private horaExtraService: HoraExtraService,
    private errorHandleService: ErrorHandleService,
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
        clicked: false,
        returnWhenClicked: "aprovado"
      },
      {
        img: "/assets/layout/img/sistema/reprovado.png",
        title: "Reprovar",
        clicked: false,
        returnWhenClicked: "reprovado"
      }
    ];
  }
  minutosEmHoras(minutos: number = 0): string {
    return minutosEmHorasStr(minutos)
  }

  clickButtonCard(event: string) {
    console.log('clickButtonCard: '+event);
  }


}
