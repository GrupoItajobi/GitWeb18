import { Component } from '@angular/core';
import { Renderer2 } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';

import { ToastService } from '../../../../services/toast/toast.service';
import { ErrorHandleService } from '../../../../services/error-handle/error-handle.service';
import { HoraExtraService } from '../../../../services/rh/hora-extra/hora-extra.service';

import { LovFuncionarioSolicitanteHeComponent } from '../lov-funcionario-solicitante-he/lov-funcionario-solicitante-he.component';
import { SolicitacaoHoraExtraIncluir } from '../../../../models/rh/hora-extra/solicitacao-he-incluir';
import { FuncionarioPorSolicitanteHe } from '../../../../models/rh/hora-extra/funcionario-por-solicitante-he';
import { MotivoHoraExtra } from '../../../../models/rh/hora-extra/motivo-hora-extra';
import { SolicitacaoHoraExtra } from '../../../../models/rh/hora-extra/solicitacao-he';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';

import {
  minutosEmHorasStr,
  nowString,
} from '../../../../core/util/gitweb-util';

@Component({
  selector: 'app-solicitacao-he',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    LovFuncionarioSolicitanteHeComponent,
    ListboxModule,
    FormsModule,
    DropdownModule,
    TooltipModule,
    ProgressSpinnerModule,
    RadioButtonModule
  ],
  templateUrl: './solicitacao-he.component.html',
  styleUrl: './solicitacao-he.component.scss',
})

export class SolicitacaoHeComponent {
  horas: any[] = [];
  motivo: any[] = [];

  form!: FormGroup;
  solicitacoes: SolicitacaoHoraExtra[] = [];
  usuarioEdit: SolicitacaoHoraExtra = {};

  buscaMotivo: MotivoHoraExtra[] = [];
  buscaMotivoEdit: MotivoHoraExtra = {};

  dialogVisible: boolean = false;
  saving: boolean = false;
  lovSolicitacaoVisible: boolean = false;
  gravarContinuar: boolean = false;
  loading: boolean = false;

  codigoFuncionario: string = '';

  indiceSelecionado: number = 0;

  dataInicio: any;
  dataFim: any;

  selectedStatus!: string;
  

  funcionarios: FuncionarioPorSolicitanteHe[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private horaExtraService: HoraExtraService,
    private errorHandleService: ErrorHandleService,
    private toastService: ToastService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.initForm();
    this.init();
    this.listaHoras();
  }

  async init() {

    await this.horaExtraService
      .listarHoraExtra()
      .then((response) => {
        this.solicitacoes = response;
      })
      .catch((error) => {
        this.errorHandleService.handle(error);
      });

    await this.horaExtraService
      .buscaMotivo()
      .then((response) => {
        this.buscaMotivo = response;
      })
      .catch((error) => {
        this.errorHandleService.handle(error);
      });

      this.listaMotivos();
  }

  initForm() {
    this.form = this.formBuilder.group({
      id: new FormControl(this.usuarioEdit.id),
      version: new FormControl(this.usuarioEdit.version),
      funcionarioCodigo: new FormControl(
        this.usuarioEdit.funcionarioCodigo,
        Validators.required
      ),
      funcionarioNome: new FormControl({
        value: this.usuarioEdit.funcionarioNome,
        disabled: true,
      }),
      departamentoCodigo: new FormControl(
        this.usuarioEdit.departamentoCodigo        
      ),
      departamentoDescricao: new FormControl(
        this.usuarioEdit.departamentoDescricao
      ),
      motivoCodigo: new FormControl(
        this.usuarioEdit.motivoCodigo,
      
      ),
      motivoDescricao: new FormControl(this.usuarioEdit.motivoDescricao, Validators.required),
      usuarioNome: new FormControl(this.usuarioEdit.usuarioNome),
      observacao: new FormControl(this.usuarioEdit.observacao, Validators.required),
      dataHoraExtra: new FormControl(this.usuarioEdit.dia, Validators.required),
      dataInicio: new FormControl(this.dataInicio),
      dataFim: new FormControl(this.dataFim),
      horas: new FormControl(
        minutosEmHorasStr(this.usuarioEdit.minutos, 'hh:mm'), Validators.required
      ),
    });

    this.form.valueChanges.subscribe((newValue) => {});
  }

  minutoEmHoras(minutos: number): string {
    return minutosEmHorasStr(minutos, 'hh:mm');
  }

  adicionarAlteracao() {
    this.dialogVisible = true;
  }

  showDialog() {
    this.dialogVisible = true;
  }

  async salvar() {

    this.loading = true;
    let minutosConvertido = this.converterMinutos();
    let usuario: SolicitacaoHoraExtraIncluir = {
      id: this.usuarioEdit.id,
      version: this.form.value.version,
      funcionarioCodigo: this.form.value.funcionarioCodigo,
      departamentoCodigo: this.form.value.departamentoCodigo,
      motivoCodigo: this.indiceSelecionado,
      dia: this.form.value.dataHoraExtra,
      minutos: minutosConvertido,
    };

    if (this.usuarioEdit.version && !this.gravarContinuar) {
      this.alterar(usuario);
    } else {
      this.incluir(usuario);
    }

    if (this.gravarContinuar == false) {
      this.fecharDialog();
    }
  }

  async alterar(solicitaHe: SolicitacaoHoraExtraIncluir) {
    await this.horaExtraService
      .alterar(solicitaHe)
      .then((response) => {
        this.usuarioEdit = response;
      })
      .catch((error) => {
        this.errorHandleService.handle(error);
      });
    this.finalizaProcesso();
    this.fecharDialog();
  }

