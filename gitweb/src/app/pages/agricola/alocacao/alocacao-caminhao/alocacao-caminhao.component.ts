import { Frente } from './../../../../models/agricola/alocacao-frente/frente';
import { Component } from '@angular/core';
import { UnidadesComponent } from '../../../../components/unidades/unidades/unidades.component';
import { FA } from '../../../../models/agricola/fa/fa';
import { FrenteCarregamento } from '../../../../models/agricola/alocacao-frente/frenteCarregamento';
import { PanelModule } from 'primeng/panel';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from 'primeng/dragdrop';
import { CaminhaoFrente } from '../../../../models/agricola/alocacao-frente/caminhaoFrente';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-alocacao-caminhao',
  standalone: true,
  imports: [UnidadesComponent, PanelModule, ReactiveFormsModule, DragDropModule, DatePipe],
  templateUrl: './alocacao-caminhao.component.html',
  styleUrl: './alocacao-caminhao.component.scss'
})
export class AlocacaoCaminhaoComponent {

  iconeCaminhaoOK = "/assets/layout/img/frota/caminhao-verde.png"
  iconeCarretaOK = "/assets/layout/img/frota/carreta-verde.png"


  codigoEquipamento = new FormControl('');
  loading: boolean = false;

  caminhaoIndo: CaminhaoFrente[] = [];
  caminhaoBate: CaminhaoFrente[] = [];
  caminhaoVoltando: CaminhaoFrente[] = [];

  carretaIndo: CaminhaoFrente[] = [];
  carretaVoltando: CaminhaoFrente[] = [];
  carretaBate: CaminhaoFrente[] = [];
  carretaPatioCarregada: CaminhaoFrente[] = [];
  carretaPatioVazio: CaminhaoFrente[] = [];
  carretaFrenteCarregada: CaminhaoFrente[] = [];
  carretaFrenteVazia: CaminhaoFrente[] = [];

  frentes: Frente[] = [
    { codigo: 1, descricao: "Frente 1" },
    { codigo: 2, descricao: "Frente 2" }
  ]
  fas: FA[] = [
    { codigo: 1, descricao: "Faz. 1" },
    { codigo: 2, descricao: "Faz. 2" }
  ]

  frentesCarregamento: FrenteCarregamento[] = [
    { frente: 1, fa: 1, tempoIdaMinutos: 60, tempoBateMinutos: 20, tempoVoltaMinutos: 180, tempoCarregamentoMinutos: 40, dataInicio: new Date(), ativo: "S" },
    { frente: 2, fa: 2, tempoIdaMinutos: 90, tempoBateMinutos: 20, tempoVoltaMinutos: 180, tempoCarregamentoMinutos: 40, dataInicio: new Date(), ativo: "S" },
  ]


  selecionouUnidade(event: any) {
    console.log('selecionouUnidade')
    console.log(event)
  }

  buscarEquipamento() {
    console.log('buscarEquipamento: ' + this.codigoEquipamento.value);
  }

  icone() {
    return this.iconeCaminhaoOK;
  }

  dragEnd() {
    console.log("dragEnd")
  }
  dragStart(tagDragStart: string) {
    console.log("dragStart")
  }

  onDropFrente(frente: any) {
    console.log('onDropFrente: ' + frente);
    let caminhao: CaminhaoFrente = {
      codigoEquipamento: Number(this.codigoEquipamento.value),
      codigoEstrutura: '',
      dataInicio: new Date()
    }
    this.caminhaoIndo.push(caminhao);
  }
  onDropBate(frente: any) {
     console.log('onDropFrente: ' + frente);
    let caminhao: CaminhaoFrente = {
      codigoEquipamento: Number(this.codigoEquipamento.value),
      codigoEstrutura: '',
      dataInicio: new Date()
    }
    this.caminhaoBate.push(caminhao);
  }
  onDropVoltando(frente: any) {
     console.log('onDropFrente: ' + frente);
    let caminhao: CaminhaoFrente = {
      codigoEquipamento: Number(this.codigoEquipamento.value),
      codigoEstrutura: '',
      dataInicio: new Date()
    }
    this.caminhaoVoltando.push(caminhao);
  }
}
