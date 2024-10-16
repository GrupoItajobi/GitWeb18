import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorHandleService } from './../../../../../services/error-handle/error-handle.service';
import { Component, OnInit } from '@angular/core';
import { UnidadesComponent } from "../../../../../components/unidades/unidades/unidades.component";
import { MoendaService } from '../../../../../services/rotacao-moenda/moenda.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { RotacaoMoendaService } from '../../../../../services/rotacao-moenda/rotacao-moenda.service';
import { RotacaoMoenda } from '../../../../../models/industria/rotacao-moenda/rotacaoMoenda';
import { Moenda } from '../../../../../models/industria/rotacao-moenda/moenda';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { LovMoendaEventoComponent } from '../lov-moenda-evento/lov-moenda-evento.component';
import { dateToString, nowString } from '../../../../../core/util/gitweb-util';
import { RotacaoMoendaCrud } from '../../../../../models/industria/rotacao-moenda/rotacaoMoendaCrud';

@Component({
  selector: 'app-rotacao-moenda',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    CommonModule,
    UnidadesComponent,
    SelectButtonModule,
    ReactiveFormsModule,
    TableModule,
    LovMoendaEventoComponent
  ],
  templateUrl: './rotacao-moenda.component.html',
  styleUrl: './rotacao-moenda.component.scss'
})
export class RotacaoMoendaComponent implements OnInit {
  form!: FormGroup;
  moendaOptionsSel = new FormControl('');
  moendas: Moenda[] = [];
  moendaOptions: any[] = [];

  rotacaoMoenda: RotacaoMoenda[] = [];
  rotacaoMoendaEdit: RotacaoMoenda = {}
  disableBotaoAdicionar: boolean = false;
  dialogVisible: boolean = false;
  lovMoendaVisible: boolean = false;
  ue!: string;

  saving: boolean = false;

  mapMoendas = new Map<string, Moenda>();
  disableInput: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private moendaService: MoendaService,
    private rotacaoMoendaService: RotacaoMoendaService,
    private errorHandleService: ErrorHandleService,
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  selecionouUnidade(ue: string) {
    this.rotacaoMoenda = [];
    this.ue = ue;
    this.moendaService.listarMoendas(ue)
      .then(response => {
        this.moendas = response;
        this.carregarMoendaOptions();
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
  }
  edit(rotacaoMoenda: RotacaoMoenda) {
    this.rotacaoMoendaEdit = rotacaoMoenda;
    this.initForm();
    this.dialogVisible = true;
  }
  selecionouEventoMoenda(event: any) {
    console.log('selecionouEvento: ' + event);
    this.lovMoendaVisible = false;
    // this.disableBotaoAdicionar = false;

    if (event != null) {
      // this.form.value.eventoDescricao.enable();
      this.form.patchValue({
        eventoCode: event.code,
        eventoDescricao: event.descricao!
      })
    }
  }
  adicionarAlteracao() {
    this.dialogVisible = true;
  }

  onHideDialog() {
    this.dialogVisible = false;
  }

  onChangeMoenda() {
    this.loadRotacaoMoenda();
  }

  horaInicio() {
    this.form.patchValue(
      {
        dataInicio: nowString()
      }
    )
  }
  horaPrevista() {
    this.form.patchValue(
      {
        dataPrevistaRetorno: nowString()
      }
    )
  }

  loadRotacaoMoenda() {
    this.rotacaoMoenda = []
    this.rotacaoMoendaService.listarMoendas(this.ue, this.moendaOptionsSel.value!)
      .then(response => {
        this.rotacaoMoenda = response;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
  }
  carregarMoendaOptions() {
    this.moendaOptionsSel.patchValue('');
    this.moendaOptions = [];
    this.mapMoendas.clear();
    this.moendas.forEach(m => {
      if (!this.moendaOptionsSel.value) {
        this.moendaOptionsSel.patchValue(m.id);
      }
      this.moendaOptions.push({
        label: m.descricao,
        value: m.id
      });
      this.mapMoendas.set(m.id, m);
    });
    if (this.moendaOptionsSel.value) {
      this.loadRotacaoMoenda();
    }
  }

  lovEvento() {
    this.lovMoendaVisible = true;
  }

  retiraroTdaData() {
    // quando o usuario edita o campo date, é colocado o T entre a data e o
    this.form.value.dataInicio = dateToString(this.form.value.dataInicio);
    this.form.value.dataFim = dateToString(this.form.value.dataFim);
    this.form.value.dataPrevistaRetorno = dateToString(this.form.value.dataPrevistaRetorno);
  }

  async salvar() {
    this.retiraroTdaData();

    let rotacaoMoenda: RotacaoMoendaCrud = {
      id: this.rotacaoMoendaEdit.id,
      ueId: this.ue,
      moendaId: this.moendaOptionsSel.value!,
      eventoCode: this.form.value.eventoCode,
      dataInicio: this.form.value.dataInicio,
      dataFim: this.form.value.dataFim,
      dataPrevistaRetorno: this.form.value.dataPrevistaRetorno,
      observacao: this.form.value.observacao,
      rotacaoAtual: this.form.value.rotacaoAtual,
    }
    console.log(rotacaoMoenda)
    if (this.rotacaoMoendaEdit.id) {
      this.alterar(rotacaoMoenda);
    } else {
      this.incluir(rotacaoMoenda);
    }
    this.rotacaoMoendaEdit = {};
  }

  async alterar(rotacaoMoenda: RotacaoMoendaCrud) {

    await this.rotacaoMoendaService.alterar(rotacaoMoenda)
      .then(response => {
        this.loadRotacaoMoenda();
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
    this.fecharDialog();
  }

  async incluir(rotacaoMoenda: RotacaoMoendaCrud) {

    await this.rotacaoMoendaService.incluir(rotacaoMoenda)
      .then(response => {
        this.loadRotacaoMoenda();
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
    this.fecharDialog();
  }
  fecharDialog() {
    this.dialogVisible = false;
    this.rotacaoMoendaEdit = {};
    this.initForm();
  }
  initForm() {

    this.form = this.formBuilder.group(
      {
        id: new FormControl(this.rotacaoMoendaEdit.id),
        dataInicio: new FormControl(this.rotacaoMoendaEdit.dataInicio, Validators.required),
        dataFim: new FormControl(this.rotacaoMoendaEdit.dataFim),
        dataPrevistaRetorno: new FormControl(this.rotacaoMoendaEdit.dataPrevistaRetorno),
        rotacaoAtual: new FormControl(this.rotacaoMoendaEdit.rotacaoAtual, [Validators.required, Validators.min(0), Validators.max(9999)]),
        eventoCode: new FormControl(this.rotacaoMoendaEdit.evento?.code, Validators.required),
        eventoDescricao: new FormControl({ value: this.rotacaoMoendaEdit.evento?.descricao, disabled: true }),
        observacao: new FormControl(this.rotacaoMoendaEdit.observacao),
      }
    );
    // this.calcularTempoEstimado();
    this.form.valueChanges.subscribe(newValue => {
      // this.checkChanges(newValue);
    });
  }
}
