import { Component } from '@angular/core';
import { UnidadesComponent } from '../../../../components/unidades/unidades/unidades.component';
import { TableModule } from 'primeng/table';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { PlanejamentoMetaMoagemDia } from '../../../../models/agricola/planejamento/safra/moagem-safra';
import { MoagemSafraService } from '../../../../services/agricola/planejamento/moagem-safra.service';
import { ErrorHandleService } from '../../../../services/error-handle/error-handle.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../../services/toast/toast.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-safra',
  standalone: true,
  imports: [
    UnidadesComponent,
    TableModule,
    ReactiveFormsModule,
    DialogModule,
    CommonModule,
    TooltipModule,
    ButtonModule,
  ],
  templateUrl: './moagem-safra.component.html',
})
export class MoagemSafraComponent {
  form!: FormGroup;
  dataInicio: Date = new Date();
  dataHoraFim: Date = new Date();

  planejamentoMetaMoagemDia: PlanejamentoMetaMoagemDia[] = [];
  dadosPlanejamentoMetaMoagemDia: any[] = [];

  selectedRow: any;

  codEmpresa: number = 0;
  codFilial: number = 0;
  codGrupoEmpresa: number = 0;
  nomeEmpresa!: string;

  rowIndexEdit: number = 0;

  unidade!: string;
  visible: boolean = false;
  shouldBlink = false;

  constructor(
    private formBuilder: FormBuilder,
    private moagemSafraService: MoagemSafraService,
    private errorHandleService: ErrorHandleService,
    private toastService: ToastService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  async initForm() {
    this.form = this.formBuilder.group({
      dataInicio: new FormControl(),
      dataHoraFim: new FormControl(),
      dataMoagem: new FormControl({ value: '', disabled: true }),
      gefMoagem: new FormControl({ value: '', disabled: true }),
      toneladasMoagem: new FormControl(),
    });
    this.form.valueChanges.subscribe((newValue) => {});
  }

  selecionouUnidade(event: any) {
    this.unidade = event;
    switch (event) {
      case 'Itajobi':
        this.codEmpresa = 1;
        this.codFilial = 1;
        this.codGrupoEmpresa = 1;
        this.nomeEmpresa = 'ITAJOBI';
        break;

      case 'Centroalcool':
        this.codEmpresa = 22;
        this.codFilial = 1;
        this.codGrupoEmpresa = 1;
        this.nomeEmpresa = 'CENTROALCOOL';
        break;

      case 'Carolo':
        this.codEmpresa = 30;
        this.codFilial = 1;
        this.codGrupoEmpresa = 1;
        this.nomeEmpresa = 'CAROLO';
        break;

      case 'VO-Cat':
        this.codEmpresa = 10;
        this.codFilial = 1;
        this.codGrupoEmpresa = 1;
        this.nomeEmpresa = 'V.O.';
        break;

      case 'Furlan':
        this.codEmpresa = 0;
        this.codFilial = 0;
        this.codGrupoEmpresa = 0;
        this.nomeEmpresa = 'FURLAN';
        break;

      case 'RioPardo':
        this.codEmpresa = 0;
        this.codFilial = 0;
        this.codGrupoEmpresa = 0;
        this.nomeEmpresa = 'RIO PARDO';
        break;
    }

    this.dataInicio = this.form.controls['dataInicio'].value;
    this.dataHoraFim = this.form.controls['dataHoraFim'].value;

    const enviaDados = {
      dataInicio: this.dataInicio,
      dataFim: this.dataHoraFim,
      codEmpresa: this.codEmpresa,
      codFilial: this.codFilial,
      codGrupo: this.codGrupoEmpresa,
    };

    if (!enviaDados.dataInicio || !enviaDados.dataFim) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'selecione uma data Inicio e data Fim!'
      });
      return;
    }

    if (new Date(enviaDados.dataFim) < new Date(enviaDados.dataInicio)){
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Data inicio não pode ser menor que data fim'
      });
      return;
    }
    this.enviarDados(enviaDados);    
  }

  async enviarDados(enviaDados: any) {
    try {
      const response = await this.moagemSafraService.busca(enviaDados);

      this.planejamentoMetaMoagemDia = response;

      this.dadosPlanejamentoMetaMoagemDia = this.planejamentoMetaMoagemDia;
    } catch (error) {
      this.errorHandleService.handle(error);
    }
  }

  edit(rowIndex: number) {
    this.selectedRow = this.dadosPlanejamentoMetaMoagemDia[rowIndex];

    if (this.selectedRow) {
      // Combina os códigos GEF
      const gef = `${this.selectedRow.grupoEmpresaCodigo}-${this.selectedRow.empresaCodigo}-${this.selectedRow.filialCodigo}   ${this.nomeEmpresa}`;

      this.form.patchValue({
        dataMoagem: this.selectedRow.dataMoagem,
        gefMoagem: gef,
        toneladasMoagem: this.selectedRow.tonelada,
      });

      this.visible = true;
    }
  }

  showDialog() {
    this.visible = true;
  }

  async salvar() {
    let dadosSalvar: PlanejamentoMetaMoagemDia = {
      id: this.selectedRow.id,
      version: this.selectedRow.version,
      grupoEmpresaCodigo: this.selectedRow.grupoEmpresaCodigo,
      empresaCodigo: this.selectedRow.empresaCodigo,
      filialCodigo: this.selectedRow.filialCodigo,
      dataMoagem: this.selectedRow.dataMoagem,
      tonelada: this.selectedRow.tonelada,
    };

    try {
      const response = await this.moagemSafraService.alterar(
        dadosSalvar.id,
        this.form.controls['toneladasMoagem'].value
      );

      this.planejamentoMetaMoagemDia[this.rowIndexEdit] = response;
      this.visible = false;
      this.toastService.showSuccessMsg('Alteração efetuada com sucesso!');
    } catch (error) {
      this.errorHandleService.handle(error);
    }
  }

}
