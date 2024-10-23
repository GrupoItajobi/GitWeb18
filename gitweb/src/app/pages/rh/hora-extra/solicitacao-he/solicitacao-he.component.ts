import { Component } from '@angular/core';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitacaoHoraExtra } from '../../../../models/rh/hora-extra/solicitacao-he';
import { nowString } from '../../../../core/util/gitweb-util';
import { SolicitacaoHoraExtraIncluir } from '../../../../models/rh/hora-extra/solicitacao-he-incluir';
import { ButtonModule } from 'primeng/button';
import { HoraExtraService } from '../../../../services/rh/hora-extra/hora-extra.service';
import { ErrorHandleService } from '../../../../services/error-handle/error-handle.service';
import { LovFuncionarioSolicitanteHeComponent } from "../lov-funcionario-solicitante-he/lov-funcionario-solicitante-he.component";
import { FuncionarioPorSolicitanteHe } from '../../../../models/rh/hora-extra/funcionario-por-solicitante-he';

@Component({
  selector: 'app-solicitacao-he',
  standalone: true,
  imports: [TableModule, DialogModule, ReactiveFormsModule, ButtonModule, LovFuncionarioSolicitanteHeComponent],
  templateUrl: './solicitacao-he.component.html',
  styleUrl: './solicitacao-he.component.scss'
})
export class SolicitacaoHeComponent {

  form!: FormGroup;  
  solicitacoes: SolicitacaoHoraExtra[] = [];  
  usuarioEdit: SolicitacaoHoraExtra = {};
  
  dialogVisible: boolean = false;
  saving: boolean = false;
  lovMoendaVisible: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private horaExtraService: HoraExtraService,
    private errorHandleService: ErrorHandleService,

  ){}
  

    ngOnInit() {
      this.initForm();
      this.init();
      
     }

     async init(){
      await this.horaExtraService.listarHoraExtra()
      .then(response => {
        console.log(response);
        this.solicitacoes = response;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      });
      
     }


initForm() {

    this.form = this.formBuilder.group(
    {
      id: new FormControl(this.usuarioEdit.id),
      version: new FormControl(this.usuarioEdit.version),
      funcionarioCodigo: new FormControl(this.usuarioEdit.funcionarioCodigo, Validators.required),
      funcionarioNome: new FormControl(this.usuarioEdit.funcionarioNome),
      departamentoCodigo: new FormControl(this.usuarioEdit.departamentoCodigo, Validators.required),
      departamentoDescricao: new FormControl(this.usuarioEdit.departamentoDescricao),
      motivoCodigo: new FormControl(this.usuarioEdit.motivoCodigo, Validators.required),
      motivoDescricao: new FormControl(this.usuarioEdit.motivoDescricao),
      dia: new FormControl(this.usuarioEdit.dia, Validators.required),
      minutos: new FormControl(this.usuarioEdit.minutos, Validators.required),
      usuarioNome: new FormControl(this.usuarioEdit.usuarioNome),
      observacao: new FormControl(this.usuarioEdit.observacao),
      dataHoraExtra: new FormControl(this.usuarioEdit.dataHe),     

     });

    this.form.valueChanges.subscribe(newValue => { });
  }

    adicionarAlteracao() {
      this.dialogVisible = true;
    }

    showDialog() {
      this.dialogVisible = true;
  } 

  async salvar() {
    //this.retiraroTdaData();

    let usuario: SolicitacaoHoraExtraIncluir = {
      version: this.usuarioEdit.version,
      funcionarioCodigo: this.usuarioEdit.funcionarioCodigo,
      departamentoCodigo: this.usuarioEdit.departamentoCodigo,
      motivoCodigo: this.usuarioEdit.motivoCodigo,
      dia: this.usuarioEdit.dia,
      minutos: this.usuarioEdit.minutos,
      observacao: this.usuarioEdit.observacao,
    }
     if (this.usuarioEdit.version) {
       this.alterar(usuario);
    } else {
       this.incluir(usuario);
   }

  }

  async alterar(solicitaHe: SolicitacaoHoraExtraIncluir) {
    
    await this.horaExtraService.alterar(solicitaHe)
      .then(response => {
        this.usuarioEdit = response
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
    this.fecharDialog();
  }

  async incluir(solicitaHe: SolicitacaoHoraExtraIncluir) {

    await this.horaExtraService.incluir(solicitaHe)
      .then(response => {
        this.usuarioEdit = response
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      })
    this.fecharDialog();
  }

  horaInicio() {
    this.form.patchValue(
      {
        dataInicio: nowString()
      }
    )
  }

  fecharDialog() {
    this.dialogVisible = false;
    this.usuarioEdit = {};
    this.initForm();
  }

  selecionouEventoHe(event: any) {
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

  buscaNomeFuncionario(){

    let codFuncionario = this.form.value.funcionarioCodigo;

      if (codFuncionario == null || codFuncionario == "") alert("Código funcionário vázio"); 
      else{

        // let funcionarios: FuncionarioPorSolicitanteHe = {
           
        // }
        
      }
    
  }



}
