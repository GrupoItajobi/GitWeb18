import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { PanelModule } from 'primeng/panel';
import { BlockUIModule } from 'primeng/blockui';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DragDropModule } from 'primeng/dragdrop';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

import { CarregamentoSaida } from '../../../../models/carregamento-produto/CarregamentoSaida';
import { UnidadesComponent } from '../../../../components/unidades/unidades/unidades.component';
import { EstoqueProduto } from '../../../../models/producao/estoqueProduto';
import { CarregamentoAlterarOrdem } from './../../../../models/carregamento-produto/CarregamentoAlterarOrdem';
import { CarregamentoESaldo } from './../../../../models/carregamento-produto/CarregamentoESaldo';
import { CarregamentoFila } from './../../../../models/carregamento-produto/CarregamentoFila';
import { CaminhaoCarregamentoComponent } from './../../../../components/equipamentos/caminhao-carregamento/caminhao-carregamento/caminhao-carregamento.component';

import { TemPermissaoService } from '../../../../services/tem-permissao/tem-permissao.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { ErrorHandleService } from '../../../../services/error-handle/error-handle.service';
import { CarregamentoProdutoService } from '../../../../services/carregamento-produto/carregamento-produto.service';
import { UrlService } from '../../../../services/url/url.service';
import { SharedDataService } from '../../../../services/geral/shared/shared-data.service';

const tagCaminhaParaFila: string = 'tagCaminhaParaFila';
const tagRecarregar: string = 'tagRecarregar';

@Component({
  selector: 'app-carregamento-produto',
  standalone: true,
  imports: [
    CommonModule,
    BadgeModule,
    FormsModule,
    UnidadesComponent,
    ReactiveFormsModule,
    BlockUIModule,
    PanelModule,
    SelectButtonModule,
    CaminhaoCarregamentoComponent,
    DialogModule,
    InputNumberModule,
    DividerModule,
    ButtonModule,
    ToastModule,
    DragDropModule,
    InputMaskModule,
    InputTextModule,
    TableModule,
  ],
  templateUrl: './carregamento-produto.component.html',
  styleUrl: './carregamento-produto.component.scss',
})
export class CarregamentoProdutoComponent implements OnInit, OnDestroy {
  iconeCaminhaoOK =
    'https://gitweb.usinaitajobi.com.br/git-ged/layout/img/frota/caminhao-verde.png';
  iconeCaminhaoSemOrdem =
    'https://gitweb.usinaitajobi.com.br/git-ged/layout/img/frota/caminhao-amarelo.png';
  iconeCaminhaoBloqueado =
    'https://gitweb.usinaitajobi.com.br/git-ged/layout/img/frota/caminhao-vermelho.png';

  iconeInbox =
    'https://gitweb.usinaitajobi.com.br/git-ged/layout/img/sistema/inbox.png';
  iconeDestino =
    'https://gitweb.usinaitajobi.com.br/git-ged/layout/img/frota/destino.png';
  iconeCaminhaoDeCarga =
    'https://gitweb.usinaitajobi.com.br/git-ged/layout/img/frota/caminhao-de-carga.png';
  iconeCarregamento =
    'https://gitweb.usinaitajobi.com.br/git-ged/layout/img/frota/carregamento.png';

  //todos os carregadmento
  carregamentos?: CarregamentoFila[] = [];

  // carregamento distribuido por ciclo
  cicloDigPortaria?: CarregamentoFila[] = [];
  cicloFila?: CarregamentoFila[] = [];
  cicloBalEntrada?: CarregamentoFila[] = [];
  cicloFilaCarregamento?: CarregamentoFila[] = [];
  cicloEmCarregamento?: CarregamentoFila[] = [];
  cicloLiberadoCarregamento?: CarregamentoFila[] = [];
  cicloBalSaida?: CarregamentoFila[] = [];
  cicloDigExpedicao?: CarregamentoFila[] = [];
  cicloNF?: CarregamentoFila[] = [];
  cicloCT?: CarregamentoFila[] = [];
  cicloSaida?: CarregamentoFila[] = [];

