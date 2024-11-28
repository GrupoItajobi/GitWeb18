import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';

import { ToastService } from '../../../../../services/toast/toast.service';
import { FolhaEventosService } from './../../../../../services/rh/folha/eventos/folha-eventos.service';
import { ErrorHandleService } from '../../../../../services/error-handle/error-handle.service';

import { FolhaEventoPonto } from '../../../../../models/rh/folha/eventos-pontos/folha-evento-divergencia';
import { ButtonModule } from 'primeng/button';
import { BloquearTelaComponent } from "../../../../../components/bloquear-tela/bloquear-tela.component";

const ACTIVE_GEF: number = 0;
const ACTIVE_OBJ_CUSTO: number = 1;
const ACTIVE_DEPTO: number = 2;
const ACTIVE_FUNCIONARIO: number = 3;
const ACTIVE_EVENTOS: number = 4;


@Component({
  selector: 'app-divergencia-ponto-dp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    TabViewModule,
    ButtonModule,
    BloquearTelaComponent,
  ],
  templateUrl: './divergencia-ponto-dp.component.html',
  styleUrl: './divergencia-ponto-dp.component.scss'
})
export class DivergenciaPontoDpComponent {
  form!: FormGroup;
  mapFolhaEventoPonto = new Map<string, FolhaEventoPonto>();
  eventoPontos: FolhaEventoPonto[] = [];
  eventoPontosSelecionado: ResumoPorGef = {} as ResumoPorGef;

  resumoPorGef: ResumoPorGef[] = [];
  resumoPorGefSelecionado: ResumoPorGef = {} as ResumoPorGef;

  resumoPorObjCusto: ResumoPorGef[] = [];
  resumoPorObjCustoSelecionado: ResumoPorGef = {} as ResumoPorGef;

  resumoPorDepto: ResumoPorGef[] = [];
  resumoPorDeptoSelecionado: ResumoPorGef = {} as ResumoPorGef;

  resumoPorFuncionario: ResumoPorGef[] = [];
  resumoPorFuncionarioSelecionado: ResumoPorGef = {} as ResumoPorGef;

  activeIndex: number = ACTIVE_GEF;

  eventosPorData: EventosPorData[] = [];
  disableDepto: boolean = false;
  disableObjCusto: boolean = false;

  blockedDocument: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private errorHandleService: ErrorHandleService,
    private toastService: ToastService,
    private folhaService: FolhaEventosService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  async buscarDivergencias() {
    this.blockedDocument=true;
    this.limparResumoGef();
    this.activeIndex = ACTIVE_GEF;
    await this.folhaService.listarDivergencias(
      this.form.value.dataInicio,
      this.form.value.dataFim,
      this.form.value.funcionarioCodigo)
      .then(result => {
        this.classificarResumoPorGef(result);
        this.blockedDocument=false;
      })
      .catch(error => {
        this.blockedDocument=false;
        this.errorHandleService.handle(error);
      });
  }

  listar(divergencias: any) {
    this.eventoPontos = divergencias;
    // this.activeIndex = ACTIVE_EVENTOS;

    this.eventosPorData = [];
    let data: Date;
    this.eventoPontos.forEach(e => {
      let evento: EventosPorData = {};
      evento.id = evento.dataReferencia + ":" + evento.eventoCodigo
      if (!data || data != e.dataReferencia) {
        evento.dataReferencia = e.dataReferencia;
        evento.pontos = e.pontos;
        data = e.dataReferencia!;
      }

      e.eventos?.forEach(ev => {
        evento.eventoCodigo = ev.eventoCodigo;
        evento.eventoDescricao = ev.eventoDescricao;
      })
      this.eventosPorData.push(evento);

    });
  }

  limparResumoGef() {
    this.limparResumoOjbCusto();
    this.limparResumoDepto();
    this.resumoPorGef = [];
    this.resumoPorGefSelecionado = {} as ResumoPorGef;
  }

  limparResumoOjbCusto() {
    this.limparResumoFuncionario();
    this.resumoPorObjCusto = [];
    this.resumoPorObjCustoSelecionado = {} as ResumoPorGef;
  }

  limparResumoDepto() {
    this.limparResumoFuncionario();
    this.resumoPorDepto = [];
    this.resumoPorDeptoSelecionado = {} as ResumoPorGef;
  }

  limparResumoFuncionario() {
    this.limparEvento();
    this.resumoPorFuncionario = [];
    this.resumoPorFuncionarioSelecionado = {} as ResumoPorGef;
  }

  limparEvento() {
    this.eventosPorData=[];
    this.eventoPontos = [];
    this.eventoPontosSelecionado = {} as ResumoPorGef;
  }

  selecionouGefPorCusto(event: any) {
    this.disableObjCusto = false;
    this.disableDepto = true;
    this.limparResumoDepto();
    this.limparResumoOjbCusto();
    this.resumoPorGefSelecionado = event;
    this.classificarResumoPorObjCusto(event.lista);
  }

  selecionouGefPorDepto(event: any) {
    this.disableObjCusto = true;
    this.disableDepto = false;
    this.limparResumoDepto();
    this.limparResumoOjbCusto();
    this.resumoPorGefSelecionado = event;
    this.classificarResumoPorDepto(event.lista);
  }

