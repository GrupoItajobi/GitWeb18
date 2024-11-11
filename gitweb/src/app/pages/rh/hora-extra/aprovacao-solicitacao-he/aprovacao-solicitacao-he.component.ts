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

  loading: boolean = false;
  blockedDocument: boolean = false;


  mapSolicitacoes = new Map<string, SolicitacaoHoraExtraPorAprovador>();
  resumoPorUnidade: any[] = [];
  resumoPorUnidadeSelected: any = {};

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
    await this.downloadSolicitacaoPorAprovador();
  }

  async downloadSolicitacaoPorAprovador() {
    this.solicitacoes = [];
    this.solicitacoesSelecionadas = [];
    this.resumoPorUnidade = [];

    await this.horaExtraService.solicitacaoPorAprovador()
      .then(response => {
        this.loadMapSolicitacoes(response);
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })

  }

  private loadMapSolicitacoes(solicitacoes: SolicitacaoHoraExtraPorAprovador[]) {
    this.mapSolicitacoes = new Map<string, SolicitacaoHoraExtraPorAprovador>();
    let mapResumoPorUeId = new Map<string, string[]>();

    solicitacoes.forEach(tmp => {
      this.mapSolicitacoes.set(tmp.id!, tmp);
      let ids: string[] = [];
      if (mapResumoPorUeId.has(tmp.ueId!)) {
        ids = mapResumoPorUeId.get(tmp.ueId!)!;
      }
      ids.push(tmp.id!);
      mapResumoPorUeId.set(tmp.ueId!, ids)
    });
    mapResumoPorUeId.forEach((value, key) => {
      this.resumoPorUnidade.push({ ue: key, ids: value });
    });

    if (this.resumoPorUnidadeSelected) {
      this.listarUe(this.resumoPorUnidadeSelected);
    }
  }

  listarUe(ue: any) {
    this.solicitacoes = [];
    if (ue && ue.ids && ue.ids.length >0 ) {
      ue.ids.forEach((element: any) => {
        if (this.mapSolicitacoes.has(element)) {
          this.solicitacoes.push(this.mapSolicitacoes.get(element)!);
        }
      });
    }

  }
  onRowSelectResumoUe(event: any) {
    this.listarUe(event.data);
  }
  onRowUnselectResumoUe(event: any) {
    this.solicitacoes = [];
  }

  loadOptionButtonCard() {
    this.optionsButtonCard = [
      {
        img: "https://gitweb.usinaitajobi.com.br/git-ged/layout/img/sistema/aprovado.png",
        title: "Aprovar",
        returnWhenClicked: "aprovado",
      },
      {
        img: "https://gitweb.usinaitajobi.com.br/git-ged/layout/img/sistema/reprovado.png",
        title: "Reprovar",
        returnWhenClicked: "reprovado",
      },
    ];
  }
  minutosEmHoras(minutos: number = 0): string {
    return minutosEmHorasStr(minutos)
  }

  async clickButtonCard(event: string) {
    if (this.solicitacoesSelecionadas.length > 0) {
      if (event === 'aprovado') {
        await this.aprovar();
      } else if (event === 'reprovado') {
        await this.reprovar();
      }
    } else {
      this.toastService.showWarnMsg("Selecione uma Solicitação!")
    }
  }

  async aprovar() {
    this.blockedDocument = true;
    this.loading = true;
    await this.horaExtraService.aprovar(this.solicitacoesSelecionadas)
      .then(reponse => {
        this.downloadSolicitacaoPorAprovador();
        this.loading = false;
        this.blockedDocument = false;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
        this.loading = false;
        this.blockedDocument = false;
      });
  }

  async reprovar() {
    this.blockedDocument = true;
    this.loading = true;
    await this.horaExtraService.reprovar(this.solicitacoesSelecionadas)
      .then(reponse => {
        this.downloadSolicitacaoPorAprovador();
        this.loading = false;
        this.blockedDocument = false;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      });
  }

}
