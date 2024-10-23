import { SolicitacaoHeComponent } from './pages/rh/hora-extra/solicitacao-he/solicitacao-he.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { GuardService } from './core/guard/guard.service';
import { CarregamentoProdutoComponent } from './pages/comercial/carregamento-produto/painel/carregamento-produto.component';
import { ForbiddenPageComponent } from './pages/acessos/forbidden/forbidden-page/forbidden-page.component';
import { ErrorPageComponent } from './pages/acessos/error/error-page/error-page.component';
import { NotFoundPageComponent } from './pages/acessos/notfound/not-found-page/not-found-page.component';
import { ControleAcessoPageComponent } from './pages/ti/controle-acesso/controle-acesso-page/controle-acesso-page.component';
import { QrcodeReadComponent } from './components/qrcode/qrcode-read/qrcode-read.component';
import { UtilSpringComponent } from './pages/ti/util-spring/util-spring.component';
import { OrdemCarregamentoComponent } from './pages/comercial/carregamento-produto/ordem-carregamento/ordem-carregamento.component';
import { CheckListComponent } from './pages/comercial/check-list/check-list/check-list.component';
import { FotoComponent } from './components/camera/foto/foto.component';
import { AlocacaoCaminhaoComponent } from './pages/agricola/alocacao/alocacao-caminhao/alocacao-caminhao.component';
import { RotacaoMoendaComponent } from './pages/industria/coi/moenda/rotacao-moenda/rotacao-moenda.component';
import { PainelProducaoComponent } from './pages/industria/painel/painel-producao/painel-producao.component';
import { PainelAprovacaoComponent } from './pages/painel/painel-aprovacao/painel-aprovacao.component';
import { AprovacaoSolicitacaoHeComponent } from './pages/rh/hora-extra/aprovacao-solicitacao-he/aprovacao-solicitacao-he.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },

  { path: "painel-aprovacao", component: PainelAprovacaoComponent },


  { path: "faturamento/painel-carreg-produto", component: CarregamentoProdutoComponent, canActivate: [GuardService] },
  { path: "faturamento/ordem-carregamento", component: OrdemCarregamentoComponent, canActivate: [GuardService] },
  { path: "faturamento/ordem-carregamento/:nrOrdemRetirada", component: OrdemCarregamentoComponent, canActivate: [GuardService] },
  { path: "faturamento/checklist", component: CheckListComponent, canActivate: [GuardService] },

  { path: "agricola/alocacao/caminhao-frente", component: AlocacaoCaminhaoComponent, canActivate: [GuardService] },

  { path: "rh/hora-extra/solicitacao-he", component: SolicitacaoHeComponent, canActivate: [GuardService] },
  { path: "rh/hora-extra/aprovacao-solicitacao-he", component: AprovacaoSolicitacaoHeComponent, canActivate: [GuardService] },


  { path: "industria/rotacao-moenda/rotacao-moenda", component: RotacaoMoendaComponent, canActivate: [GuardService] },
  { path: "industria/painel/painel-producao", component: PainelProducaoComponent, canActivate: [GuardService] },




  { path: "user/acesso", component: ControleAcessoPageComponent, canActivate: [GuardService] },
  { path: "user/qrCodeRead", component: QrcodeReadComponent, canActivate: [GuardService] },
  { path: "user/foto", component: FotoComponent, canActivate: [GuardService] },



  { path: "ti/util-spring", component: UtilSpringComponent },

  { path: 'notfound', component: NotFoundPageComponent },
  { path: 'error-page', component: ErrorPageComponent },
  { path: 'forbidden', component: ForbiddenPageComponent },

  { path: '**', redirectTo: 'notfound', pathMatch: 'full' },


];
