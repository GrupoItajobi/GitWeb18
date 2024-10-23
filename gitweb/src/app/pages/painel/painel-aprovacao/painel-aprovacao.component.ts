import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ErrorHandleService } from './../../../services/error-handle/error-handle.service';
import { HoraExtraService } from './../../../services/rh/hora-extra/hora-extra.service';
import { Component, OnInit } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-painel-aprovacao',
  standalone: true,
  imports: [ButtonModule, ProgressSpinnerModule, BadgeModule],
  templateUrl: './painel-aprovacao.component.html',
  styleUrl: './painel-aprovacao.component.scss'
})
export class PainelAprovacaoComponent implements OnInit {

  countSolicitacaoHoraExtra: number = 0;
  loadingCountSolicitacaoHoraExtra: boolean = false;

  constructor(
    private errorHandleService: ErrorHandleService,
    private horaExtraService: HoraExtraService,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.countSolicitacaoHoraExtraPorAprovador();
  }

  countSolicitacaoHoraExtraPorAprovador() {
    this.loadingCountSolicitacaoHoraExtra = true;
    this.horaExtraService
      .countSolicitacaoPorAprovador()
      .then(response => {
        this.loadingCountSolicitacaoHoraExtra = false;
        this.countSolicitacaoHoraExtra = response;
      })
      .catch(error => {
        this.loadingCountSolicitacaoHoraExtra = false;
        this.errorHandleService.handle(error);
      })
  }


  aprovacaoHoraExtra() {
    this.router.navigate(['/rh/hora-extra/aprovacao-solicitacao-he']);

  }
}
