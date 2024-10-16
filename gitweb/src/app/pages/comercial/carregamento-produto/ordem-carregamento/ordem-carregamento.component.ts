import { OrdemDeCarregamento } from './../../../../models/carregamento-produto/OrdemCarregamento';
import { OrdemCarregamentoService } from './../../../../services/carregamento-produto/ordem-carregamento.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorHandleService } from '../../../../services/error-handle/error-handle.service';
import { UrlService } from '../../../../services/url/url.service';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastService } from '../../../../services/toast/toast.service';
import { dividir, minutosEmHorasStr, nowString } from '../../../../core/util/gitweb-util';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-ordem-carregamento',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputNumberModule, SelectButtonModule],
  templateUrl: './ordem-carregamento.component.html',
  styleUrl: './ordem-carregamento.component.scss'
})
export class OrdemCarregamentoComponent implements OnInit {
  form!: FormGroup;
  ordensCarregamento: OrdemDeCarregamento[] = [];
  ordemCarregamentoSelecionado: OrdemDeCarregamento = {}
  edicaoDesabilidade: boolean = true;
  mapOrdensCarregamento = new Map<string, OrdemDeCarregamento>();
  pontoCarregamentoOptions: any[] = [{
    name: 'Ponto de Carregamento'
  }]
  pontoCarregamentoOptionsSelecionado: OrdemDeCarregamento = {};
  tempoEstimado: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private ordemCarregamentoService: OrdemCarregamentoService,
    // private messageService: MessageService,
    private toastMessageService: ToastService,
    private errorHandleService: ErrorHandleService,
    private urlService: UrlService,
    private router:ActivatedRoute
  ) { }

  ngOnInit(): void {
    let nrOrdemRetirada = this.router.snapshot.params['nrOrdemRetirada'];
    console.log('nrOrdemRetirada: '+nrOrdemRetirada  )
    console.log(this.router.snapshot)
    this.initForm()
  }


  async buscarOrdemRetirada() {
    this.ordemCarregamentoSelecionado = {};
    this.ordensCarregamento = [];
    this.pontoCarregamentoOptions = [];
    let ordem: number = this.form.value.nrOrdemRetirada;
    // this.initForm();
    // this.form.patchValue({ nrOrdemRetirada: ordem });

    if (this.form.value.nrOrdemRetirada) {
      await this.ordemCarregamentoService.buscarOrdemRetirada(this.form.value.nrOrdemRetirada)
        .then(response => {
          this.ordensCarregamento = response;

          if (this.ordensCarregamento.length > 0) {
            this.identificarEspecificacaoEscolhida();
            this.carregarMapOrdensCarregamento()
            this.initPontoCarregamento();
            this.initForm();
            this.calcularTempoEstimado();
          } else {
            this.toastMessageService.showWarnMsg("Ordem Retirada não Liberada ou não existe!")
          }
        })
        .catch(error => {
          this.errorHandleService.handle(error);
        });
    }
  }

  startCarregamento() {
    this.form.patchValue(
      {
        dataInicio: nowString()
      }
    )
  }
  stopCarregamento() {

    this.form.patchValue(
      {
        dataFim: nowString()
      }
    )
  }

  async salvar() {
    this.ordemCarregamentoSelecionado.quantidadeEquipamento = this.form.value.quantidadeEquipamento;
    this.ordemCarregamentoSelecionado.dataInicio = this.form.value.dataInicio;
    this.ordemCarregamentoSelecionado.dataFim = this.form.value.dataFim;
    await this.ordemCarregamentoService.salvar(this.ordemCarregamentoSelecionado)
      .then(response => {
        this.toastMessageService.showSuccessMsg("Ordem " + this.ordemCarregamentoSelecionado.nrOrdemRetirada + " Alterada!");
      })
      .catch(error => {
        this.errorHandleService.handle(error);
      });
    await this.buscarOrdemRetirada();
  }

  identificarEspecificacaoEscolhida() {
    this.ordemCarregamentoSelecionado = this.ordensCarregamento[0];
    if (this.ordensCarregamento.length > 1) {
      this.ordensCarregamento.forEach(t => {
        if (t.especificacaoIdSelecionadaNoCarregamento == t.especificacaoIdSelecionadaNoCarregamento) {
          this.ordemCarregamentoSelecionado = t;
        }
      })
    }
    // else {
    //   this.ordemCarregamentoSelecionado.especificacaoIdSelecionadaNoCarregamento = this.ordemCarregamentoSelecionado.especificacaoId;
    // }

  }
  carregarMapOrdensCarregamento() {
    this.mapOrdensCarregamento = new Map<string, OrdemDeCarregamento>();
    this.ordensCarregamento.forEach(t => {
      this.mapOrdensCarregamento.set(t.especificacaoId!, t);
    })
  }


  initPontoCarregamento() {
    this.ordensCarregamento.forEach(t => {
      let ponto: any = {
        name: t.pontoCarregamentoDescricao + ' [' + t.tipoEquipamentoDescricao + ']',
        value: t.especificacaoId,
        ponto: t
      }
      this.pontoCarregamentoOptions.push(ponto)
    });
  }

  selecionouPonto(event: any) {
    if (event.value) {
      this.ordemCarregamentoSelecionado = this.mapOrdensCarregamento.get(event.value)!;
      this.ordemCarregamentoSelecionado.especificacaoIdSelecionadaNoCarregamento = this.ordemCarregamentoSelecionado.especificacaoId;
      this.initForm();
      this.calcularTempoEstimado();
    }
  }


  initForm() {
    this.form = this.formBuilder.group(
      {
        nrOrdemRetirada: new FormControl({ value: this.ordemCarregamentoSelecionado.nrOrdemRetirada, disabled: false }),
        motoristaNome: new FormControl({ value: this.ordemCarregamentoSelecionado.motoristaNome, disabled: this.edicaoDesabilidade }),
        caminhaoPlaca: new FormControl({ value: this.ordemCarregamentoSelecionado.caminhaoPlaca, disabled: this.edicaoDesabilidade }),
        produto: new FormControl({ value: this.ordemCarregamentoSelecionado.produto, disabled: this.edicaoDesabilidade }),
        produtoDescricao: new FormControl({ value: this.ordemCarregamentoSelecionado.produtoDescricao, disabled: this.edicaoDesabilidade }),
        sequencia: new FormControl({ value: this.ordemCarregamentoSelecionado.sequencia, disabled: this.edicaoDesabilidade }),
        pontoCarregamento: new FormControl({ value: this.ordemCarregamentoSelecionado.especificacaoIdSelecionadaNoCarregamento, disabled: false }),
        dataInicio: new FormControl({ value: this.ordemCarregamentoSelecionado.dataInicio, disabled: false }, Validators.required),
        dataFim: new FormControl({ value: this.ordemCarregamentoSelecionado.dataFim, disabled: this.ordemCarregamentoSelecionado.dataInicio == null }),
        quantidadeEquipamento: new FormControl({ value: this.ordemCarregamentoSelecionado.quantidadeEquipamento, disabled: false }, Validators.required),
        tempo1EmMinutos: new FormControl({ value: this.ordemCarregamentoSelecionado.tempo1EmMinutos, disabled: this.edicaoDesabilidade }),
        tempoEstimado: new FormControl({ value: 'x', disabled: this.edicaoDesabilidade }),
      }
    );
    // this.calcularTempoEstimado();
    this.form.valueChanges.subscribe(newValue => {
      // this.checkChanges(newValue);
      this.calcularTempoEstimado();
    });
  }

  calcularTempoEstimado() {
    let tempo1Minutos: number = Number(this.ordemCarregamentoSelecionado.tempo1EmMinutos);
    let quantidadeEquipamento: number = Number(this.form.value!.quantidadeEquipamento!);
    this.tempoEstimado = minutosEmHorasStr(dividir(tempo1Minutos, quantidadeEquipamento));

  }
}