  classificarResumoPorGef(eventos: FolhaEventoPonto[]) {
    this.activeIndex = ACTIVE_GEF;
    this.limparResumoGef();
    this.resumoPorGef = this.classificarResumo(eventos, 'gef');
  }

  classificarResumoPorObjCusto(eventos: FolhaEventoPonto[]) {
    this.limparResumoOjbCusto();
    this.resumoPorObjCusto = this.classificarResumo(eventos, 'obj');
    this.activeIndex = ACTIVE_OBJ_CUSTO;
  }

  classificarResumoPorDepto(eventos: FolhaEventoPonto[]) {
    this.limparResumoDepto();
    this.resumoPorDepto = this.classificarResumo(eventos, 'depto');
    this.activeIndex = ACTIVE_DEPTO;
  }

  classificarResumoPorFuncionario(eventos: FolhaEventoPonto[]) {
    this.limparResumoFuncionario();
    this.resumoPorFuncionario = this.classificarResumo(eventos, 'fun');
    this.activeIndex = ACTIVE_FUNCIONARIO;
  }

  classificarResumo(eventos: FolhaEventoPonto[], usarKey: string): ResumoPorGef[] {
    let map = new Map<string, ResumoPorGef>();

    eventos.forEach(t => {

      let resumo: ResumoPorGef = {} as ResumoPorGef;
      resumo.lista = [] as FolhaEventoPonto[];
      resumo.horaExtra = 0
      resumo.marcacaoInvalida = 0;
      resumo.atrasoSaida = 0;
      resumo.falta = 0;

      let key!: any;

      if (usarKey == 'gef') {
        key = t.gef!;
        resumo.id = t.gef!;
      } else if (usarKey == 'obj') {
        key = t.objCustoDescricao!;
        resumo.id = t.objCustoCodigo?.toString();
      } else if (usarKey == 'fun') {
        key = t.funcionarioCodigo!;
        resumo.id = t.funcionarioCodigo?.toString();
      } else if (usarKey == 'depto') {
        key = t.deptoCodigo!;
        resumo.id = t.deptoCodigo?.toString();
      }

      if (map.has(key)) {
        resumo = map.get(key)!;
      }

      let horaExtra: number = 0;
      let marcacaoInvalida: number = 0;
      let atrasoSaida: number = 0;
      let falta: number = 0;

      t.eventos?.forEach(e => {
        if (e.ehHoraExtra! == 'S') {
          horaExtra = 1;
        }
        if (e.ehMarcacaoInvalida! == 'S') {
          marcacaoInvalida = 1;
        }
        if (e.ehAtrasoSaida! == 'S') {
          atrasoSaida = 1;
        }
        if (e.ehFalta! == 'S') {
          falta = 1;
        }
      })

      resumo.gef = t.gef!;
      resumo.filialNomeFantasia = t.filialNomeFantasia!;
      resumo.funcionarioCodigo = t.funcionarioCodigo!;
      resumo.funcionarioNome = t.funcionarioNome!;

      resumo.objCustoCodigo = t.objCustoCodigo!;
      resumo.objCustoDescricao = t.objCustoDescricao!;

      resumo.deptoCodigo = t.deptoCodigo!;
      resumo.deptoDescricao = t.deptoDescricao!;

      resumo.horaExtra! += horaExtra;
      resumo.marcacaoInvalida! += marcacaoInvalida;
      resumo.atrasoSaida! += atrasoSaida;
      resumo.falta! += falta;

      resumo.lista?.push(t);
      map.set(key, resumo);

    });

    let resumoRetorno: ResumoPorGef[] = [];
    map.forEach((value, key) => {
      resumoRetorno.push(value);
    })
    return resumoRetorno;
  }



  initForm() {

    this.form = this.formBuilder.group({
      dataInicio: new FormControl('', Validators.required),
      dataFim: new FormControl('', Validators.required),
      funcionarioCodigo: new FormControl('')
    });

    this.form.valueChanges.subscribe((newValue) => { });
  }

  onRowSelectGef(event: any) {
    this.classificarResumoPorObjCusto(event.data.lista);
  }
  onRowSelectObjCusto(event: any) {
    this.classificarResumoPorFuncionario(event.data.lista);
  }
  onRowSelectDepto(event: any) {
    this.classificarResumoPorFuncionario(event.data.lista);
  }
  onRowSelectFuncionario(event: any) {
    this.listar(event.data.lista);
  }

}

interface ResumoPorGef {
  id?: string
  gef?: string
  filialNomeFantasia?: string
  objCustoCodigo?: number,
  objCustoDescricao?: string
  deptoCodigo?: number,
  deptoDescricao?: string
  funcionarioCodigo?: number
  funcionarioNome: string
  horaExtra: number,
  marcacaoInvalida: number;
  atrasoSaida: number,
  falta: number,
  lista: FolhaEventoPonto[],
}

interface EventosPorData {
  id?: string,
  dataReferencia?: Date,
  pontos?: string,
  eventoCodigo?: number,
  eventoDescricao?: string,
}