  async incluir(solicitaHe: SolicitacaoHoraExtraIncluir) {
    await this.horaExtraService
      .incluir(solicitaHe)
      .then((response) => {
        this.usuarioEdit = response;
        this.finalizaProcesso();
      })
      .catch((error) => {
        this.errorHandleService.handle(error);
      });
  }

  horaInicio() {
    this.form.patchValue({
      dataInicio: nowString(),
    });
  }

  fecharDialog() {
    this.dialogVisible = false;
    this.usuarioEdit = {};
    this.initForm();
  }

  selecionouEventoHe(event: any) {
    this.lovSolicitacaoVisible = false;

    if (event != null) {
      this.form.patchValue({
        funcionarioCodigo: event.funcionarioCodigo,
        funcionarioNome: event.funcionarioNome,
      });
    }
  }

  buscaNomeFuncionario() {
    this.lovSolicitacaoVisible = false;
    this.lovSolicitacaoVisible = true;
  }

  listaHoras() {
    this.horas = [
      { label: '01:00' },
      { label: '01:30' },
      { label: '02:00' },
      { label: '02:30' },
      { label: '03:00' },
      { label: '03:30' },
      { label: '04:00' },
      { label: '04:30' },
      { label: '05:00' },
      { label: '05:30' },
    ];
  }

  async listaMotivos(){

    let motivoDescricao: { label: string; value: number }[] = [];

    for (let index = 0; index < this.buscaMotivo.length; index++) {
      let descricao = this.buscaMotivo[index].descricao;

      motivoDescricao.push({label: String(descricao), value: index+1})
    }

    this.motivo = motivoDescricao

  }

  onMotivoSelecionado(event: any) {
    this.indiceSelecionado = event.value.value;
     return Number(this.indiceSelecionado);
  }

  edit(solicitaHoraExtra: SolicitacaoHoraExtraIncluir) {
    this.usuarioEdit = solicitaHoraExtra;   

    if(this.usuarioEdit.minutos == undefined){return}
    this.initForm();
    this.dialogVisible = true;
  }

  //Converte as horas selecionadas para minutos, para salvar no banco
  converterMinutos() {
    let tempo = this.form.value.horas.label;
    let partes: string[] = tempo.split(':');
    let hora = partes[0];
    let minuto = partes[1];

    let minutos = Number(hora) * 60 + Number(minuto);

    return minutos;
  }

  //Buscando o valor do Input inserido no HTML
  buscaValorCampo(event: Event) {
    this.codigoFuncionario = (event.target as HTMLInputElement).value;
  }

  //Traz todos os usuários que o usuário logado pode solicitar hora extra
  async buscaFuncionario() {
    await this.horaExtraService
      .listarFuncionarioSolicitante()
      .then((response) => {
        this.funcionarios = response;
      })
      .catch((error) => {
        this.errorHandleService.handle(error);
      });

    this.nomeFuncionario();
  }

  //Busca nome de funcionário que o usuario pode solicitar Hora extra.
  nomeFuncionario() {
    if (this.codigoFuncionario != '') {
      for (let chave in this.funcionarios) {
        this.limpaForm();
        if (
          this.funcionarios[chave].funcionarioCodigo ==
          Number(this.codigoFuncionario)
        ) {
          this.form.patchValue({
            funcionarioCodigo: this.funcionarios[chave].funcionarioCodigo,
            funcionarioNome: this.funcionarios[chave].funcionarioNome,
          });

          break; // para caso encontre o primeiro valor igual
        } else {
          this.toastService.showInfoMsg('Usuário não encontrado!');
          this.focoInput();
          break;
        }
      }
    }
  }

  //limpa os campor codigo funcionário e nome funcionário
  limpaForm() {
    this.form.patchValue({
      funcionarioCodigo: '',
      funcionarioNome: '',
    });
  }

  //dar o foco em um campo especifico
  focoInput() {
    this.renderer.selectRootElement('#funcionarioCodigo').focus();
  }

  salvarContinuar() {
    this.dialogVisible = true;
    this.gravarContinuar = true;

    this.salvar();

    this.form.patchValue({
      funcionarioCodigo: '',
      funcionarioNome: '',
    });

    this.renderer.selectRootElement('#funcionarioCodigo').focus();
  }

  finalizaProcesso(){
    this.loading = false;

    if(this.usuarioEdit.id != ""){this.toastService.showSuccessMsg('Salvo!');}
  } 

  // Busca as solicitações com base no filtro "data fim, data inicio, status".
  async buscarSolicitacoes() {
  
    const solicitacoes = {
      dataInicio: this.form.controls['dataInicio'].value,
      dataFim: this.form.controls['dataFim'].value,
      status: this.selectedStatus
    };

     // Verifica se algum campo está nulo ou indefinido
  if (!solicitacoes.dataInicio || !solicitacoes.dataFim || !solicitacoes.status) {
    this.toastService.showErrorMsg("Por favor, preencha todos os campos obrigatórios.")
    return; 
  }
  
    try {
      const response = await this.horaExtraService.solicitacoesPorSolicitante(solicitacoes);
      this.solicitacoes = response;
      this.dataInicio = this.form.controls['dataInicio'].value
      this.dataFim = this.form.controls['dataFim'].value
      this.selectedStatus = '';
      this.initForm();

    } catch (error) {
      this.errorHandleService.handle(error);
    }
  }
  
}