  dragCarregamento?: any;

  disableButtonSave: boolean = true;

  saving: boolean = false;
  loading: boolean = false;

  intervalId?: number;
  ue?: string = '';
  contador: number = 0;

  visibleCreateOrdem: boolean = false;
  visibleEditCiclo: boolean = false;
  visibleEditBloqueio: boolean = false;
  visibleEncerrarCiclo: boolean = false;

  mapCarregamento = new Map<string, CarregamentoFila>();
  mapCaminhaoPorProduto = new Map<string, number>();
  formAddCarregamento!: FormGroup;
  formProdutoDisable: boolean = true;

  carregamentoEdicao: CarregamentoFila = {} as CarregamentoFila;

  blockedPanel: boolean = false;
  blockedPanelSaida: boolean = false;

  motivoEncerramento?: string;
  motivoBloqueio?: string;
  saldoProduto?: EstoqueProduto[];
  estoquePorArmazemTanque?: EstoqueProduto[];
  mapEstoquePorProduto = new Map<number, number[]>();

  opcoesTipoVenda: any[] = [
    { name: 'Interno', value: 'MI' },
    { name: 'Exportação', value: 'ME' },
  ];
  opcoesProduto: any[] = [
    { name: 'Açúcar', value: 'ACUCAR', quantidade: 0 },
    { name: 'Etanol', value: 'ETANOL', quantidade: 0 },
    { name: 'Óleo Fusel', value: 'OLEOFUSEL', quantidade: 0 },
    { name: 'Bagaço', value: 'BAGACO', quantidade: 0 },
    { name: 'Sucata', value: 'SUCATA', quantidade: 0 },
  ];
  produtoSelecionado: string = 'ETANOL';

  opcoesProdutoDetalhe?: any[];
  produtoDetalheSelecionado?: number;
  quantidadeTotalEstoque: number = 0;

  opcaoInfo: any[] = [
    // { name: "Básica", value: "B" },
    { name: 'Completa', value: 'C' },
  ];
  opcaoInfoSelecionada: string = 'B';
  infoFull: boolean = false;

  temPermissaoService = inject(TemPermissaoService);

  tagDragStart!: string;
  crud: string = 'C';

