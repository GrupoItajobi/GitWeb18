import { CommonModule } from '@angular/common';
import { CarregamentoFila } from './../../../../models/carregamento-produto/CarregamentoFila';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { CarregamentoProdutoService } from '../../../../services/carregamento-produto/carregamento-produto.service';
import { ChamaParaPesar } from '../../../../models/carregamento-produto/ChamaParaPesar';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../../../services/toast/toast.service';
// import { SharedDataService } from '../../../../services/geral/shared/shared-data.service';

@Component({
  selector: 'app-caminhao-carregamento',
  standalone: true,
  imports: [
    CommonModule,
    BadgeModule,
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './caminhao-carregamento.component.html',
  styleUrl: './caminhao-carregamento.component.scss',
})
export class CaminhaoCarregamentoComponent implements OnInit {
  iconeCaminhaoOK =
    'https://gitweb.usinaitajobi.com.br/git-ged/layout/img/frota/caminhao-verde.png';
  iconeCaminhaoSemOrdem =
    'https://gitweb.usinaitajobi.com.br/git-ged/layout/img/frota/caminhao-amarelo.png';
  iconeCaminhaoBloqueado =
    'https://gitweb.usinaitajobi.com.br/git-ged/layout/img/frota/caminhao-vermelho.png';

  form!: FormGroup;
  visible: boolean = false;
  dadosEnvioMsg?: ChamaParaPesar = {};

  rowIndex: number = 0;

  @Output() selecionouCarregamento = new EventEmitter();

  @Input() posicao!: any;
  @Input() infoFull: boolean = false;
  @Input() temPermissaoParaExcluir: boolean = false;
  @Input() temPermissaoParaEditar: boolean = false;
  @Input() temPermissaoParaBloquear: boolean = false;
  @Input() ordemCiclo: any = 'S';
  @Input() ciclo: CarregamentoFila = {};

  constructor(
    //private sharedDataService: SharedDataService,
    private carregamentoProdutoService: CarregamentoProdutoService,
    private formBuilder: FormBuilder,
    private toastMessageService: ToastService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  async initForm() {
    this.form = this.formBuilder.group({ whatsapp: new FormControl() });
    this.form.valueChanges.subscribe((newValue) => {});
    //  console.log(this.sharedDataService.getData())
  }

  editarCiclo() {
    this.selecionouCarregamento.emit({
      acao: 'editarCiclo',
      idCarregamento: this.ciclo?.idCarregamentoFila!,
    });
  }
  editarBloqueio() {
    this.selecionouCarregamento.emit({
      acao: 'editarBloqueio',
      idCarregamento: this.ciclo?.idCarregamentoFila!,
    });
  }
  editarOrdem() {
    this.selecionouCarregamento.emit({
      acao: 'editarOrdem',
      idCarregamento: this.ciclo?.idCarregamentoFila!,
    });
  }

  icone() {
    if (this.ciclo.obsComercialBloqueio) {
      return this.iconeCaminhaoBloqueado;
    }
    if (this.ciclo?.nrOrdemRetirada) {
      return this.iconeCaminhaoOK;
    }
    return this.iconeCaminhaoSemOrdem;
  }

  fecharCiclo() {
    this.selecionouCarregamento.emit({
      acao: 'fecharCiclo',
      idCarregamento: this.ciclo?.idCarregamentoFila!,
    });
  }

  retornarTransportadora() {
    if (this.ciclo?.transportadoraRazaoSocial!) {
      return this.ciclo?.transportadoraRazaoSocial!;
    }
    return this.ciclo?.transportadora!;
  }

  retornarProduto() {
    if (this.ciclo?.produtoDescricao) {
      return this.ciclo?.produtoDescricao!;
    }
    return this.ciclo?.produto!.toString();
  }

  truncarTexto(texto: string, tam: number = 25) {
    let textoParaTruncar: string = texto;
    if (textoParaTruncar) {
      return textoParaTruncar.substring(0, tam);
    }
    return '';
  }

  toNumber(valor: any): number {
    if (valor) {
      return Number(valor);
    }
    return 0;
  }

  quantidadeVolume() {
    if (this.ciclo.nrNotaFiscal) {
      return this.ciclo.quantidadeVolumeNF;
    } else if (this.ciclo.nrOrdemRetirada) {
      return this.ciclo.quantidadeVolumePed;
    }
    return this.ciclo.quantidadeVolume;
  }

  colorSaldo() {
    if (this.ciclo.simuladoSaldoEstoque! < 0) {
      return 'red';
    }
    return 'black';
  }

  async chamarMotorista() {
    if (!this.form.value.whatsapp) return;

    let dadosMsg = this.form.value.whatsapp.toString();

    console.log(dadosMsg);
    dadosMsg = this.limparNumero(dadosMsg);
    console.log(dadosMsg);
    this.dadosEnvioMsg = {
      text: '*USINA ITAJOBI* \nCaro motorista, por favor, dirija-se ao Núcleo Fiscal.',
      number: dadosMsg,
    };

    try {
      const request = await this.carregamentoProdutoService.chamarParaBalanca(
        this.dadosEnvioMsg
      );
      console.log('✅ Sucesso na chamada à API:', request);
      this.toastMessageService.showSuccessMsg('Mensagem enviada com sucesso!');
      this.visible = false;
      this.form.patchValue({ whatsapp: null });
    } catch (error) {
      this.toastMessageService.showErrorMsg(
        'O número informado não possui WhatsApp ou está incorreto!'
      );
      console.error('❌ Erro ao chamar a API:', error);
      throw new Error('Conexão com API recusada');
    }
  }

  showDialog() {
    // console.log(this.sharedDataService.getData());
    // let teste = this.form.value.whatsapp;
    // console.log(teste);
    this.visible = true;
  }

  fecharDialog() {
    this.form.patchValue({ whatsapp: null });
    this.visible = false;
  }

  // Remove tudo que não for número
  limparNumero(valor: string) {
    valor = valor.replace(/\D/g, '');
    if (valor.length > 11) {
      valor = valor.slice(1);
    }
    return (valor = '55' + valor);
  }
}
