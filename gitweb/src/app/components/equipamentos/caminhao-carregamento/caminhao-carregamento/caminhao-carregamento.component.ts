import { CommonModule } from '@angular/common';
import { CarregamentoFila } from './../../../../models/carregamento-produto/CarregamentoFila';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-caminhao-carregamento',
  standalone: true,
  imports: [CommonModule, BadgeModule],
  templateUrl: './caminhao-carregamento.component.html',
  styleUrl: './caminhao-carregamento.component.scss'
})
export class CaminhaoCarregamentoComponent implements OnInit {

  iconeCaminhaoOK = "/assets/layout/img/frota/caminhao-verde.png";
  iconeCaminhaoSemOrdem = "/assets/layout/img/frota/caminhao-amarelo.png";
  iconeCaminhaoBloqueado = "/assets/layout/img/frota/caminhao-vermelho.png";

  @Output() selecionouCarregamento = new EventEmitter();


  @Input() posicao!: any;
  @Input() infoFull: boolean = false;
  @Input() temPermissaoParaExcluir: boolean = false;
  @Input() temPermissaoParaEditar: boolean = false;
  @Input() temPermissaoParaBloquear: boolean = false;
  @Input() ordemCiclo: any = "S";
  @Input() ciclo: CarregamentoFila = {};


  constructor() {

  }

  ngOnInit(): void {

  }
  editarCiclo() {
    this.selecionouCarregamento.emit({ acao: 'editarCiclo', idCarregamento: this.ciclo?.idCarregamentoFila! });
  }
  editarBloqueio() {
    this.selecionouCarregamento.emit({ acao: 'editarBloqueio', idCarregamento: this.ciclo?.idCarregamentoFila! });
  }
  editarOrdem() {
    this.selecionouCarregamento.emit({ acao: 'editarOrdem', idCarregamento: this.ciclo?.idCarregamentoFila! });
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
    this.selecionouCarregamento.emit({ acao: 'fecharCiclo', idCarregamento: this.ciclo?.idCarregamentoFila! });
  }

  retornarTransportadora() {
    if (this.ciclo?.transportadoraRazaoSocial!) {
      return this.ciclo?.transportadoraRazaoSocial!;
    }
    return this.ciclo?.transportadora!;
  }

  retornarProduto() {

    if (this.ciclo?.produtoDescricao) {
      return this.ciclo?.produtoDescricao!
    }
    return this.ciclo?.produto!.toString();
  }

  truncarTexto(texto: string, tam: number = 25) {
    let textoParaTruncar: string = texto;
    if (textoParaTruncar) {
      return textoParaTruncar.substring(0, tam);
    }
    return "";
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
    return this.ciclo.quantidadeVolume
  }

  colorSaldo(){
    if (this.ciclo.simuladoSaldoEstoque!<0) {
      return 'red';
    }
    return 'black'
  }

}