  posicaoInicial: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private toastMessageService: ToastService,
    private errorHandleService: ErrorHandleService,
    private painelCarregProdutoService: CarregamentoProdutoService,
    private urlService: UrlService,
    private router: Router,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    this.initFormAddCarregamento();
    this.init();
  }
  async init() {
    await this.buscarCarregamentos();
    // await this.urlService.permissaoParaoLink(this.router.url);
  }

  ngOnDestroy(): void {
    this.stopRefresh();
  }

  startRefresh() {
    if (!this.intervalId || this.intervalId == undefined) {
      this.intervalId = window.setInterval(() => {
        if (!this.loading) {
          this.buscarCarregamento();
        }
      }, 30000);
    }
  }

  stopRefresh() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  initCiclos() {
    this.cicloDigPortaria = [] as CarregamentoFila[];
    this.cicloFila = [] as CarregamentoFila[];
    this.cicloBalEntrada = [] as CarregamentoFila[];
    this.cicloFilaCarregamento = [] as CarregamentoFila[];
    this.cicloEmCarregamento = [] as CarregamentoFila[];
    this.cicloLiberadoCarregamento = [] as CarregamentoFila[];
    this.cicloBalSaida = [] as CarregamentoFila[];
    this.cicloDigExpedicao = [] as CarregamentoFila[];
    this.cicloNF = [] as CarregamentoFila[];
    this.cicloCT = [] as CarregamentoFila[];
    this.cicloSaida = [] as CarregamentoFila[];
  }

  selecionouUnidade(ue: string) {
    this.ue = ue;
    if (!this.intervalId) {
      this.startRefresh();
    }
    this.buscarCarregamento();
    this.buscarCarregamentos();
  }
  selecionouOpcaoProdutoDetalhe() {
    this.popularEstoque();
  }

  selecionouOpcaoInfo() {
    this.infoFull = false;
    if (this.opcaoInfoSelecionada == 'C') {
      this.infoFull = true;
    }
    this.buscarCarregamento();
  }

  selecionouCarregamento(info: any) {
    console.log(
      'eventClickEditar: ação:' + info.acao + ' - ' + info.idCarregamento
    );
    let carregamento: CarregamentoFila = this.mapCarregamento.get(
      info.idCarregamento
    )!;
    if (carregamento) {
      this.carregamentoEdicao = carregamento;

      if (info.acao == 'editarOrdem') {
        this.crud = 'U';
        this.stopRefresh();
        this.initFormAddCarregamento();
        this.visibleCreateOrdem = true;
      } else if (info.acao == 'editarBloqueio') {
        this.motivoBloqueio = this.carregamentoEdicao.obsComercialBloqueio;
        this.stopRefresh();
        this.visibleEditBloqueio = true;
      } else if (info.acao == 'fecharCiclo') {
        this.visibleEncerrarCiclo = true;
      } else if (info.acao == 'editarCiclo') {
        this.stopRefresh();
        this.visibleEditCiclo = true;
      }
    }
  }

  selecionouProduto() {
    this.produtoDetalheSelecionado = 0;
    this.buscarCarregamento();
  }

  async buscarCarregamento() {
    if (this.ue) {
      this.contador++;
      this.loading = true;
      this.blockedPanel = true;

      await this.painelCarregProdutoService
        .listarTodosAbertos(this.ue)
        .then((response) => {
          this.loading = false;
          this.blockedPanel = false;
          let carregamentoESaldo: CarregamentoESaldo = response;

          this.saldoProduto = carregamentoESaldo.estoqueProduto;
          this.carregamentos = carregamentoESaldo.carregamentos;
          this.contarCaminhaoPorProduto();
          this.classificarCarregamentos();
          this.popularOpcoesProdutoDetalhe();
          this.popularEstoque();
        })
        .catch((erro) => {
          this.loading = false;
          this.blockedPanel = false;
          this.errorHandleService.handle(erro);
        });
    }
  }

  popularEstoque() {
    this.mapEstoquePorProduto = new Map<number, number[]>();
    this.quantidadeTotalEstoque = 0;
    this.estoquePorArmazemTanque = [] as EstoqueProduto[];
    let incluir = true;
    let adicionarNoSaldo = true;
    this.saldoProduto?.forEach((s) => {
      incluir = true;
      adicionarNoSaldo = true;
      if (this.ue == 'VO-Cat' && s.codigoEmpresa == 10) {
        incluir = false;
      }
      if (this.ue == 'Itajobi' && s.codigoEmpresaLocalRetirada == 10) {
        incluir = false;
      }
      if (s.localArmazenamento && s.localArmazenamento == 'EXP') {
        adicionarNoSaldo = false;
      }
      if (adicionarNoSaldo) {
        let valor: number[] = [0, 0];
        if (this.mapEstoquePorProduto.has(s.codigoProduto!)) {
          valor = this.mapEstoquePorProduto.get(s.codigoProduto!)!;
        }
        valor[0] += s.quantidade!;
        valor[1] += s.quantidade!;
        let key: number = s.codigoProduto!;
        this.mapEstoquePorProduto.set(key, valor);
      }
      if (this.produtoDetalheSelecionado) {
        if (
          this.produtoSelecionado == s.tagProduto &&
          this.produtoDetalheSelecionado == s.codigoProduto &&
          s.codigoProduto &&
          s.descricaoProduto
        ) {
          if (incluir) {
            if (adicionarNoSaldo) {
              this.quantidadeTotalEstoque += s.quantidade!;
            }

            this.estoquePorArmazemTanque?.push(s);
          }
        }
      }
    });

    // distribui o saldo do produto
    this.cicloNF = this.simularSaldoEstoqueNoCiclo(this.cicloNF!);
    this.cicloLiberadoCarregamento = this.simularSaldoEstoqueNoCiclo(
      this.cicloLiberadoCarregamento!
    );
    this.cicloEmCarregamento = this.simularSaldoEstoqueNoCiclo(
      this.cicloEmCarregamento!
    );
    this.cicloFilaCarregamento = this.simularSaldoEstoqueNoCiclo(
      this.cicloFilaCarregamento!
    );
    this.cicloFila = this.simularSaldoEstoqueNoCiclo(this.cicloFila!);
  }

  simularSaldoEstoqueNoCiclo(ciclo: CarregamentoFila[]): CarregamentoFila[] {
    ciclo?.forEach((t) => {
      t.simuladoSaldoEstoque = 0;
      let key: number = t.produtoCodigo!;
      if (this.mapEstoquePorProduto.has(key)) {
        let valor = this.mapEstoquePorProduto.get(key);
        valor![1] -= t.quantidadeVolumePed!;
        t.simuladoSaldoEstoque = valor![1];
        this.mapEstoquePorProduto.set(key, valor!);
      }
    });
    return ciclo;
  }
  saldoComprometido(produto: number): number {
    let saldo = this.saldoSimulado(produto);
    return this.quantidadeTotalEstoque! - saldo;
  }
  saldoSimulado(produto: number): number {
    let saldo: number[] = [0, 0];
    if (produto) {
      saldo = this.mapEstoquePorProduto.get(produto)!;
    }
    return saldo[1]!;
  }
  popularOpcoesProdutoDetalhe() {
    this.opcoesProdutoDetalhe = [];
    let map = new Map<number, string>();
    this.opcoesProdutoDetalhe = [];
    this.saldoProduto?.forEach((s) => {
      if (
        this.produtoSelecionado == s.tagProduto &&
        s.codigoProduto &&
        s.descricaoProduto
      ) {
        map.set(s.codigoProduto, s.descricaoProduto);
      }
    });
    map.forEach((k, v) => {
      let detalhe: any = { name: k, value: v };
      this.opcoesProdutoDetalhe?.push(detalhe);
    });
  }

  contarCaminhaoPorProduto() {
    this.mapCaminhaoPorProduto = new Map<string, number>();
    if (this.carregamentos) {
      this.carregamentos.forEach((c) => {
        if (c.produto) {
          let key = c.produto;
          let valor = this.mapCaminhaoPorProduto.get(key!);
          if (this.mapCaminhaoPorProduto.has(key!)) {
            valor = this.mapCaminhaoPorProduto.get(key!);
          }
          if (valor === undefined) valor = 0;
          this.mapCaminhaoPorProduto.set(key!, ++valor);
        }
      });

      this.opcoesProduto.forEach((op) => {
        let valor = this.mapCaminhaoPorProduto.get(op.value);
        op.quantidade = valor;
      });
    }
  }

  popularMapCarregamento() {
    this.mapCarregamento = new Map<string, CarregamentoFila>();
    if (this.carregamentos) {
      this.carregamentos.forEach((c) => {
        this.mapCarregamento.set(c.idCarregamentoFila!, c);
      });
    }
  }

  classificarCarregamentos() {
    this.initCiclos();
    this.popularMapCarregamento();

    if (this.carregamentos) {
      this.carregamentos.forEach((c) => {
        if (c.produto === this.produtoSelecionado) {
          c.icone = this.iconeCaminhaoOK;

          if (c.checkpoint! == 'DigPortaria') {
            this.cicloFila?.push(c);
          } else if (c.checkpoint! == 'Fila') {
            this.cicloFila?.push(c);
          } else if (c.checkpoint! == 'BalEntrada') {
            this.cicloBalEntrada?.push(c);
          } else if (
            c.checkpoint! == 'Carregamento' ||
            c.checkpoint! == 'FilaCarregamento'
          ) {
            this.cicloFilaCarregamento?.push(c);
          } else if (c.checkpoint! == 'EmCarregamento') {
            this.cicloEmCarregamento?.push(c);
          } else if (c.checkpoint! == 'LiberadoCarregamento') {
            this.cicloLiberadoCarregamento?.push(c);
          } else if (c.checkpoint! == 'BalSaida') {
            this.cicloBalSaida?.push(c);
          } else if (c.checkpoint! == 'DigExpedicao') {
            this.cicloDigExpedicao?.push(c);
          } else if (c.checkpoint! == 'NF') {
            this.cicloNF?.push(c);
          } else if (c.checkpoint! == 'CT') {
            this.cicloCT?.push(c);
          } else if (c.checkpoint! == 'Saida') {
            this.cicloSaida?.push(c);
          }
        }
      });
      this.cicloFila = this.ordernarCarregamentos(this.cicloFila!);
      this.cicloBalEntrada = this.ordernarCarregamentos(this.cicloBalEntrada!);
      this.cicloFilaCarregamento = this.ordernarCarregamentos(
        this.cicloFilaCarregamento!
      );
      this.cicloEmCarregamento = this.ordernarCarregamentos(
        this.cicloEmCarregamento!
      );
      this.cicloLiberadoCarregamento = this.ordernarCarregamentos(
        this.cicloLiberadoCarregamento!
      );
      this.cicloBalSaida = this.ordernarCarregamentos(this.cicloBalSaida!);
      this.cicloDigExpedicao = this.ordernarCarregamentos(
        this.cicloDigExpedicao!
      );
      this.cicloNF = this.ordernarCarregamentos(this.cicloNF!);
      this.cicloCT = this.ordernarCarregamentos(this.cicloCT!);
    }
  }
  ordernarCarregamentos(lista: CarregamentoFila[]): CarregamentoFila[] {
    lista?.sort((a, b) => {
      let timeA = a.filaSequencia; // ignore upper and lowercase
      let timeB = b.filaSequencia; // ignore upper and lowercase
      // if (ordenarPor == 'Ciclo') {
      //   timeA = a.ordemCiclo; // ignore upper and lowercase
      //   timeB = b.ordemCiclo; // ignore upper and lowercase
      // }
      // ordem decrescente

      if (timeA! < timeB!) {
        return -1;
      }
      if (timeA! > timeB!) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    return lista;
  }

  salvarCrudCarregamento() {
    let carregamento: CarregamentoFila = this.formAddCarregamento.value;
    carregamento.produto = this.produtoSelecionado;
    this.saving = true;
    if (carregamento.idCarregamentoFila) {
      this.alterarCarregamento(carregamento);
    } else {
      this.incluirCarregamento(carregamento);
    }
  }
  async alterarCarregamento(carregamento: CarregamentoFila) {
    console.log(carregamento);
    await this.painelCarregProdutoService
      .alterar(carregamento)
      .then((request) => {
        this.saving = false;
        this.carregamentoEdicao = {};
        this.fecharDialogCreateCarregamento();
        this.fecharDialogEditBloqueio();
        this.buscarCarregamento();
      })
      .catch((erro) => {
        this.errorHandleService.handle(erro);
        this.saving = false;
      });
  }

  async incluirCarregamento(carregamento: CarregamentoFila) {
    await this.painelCarregProdutoService
      .incluir(carregamento)
      .then((request) => {
        this.saving = false;
        this.carregamentoEdicao = {};
        this.fecharDialogCreateCarregamento();
        this.buscarCarregamento();
      })
      .catch((erro) => {
        this.errorHandleService.handle(erro);
        this.saving = false;
      });
  }
  fecharDialogCreateCarregamento() {
    this.visibleCreateOrdem = false;
    this.startRefresh();
  }
  fecharDialogEncerrarCiclo() {
    this.visibleEncerrarCiclo = false;
  }
  fecharDialogEditCiclo() {
    this.visibleEditCiclo = false;
  }
  fecharDialogEditBloqueio() {
    this.visibleEditBloqueio = false;
  }
  onDragStartCarregamento(
    posicao: number,
    tagDragStart: string,
    carregamento: CarregamentoFila
  ) {
    this.tagDragStart = tagDragStart;
    this.carregamentoEdicao = carregamento;
    this.posicaoInicial = posicao;
  }

  async onDropCarregamento(
    posicao: number,
    ciclo: string,
    carregamentos: CarregamentoFila[]
  ) {
    if (ciclo == this.tagDragStart) {
      if (this.temPermissaoService.temTag('AlterarFila', this.ue)) {
        let dataInicio: Date;
        let dataFim: Date;
        if (posicao < this.posicaoInicial) {
          dataFim = carregamentos[posicao].ordemFila!;
          if (posicao > 0) {
            dataInicio = carregamentos[posicao - 1].ordemFila!;
          }
        } else {
          dataInicio = carregamentos[posicao].ordemFila!;
          if (posicao < carregamentos.length - 1) {
            dataFim = carregamentos[posicao + 1].ordemFila!;
          }
        }

        let ordem: CarregamentoAlterarOrdem = {
          idCarregamento: this.carregamentoEdicao.idCarregamentoFila!,
          dataInicio: dataInicio!,
          dataFim: dataFim!,
        };
        await this.painelCarregProdutoService
          .alterarOrdem(ordem)
          .then(() => {
            this.toastMessageService.showSuccessMsg('Ordem Fila Alterada!');
            this.buscarCarregamento();
          })
          .catch((error) => {
            this.errorHandleService.handle(error);
          });
      } else {
        this.toastMessageService.showInfoMsg(
          'Acesso para alterar Ordem da Fila não liberado!'
        );
      }
    } else {
      this.toastMessageService.showInfoMsg(
        'Não é permitida transferir da ' + this.tagDragStart + ' para ' + ciclo
      );
    }
  }

  onDropCreate() {
    this.crud = 'C';
    if (this.tagDragStart == tagCaminhaParaFila) {
      console.log('opçãoProduto: ' + this.produtoSelecionado);
      if (this.produtoSelecionado) {
        console.log('entrei');

        this.stopRefresh();
        this.carregamentoEdicao = {} as CarregamentoFila;
        this.carregamentoEdicao = {
          ue: this.ue,
          produto: this.produtoSelecionado,
          tipoVenda: 'MI',
        };

        this.initFormAddCarregamento();

        this.disableButtonSave = true;
        this.visibleCreateOrdem = true;
      } else {
        this.toastMessageService.showInfoMsg('Selecionar o Produto!');
      }
    } else {
      this.toastMessageService.showInfoMsg('Tag não pode ser movido aqui!');
    }
  }

  async onDropRecarregar() {
    this.blockedPanelSaida = true;
    if (this.dragCarregamento.dragFrom == tagRecarregar) {
      let saida: CarregamentoSaida = {
        tipoEncerramento: tagRecarregar,
        idCarregamentoFila:
          this.dragCarregamento.carregamento.idCarregamentoFila,
      };
      await this.salvarEncerramento(saida);
    } else {
      this.toastMessageService.showInfoMsg('Não Permitido!');
    }
  }
  async onDropSaida() {
    this.blockedPanelSaida = true;
    if (this.dragCarregamento.dragFrom == 'CT') {
      let saida: CarregamentoSaida = {
        tipoEncerramento: 'N',
        idCarregamentoFila:
          this.dragCarregamento.carregamento.idCarregamentoFila,
      };
      await this.salvarEncerramento(saida);
    } else {
      this.toastMessageService.showInfoMsg('Não Permitido!');
    }
  }
  async salvarCiclo() {}
  async salvarBloqueio() {
    this.carregamentoEdicao.obsComercialBloqueio = this.motivoBloqueio;
    this.initFormAddCarregamento();
    this.salvarCrudCarregamento();
  }
  async salvarEncerramentoCiclo() {
    let saida: CarregamentoSaida = {
      tipoEncerramento: 'C',
      idCarregamentoFila: this.carregamentoEdicao!.idCarregamentoFila!,
      motivoEncerramento: this.motivoEncerramento,
    };
    await this.salvarEncerramento(saida)
      .then((request) => {
        this.visibleEncerrarCiclo = false;
      })
      .catch();
  }

  async salvarRecarregamento(saida: CarregamentoSaida): Promise<boolean> {
    return await this.painelCarregProdutoService
      .recarregamento(saida)
      .then((response) => {
        this.blockedPanelSaida = false;
        this.buscarCarregamento();
        return true;
      })
      .catch((erro) => {
        this.errorHandleService.handle(erro);
        this.blockedPanelSaida = false;
        return false;
      });
  }

  async salvarEncerramento(saida: CarregamentoSaida): Promise<boolean> {
    console.log(saida);
    return await this.painelCarregProdutoService
      .saida(saida)
      .then((response) => {
        this.blockedPanelSaida = false;
        this.buscarCarregamento();
        return true;
      })
      .catch((erro) => {
        this.errorHandleService.handle(erro);
        this.blockedPanelSaida = false;
        return false;
      });
  }

  dragStart(tagDragStart: string) {
    this.tagDragStart = tagDragStart;
  }

  dragStartCT(carregamento: CarregamentoFila) {
    this.dragCarregamento = {
      dragFrom: 'CT',
      carregamento: carregamento,
    };
  }
  dragStartExpedicaoOuNF(carregamento: CarregamentoFila) {
    this.dragCarregamento = {
      dragFrom: 'ExpOuNF',
      carregamento: carregamento,
    };
  }

  dragEnd() {
    console.log('dragEnd');
    this.tagDragStart = '';
  }
  onHideDialogCreate() {
    this.startRefresh();
  }
  onHideDialogEncerrarCicloCreate() {
    this.startRefresh();
  }
  onHideDialogEditCiclo() {
    this.startRefresh();
  }
  onHideDialogEditBloqueio() {
    this.startRefresh();
  }

  initFormAddCarregamento() {
    this.formAddCarregamento = this.formBuilder.group({
      idCarregamentoFila: new FormControl(
        this.carregamentoEdicao.idCarregamentoFila
      ),
      ue: new FormControl(this.carregamentoEdicao.ue),
      motoristaNome: new FormControl(
        this.carregamentoEdicao.motoristaNome,
        Validators.required
      ),
      transportadora: new FormControl(this.carregamentoEdicao.transportadora),
      motoristaCPF: new FormControl(
        this.carregamentoEdicao.motoristaCPF,
        Validators.required
      ),
      clienteNome: new FormControl(
        this.carregamentoEdicao.clienteNome,
        Validators.required
      ),
      tipoVenda: new FormControl(
        this.carregamentoEdicao.tipoVenda,
        Validators.required
      ),
      caminhaoPlaca: new FormControl(
        this.carregamentoEdicao.caminhaoPlaca,
        Validators.required
      ),
      produto: new FormControl({
        value: this.carregamentoEdicao.produto,
        disabled: this.formProdutoDisable,
      }),
      nrOrdemRetirada: new FormControl(this.carregamentoEdicao.nrOrdemRetirada),
      temperatura: new FormControl(this.carregamentoEdicao.temperatura),
      quantidadeVolume: new FormControl(
        this.carregamentoEdicao.quantidadeVolume
      ),
      obsComercialBloqueio: new FormControl(
        this.carregamentoEdicao.obsComercialBloqueio
      ),
    });

    this.formAddCarregamento.valueChanges.subscribe((newValue) => {
      this.checkChanges(newValue);
    });
  }

  checkChanges(change: any) {
    this.checkDisableBotoes();
  }

  checkDisableBotoes() {
    this.disableButtonSave = true;

    console.log(this.formAddCarregamento.valid);
    if (this.formAddCarregamento.valid) {
      this.disableButtonSave = false;
    }
  }

  async buscarCarregamentos() { 

    if (this.ue) {
      await this.painelCarregProdutoService
        .listarTodosAbertos(this.ue)
        .then((response) => {
          this.loading = false;
          this.blockedPanel = false;
          this.sharedDataService.setData(response);

        })
        .catch((erro) => {
          this.loading = false;
          this.blockedPanel = false;
          this.errorHandleService.handle(erro);
        });
    }
  }
}
