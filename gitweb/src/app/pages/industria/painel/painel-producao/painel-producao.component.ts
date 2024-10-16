import { ProducaoService } from '../../../../services/produto/producao.service';
import { RotacaoMoendaPainelProducao } from './../../../../models/industria/painel/painel-producao/rotacaoMoendaPainelproducao';
import { RotacaoMoendaPainelProducaoService } from './../../../../services/rotacao-moenda/rotacao-moenda-painel-producao.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';
import { ErrorHandleService } from './../../../../services/error-handle/error-handle.service';
import { UnidadeEmpresaService } from '../../../../services/empresa/unidade-empresa.service';
import { UnidadesComponent } from '../../../../components/unidades/unidades/unidades.component';

import { UE } from '../../../../models/empresa/ue';
import { dateToString, dividir, nowString } from '../../../../core/util/gitweb-util';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Producao } from '../../../../models/producao/producao';
import { ProdutosPorUeComponent } from "../../../producao/produtos-por-ue/produtos-por-ue.component";

const documentStyle = getComputedStyle(document.documentElement);

const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
const surfaceBorder = documentStyle.getPropertyValue('--surface-border');





@Component({
  selector: 'app-painel-producao',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    TabViewModule,
    UnidadesComponent,
    PanelModule,
    ChartModule,
    DividerModule,
    TableModule,
    ProdutosPorUeComponent
],
  templateUrl: './painel-producao.component.html',
  styleUrl: './painel-producao.component.scss'
})
export class PainelProducaoComponent implements OnInit {

  @ViewChild("meuCanvas", { static: false }) elemento!: ElementRef;

  visaoRotacao = 'rotacao';
  visaoDesempenho = 'desempenho';
  visaoProducao = 'producao';

  colorsResponsavel = new Map<string, string>();
  colorsResponsavelHover = new Map<string, string>();
  rotacoesMoenda: RotacaoMoendaPainelProducao[] = [];
  mapRotacao = new Map<string, RotacaoMoendaPainelProducao[]>();
  mapUeMoendas = new Map<string, string[]>();


  mapRotacaoAlteracao = new Map<string, Map<string, RotacaoMoendaPainelProducao[]>>();

  mapGraficoRotacao = new Map<string, any>();
  mapGraficoDisponibilidade = new Map<string, any>();
  mapGraficoStackedRotacaoHist = new Map<string, any>();

  unidadesVisiveis: number = 3;

  intervalId?: number;
  unidades: UE[] = [];
  ueSelecionada: string = "Itajobi";

  loading: boolean = false;


  responsiveOptions: any[] | undefined;

  dispMoendaData: any;
  dispMoendaOptions: any;


  rotacaoMoendaData: any;
  rotacaoMoendaData1: any;
  rotacaoMoendaOptions: any;

  chartStackedBarRotacaoHistData: any;
  chartStackedBarRotacaoAtualData: any;
  chartStackedBarRotacaoAtualOptions: any;
  chartStackedBarRotacaoHistOptions: any;


  visaoSelecionada: string = this.visaoRotacao;


  producaoDia:Producao[]=[];

  constructor(
    private ueService: UnidadeEmpresaService,
    private errorHandleService: ErrorHandleService,
    private rotacaoPainelProducaoService: RotacaoMoendaPainelProducaoService,
    private producaoService: ProducaoService,
  ) { }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    this.carregarColorsResponsavel();
    this.loadChartOptions()
    await this.loadUnidades();
    await this.loadRotacao();
    await this.startRefresh();
  }



  async startRefresh() {
    if (!this.intervalId || this.intervalId == undefined) {
      this.intervalId = window.setInterval(() => {
        if (!this.loading) {
          this.loadRotacao();
        }
      }, 30000);
    }
  }

  async loadUnidades() {

    await this.ueService.listarTodas()
      .then(response => {
        this.unidades = response;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
  }

  clickRotacao() {
    this.visaoSelecionada = this.visaoRotacao;
  }

  async clickProducao() {
    await this.producaoService.listarProducao()
    .then( response => {
      this.producaoDia = response;
      console.log(this.producaoDia);
    })
    .catch(error=> {
      this.errorHandleService.handle(error)
    })

    this.visaoSelecionada = this.visaoProducao;
  }
  clickDesempenho() {
    this.visaoSelecionada = this.visaoDesempenho;
  }

  carregarColorsResponsavel() {
    this.colorsResponsavel.set('Moagem', documentStyle.getPropertyValue('--green-500'));
    this.colorsResponsavel.set('Clima', documentStyle.getPropertyValue('--gray-500'));
    this.colorsResponsavel.set('Agrícola', documentStyle.getPropertyValue('--yellow-500'));
    this.colorsResponsavel.set('Indústria', documentStyle.getPropertyValue('--blue-500'));

    this.colorsResponsavelHover.set('Moagem', documentStyle.getPropertyValue('--green-400'));
    this.colorsResponsavelHover.set('Clima', documentStyle.getPropertyValue('--gray-400'));
    this.colorsResponsavelHover.set('Agrícola', documentStyle.getPropertyValue('--yellow-400'));
    this.colorsResponsavelHover.set('Indústria', documentStyle.getPropertyValue('--blue-400'));
  }
  selecionouUnidade(ue: string) {
    this.ueSelecionada = ue;
    this.mapearGraficosPorUnidade();
  }

  async loadRotacao() {
    await this.rotacaoPainelProducaoService.listarRotacaoPainel()
      .then(response => {
        this.rotacoesMoenda = response;
        this.mapearRotacao();
        this.mapearMapUeMoendas();
        this.chartStackedBarRotacaoAtual();
        this.mapearRotacaoAlteracao();
        this.mapearGraficosPorUnidade();

      })
      .catch(error => {
        this.errorHandleService.handle(error);
      });

  }


  mapearRotacaoAlteracao() {
    this.mapRotacaoAlteracao.clear();
    this.rotacoesMoenda.forEach(t => {

      let mapMoendaDescricao = new Map<string, RotacaoMoendaPainelProducao[]>();
      let rotacoes: RotacaoMoendaPainelProducao[] = [];

      if (this.mapRotacaoAlteracao.has(t.moendaUe!)) {
        mapMoendaDescricao = this.mapRotacaoAlteracao.get(t.moendaUe!)!
        if (mapMoendaDescricao.has(t.moendaDescricao!)) {
          rotacoes = mapMoendaDescricao.get(t.moendaDescricao!)!;
        }

      }
      rotacoes.push(t);
      mapMoendaDescricao.set(t.moendaDescricao!, rotacoes)
      this.mapRotacaoAlteracao.set(t.moendaUe!, mapMoendaDescricao!)
    })

    console.log(this.mapRotacaoAlteracao)
  }

  mapearMapUeMoendas() {

    let map = new Map<string, Map<string, string>>();
    this.mapUeMoendas.clear();
    this.rotacoesMoenda.forEach(t => {
      let moendas = new Map<string, string>();
      if (map.has(t.moendaUe!)) {
        moendas = map.get(t.moendaUe!)!
      }
      moendas.set(t.moendaDescricao!, '');
      map.set(t.moendaUe!, moendas)
    });

    this.mapUeMoendas.clear();


    map.forEach((valueUe, keyUe) => {
      valueUe.forEach((valueMoenda, keyMoenda) => {

        let moenda: string[] = [];
        if (this.mapUeMoendas.has(keyUe)) {
          moenda = this.mapUeMoendas.get(keyUe)!
        }
        moenda.push(keyMoenda);
        this.mapUeMoendas.set(keyUe, moenda);
      })
    })
  }

  mapearRotacao() {
    this.mapRotacao.clear();
    this.rotacoesMoenda.forEach(t => {
      let rotacoes: RotacaoMoendaPainelProducao[] = [];
      if (this.mapRotacao.has(t.moendaUe!)) {
        rotacoes = this.mapRotacao.get(t.moendaUe!)!
      }
      rotacoes.push(t);
      this.mapRotacao.set(t.moendaUe!, rotacoes)
    })
  }

  mapearGraficosPorUnidade() {

    this.unidades.forEach(ue => {
      this.chartLineAlteracaoRotacaoMoenda(ue.id!);
      this.chartPieDisponibilidadeMoenda(ue.id!);
      this.chartStackedBarRotacaoHistorico(ue.id!);
    })
  }

  chartStackedBarRotacaoAtual() {

    let labels: any[] = [];
    let mapResumoPorUnidade = new Map<string, number[]>();
    this.mapUeMoendas.forEach((value, key) => {
      labels.push(key);
    })
    this.rotacoesMoenda.forEach(r => {
      if (!r.dataFim) {
        let valor: number[] = [0, 0];
        if (mapResumoPorUnidade.has(r.moendaUe!)) {
          valor = mapResumoPorUnidade.get(r.moendaUe!)!;
        }
        valor[0] += r.rotacaoPonderadaIdeal!;
        valor[1] += r.rotacaoPonderadaAtual!;
        mapResumoPorUnidade.set(r.moendaUe!, valor);
      }
    })
    let valoresOK: number[] = [];
    let valoresAbaixo: number[] = [];
    let valoresParado: number[] = [];
    mapResumoPorUnidade.forEach((value, key) => {

      if (value[1] == 0) {
        value[0] = 0;
        value[1] = 0;
        value[2] = 100;
      } else {
        let perc = Math.round(dividir(value[1], value[0]) * 1000) / 10;
        value[0] = perc;
        value[1] = 100 - perc;
        value[2] = 0
      }
      valoresOK.push(value[0]);
      valoresAbaixo.push(value[1]);
      valoresParado.push(value[2]);
    });
    let dataset: any[];
    dataset = [
      {
        type: 'bar',
        label: 'Rotação',
        backgroundColor: documentStyle.getPropertyValue('--green-500'),
        data: valoresOK,

      },
      {
        type: 'bar',
        label: 'Rotação Abaixo',
        backgroundColor: documentStyle.getPropertyValue('--yellow-200'),
        data: valoresAbaixo
      },
      {
        type: 'bar',
        label: 'Parado',
        backgroundColor: documentStyle.getPropertyValue('--red-500'),
        data: valoresParado
      }
    ];

    let data = {
      labels: labels,
      datasets: dataset,

    };

    this.chartStackedBarRotacaoAtualData = data;

  }


  chartPieDisponibilidadeMoenda(ue: string) {
    let total: number = 0
    let moagem: number = 0;
    let industria: number = 0;
    let agricola: number = 0;
    let clima: number = 0;

    if (this.mapRotacao.has(ue)) {
      this.mapRotacao.get(ue)?.forEach(r => {

        // somente o que esta acontecendo a partir da 07:00
        if (r.dataIndustriaNow === r.dataIndustriaRotacao) {

          total += r.rotacaoPonderadaIdeal!;
          if (r.responsavelId === 'CLI') {
            clima += r.rotacaoPonderadaIdeal! - r.rotacaoPonderadaAtual!;
          } else if (r.responsavelId === 'AGR') {
            agricola += r.rotacaoPonderadaIdeal! - r.rotacaoPonderadaAtual!;
          } else if (r.responsavelId === 'IND') {
            industria += r.rotacaoPonderadaIdeal! - r.rotacaoPonderadaAtual!;
          }
        }
      })
    }

    moagem = total - clima - agricola - industria;
    let percMoagem = Math.round(dividir(moagem, total) * 1000) / 10;
    let percIndustria = Math.round(dividir(industria, total) * 1000) / 10;
    let percAgricola = Math.round(dividir(agricola, total) * 1000) / 10;
    let percClima = Math.round(dividir(clima, total) * 1000) / 10;
    let data = {
      labels: ['Moagem [ ' + percMoagem + '% ]', 'Clima [ ' + percClima + ' %]', 'Agrícola [ ' + percAgricola + '% ]', 'Indústria [ ' + percIndustria + '% ]'],
      datasets: [
        {
          data: [moagem, clima, agricola, industria],
          fill: false,
          backgroundColor: [
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--gray-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--blue-500'),

          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--green-400'),
            documentStyle.getPropertyValue('--gray-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--blue-400'),

          ],

        },

      ]
    };

    this.mapGraficoDisponibilidade.set(ue, data)

  }



  chartStackedBarRotacaoHistorico(ue: string) {
    let labels: any[] = [];
    let mapLabel = new Map<string, string>();
    let mapResumoRespDia = new Map<string, Map<string, number[]>>();
    let mapResumoDiaResp = new Map<string, Map<string, number[]>>();

    //-----------------------------------------------------------------------------
    // acumular por Dia Responsavel
    this.mapRotacao.get(ue)?.forEach(r => {

      let mapDia = new Map<string, number[]>();
      let mapResp = new Map<string, number[]>();
      let valores: number[] = [0, 0, 0];
      let keyData: string = dateToString(r.dataIndustriaRotacao!, false);
      mapLabel.set(keyData, "");

      let keyResp: string = r.responsavelDescricao!;

      if (mapResumoDiaResp.has(keyData)) {
        mapResp = mapResumoDiaResp.get(keyData)!
        if (mapResp.has(keyResp)) {
          valores = mapResp.get(keyResp)!;
        }
      }
      valores[0] += r.rotacaoPonderadaIdeal!;
      valores[1] += r.rotacaoPonderadaIdeal! - r.rotacaoPonderadaAtual!;
      mapResp.set(keyResp, valores);
      mapResumoDiaResp.set(keyData, mapResp);
    });
    mapLabel.forEach((valueLable, keyLabel) => {
      labels.push(keyLabel)
    })

    mapResumoDiaResp.forEach((valueDia, keyDia) => {
      let valorTotal: number[] = [0, 0, 0]
      let valorRotacao: number[] = [0, 0, 0];

      //Totalizar o dia para distribuir entre os responsaveis
      valueDia.forEach((valueResp, keyResp) => {
        valorTotal[0] += valueResp[0];
        valorTotal[1] += valueResp[1];
      });



      //distribuição em percentual
      let totalPerc: number = 0;
      valueDia.forEach((valueResp, keyResp) => {
        valueResp[1] = Math.round(dividir(valueResp[1], valorTotal[0]) * 1000) / 10;
        if (keyResp != 'Moagem') {
          totalPerc += valueResp[1];
        }
      });

      // ajustando a Moagem
      let valorMoagem: number[] = [0, 0, 0];
      valorMoagem[1] = 100 - totalPerc;
      valueDia.set('Moagem', valorMoagem);
    });

    // acumulando por Responsavel e dia, para ser distribuido no Grafico Staked

    let valores: number[] = [0, 0, 0];
    mapResumoDiaResp.forEach((valueDia, keyDia) => {
      valueDia.forEach((valueResp, keyResp) => {
        let mapDia = new Map<string, number[]>();
        if (mapResumoRespDia.has(keyResp)) {
          mapDia = mapResumoRespDia.get(keyResp)!;
        }
        mapDia.set(keyDia, valueResp);
        mapResumoRespDia.set(keyResp, mapDia);
      })
    })

    // carreganddo datasets
    let datasets: any[] = [];

    this.colorsResponsavel.forEach((value, key) => {
      let achou: boolean = false;
      mapResumoRespDia.forEach((valueResp, keyResp) => {
        if (keyResp === key) {
          achou = true;
          let valores: number[] = [];
          labels.forEach(label => {
            let valor: number[] = [0, 0, 0];
            if (valueResp.has(label)) {
              valor = valueResp.get(label)!;
            }
            valores.push(valor[1])
          })
          datasets.push(
            {
              type: 'bar',
              label: keyResp,
              backgroundColor: this.colorsResponsavel.get(keyResp),
              data: valores,

            }
          );
        }

      });

      if (!achou) {
        datasets.push(
          {
            type: 'bar',
            label: key,
            backgroundColor: this.colorsResponsavel.get(key),
            data: valores,

          }
        );
      }

    })

    let data = {
      labels: labels,
      datasets: datasets,
    };

    this.mapGraficoStackedRotacaoHist.set(ue!, data);

  }

  chartLineAlteracaoRotacaoMoenda(ue: string) {

    if (this.mapUeMoendas.has(ue)) {
      this.mapUeMoendas.get(ue)?.forEach(moenda => {
        let labels: string[] = [];
        let dataRotacaoIdeal: number[] = []
        let dataRotacaoAtual: number[] = []
        let dataRotacaoRetorno: number[] = []
        let dataset: any[] = [];
        let gerarGrafico: boolean = false;
        let ultimaRotacao: RotacaoMoendaPainelProducao = {};
        if (this.mapRotacao.has(ue)) {

          this.mapRotacao.get(ue)?.forEach(r => {

            if (r.moendaDescricao === moenda) {
              let strDate = dateToString(r.dataInicio!);
              strDate = 'd' + strDate.substring(8, 10) + ' h' + strDate.substring(11, 16);
              labels.push(strDate)
              dataRotacaoIdeal.push(r.rotacaoIdeal!)
              dataRotacaoAtual.push(r.rotacaoAtual!)
              dataRotacaoRetorno.push(0)
              gerarGrafico = true;
              if (!r.dataFim) {
                ultimaRotacao = r;
              }
            }
          });
          let strDate = nowString();
          strDate = 'd' + strDate.substring(8, 10) + ' h' + strDate.substring(11, 16);
          labels.push(strDate)

          if (ultimaRotacao.id) {
            ultimaRotacao.dataInicio = new Date;
            dataRotacaoIdeal.push(ultimaRotacao.rotacaoIdeal!)
            dataRotacaoAtual.push(ultimaRotacao.rotacaoAtual!)
            dataRotacaoRetorno.push(0)

            if (ultimaRotacao.dataPrevistaRetorno) {
              let strDate = dateToString(ultimaRotacao.dataPrevistaRetorno);
              strDate = 'd' + strDate.substring(8, 10) + ' h' + strDate.substring(11, 16);
              labels.push(strDate)
              ultimaRotacao.dataInicio = ultimaRotacao.dataPrevistaRetorno;
              dataRotacaoIdeal.push(ultimaRotacao.rotacaoIdeal!)
              dataRotacaoAtual.push(ultimaRotacao.rotacaoAtual!)
              dataRotacaoRetorno.push(ultimaRotacao.rotacaoIdeal!)
            }

          }
          dataset = [
            {
              label: 'Atual ',
              fill: false,
              borderColor: documentStyle.getPropertyValue('--blue-500'),
              yAxisID: 'y',
              tension: 0,
              data: dataRotacaoAtual,
            },
            {
              label: 'Ideal ',
              fill: false,
              borderColor: documentStyle.getPropertyValue('--green-500'),
              yAxisID: 'y',
              tension: 0,
              data: dataRotacaoIdeal,
            },
            {
              type: 'bar',
              label: 'Prev.Ret',
              fill: false,
              borderColor: documentStyle.getPropertyValue('--green-500'),
              yAxisID: 'y',
              tension: 0,
              data: dataRotacaoRetorno,
            },


          ]
        }

        if (gerarGrafico) {
          let data = {
            labels: labels,
            datasets: dataset
          };
          this.mapGraficoRotacao.set(ue + ":" + moenda, data)
        }

      })

    }

  }


  loadChartOptions() {
    this.loadChartStackedBarRotacaoHistOptions();
    this.loadChartStackedBarRotacaoAtualOptions();
    this.loadChartRotacaoOptions();
    this.loadChartPieDisponibilidadeMoendaOptions();
  }

  loadChartStackedBarRotacaoHistOptions() {
    this.chartStackedBarRotacaoHistOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,

      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          borderRadius: 4,
          backgroundColor: 'teal',
          color: 'white',
          borderColor: 'black',

          font: {
            weight: 'bold'
          }
        },
        title: {
          display: true,
          text: 'Histórico de Rotação de Moenda',
          fontSize: 60
        },
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          position: 'top',
          labels: {
            color: textColorSecondary
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            drawBorder: false
          }
        }
      }
    };
  }

  loadChartStackedBarRotacaoAtualOptions() {
    this.chartStackedBarRotacaoAtualOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,

      plugins: {
        datalabels: {
          anchor: 'center',
          align: 'center',
          color: 'white',
          font: {
            weight: 'bold'
          },
          formatter: Math.round
        },
        title: {
          display: true,
          text: 'Rotação de Moenda Atual',
          fontSize: 60
        },
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          position: 'top',
          labels: {
            color: textColorSecondary
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            drawBorder: false
          }
        }
      }
    };
  }

  loadChartPieDisponibilidadeMoendaOptions() {

    this.dispMoendaOptions = {
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          borderRadius: 4,
          backgroundColor: 'teal',
          color: 'white',
          borderColor: 'black',

          font: {
            weight: 'bold'
          }
        },
        title: {
          display: true,
          text: 'Rotação da Moenda - Inicio 07:00',
          fontSize: 16
        },
        legend: {
          position: 'top'
        },


      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            drawBorder: true
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            drawBorder: true
          }
        }
      }
    };

    return this.dispMoendaOptions;
  }

  loadChartRotacaoOptions() {
    this.rotacaoMoendaOptions = {
      legend: {
        labels: {
          fontSize: 8
        }
      },

      maintainAspectRatio: true,
      aspectRatio: 0.6,
      plugins: {
        datalabels: {
          align: 'center',
          anchor: 'end',
          borderRadius: 4,
          backgroundColor: 'teal',
          color: 'white',
          font: {
            weight: 'bold',
            size: 8,
          },
          title: {
            display: true,
            text: 'Rotação Moenda'
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary,
                fontSize: 14
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            },
            y: {
              ticks: {
                color: textColorSecondary,
                fontSize: 24
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false
              }
            }
          },
        },

      },

    };
  }
}
